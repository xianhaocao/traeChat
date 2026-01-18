'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import Button from '@/components/ui/button';
import Sidebar from '@/components/Sidebar';
import ChatWindow from '@/components/ChatWindow';
import ChatInput from '@/components/ChatInput';
import { useChatStore } from '@/lib/useChatStore';
import { Message, Conversation } from '@/types';

const Page: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { getCurrentConversation, getCurrentMessages, addMessage, updateMessage, setMessageStreaming, clearConversation, createConversation, conversations, currentConversationId } = useChatStore();
  const [clientConversation, setClientConversation] = useState<Conversation | undefined>(undefined);
  const [messages, setMessages] = useState<Message[]>([]);
  
  React.useEffect(() => {
    setClientConversation(getCurrentConversation());
  }, [getCurrentConversation, currentConversationId, conversations]);

  React.useEffect(() => {
    setMessages(getCurrentMessages());
  }, [getCurrentMessages, currentConversationId, conversations]);

  const handleSendMessage = async (content: string) => {
    if (!clientConversation) {
      const newConversationId = createConversation();
      const newConversation = getCurrentConversation();
      if (!newConversation) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: new Date(),
        isStreaming: false,
      };
      addMessage(newConversationId, userMessage);
      setMessages([...messages, userMessage]);
    } else {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: new Date(),
        isStreaming: false,
      };
      addMessage(clientConversation.id, userMessage);
      setMessages([...messages, userMessage]);
    }

    const updatedConversation = getCurrentConversation();
    if (!updatedConversation) return;

    setClientConversation(updatedConversation);

    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedConversation.messages,
          model: updatedConversation.model,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let accumulatedContent = '';

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '',
          timestamp: new Date(),
          isStreaming: true,
        };
        addMessage(updatedConversation.id, assistantMessage);
        setMessages([...messages, assistantMessage]);

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value) {
            const chunk = decoder.decode(value);
            accumulatedContent += chunk;
            updateMessage(updatedConversation.id, assistantMessage.id, accumulatedContent);
            setMessages(messages.map(m => m.id === assistantMessage.id ? { ...m, content: accumulatedContent } : m));
          }
        }

        setMessageStreaming(updatedConversation.id, assistantMessage.id, false);
        setMessages(messages.map(m => m.id === assistantMessage.id ? { ...m, isStreaming: false } : m));
      } else {
        const data = await response.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.content,
          timestamp: new Date(),
          isStreaming: false,
        };
        addMessage(updatedConversation.id, assistantMessage);
        setMessages([...messages, assistantMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '抱歉，发送消息失败，请稍后重试。',
        timestamp: new Date(),
        isStreaming: false,
      };
      addMessage(updatedConversation.id, errorMessage);
      setMessages([...messages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (clientConversation) {
      clearConversation(clientConversation.id);
      // 更新clientConversation状态
      setClientConversation(getCurrentConversation());
      // 更新messages状态
      setMessages([]);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* 侧边栏 */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 主聊天区域 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部导航栏 */}
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between shadow">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-foreground hover:bg-primary-light"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} />
            </Button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {clientConversation?.title || 'TraeChat'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {/* 可以在这里添加更多操作按钮，比如清空对话、分享等 */}
          </div>
        </header>

        {/* 聊天窗口 */}
        <ChatWindow messages={messages} isLoading={isLoading} />

        {/* 输入框 */}
        <ChatInput
          onSendMessage={handleSendMessage}
          onClearChat={handleClearChat}
          isLoading={isLoading}
          messages={messages}
        />
      </div>
    </div>
  );
};

export default Page;