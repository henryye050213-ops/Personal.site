# Henry Ye 个人网站

这是可直接上传 GitHub、交给 Vercel 托管的纯 HTML / CSS / JavaScript 静态网站。没有 Node.js、React、Next.js 或其他框架运行依赖，不需要安装依赖、执行构建或租用后端服务器。

## 文件结构

```text
仓库根目录/
├── app/
│   ├── globals.css
│   └── cyber-theme.css
├── public/
│   ├── assets/
│   └── favicon-cyber.svg
├── .gitignore
├── README.md
├── index.html
├── script.js
└── vercel.json
```

`app/` 只是存放 CSS 的普通文件夹，不是框架工程。头像粒子、首页及未来方向的背景动效均在浏览器中运行，已经合并到 `script.js`。

## 上传 GitHub

1. 解压上传包，打开包含 `index.html` 的文件夹。
2. 将上面列出的文件和文件夹上传到 GitHub 仓库根目录。
3. 确认在仓库首页可以直接看到 `index.html`。不要把外层“Henry-Ye-GitHub-纯静态版”文件夹一起套进去，也不要只上传 ZIP 文件。
4. 更新已有仓库时，覆盖同名文件，并上传 `app/` 和 `public/` 中新增或更新的文件。不要混入旧的框架工程、测试目录或备份文件。

## Vercel 设置

本包的 `vercel.json` 已设置：

- Framework Preset：Other（无框架）
- Install Command：空，跳过安装
- Build Command：空，跳过构建
- Output Directory：`.`（仓库根目录）

导入仓库时，Root Directory 保持仓库根目录，不要选 `app` 或 `public`。如果旧项目在控制台保留了旧的根目录设置，需要改回根目录。

参考：[Vercel 静态站点构建设置](https://vercel.com/docs/builds/configure-a-build)、[vercel.json 配置](https://vercel.com/docs/project-configuration/vercel-json)。

## 内容与效果

- `index.html`：个人资料、公司与项目、历史成果、未来方向、联系方式。
- `app/`：页面样式与紫色科技风主题。
- `script.js`：导航、入场与滚动动画、头像粒子、背景线路动效。
- `public/assets/`：头像、背景、二维码和项目 SVG 图标。

修改文案不会要求重新编译。在线托管访问时可直接使用粒子交互；部分浏览器直接双击本地 `index.html` 时会限制图片像素读取，此时自动显示完整头像。系统开启“减少动态效果”时，页面会主动关闭持续动画。
