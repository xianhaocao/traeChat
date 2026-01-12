import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Conversation, Message, AppConfig, ModelType } from '@/types';
import { generateId } from './utils';

// 定义仓库状态接口
interface ChatStore {
  // 对话相关
  conversations: Conversation[];
  currentConversationId: string | null;
  createConversation: (model?: ModelType) => string;
  switchConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  clearAllConversations: () => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateMessage: (conversationId: string, messageId: string, content: string) => void;
  setMessageStreaming: (conversationId: string, messageId: string, isStreaming: boolean) => void;
  clearConversation: (id: string) => void;
  renameConversation: (id: string, title: string) => void;

  // 应用配置
  config: AppConfig;
  updateConfig: (updates: Partial<AppConfig>) => void;
  updateApiKey: (provider: string, key: string) => void;
  setDefaultModel: (model: ModelType) => void;
  setTemperature: (temperature: number) => void;

  // UI状态
  isSidebarOpen: boolean;
  isSettingsOpen: boolean;
  toggleSidebar: () => void;
  toggleSettings: () => void;
  closeSettings: () => void;

  // 辅助函数
  getCurrentConversation: () => Conversation | undefined;
  getCurrentMessages: () => Message[];
}

// 初始应用配置
const initialConfig: AppConfig = {
  theme: 'system',
  defaultModel: 'gpt-4o',
  temperature: 0.7,
  maxTokens: 4000,
  apiKeys: {},
};

// 创建对话仓库
export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      // 对话相关
      conversations: [],
      currentConversationId: null,

      createConversation: (model = get().config.defaultModel) => {
        const id = generateId();
        const newConversation: Conversation = {
          id,
          title: `新对话 ${new Date().toLocaleTimeString()}`,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          model,
        };

        set((state) => ({
          conversations: [...state.conversations, newConversation],
          currentConversationId: id,
          isSidebarOpen: false,
        }));

        return id;
      },

      switchConversation: (id) => {
        set(() => ({
          currentConversationId: id,
          isSidebarOpen: false,
        }));
      },

      deleteConversation: (id) => {
        set((state) => {
          const newConversations = state.conversations.filter((c) => c.id !== id);
          return {
            conversations: newConversations,
            currentConversationId: newConversations.length > 0 ? newConversations[0].id : null,
          };
        });
      },

      addMessage: (conversationId, message) => {
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id === conversationId) {
              return {
                ...c,
                messages: [...c.messages, message],
                updatedAt: new Date(),
              };
            }
            return c;
          }),
        }));
      },

      updateMessage: (conversationId, messageId, content) => {
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id === conversationId) {
              return {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === messageId ? { ...m, content } : m
                ),
              };
            }
            return c;
          }),
        }));
      },

      setMessageStreaming: (conversationId, messageId, isStreaming) => {
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id === conversationId) {
              return {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === messageId ? { ...m, isStreaming } : m
                ),
              };
            }
            return c;
          }),
        }));
      },

      clearConversation: (id) => {
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id === id) {
              return {
                ...c,
                messages: [],
                updatedAt: new Date(),
              };
            }
            return c;
          }),
        }));
      },

      renameConversation: (id, title) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, title } : c
          ),
        }));
      },

      // 应用配置
      config: initialConfig,

      updateConfig: (updates) => {
        set((state) => ({
          config: { ...state.config, ...updates },
        }));
      },

      updateApiKey: (provider, key) => {
        set((state) => ({
          config: {
            ...state.config,
            apiKeys: { ...state.config.apiKeys, [provider]: key },
          },
        }));
      },

      setDefaultModel: (model) => {
        set((state) => ({
          config: { ...state.config, defaultModel: model },
        }));
      },

      setTemperature: (temperature) => {
        set((state) => ({
          config: { ...state.config, temperature: Math.max(0, Math.min(1, temperature)) },
        }));
      },

      // UI状态
      isSidebarOpen: false,
      isSettingsOpen: false,

      toggleSidebar: () => {
        set((state) => ({
          isSidebarOpen: !state.isSidebarOpen,
        }));
      },

      toggleSettings: () => {
        set((state) => ({
          isSettingsOpen: !state.isSettingsOpen,
        }));
      },

      closeSettings: () => {
        set(() => ({
          isSettingsOpen: false,
        }));
      },

      // 辅助函数
      getCurrentConversation: () => {
        const { conversations, currentConversationId } = get();
        if (!currentConversationId) return undefined;
        return conversations.find((c) => c.id === currentConversationId);
      },

      getCurrentMessages: () => {
        const conversation = get().getCurrentConversation();
        return conversation?.messages || [];
      },

      clearAllConversations: () => {
        set(() => ({
          conversations: [],
          currentConversationId: null,
        }));
      },
    }),
    {
      name: 'trae-chat-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0 && persistedState) {
          // 版本迁移逻辑
          return {
            ...persistedState,
            config: {
              ...persistedState.config,
              maxTokens: 4000,
            },
          };
        }
        return persistedState;
      },
    }
  )
);