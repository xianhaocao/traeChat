// 定义所有支持的AI模型配置
export enum ProviderType {
  OpenAI = 'openai',
  Anthropic = 'anthropic',
  DeepSeek = 'deepseek',
  Google = 'google',
}

export interface ModelConfig {
  name: string;
  displayName: string;
  provider: ProviderType;
  icon: string;
}

export type ModelType = 'gpt-4o' | 'gpt-3.5-turbo' | 'claude-3-opus' | 'claude-3-sonnet' | 'deepseek-chat' | 'gemini-pro';

// 定义所有支持的AI模型配置
export const modelConfigs: ModelConfig[] = [
  // OpenAI 模型
  {
    name: 'gpt-4o' as ModelType,
    displayName: 'GPT-4o',
    provider: ProviderType.OpenAI,
    icon: '🤖',
  },
  {
    name: 'gpt-3.5-turbo' as ModelType,
    displayName: 'GPT-3.5 Turbo',
    provider: ProviderType.OpenAI,
    icon: '🤖',
  },
  
  // Anthropic 模型
  {
    name: 'claude-3-opus' as ModelType,
    displayName: 'Claude 3 Opus',
    provider: ProviderType.Anthropic,
    icon: '🧠',
  },
  {
    name: 'claude-3-sonnet' as ModelType,
    displayName: 'Claude 3 Sonnet',
    provider: ProviderType.Anthropic,
    icon: '🧠',
  },
  
  // DeepSeek 模型
  {
    name: 'deepseek-chat' as ModelType,
    displayName: 'DeepSeek Chat',
    provider: ProviderType.DeepSeek,
    icon: '🔍',
  },
  
  // Google 模型
  {
    name: 'gemini-pro' as ModelType,
    displayName: 'Gemini Pro',
    provider: ProviderType.Google,
    icon: '✨',
  },
];

// 根据模型名称获取模型配置
export const getModelConfig = (modelName: string): ModelConfig | undefined => {
  return modelConfigs.find(model => model.name === modelName);
};

// 根据提供商获取模型列表
export const getModelsByProvider = (provider: string | ProviderType): ModelConfig[] => {
  return modelConfigs.filter(model => model.provider === provider);
};

// 检查模型是否需要API密钥
export const isModelRequiringApiKey = (modelName: string): boolean => {
  const model = getModelConfig(modelName);
  if (!model) return true;
  // 目前所有模型都需要API密钥
  return true;
};

// 获取所有模型
export const getAllModels = (): ModelConfig[] => {
  return modelConfigs;
};

// 获取提供商图标
export const getProviderIcon = (provider: string | ProviderType): string => {
  const model = modelConfigs.find(m => m.provider === provider);
  return model ? model.icon : '🤖';
};