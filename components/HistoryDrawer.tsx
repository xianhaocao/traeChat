'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Trash2, X } from 'lucide-react';
import Button from '@/components/ui/button';
import { Virtuoso } from 'react-virtuoso';
import { useChatStore } from '@/lib/useChatStore';
import { formatDate } from '@/lib/utils';
import { Conversation, Message } from '@/types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ isOpen, onClose }) => {
  const { conversations, currentConversationId, switchConversation, deleteConversation, clearAllConversations } = useChatStore();

  const handleClearAll = () => {
    if (confirm('确定要清除所有对话记录吗？此操作不可撤销。')) {
      clearAllConversations();
      onClose();
    }
  };

  const getWordCount = (messages: Message[]): number => {
    return messages.reduce((count, message) => count + message.content.length, 0);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">历史对话</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <X size={20} />
              </Button>
            </div>

            {/* Conversation List */}
            <div className="flex-1 p-4">
              {conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <MessageSquare size={48} className="mb-4 opacity-50" />
                  <p>暂无对话记录</p>
                  <p className="text-sm mt-2">开始新对话以保存历史记录</p>
                </div>
              ) : (
                <Virtuoso
                  data={conversations}
                  itemContent={(index, conversation) => (
                    <motion.div
                      key={conversation.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: 0.05 * index }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`cursor-pointer p-3 rounded-lg transition-colors ${currentConversationId === conversation.id ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700' : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                      onClick={() => {
                        switchConversation(conversation.id);
                        onClose();
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">{conversation.title}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{conversation.messages.length > 0 ? conversation.messages[conversation.messages.length - 1].content : '无消息'}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteConversation(conversation.id);
                          }}
                          className="ml-2 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{formatDate(conversation.updatedAt)}</span>
                        <span>{getWordCount(conversation.messages)} 字</span>
                      </div>
                    </motion.div>
                  )}
                  style={{ height: '100%' }}
                />
              )}
            </div>

            {/* Footer */}
            {conversations.length > 0 && (
              <div className="p-4 border-t dark:border-gray-700">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleClearAll}
                  className="w-full text-red-500 hover:text-red-600"
                >
                  <Trash2 size={16} className="mr-2" />
                  清除所有对话
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default HistoryDrawer;