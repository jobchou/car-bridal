# 🚀 5分钟快速部署指南

## 最快方式：使用 Vercel（免费）

### 第一步：准备代码（1分钟）

1. 在本地终端执行：

```bash
cd /workspace/projects

# 初始化 Git（如果还没有）
git init
git add .
git commit -m "Initial commit: 车圈红娘应用"
```

2. 推送到 GitHub：

```bash
# 在 GitHub 创建新仓库，然后执行：
git remote add origin https://github.com/你的用户名/你的仓库名.git
git branch -M main
git push -u origin main
```

### 第二步：部署到 Vercel（3分钟）

1. 访问 https://vercel.com，用 GitHub 账号登录

2. 点击 "Add New" → "Project"

3. 选择刚才推送的仓库，点击 "Import"

4. 配置项目（自动检测 Next.js）：
   - Framework Preset: Next.js
   - Root Directory: `./`（默认）
   - Build Command: `pnpm run build`（自动填充）
   - Output Directory: `.next`（自动填充）

5. **关键步骤：添加环境变量**

   向下滚动到 "Environment Variables" 部分，添加：

   | Name | Value |
   |------|-------|
   | `COZE_API_URL` | `https://26gpw6v7pz.coze.site/stream_run` |
   | `COZE_API_TOKEN` | `eyJhbGciOiJSUzI1NiIsImtpZCI6ImIxNTVmODNhLTZkYzAtNDA5Ni05MDRiLWU5MjM0ZTVlZmU2ZiJ9.eyJpc3MiOiJodHRwczovL2FwaS5jb3plLmNuIiwiYXVkIjpbInUxeEFsOEZ3QTROR09qWjZXdnBQNzVPQXplWmpjVlE3Il0sImV4cCI6ODIxMDI2Njg3Njc5OSwiaWF0IjoxNzcwODc3NjIxLCJzdWIiOiJzcGlmZmU6Ly9hcGkuY296ZS5jbi93b3JrbG9hZF9pZGVudGl0eS9pZDo3NjAxMDQzMzM4MzU5MjEwMDM2Iiwic3JjIjoiaW5ib3VuZF9hdXRoX2FjY2Vzc190b2tlbl9pZDo3NjA1ODYxNDY5MzM4NDY4MzcxIn0.Kb5Dz9-lAKchtL4ZnLo8rwrhvwEy0TafX392vCsFvANui7Z8xHCsm6ht9WjQXrSyRM53ibdi69TvnYI2wYyJ-twr1dD5phGZfj47AmaNWZDeVsylH7Eggr40kfT1ZLUFVgUog6Mr149xF9aXIGL71avyJPnfazZe83K2AC_d9tgXnBymAkmx2bWrqPCkdcekrnvhRzhxHKSfThPw4h_KXeHS0TYd7x_ry9oMe-OmoCU2WwrdFzXD9T9H1i45wlzyRwzMGX0gpu9zJC-OPmhKMDzbPHbshI0KPl9RHlhOQCwXQ5yUk9arqluJw4ltNKdxmREyPpTrdh30IbI8FyLebQ` |
   | `COZE_PROJECT_ID` | `7601039291392753716` |

6. 点击 "Deploy"

### 第三步：等待完成（1分钟）

- Vercel 会自动构建和部署
- 大约需要 1-3 分钟
- 完成后会显示类似 `https://car-bridal-xxx.vercel.app` 的链接

### 第四步：测试

1. 点击部署成功的链接
2. 测试对话功能
3. 如果正常，分享链接给朋友！

---

## 🎉 部署成功！

现在你可以：
- 分享 Vercel 域名链接给朋友
- 在项目设置中添加自定义域名
- 每次推送代码自动更新

---

## ⚠️ 重要提醒

### 不要做的事情：
- ❌ 不要提交 `.env.local` 到 Git
- ❌ 不要公开分享 API Token
- ❌ 不要在代码中硬编码密钥

### 必须做的事情：
- ✅ 在 Vercel 中配置环境变量
- ✅ 保存好 API Token
- ✅ 定期更新依赖

---

## 🔧 出问题了？

### 问题1：部署失败
- 检查构建日志
- 确认环境变量已添加
- 重新部署

### 问题2：对话不工作
- 确认环境变量正确
- 检查 API Token 是否过期
- 查看 Vercel 日志

### 问题3：页面空白
- 等待部署完全完成
- 清除浏览器缓存
- 检查构建状态

---

## 📞 需要帮助？

查看完整部署指南：[DEPLOYMENT.md](./DEPLOYMENT.md)
