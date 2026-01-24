// 定义文件类型
export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

// 定义消息类型
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  isStreaming?: boolean;
  files?: FileAttachment[];
}

// 定义对话类型
export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  model: ModelType;
}

// 定义模型类型
export type ModelType = 'gpt-4o' | 'claude-3-opus' | 'deepseek-chat' | 'gemini-pro' | 'gpt-3.5-turbo' | 'claude-3-sonnet';

// 定义模型配置
export interface ModelConfig {
  name: string;
  displayName: string;
  provider: 'openai' | 'anthropic' | 'deepseek' | 'google';
  icon?: string;
}

// 定义应用配置
export interface AppConfig {
  theme: 'light' | 'dark' | 'system';
  defaultModel: ModelType;
  temperature: number;
  maxTokens: number;
  apiKeys: {
    openai?: string;
    anthropic?: string;
    deepseek?: string;
    google?: string;
  };
}

// 定义API请求参数
export interface ChatRequest {
  messages: Message[];
  model: ModelType;
  temperature: number;
  maxTokens: number;
  apiKey?: string;
}

// 定义API响应
export interface ChatResponse {
  id: string;
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}