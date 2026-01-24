'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import TextareaAutosize from 'react-textarea-autosize';
import { Send, Smile, Trash2, Paperclip, FileText, Image as ImageIcon, X } from 'lucide-react';
import { Message, FileAttachment } from '@/types';
import { debounce } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (content: string, files?: FileAttachment[]) => void;
  onClearChat: () => void;
  isLoading: boolean;
  messages: Message[];
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, onClearChat, isLoading, messages }) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [files, setFiles] = useState<FileAttachment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // 处理文件选择
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const newFiles: FileAttachment[] = Array.from(selectedFiles).map(file => {
        // 生成临时URL用于预览
        const url = URL.createObjectURL(file);
        return {
          id: crypto.randomUUID(),
          name: file.name,
          type: file.type,
          size: file.size,
          url
        };
      });
      setFiles([...files, ...newFiles]);
    }
  };

  // 移除文件
  const handleRemoveFile = (fileId: string) => {
    const fileToRemove = files.find(f => f.id === fileId);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.url);
    }
    setFiles(files.filter(file => file.id !== fileId));
  };

  // 发送消息
  const handleSendMessage = () => {
    if ((inputValue.trim() || files.length > 0) && !isLoading) {
      onSendMessage(inputValue.trim(), files);
      setInputValue('');
      setFiles([]);
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
    <div className="p-4 sm:p-6 lg:p-8 border-t border-border bg-card">
      {/* 智能建议 */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          className="mb-4 flex flex-wrap gap-2"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSelectSuggestion(suggestion)}
              className="px-4 py-2 bg-card hover:bg-card-hover text-foreground rounded-lg text-sm transition-colors shadow hover:shadow-md"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* 文件列表 */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {files.map(file => (
            <div key={file.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card-hover border border-border">
              {file.type.startsWith('image/') ? (
                <ImageIcon size={16} className="text-primary" />
              ) : (
                <FileText size={16} className="text-gray-500" />
              )}
              <span className="text-sm truncate max-w-[150px]">{file.name}</span>
              <button
                onClick={() => handleRemoveFile(file.id)}
                className="p-1 rounded-full hover:bg-red-100 text-red-500 transition-colors"
                title="移除文件"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 输入框容器 */}
      <div className="flex flex-col gap-3">
        <div className="flex items-end gap-2">
          {/* 附件按钮 */}
          <button
            className="p-2 rounded-full bg-card-hover hover:bg-primary-light transition-colors text-foreground"
            disabled={isLoading}
            title="附件"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip size={20} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            disabled={isLoading}
          />

          {/* 表情按钮 */}
          <button
            className="p-2 rounded-full bg-card-hover hover:bg-primary-light transition-colors text-foreground"
            disabled={isLoading}
            title="表情"
          >
            <Smile size={20} />
          </button>

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
              className={`w-full min-h-[80px] max-h-[200px] p-4 rounded-lg border-2 resize-none focus:outline-none transition-all duration-300 ${isFocused ? 'border-primary shadow-lg' : 'border-border'} bg-card text-foreground placeholder-gray-400 dark:placeholder-gray-500`}
              disabled={isLoading}
              spellCheck={false}
            />

            {/* 字符计数 */}
            <div className="absolute bottom-3 right-4 text-xs text-gray-400 dark:text-gray-500">
              {inputValue.length}/2000
            </div>
          </div>

          {/* 发送按钮 */}
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className={`p-3 rounded-full transition-all duration-300 ${!inputValue.trim() || isLoading ? 'bg-border cursor-not-allowed' : 'bg-primary hover:bg-primary-dark shadow-lg hover:shadow-xl'}`}
            title="发送"
          >
            <Send size={20} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;