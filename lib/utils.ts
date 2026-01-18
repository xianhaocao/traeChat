import { customAlphabet } from 'nanoid';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

// 生成唯一ID
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);
export const generateId = (): string => nanoid();

// 格式化日期
export const formatDate = (date: Date | string): string => {
  const now = new Date();
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  
  // 检查日期是否有效
  if (isNaN(targetDate.getTime())) {
    return '无效日期';
  }
  
  const diff = now.getTime() - targetDate.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  return targetDate.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

// 格式化消息内容（添加换行符）
export const formatMessageContent = (content: string): string => {
  return content
    .replace(/\n/g, '<br />')
    .replace(/\s{2,}/g, ' ');
};

// 处理Markdown代码块
export const processMarkdownCode = (markdown: string): string => {
  return markdown.replace(/```([\s\S]*?)```/g, (match, code) => {
    const [language, ...contentLines] = code.split('\n');
    const content = contentLines.join('\n').trim();
    
    try {
      const result = hljs.highlight(content, { language: language || 'plaintext' });
      return `<div class="code-block"><pre><code class="language-${language || 'plaintext'}">${result.value}</code></pre></div>`;
    } catch (error) {
      return `<pre><code>${content}</code></pre>`;
    }
  });
};

// 截断文本
export const truncateText = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// 生成对话标题
export const generateConversationTitle = (messages: any[]): string => {
  const userMessage = messages.find((msg: any) => msg.role === 'user');
  if (userMessage) {
    return truncateText(userMessage.content, 30);
  }
  return `新对话`;
};

// 验证API密钥
export const validateApiKey = (key: string, provider: string): boolean => {
  if (!key) return false;
  
  switch (provider) {
    case 'openai':
      return key.startsWith('sk-');
    case 'anthropic':
      return key.startsWith('sk-ant-');
    case 'deepseek':
      return key.startsWith('sk-');
    case 'google':
      return key.length > 0;
    default:
      return false;
  }
};

// 生成随机头像颜色
export const getRandomAvatarColor = (seed: string): string => {
  const colors = [
    '#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b',
    '#ef4444', '#06b6d4', '#84cc16', '#f97316', '#a855f7'
  ];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// 生成头像URL
export const generateAvatarUrl = (name: string, seed: string): string => {
  const color = getRandomAvatarColor(seed);
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${color.replace('#', '')}&color=fff&size=40`;
};

// 防抖函数
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// 节流函数
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};