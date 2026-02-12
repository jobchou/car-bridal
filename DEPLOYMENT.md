# 车圈红娘 - 部署指南

本指南将帮助你将车圈红娘应用部署到生产环境，让其他人可以通过链接访问使用。

## 🚀 推荐部署平台

### 方案一：Vercel（推荐）

Vercel 是 Next.js 的官方部署平台，提供免费的托管服务，部署简单快捷。

#### 步骤：

1. **准备代码仓库**
   - 将代码推送到 GitHub、GitLab 或 Bitbucket

2. **注册 Vercel 账号**
   - 访问 https://vercel.com
   - 使用 GitHub 账号登录

3. **导入项目**
   - 点击 "New Project"
   - 选择你的代码仓库
   - Vercel 会自动检测 Next.js 项目

4. **配置环境变量（重要！）**

   在 Vercel 项目设置中添加以下环境变量：

   ```
   COZE_API_URL=https://26gpw6v7pz.coze.site/stream_run
   COZE_API_TOKEN=你的token（从.env.local复制）
   COZE_PROJECT_ID=7601039291392753716
   ```

   添加方式：
   - 进入项目设置 → Environment Variables
   - 添加上述三个变量
   - 选择所有环境（Production, Preview, Development）

5. **部署**
   - 点击 "Deploy"
   - 等待构建完成（约 2-3 分钟）
   - 部署成功后会获得一个 `.vercel.app` 域名

6. **自定义域名（可选）**
   - 在项目设置 → Domains 添加自定义域名
   - 按提示配置 DNS 记录

#### 优点：
- ✅ 完全免费（有限制，但对个人项目足够）
- ✅ 自动 HTTPS
- ✅ 全球 CDN 加速
- ✅ 自动部署（推送代码自动更新）
- ✅ 官方支持，稳定性高

---

### 方案二：Netlify

Netlify 也是一个优秀的免费托管平台，支持 Next.js。

#### 步骤：

1. **注册 Netlify 账号**
   - 访问 https://netlify.com

2. **导入项目**
   - 连接你的 Git 仓库
   - 配置构建设置：

   ```
   Build command: pnpm install && pnpm run build
   Publish directory: .next
   Node version: 24
   ```

3. **配置环境变量**
   - Site settings → Environment variables
   - 添加与 Vercel 相同的环境变量

4. **部署**
   - 点击 "Deploy site"

---

### 方案三：自建服务器

如果你想在自己的服务器上部署，可以使用 Docker。

#### 步骤：

1. **创建 Dockerfile**

   在项目根目录创建 `Dockerfile`：

   ```dockerfile
   FROM node:24-slim

   WORKDIR /app

   # 复制 package 文件
   COPY package.json pnpm-lock.yaml* ./

   # 安装 pnpm
   RUN npm install -g pnpm

   # 安装依赖
   RUN pnpm install

   # 复制项目文件
   COPY . .

   # 构建应用
   RUN pnpm run build

   # 暴露端口
   EXPOSE 5000

   # 启动应用
   CMD ["pnpm", "start"]
   ```

2. **构建镜像**

   ```bash
   docker build -t car-bridal .
   ```

3. **运行容器**

   ```bash
   docker run -d -p 5000:5000 \
     -e COZE_API_URL=https://26gpw6v7pz.coze.site/stream_run \
     -e COZE_API_TOKEN=你的token \
     -e COZE_PROJECT_ID=7601039291392753716 \
     car-bridal
   ```

4. **使用 Nginx 反向代理（推荐）**

   配置 Nginx 作为反向代理，提供 HTTPS 支持。

---

## 🔑 环境变量说明

部署时必须配置以下环境变量：

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `COZE_API_URL` | 扣子智能体 API 地址 | `https://26gpw6v7pz.coze.site/stream_run` |
| `COZE_API_TOKEN` | 扣子 API 授权 Token | `eyJhbGciOiJ...` (从 .env.local 复制) |
| `COZE_PROJECT_ID` | 智能体项目 ID | `7601039291392753716` |

⚠️ **重要提示**：
- 不要将 `.env.local` 文件提交到 Git 仓库
- `.gitignore` 已配置，会自动忽略此文件
- 部署时需要在平台设置中手动添加环境变量

---

## 📱 部署后验证

部署完成后，进行以下测试：

1. **访问网站**
   - 打开部署后的 URL
   - 检查页面是否正常加载

2. **测试对话功能**
   - 发送一条测试消息
   - 确认智能体能够正常回复

3. **检查流式响应**
   - 观察回复是否实时显示（打字机效果）

4. **测试多轮对话**
   - 发送多轮对话
   - 确认上下文能够保持

---

## 🌐 分享链接

部署成功后，你可以：

1. **直接分享 Vercel 域名**
   - 例如：`https://car-bridal.vercel.app`

2. **使用自定义域名**
   - 配置更专业的域名，如 `chat.yourdomain.com`

3. **生成二维码**
   - 使用在线工具生成二维码
   - 方便手机扫码访问

---

## 🔧 常见问题

### Q1: 部署后 API 报错？
**A:** 检查环境变量是否正确配置，特别是 `COZE_API_TOKEN`

### Q2: 页面无法访问？
**A:** 检查部署状态，确认构建成功，查看部署日志

### Q3: 流式响应不工作？
**A:** 确认使用了生产环境构建，检查 API 路由配置

### Q4: 如何更新应用？
**A:** 推送代码到 Git 仓库，Vercel 会自动重新部署

### Q5: Vercel 免费额度用完怎么办？
**A:** 升级到 Pro 计划（$20/月）或迁移到其他平台

---

## 📞 技术支持

如果遇到部署问题：

1. 查看部署平台的日志
2. 检查环境变量配置
3. 确认 API Token 是否有效
4. 参考官方文档

---

## ✅ 部署清单

部署前请确认：

- [ ] 代码已推送到 Git 仓库
- [ ] .gitignore 已配置（不要提交 .env.local）
- [ ] 环境变量已准备好
- [ ] 本地构建测试通过（`pnpm run build`）
- [ ] 已选择部署平台
- [ ] 已阅读平台文档

---

**祝你部署成功！🎉**
