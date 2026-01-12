'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Message } from '@/types';
import { formatDate } from '@/lib/utils';

interface ChatWindowProps {
  messages: Message[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 渲染消息内容
  const renderMessageContent = (message: Message) => {
    if (message.isStreaming && message.content === '') {
      return (
        <div className="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      );
    }

    return (
      <ReactMarkdown
        className="prose prose-sm sm:prose-base max-w-none break-words"
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-([\w]+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={tomorrow}
                language={match[1]}
                PreTag="div"
                className="rounded-lg overflow-x-auto my-2"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code
                className={`${className} bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono`}
                {...props}
              >
                {children}
              </code>
            );
          },
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-6 mb-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-6 mb-2">{children}</ol>,
          li: ({ children }) => <li className="mb-1">{children}</li>,
          h1: ({ children }) => <h1 className="text-2xl font-bold mb-2 mt-4">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-bold mb-2 mt-4">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-bold mb-2 mt-4">{children}</h3>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-2">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-2">
              <table className="border-collapse border border-gray-300 dark:border-gray-600">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-gray-800 font-bold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
              {children}
            </td>
          ),
        }}
      >
        {message.content}
      </ReactMarkdown>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <div className="mb-4">
            <div className="text-6xl">🤖</div>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            欢迎使用 TraeChat
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
            我是你的AI助手，可以帮助你解决问题、提供信息和进行对话
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-500">
            支持的模型：GPT-4o、GPT-3.5 Turbo、Claude 3 Opus、Claude 3 Sonnet、DeepSeek Chat、Gemini Pro
          </div>
        </div>
      ) : (
        messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 sm:gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {/* 头像 */}
            {message.role !== 'user' && (
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg">
                🤖
              </div>
            )}

            {/* 消息内容 */}
            <div
              className={`max-w-[85%] sm:max-w-[80%] lg:max-w-[75%] rounded-lg p-3 sm:p-4 shadow ${message.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-card text-foreground rounded-bl-none'}`}
            >
              {/* 消息文本 */}
              <div className="whitespace-pre-wrap break-words">
                {renderMessageContent(message)}
              </div>

              {/* 时间戳 */}
              <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'} text-right`}>
                {formatDate(message.timestamp)}
              </div>
            </div>

            {/* 用户头像 */}
            {message.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg">
                👤
              </div>
            )}
          </div>
        ))
      )}

      {/* 滚动到底部的标记 */}
      <div ref={messagesEndRef} className="h-1" />

      {/* 输入指示器样式 */}
      <style jsx>{`
        .typing-indicator {
          display: flex;
          gap: 4px;
        }
        
        .typing-indicator span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: currentColor;
          animation: typing 1.4s infinite;
        }
        
        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.5;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatWindow;