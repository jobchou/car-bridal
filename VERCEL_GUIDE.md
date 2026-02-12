# 📘 Vercel 部署超详细教程

本教程将手把手教你如何将车圈红娘部署到 Vercel，从注册到分享链接，每个步骤都有详细说明。

---

## 📋 部署前准备清单

在开始之前，请确保你已经：

- [x] 拥有 GitHub 账号（如果没有，访问 https://github.com 注册）
- [x] 已准备好项目代码（在 `/workspace/projects` 目录）
- [x] 已有 Vercel 部署 Token（从 .env.local 复制）

---

## 第一阶段：准备代码仓库

### 步骤 1：初始化 Git 仓库

在终端中执行以下命令：

```bash
# 进入项目目录
cd /workspace/projects

# 初始化 Git 仓库
git init

# 添加所有文件到暂存区
git add .

# 提交代码
git commit -m "feat: 车圈红娘智能汽车顾问系统"
```

执行后应该看到类似输出：
```
Initialized empty Git repository in /workspace/projects/.git/
[main (root-commit)] feat: 车圈红娘智能汽车顾问系统
 31 files changed, 1234 insertions(+)
 create mode 100644 src/app/page.tsx
 ...
```

### 步骤 2：在 GitHub 创建新仓库

1. 打开浏览器，访问：https://github.com

2. 登录你的 GitHub 账号

3. 点击右上角的 **+** 号，选择 **New repository**

4. 填写仓库信息：
   - **Repository name**: 输入 `car-bridal`（或你喜欢的名称）
   - **Description**: 输入 `智能汽车顾问系统`
   - **Visibility**: 选择 **Public**（公开）或 **Private**（私有）

5. 勾选 **Add a README file**（可选）

6. 点击 **Create repository**

7. 创建后会看到一个页面，显示仓库地址，格式类似：
   ```
   https://github.com/你的用户名/car-bridal.git
   ```

### 步骤 3：推送代码到 GitHub

复制仓库地址后，在终端执行：

```bash
# 添加远程仓库（替换成你的实际地址）
git remote add origin https://github.com/你的用户名/car-bridal.git

# 设置主分支
git branch -M main

# 推送代码到 GitHub
git push -u origin main
```

**如果需要登录 GitHub：**
```bash
# 使用 Personal Access Token 登录
# 访问 https://github.com/settings/tokens 创建 Token
git push -u origin main
```

推送成功后，会看到：
```
Enumerating objects: 42, done.
Counting objects: 100% (42/42), done.
...
To https://github.com/你的用户名/car-bridal.git
 * [new branch]      main -> main
```

现在访问你的 GitHub 仓库页面，应该能看到所有代码文件。

---

## 第二阶段：部署到 Vercel

### 步骤 4：注册/登录 Vercel

1. 打开浏览器，访问：https://vercel.com

2. 点击右上角的 **Login**

3. 选择 **Continue with GitHub**（推荐）

4. 授权 Vercel 访问你的 GitHub 账号：
   - 点击 "Authorize Vercel"
   - 如果需要，输入 GitHub 密码进行确认

5. 注册/登录成功后会跳转到 Vercel 仪表板

### 步骤 5：创建新项目

1. 在 Vercel 仪表板，点击 **Add New** 按钮

2. 在下拉菜单中选择 **Project**

3. Vercel 会显示你的 GitHub 仓库列表

4. 找到 **car-bridal**（你的仓库名），点击 **Import**

### 步骤 6：配置项目构建设置

导入后，Vercel 会自动检测项目配置并显示设置页面：

#### Configure Project 页面设置：

**Project Name（项目名称）**
- 输入：`car-bridal`
- 或使用默认名称
- 这将决定你的域名，如 `car-bridal.vercel.app`

**Framework Preset（框架预设）**
- 选择：**Next.js**
- Vercel 会自动检测，通常已默认选中

**Root Directory（根目录）**
- 输入：`./`（默认）
- 保持默认即可

**Build Command（构建命令）**
- 输入：`pnpm run build`
- 这是生产环境构建命令

**Output Directory（输出目录）**
- 输入：`.next`
- Next.js 的构建输出目录

**Install Command（安装命令）**
- 输入：`pnpm install`
- 或保持默认（Vercel 会自动检测）

**Node.js Version**
- 选择：**24.x**
- 或保持默认（Vercel 会自动选择）

**Environment Variables（环境变量）** ⭐ **关键步骤**

向下滚动到 **Environment Variables** 部分，点击 **Add New** 添加以下变量：

| Name | Value | Environment |
|------|-------|-------------|
| `COZE_API_URL` | `https://26gpw6v7pz.coze.site/stream_run` | Production, Preview, Development |
| `COZE_API_TOKEN` | `eyJhbGciOiJSUzI1NiIsImtpZCI6ImIxNTVmODNhLTZkYzAtNDA5Ni05MDRiLWU5MjM0ZTVlZmU2ZiJ9.eyJpc3MiOiJodHRwczovL2FwaS5jb3plLmNuIiwiYXVkIjpbInUxeEFsOEZ3QTROR09qWjZXdnBQNzVPQXplWmpjVlE3Il0sImV4cCI6ODIxMDI2Njg3Njc5OSwiaWF0IjoxNzcwODc3NjIxLCJzdWIiOiJzcGlmZmU6Ly9hcGkuY296ZS5jbi93b3JrbG9hZF9pZGVudGl0eS9pZDo3NjAxMDQzMzM4MzU5MjEwMDM2Iiwic3JjIjoiaW5ib3VuZF9hdXRoX2FjY2Vzc190b2tlbl9pZDo3NjA1ODYxNDY5MzM4NDY4MzcxIn0.Kb5Dz9-lAKchtL4ZnLo8rwrhvwEy0TafX392vCsFvANui7Z8xHCsm6ht9WjQXrSyRM53ibdi69TvnYI2wYyJ-twr1dD5phGZfj47AmaNWZDeVsylH7Eggr40kfT1ZLUFVgUog6Mr149xF9aXIGL71avyJPnfazZe83K2AC_d9tgXnBymAkmx2bWrqPCkdcekrnvhRzhxHKSfThPw4h_KXeHS0TYd7x_ry9oMe-OmoCU2WwrdFzXD9T9H1i45wlzyRwzMGX0gpu9zJC-OPmhKMDzbPHbshI0KPl9RHlhOQCwXQ5yUk9arqluJw4ltNKdxmREyPpTrdh30IbI8FyLebQ` | Production, Preview, Development |
| `COZE_PROJECT_ID` | `7601039291392753716` | Production, Preview, Development |

**添加环境变量的详细步骤：**

1. 点击 "Add New"
2. 在 "Name" 框输入：`COZE_API_URL`
3. 在 "Value" 框输入：`https://26gpw6v7pz.coze.site/stream_run`
4. 在 "Environment" 部分勾选：
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. 点击 "Add" 或按回车
6. 重复以上步骤添加另外两个变量

**重要提示：**
- 确保 Token 完整复制（以 `eyJ` 开头，以 `Q` 结尾）
- 确保 Project ID 完整
- 所有环境都勾选

### 步骤 7：开始部署

配置完成后：

1. 检查所有设置是否正确
2. 点击页面底部的 **Deploy** 按钮

### 步骤 8：等待部署完成

Vercel 会开始构建和部署，你会看到实时日志：

**构建过程（约 2-3 分钟）：**

1. **Cloning repository** - 克隆代码
2. **Installing dependencies** - 安装依赖（pnpm install）
3. **Building application** - 构建应用（pnpm run build）
4. **Uploading to Edge** - 上传到边缘节点
5. **Deploying** - 部署到全球网络

日志示例：
```
2024-02-12T14:30:00.000Z Cloning repository...
2024-02-12T14:30:10.000Z Installing dependencies...
2024-02-12T14:31:00.000Z Building application...
2024-02-12T14:31:45.000Z Build successful
2024-02-12T14:31:50.000Z Deploying...
```

**状态指示：**
- 🔵 Building - 构建中
- 🟢 Ready - 部署成功
- 🔴 Error - 部署失败

### 步骤 9：获取部署链接

部署成功后，Vercel 会跳转到部署详情页面：

1. 页面顶部会显示绿色 **"Ready"** 状态
2. 页面右上角有一个链接按钮，格式类似：
   ```
   https://car-bridal-xxx.vercel.app
   ```
3. 点击链接或复制这个 URL

**示例链接：**
```
https://car-bridal-a1b2c3d4.vercel.app
```

---

## 第三阶段：验证和分享

### 步骤 10：测试部署

1. 打开新标签页，访问你的部署链接
2. 检查页面是否正常显示
3. 测试对话功能：
   - 输入："你好"
   - 检查是否有回复
   - 观察流式输出是否正常

### 步骤 11：分享链接

现在你可以分享链接给朋友了！

**分享方式：**

1. **直接复制链接**
   ```
   https://car-bridal-a1b2c3d4.vercel.app
   ```

2. **生成二维码**
   - 访问 https://www.qrcode-generator.com
   - 输入你的链接
   - 下载二维码图片
   - 朋友扫码即可访问

3. **添加到社交媒体**
   - 微信、朋友圈、微博等

---

## 第四阶段：自定义配置（可选）

### 选项 1：修改项目名称

如果你想要更短的域名：

1. 进入 Vercel 项目页面
2. 点击 **Settings** → **General**
3. 在 "Project Name" 输入新名称
4. 点击 **Save**
5. 新域名会自动生成

### 选项 2：添加自定义域名

如果你有自己的域名：

1. 购买域名（阿里云、腾讯云等）
2. 进入 Vercel 项目页面
3. 点击 **Settings** → **Domains**
4. 点击 **Add** 输入你的域名
5. 按提示配置 DNS 记录

DNS 配置示例：
```
Type: CNAME
Name: chat
Value: cname.vercel-dns.com
```

### 选项 3：配置团队协作

如果需要团队协作：

1. 在项目页面点击 **Settings** → **Team**
2. 邀请团队成员
3. 分配权限

---

## 🛠️ 常见问题和解决方案

### 问题 1：构建失败

**错误信息：**
```
Build failed with exit code 1
```

**解决方案：**
1. 检查构建日志，查看具体错误
2. 确认 package.json 中的脚本正确
3. 检查依赖是否兼容
4. 尝试在本地构建：`pnpm run build`

### 问题 2：环境变量未生效

**错误信息：**
```
COZE_API_TOKEN is not configured
```

**解决方案：**
1. 进入项目设置 → Environment Variables
2. 确认三个变量都已添加
3. 确认选择了 Production 环境
4. 重新部署：点击 "Redeploy"

### 问题 3：页面无法访问

**错误信息：**
```
404 Not Found
```

**解决方案：**
1. 确认部署状态是 "Ready"
2. 检查链接是否正确
3. 清除浏览器缓存
4. 等待 1-2 分钟（DNS 传播）

### 问题 4：对话功能不工作

**错误信息：**
```
Failed to call Coze API
```

**解决方案：**
1. 检查环境变量配置
2. 确认 API Token 是否完整
3. 查看部署日志中的错误信息
4. 测试 API 是否可访问

### 问题 5：推送代码后没有自动部署

**解决方案：**
1. 检查 GitHub 集成是否正确
2. 确认推送到了正确的分支（main）
3. 在 Vercel 检查项目设置 → Git
4. 手动触发部署：点击 "Redeploy"

---

## 📊 Vercel 免费额度说明

Vercel 免费计划（Hobby）包含：

- ✅ 无限项目数量
- ✅ 无限带宽
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ✅ 100GB 带宽/月
- ✅ 6,000 分钟构建时间/月
- ✅ 100GB 托管空间

**限制：**
- 每次构建最长 60 分钟
- 无企业级支持
- 无团队协作功能

**对于个人项目完全够用！**

---

## 🔄 自动部署设置

Vercel 默认会自动部署，每次你推送代码到 GitHub 都会自动重新部署。

**如果需要关闭自动部署：**
1. 进入项目设置
2. 点击 **Git**
3. 关闭 "Auto Deploy"

**手动重新部署：**
1. 在项目页面找到你的部署
2. 点击右上角的 "..."
3. 选择 "Redeploy"

---

## 📱 移动端访问

部署后，你可以：

1. 在手机浏览器直接访问链接
2. 生成二维码扫码访问
3. 添加到手机主屏幕（PWA）

**添加到主屏幕：**
1. 用 Safari 或 Chrome 打开链接
2. 点击分享按钮
3. 选择 "添加到主屏幕"
4. 像使用 App 一样访问

---

## ✅ 部署完成检查清单

部署完成后，请确认：

- [ ] 部署状态显示 "Ready"
- [ ] 可以通过链接访问页面
- [ ] 对话功能正常工作
- [ ] 流式输出正常
- [ ] 多轮对话正常
- [ ] 环境变量已配置
- [ ] 链接可以分享给朋友

---

## 🎉 恭喜！

你已经成功将车圈红娘部署到 Vercel 了！

现在你可以：
- ✅ 分享链接给朋友
- ✅ 随时更新代码（自动部署）
- ✅ 监控访问数据
- ✅ 添加自定义域名
- ✅ 享受全球 CDN 加速

**访问地址：**
```
https://car-bridal-xxx.vercel.app
```

---

## 📞 获取帮助

如果遇到问题：

1. 查看部署日志
2. 访问 Vercel 文档：https://vercel.com/docs
3. 查看 GitHub Issues
4. 联系技术支持

---

**祝你使用愉快！🚗💨**
