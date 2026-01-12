'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useChatStore } from '@/lib/useChatStore';
import { getAllModels, getProviderIcon, ProviderType } from '@/lib/modelConfigs';

interface ModelSelectorProps {
  onModelChange?: (model: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ onModelChange }) => {
  const { config, updateConfig } = useChatStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<ProviderType | 'all'>('all');

  const models = getAllModels();
  const providers = useMemo(() => Object.values(ProviderType), []);

  // 过滤模型
  const filteredModels = useMemo(() => {
    return models.filter(model => {
      const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.displayName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProvider = selectedProvider === 'all' || model.provider === selectedProvider;
      return matchesSearch && matchesProvider;
    });
  }, [models, searchTerm, selectedProvider]);

  // 切换模型
  const handleModelChange = (modelName: string) => {
    updateConfig({ defaultModel: modelName });
    if (onModelChange) {
      onModelChange(modelName);
    }
  };

  // 获取提供商图标
  const getProviderIconComponent = (provider: ProviderType) => {
    const icon = getProviderIcon(provider);
    return <span className="text-lg">{icon}</span>;
  };

  return (
    <div className="space-y-3">
      {/* 搜索框 */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="搜索模型..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 text-sm"
        />
      </div>

      {/* 提供商筛选 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Button
          variant={selectedProvider === 'all' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setSelectedProvider('all')}
          className="text-xs whitespace-nowrap"
        >
          全部
        </Button>
        {providers.map(provider => (
          <Button
            key={provider}
            variant={selectedProvider === provider ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedProvider(provider)}
            className="text-xs whitespace-nowrap"
            leftIcon={getProviderIconComponent(provider)}
          >
            {provider}
          </Button>
        ))}
      </div>

      {/* 模型列表 */}
      <div className="max-h-64 overflow-y-auto space-y-1 pr-2">
        <TooltipProvider>
          {filteredModels.length > 0 ? (
            filteredModels.map(model => (
              <motion.div
                key={model.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`cursor-pointer p-2 rounded-lg transition-colors flex items-center gap-2 ${model.name === config.defaultModel ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                onClick={() => handleModelChange(model.name)}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                      {getProviderIconComponent(model.provider)}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{model.provider}</p>
                  </TooltipContent>
                </Tooltip>

                <div className="flex-1 min-w-0">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <h3 className="text-sm font-medium truncate">{model.displayName}</h3>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{model.name}</p>
                    </TooltipContent>
                  </Tooltip>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{model.description}</p>
                </div>

                {model.name === config.defaultModel && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="flex-shrink-0 ml-2"
                  >
                    <CheckCircle size={16} className="text-blue-500" />
                  </motion.div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              <p className="text-sm">未找到匹配的模型</p>
              <p className="text-xs mt-1">请尝试调整搜索条件</p>
            </div>
          )}
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ModelSelector;