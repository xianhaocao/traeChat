import { ModelConfig, ModelType } from '@/types';

// 定义所有支持的AI模型配置
export const modelConfigs: ModelConfig[] = [
  // OpenAI 模型
  {
    name: 'gpt-4o' as ModelType,
    displayName: 'GPT-4o',
    provider: 'openai',
    icon: '🤖',
  },
  {
    name: 'gpt-3.5-turbo' as ModelType,
    displayName: 'GPT-3.5 Turbo',
    provider: 'openai',
    icon: '🤖',
  },
  
  // Anthropic 模型
  {
    name: 'claude-3-opus' as ModelType,
    displayName: 'Claude 3 Opus',
    provider: 'anthropic',
    icon: '🧠',
  },
  {
    name: 'claude-3-sonnet' as ModelType,
    displayName: 'Claude 3 Sonnet',
    provider: 'anthropic',
    icon: '🧠',
  },
  
  // DeepSeek 模型
  {
    name: 'deepseek-chat' as ModelType,
    displayName: 'DeepSeek Chat',
    provider: 'deepseek',
    icon: '🔍',
  },
  
  // Google 模型
  {
    name: 'gemini-pro' as ModelType,
    displayName: 'Gemini Pro',
    provider: 'google',
    icon: '✨',
  },
];

// 根据模型名称获取模型配置
export const getModelConfig = (modelName: string): ModelConfig | undefined => {
  return modelConfigs.find(model => model.name === modelName);
};

// 根据提供商获取模型列表
export const getModelsByProvider = (provider: string): ModelConfig[] => {
  return modelConfigs.filter(model => model.provider === provider);
};

// 检查模型是否需要API密钥
export const isModelRequiringApiKey = (modelName: string): boolean => {
  const model = getModelConfig(modelName);
  if (!model) return true;
  // 目前所有模型都需要API密钥
  return true;
};