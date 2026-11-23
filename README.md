# 穿越宝典

从穿越小说和短剧里的经典情境出发，学习诗词、历史与生活知识。

[打开穿越宝典](https://oneleafdev.github.io/TimeTravelGuide/) · [部署记录](https://github.com/oneleafdev/TimeTravelGuide/actions/workflows/pages.yml)

## 第一卷 · 穿越必背古诗

首版收录汉、唐、宋、清共 8 首古诗。目录可按朝代筛选，也能搜篇名、作者和诗句。每首包含原文、穿越情境、白话释义、背诵提示和参考资料。「练背诵」保留每句首字，点按即可核对原文。「标记背会」的进度保存在当前浏览器。

《穿越野外求生指南》在卷目中显示为筹备中。

## 本地开发

使用 Node.js 24 LTS 和 npm。安装依赖并启动开发服务器后，访问终端显示的地址。

```bash
npm ci
npm run dev
```

```bash
npm run check    # 检查 TypeScript 和内容数据
npm run build    # 通过检查后构建到 dist/
npm run preview  # 预览构建产物
```

## 技术栈

| 层级 | 选择 | 用途 |
| --- | --- | --- |
| 前端 | React 19、TypeScript 7 | 页面交互、编译期类型检查 |
| 构建 | Vite 8、npm 锁文件 | 本地开发与静态构建 |
| 页面地址 | React Router 8、HashRouter | 在 GitHub Pages 子路径直接打开或刷新任意单篇 |
| 样式 | 原生 CSS、Lucide | 波普风视觉和响应式布局 |
| 内容与进度 | 本地 JSON、localStorage | 构建时打包内容，浏览器保存学习进度 |
| 部署 | GitHub Actions、GitHub Pages | 更新 `main` 后自动构建并上线 |

## 编辑内容

- [`src/data/library.json`](src/data/library.json) 管卷目。使用稳定的英文短 ID，发布状态用 `available` 或 `planned`。
- [`src/data/poetry.json`](src/data/poetry.json) 管古诗模块。编辑 `poems` 数组，每首填写 `id`、`title`、`dynasty`、`author`、`form`、`lines`、`scene`、`meaning`、`memoryCue` 和 `sources`。每个 `lines` 元素放一句并保留标点，`sources` 元素包含 `label` 和原始资料的 `url`。首页预览诗通过 `featuredPoemId` 选择。
- 各新模块各用一个 JSON，在 `src/features/` 里放独立的数据类型与页面。卷目只共享入口信息。例如野外求生模块可按主题、环境条件和步骤组织，古诗模块按篇目和诗句组织。
- 原文、出处和存在异文的版本信息一同核对。资料链接在阅读页展示，页面内容由本地 JSON 提供。编辑已有条目时保留 ID，旧链接和学习进度依赖该 ID。

## GitHub Pages 部署

工作流在 [`.github/workflows/pages.yml`](.github/workflows/pages.yml)。复制项目到其他仓库时，在该仓库的 **Settings → Pages → Build and deployment** 下选择 **GitHub Actions**。推送到 `main` 会触发构建和发布，也可以在 **Actions → Deploy GitHub Pages** 手动运行。Vite 使用相对资源路径，单篇地址保留在 URL 的 `#` 后面。

图片与内容维护规范见 [AGENTS.md](AGENTS.md)。
