# 🚗 车圈红娘 - 智能汽车顾问

> 基于扣子智能体的智能汽车顾问系统，科技感十足，为您提供专业的汽车咨询服务。

## ✨ 功能特点

- 🤖 **智能对话** - 基于扣子大模型，提供专业的汽车咨询
- ⚡ **实时响应** - 流式输出，打字机效果，体验流畅
- 🎨 **科技风格** - 未来感十足的科技汽车主题界面
- 💬 **多轮对话** - 支持 session 管理，保持对话上下文
- 📱 **响应式设计** - 完美适配各种设备

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 访问 http://localhost:5000
```

### 部署到生产环境

详细部署指南请查看：

- **[5分钟快速部署](./QUICKSTART.md)** - 推荐新手阅读
- **[完整部署指南](./DEPLOYMENT.md)** - 包含多种部署方案

## 📦 项目结构

```
.
├── src/
│   ├── app/
│   │   ├── api/chat/     # API 路由
│   │   ├── page.tsx      # 主页面
│   │   ├── layout.tsx    # 布局
│   │   └── globals.css   # 全局样式
│   └── components/       # 组件
├── public/               # 静态资源
├── .env.example         # 环境变量示例
└── .env.local          # 本地环境变量（不提交到Git）
```

## 🔑 环境变量

创建 `.env.local` 文件并配置：

```bash
COZE_API_URL=https://26gpw6v7pz.coze.site/stream_run
COZE_API_TOKEN=你的token
COZE_PROJECT_ID=7601039291392753716
```

## 🛠️ 技术栈

- **框架**: Next.js 16 (App Router)
- **UI**: React 19
- **样式**: Tailwind CSS 4
- **组件**: shadcn/ui
- **AI SDK**: coze-coding-dev-sdk
- **语言**: TypeScript

## 📸 界面预览

- 科技感十足的汽车主题设计
- 深色背景 + 青色/蓝色渐变
- 速度线、光晕、网格等科技元素
- 流畅的动画效果

## 🌐 部署平台推荐

- [Vercel](https://vercel.com) ⭐ 推荐
- [Netlify](https://netlify.com)
- 自建服务器（Docker）

## 📝 开发说明

### 可用命令

```bash
pnpm dev          # 启动开发服务器
pnpm build        # 构建生产版本
pnpm start        # 启动生产服务器
pnpm lint         # 代码检查
pnpm ts-check     # TypeScript 类型检查
```

### 代码规范

- 使用 TypeScript 编写
- 遵循 ESLint 规则
- 组件采用函数式编程
- 使用 React Hooks

## 🔒 安全提示

- ⚠️ **不要**提交 `.env.local` 到 Git 仓库
- ✅ 使用 `.env.example` 作为配置模板
- ✅ 部署时在平台配置环境变量
- ✅ 定期更新依赖包

## 📄 License

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**立即体验智能汽车顾问服务！** 🚗💨
