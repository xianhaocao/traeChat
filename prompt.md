> **角色设定：**
> 你是一名拥有 10 年经验的全栈架构师，精通前端（Next.js、React、Tailwind、TypeScript）、大模型接口集成与现代 UI 设计。
> 现在请你从 0 规划并实现一个 **AI 对话助手 Web 应用**，要求结构清晰、可直接运行、视觉现代。
---
### 一、项目定位与目标

请为一个 Web 端的 **AI 聊天助手（Chat Assistant）** 设计完整方案。
主要功能包括：
1. 对话区（支持 Markdown、高亮代码、流式输出动画）
2. 历史会话记录（本地存储即可，无需数据库）
3. 推荐问句区（在输入框上方显示）
4. 模型选择（支持 GPT / Claude / DeepSeek / Gemini）
5. 设置页（主题切换、API Key、temperature 参数）
6. 页面加载与全局 Skeleton 效果

目标：一个轻量、流畅、可快速部署的**前端 + API 调用型对话助手网页**。
---

### 二、技术架构与技术栈要求
**前端：**
* 框架：Next.js 15 + React 19 + TypeScript
* UI 组件库：shadcn/ui + Tailwind CSS + Lucide Icons
* 动效：Framer Motion
* Markdown 渲染：react-markdown + highlight.js
* 状态管理：Zustand（或 Recoil）
* 存储：LocalStorage（存储会话与用户配置）
* API 调用：Next.js Edge Functions / API Routes
* 模型接入：支持 OpenAI、Anthropic、DeepSeek、Gemini、Azure 等模型
**后端 / 接口层：**
* 使用 Next.js API Route 封装模型请求
* 支持流式响应输出（Server-Sent Events 或 ReadableStream）
* 允许通过环境变量或前端输入的 API Key 调用
**部署与环境：**
* 部署：Vercel 一键部署
* 环境变量（可选）：
  * `OPENAI_API_KEY`
  * `ANTHROPIC_API_KEY`
  * `DEEPSEEK_API_KEY`
---

### 三、UI 风格与交互设计
**整体风格：**
* 极简现代风格 + 半透明玻璃拟态（Glassmorphism）
* 明亮主题 / 暗色主题自动切换
* 柔和动画与自然动效（使用 Framer Motion）
* 响应式布局（桌面端与移动端自适应）
**页面结构：**
* 左侧：历史对话列表（本地存储）+ 模型选择 + 设置按钮
* 右侧：主对话窗口（消息展示区 + 输入框 + 推荐问句）
* 输入框区：
  * 输入框 + 发送按钮
  * 上方推荐问句 Chips（点击可填充输入框）
---
### 四、功能模块划分
| 模块                | 说明                                |
| ----------------- | --------------------------------- |
| `ChatWindow`      | 主对话展示区，支持 Markdown 渲染与流式输出        |
| `ChatInput`       | 输入框组件（支持 Enter 发送、Shift+Enter 换行） |
| `Sidebar`         | 历史会话栏（数据存储于 LocalStorage）         |
| `ModelSelector`   | 模型切换组件（多模型支持）                     |
| `SettingsModal`   | 设置弹窗（主题、temperature、API Key）      |
| `useChatStore`    | Zustand 全局状态管理（消息、加载状态、当前模型）      |
| `api/chat`        | Next.js API 路由封装模型调用逻辑            |
| `LoadingSkeleton` | 页面加载占位动画组件                        |
---

### 五、输出格式要求
请按以下结构输出结果，使其可作为项目起点直接使用：
1. **应用方案总览**
   * 产品目标与核心功能总结
   * 用户交互逻辑说明（文字描述即可）
2. **架构与目录结构设计**
   * 文件与目录结构
   * 模块功能职责划分
3. **依赖清单与技术栈说明**
   * npm 包列表与用途
4. **UI 风格与动画说明**
   * 颜色系统、排版、动画设计
5. **核心代码示例**
   * 首页（`page.tsx`）主结构代码
   * 主对话组件（`ChatWindow.tsx`）
   * 输入框组件（`ChatInput.tsx`）
   * Zustand 状态管理（`useChatStore.ts`）
6. **API 调用逻辑示例**
   * Next.js API Route 示例：如何调用模型 + 实现流式输出
   * 兼容多模型的设计模式（OpenAI / DeepSeek / Claude）
7. **部署说明**
   * 环境变量配置（如使用 API Key）
   * Vercel 一键部署步骤
---
### 六、最终要求
请生成一个：
* **无需数据库依赖、可立即启动的项目模板方案**
* **UI 简洁现代，具备流式对话体验**
* **代码结构清晰、模块职责分明、易维护扩展**
* **符合现代前端开发标准（Next.js + TypeScript + Tailwind）**

CN.1933384367215817:5c16c771aa0c698fd39d3de3317badb9_6904cd73c5e1ef51571de3a6.6904d04dc5e1ef51571de3aa.6904d04d16299c904de9102a:Trae CN.T(2025/10/31 23:05:49)