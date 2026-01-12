'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import TextareaAutosize from 'react-textarea-autosize';
import { Send, Smile, Trash2, Paperclip } from 'lucide-react';
import { Message } from '@/types';
import { debounce } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  onClearChat: () => void;
  isLoading: boolean;
  messages: Message[];
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, onClearChat, isLoading, messages }) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 智能建议
  const generateSuggestions = debounce(() => {
    if (!inputValue.trim() && messages.length === 0) {
      setSuggestions([
        '介绍一下你自己',
        '什么是人工智能？',
        '如何学习编程？',
        '推荐一本好书',
        '解释一下机器学习',
      ]);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, 300);

  useEffect(() => {
    generateSuggestions();
  }, [inputValue, messages.length, generateSuggestions]);

  // 发送消息
  const handleSendMessage = () => {
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
      setShowSuggestions(false);
      textareaRef.current?.focus();
    }
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 选择建议
  const handleSelectSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    textareaRef.current?.focus();
  };

  // 清空聊天
  const handleClearChat = () => {
    if (confirm('确定要清空聊天记录吗？')) {
      onClearChat();
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      {/* 智能建议 */}
      {showSuggestions && suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="mb-4 flex flex-wrap gap-2"
        >
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectSuggestion(suggestion)}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {suggestion}
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* 输入框容器 */}
      <div className="flex flex-col gap-3">
        <div className="flex items-end gap-2">
          {/* 附件按钮 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
            disabled={isLoading}
            title="附件"
          >
            <Paperclip size={20} />
          </motion.button>

          {/* 表情按钮 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
            disabled={isLoading}
            title="表情"
          >
            <Smile size={20} />
          </motion.button>

          {/* 输入框 */}
          <div className="flex-1 relative">
            <TextareaAutosize
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="输入你的问题或消息..."
              className={`w-full min-h-[80px] max-h-[200px] p-4 rounded-lg border-2 resize-none focus:outline-none transition-all duration-300 ${isFocused ? 'border-blue-500 shadow-lg' : 'border-gray-200 dark:border-gray-700'} bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
              disabled={isLoading}
              spellCheck={false}
            />

            {/* 字符计数 */}
            <div className="absolute bottom-3 right-4 text-xs text-gray-400 dark:text-gray-500">
              {inputValue.length}/2000
            </div>
          </div>

          {/* 发送按钮 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className={`p-3 rounded-full transition-all duration-300 ${!inputValue.trim() || isLoading ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl'}`}
            title="发送"
          >
            <Send size={20} className="text-white" />
          </motion.button>
        </div>

        {/* 清空聊天按钮 */}
        {messages.length > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleClearChat}
            disabled={isLoading}
            className="self-end flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Trash2 size={16} />
            清空聊天
          </motion.button>
        )}
      </div>

      {/* 加载状态提示 */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          AI正在思考中...
        </motion.div>
      )}
    </div>
  );
};

export default ChatInput;