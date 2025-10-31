# TraeChat - AI对话助手

一个基于Next.js 15、React 19和TypeScript构建的现代化AI对话助手Web应用，支持多种AI模型（OpenAI、Anthropic、DeepSeek、Google Gemini）。

## ✨ 核心功能

- 🤖 **多模型支持**：集成OpenAI（GPT-4o、GPT-3.5 Turbo）、Anthropic（Claude 3 Opus、Claude 3 Sonnet）、DeepSeek Chat和Google Gemini Pro
- 💬 **实时对话**：支持流式响应和实时消息更新
- 📝 **Markdown渲染**：支持代码高亮、表格、列表等Markdown格式
- 📱 **响应式设计**：完美适配桌面端和移动端
- 🎨 **主题切换**：支持浅色、深色和系统主题
- 💾 **本地存储**：对话历史保存在浏览器本地存储中
- ⚙️ **个性化配置**：支持调整温度参数、API密钥管理
- 🔄 **历史对话管理**：创建、切换、删除和重命名对话
- 🎯 **智能建议**：根据上下文提供智能对话建议

## 🛠️ 技术栈

### 前端
- **框架**: Next.js 15 (App Router) + React 19
- **语言**: TypeScript
- **UI组件库**: ShadCN UI
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **状态管理**: Zustand
- **Markdown渲染**: react-markdown + highlight.js
- **图标**: Lucide React

### 后端
- **API路由**: Next.js API Routes
- **模型集成**: OpenAI SDK、Anthropic SDK、DeepSeek SDK、Google Generative AI SDK

### 开发工具
- **包管理**: npm
- **代码质量**: ESLint
- **部署**: Vercel

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建`.env.local`文件，添加所需的API密钥（至少配置一个）：

```env
# OpenAI API Key (https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Anthropic API Key (https://console.anthropic.com/settings/keys)
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# DeepSeek API Key (https://platform.deepseek.com/api-keys)
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Google API Key (https://ai.google.dev/tutorials/setup)
GOOGLE_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看应用。

### 4. 构建生产版本

```bash
npm run build
npm start
```

## 📦 核心组件

### ChatWindow
对话展示组件，支持Markdown渲染和流式消息动画。

### ChatInput
输入框组件，支持Enter发送、Shift+Enter换行、智能建议和表情符号。

### Sidebar
侧边栏组件，包含对话历史管理、模型选择和设置入口。

### ModelSelector
模型选择器，支持快速切换不同AI模型。

### Settings
设置组件，支持主题切换、API密钥管理和温度参数调整。

## 📁 项目结构

```
traechat/
├── app/                    # Next.js App Router
│   ├── api/               # API路由
│   │   └── chat/          # 聊天API
│   ├── (chat)/            # 聊天页面
│   │   ├── components/    # 聊天组件
│   │   └── page.tsx       # 聊天页面
│   ├── layout.tsx         # 根布局
│   └── globals.css        # 全局样式
├── components/            # 通用组件
│   ├── ChatWindow.tsx     # 对话窗口组件
│   ├── ChatInput.tsx      # 聊天输入框组件
│   ├── Sidebar.tsx        # 侧边栏组件
│   ├── ModelSelector.tsx  # 模型选择器组件
│   ├── Settings.tsx       # 设置组件
│   └── Message.tsx        # 消息组件
├── lib/                   # 工具和逻辑
│   ├── useChatStore.ts    # Zustand状态管理
│   ├── modelConfigs.ts    # 模型配置
│   ├── utils.ts           # 通用工具函数
│   └── api.ts             # API客户端
├── types.ts               # TypeScript类型定义
├── next.config.js         # Next.js配置
├── tsconfig.json          # TypeScript配置
├── tailwind.config.js     # Tailwind CSS配置
├── postcss.config.js      # PostCSS配置
└── package.json           # 项目依赖
```

## ⚙️ 配置说明

### API密钥配置

可以通过以下两种方式配置API密钥：

1. **环境变量**：在`.env.local`文件中配置（推荐用于生产环境）
2. **设置页面**：在应用的设置页面中输入（存储在浏览器本地存储中）

### 模型选择

支持以下模型：

- **OpenAI**: GPT-4o、GPT-3.5 Turbo
- **Anthropic**: Claude 3 Opus、Claude 3 Sonnet
- **DeepSeek**: DeepSeek Chat
- **Google**: Gemini Pro

### 参数调整

- **温度**: 控制输出的随机性（0-1，默认0.7）
- **最大令牌**: 控制输出的最大长度（默认4000）

## 🎨 样式主题

支持三种主题模式：

- **浅色模式**: 明亮的界面设计
- **深色模式**: 暗色的界面设计
- **系统模式**: 跟随操作系统的主题设置

## 📱 移动端适配

应用采用响应式设计，在不同设备上都有良好的体验：

- **桌面端**: 侧边栏展示完整对话列表
- **平板**: 自适应布局，保持良好的可用性
- **手机**: 侧边栏可折叠，优化触控操作

## 🚀 部署

### Vercel部署

1. Fork或克隆本项目到GitHub
2. 在Vercel上创建新的项目
3. 连接GitHub仓库
4. 配置环境变量（在Vercel项目设置中）
5. 部署项目

### 其他部署方式

可以部署到任何支持Next.js的平台，如Netlify、AWS Amplify等。

## 🔧 开发说明

### 代码规范

使用ESLint进行代码质量检查：

```bash
npm run lint
```

### 类型检查

使用TypeScript进行类型检查：

```bash
npx tsc --noEmit
```

### 性能优化

- 使用Next.js的App Router和Server Components
- 实现了对话历史的本地存储缓存
- 采用流式响应减少等待时间
- 优化了Markdown渲染性能

## 📝 功能规划

- [ ] 文件上传和处理
- [ ] 多轮对话记忆
- [ ] 对话导出功能
- [ ] 自定义提示词模板
- [ ] 语音输入和输出
- [ ] 多语言支持
- [ ] 插件系统

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📧 联系方式

如有问题或建议，请创建Issue或发送邮件至：your-email@example.com