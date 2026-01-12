'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, MessageSquare, Settings, Trash2, Edit, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatStore } from '@/lib/useChatStore';
import { generateId, truncateText } from '@/lib/utils';
import ModelSelector from './ModelSelector';
import { Conversation } from '@/types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const {
    conversations,
    currentConversationId,
    createConversation,
    switchConversation,
    deleteConversation,
    renameConversation,
    toggleSettings,
    config,
  } = useChatStore();

  // 处理新对话
  const handleNewConversation = () => {
    createConversation(config.defaultModel);
    onClose();
  };

  // 处理删除对话
  const handleDeleteConversation = (id: string) => {
    if (confirm('确定要删除这个对话吗？')) {
      deleteConversation(id);
    }
  };

  // 处理重命名对话
  const handleRenameConversation = (id: string, currentTitle: string) => {
    const newTitle = prompt('请输入新的对话标题:', currentTitle);
    if (newTitle && newTitle.trim() !== currentTitle.trim()) {
      renameConversation(id, newTitle.trim());
    }
  };

  // 渲染对话项
  const renderConversationItem = (conversation: Conversation) => (
    <motion.div
      key={conversation.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`cursor-pointer p-3 rounded-lg mb-2 transition-colors ${conversation.id === currentConversationId ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
      onClick={() => {
        switchConversation(conversation.id);
        onClose();
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <MessageSquare size={16} className="text-gray-500 dark:text-gray-400 flex-shrink-0" />
            <h3 className="text-sm font-medium truncate">{conversation.title}</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
            {conversation.messages.length > 0
              ? conversation.messages[conversation.messages.length - 1].content
              : '无消息'}
          </p>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
            onClick={(e) => {
              e.stopPropagation();
              handleRenameConversation(conversation.id, conversation.title);
            }}
          >
            <Edit size={14} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteConversation(conversation.id);
            }}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {conversation.model.split('-')[0]}
        </span>
      </div>
    </motion.div>
  );

  return (
    <>
      {/* 移动端遮罩 */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* 侧边栏 */}
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: isOpen ? 0 : -300, opacity: isOpen ? 1 : 0 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 z-50 w-80 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-xl md:static md:w-72"
      >
        <div className="h-full flex flex-col">
          {/* 顶部导航 */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">TraeChat</h1>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={onClose}
              >
                <X size={20} />
              </Button>
            </div>

            <Button
              variant="default"
              className="w-full"
              onClick={handleNewConversation}
              leftIcon={<PlusCircle size={18} />}
            >
              新对话
            </Button>
          </div>

          {/* 对话历史 */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  对话历史
                </h2>

                {conversations.length > 0 ? (
                  <div className="space-y-1">
                    {conversations.map(renderConversationItem)}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                    <p>暂无对话历史</p>
                    <p className="text-xs mt-2">点击"新对话"开始聊天</p>
                  </div>
                )}

                {/* 模型选择器 */}
                <div className="mt-8">
                  <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    选择模型
                  </h2>
                  <ModelSelector onModelChange={() => {}} />
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* 底部设置 */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                toggleSettings();
                onClose();
              }}
              leftIcon={<Settings size={18} />}
            >
              设置
            </Button>

            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
              <p>TraeChat - AI对话助手</p>
              <p className="mt-1">支持多种AI模型</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 修复移动端关闭按钮的导入 */}
      <style jsx>{`
        .group:hover .opacity-0 {
          opacity: 1;
        }
      `}</style>
    </>
  );
};

export default Sidebar;