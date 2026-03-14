---
name: blog-project
description: Conventions and structure for this Astro blog (QuincySnow). Use when editing the blog, adding pages or links, changing navigation, or working in site/ or content. Covers base path, internal links, i18n, layout, and package manager (Bun only).
---

# Blog 项目约定

本 Skill 描述本仓库中 Astro 博客的目录与约定，便于增改页面、链接与内容时保持一致。

## 包管理器：仅使用 Bun

- **本仓库统一使用 Bun**，不使用 npm、yarn、pnpm 等。
- 安装依赖：`bun install`（在 `site/` 下执行）。
- 开发：`bun run dev`；构建：`bun run build`；其它脚本一律用 `bun run <script>`。
- 添加依赖时用 `bun add <pkg>` 或 `bun add -d <pkg>`，不要写 `npm install` / `npm i` / `yarn` / `pnpm` 等。
- 文档、注释、Skill 中的示例命令均以 Bun 为准。

## 项目位置与 base

- 站点源码在 **`site/`** 下；构建输出为 `site/dist/`。
- 配置了 **`base: '/blog'`**（`site/astro.config.mjs`），站点部署在子路径 `/blog` 下（如 GitHub Pages）。
- **所有站内链接必须带 base 前缀**，不能写死 `/about`、`/search` 等，否则在子路径部署下会失效。

## 内部链接：必须用 withBase

- **`site/src/consts.ts`** 提供：
  - `BASE_PATH`：当前 base（如 `/blog`）
  - **`withBase(path: string): string`**：给路径加上 base 前缀
- 规则：
  - 所有站内 **`href`**（导航、列表、搜索页、资源链接等）一律用 **`withBase('/...')`** 生成。
  - 示例：`href={withBase('/')}`、`href={withBase('/about')}`、`href={withBase(\`/blog/${post.id}/\`)}`。
- 已统一使用 withBase 的位置：
  - **Header**：站名、首页/博客/关于（通过 HeaderLink）、搜索按钮
  - **HeaderLink.astro**：对传入的 `href` 用 `withBase(href)` 再输出
  - **BaseHead**：favicon、sitemap、RSS、字体 preload
  - **首页 / 博客列表 / 搜索页**：文章链接、“全部文章”链接
- **新增页面或新链接时**：从 `../consts`（或 `../../consts`，视文件位置）引入 `withBase`，用 `href={withBase('/your-path')}`，不要写裸 `/your-path`。

## 路由与页面

- 首页：`site/src/pages/index.astro` → `/`（实际访问为 `/blog/`）
- 博客列表：`site/src/pages/blog/index.astro` → `/blog`
- 文章详情：`site/src/pages/blog/[...slug].astro` → `/blog/:slug`
- 关于：`site/src/pages/about.astro` → `/about`
- 标签列表：`site/src/pages/tags.astro` → `/tags`
- 标签详情（某标签下的文章列表）：`site/src/pages/tags/[tag].astro` → `/tags/:tag`，链接用 `withBase('/tags/' + encodeURIComponent(tagName))`。
- 文章内与标签页的标签均指向 **`/tags/[tag]`**，不再使用 `?search=` 搜索。
- 搜索为 Header 内弹窗，无独立 `/search` 页面。
- 新增页面时，在导航或其它入口用 **`withBase('/your-route')`** 链接过去。

## 导航与 active 状态

- **Header.astro**：站名、HeaderLink（Home/Blog/About）、搜索按钮；所有链接已用 withBase。
- **HeaderLink.astro**：接收“逻辑路径”（如 `/`、`/blog`、`/about`），内部用 `withBase(href)` 输出真实 href；active 判断基于去掉 base 后的 pathname，无需在调用处再写 base。
- 若在客户端脚本里根据 pathname 做分支（如设置 document.title），需先去掉 base 再比较；Header 中已通过 `define:vars={{ basePath: BASE_PATH }}` 传入并做字符串截断。

## 资源与 head

- **BaseHead.astro**：canonical、favicon、sitemap、RSS、字体 preload 等均已使用 `withBase(...)`。
- 新增 head 内资源（如新 favicon、新字体）时，**href 使用 `withBase('/path/to/asset')`**，保证在子路径下可正确加载。

## 内容与 i18n

- 博客正文：`site/src/content/blog/`（MD/MDX）。
- 全局文案与多语言在 **`site/src/i18n.ts`**，通过 `data-i18n`、`data-i18n-placeholder` 与 Header 内脚本中的 `i18n` 使用（中/英）。
- 新增需翻译的 UI 时，在 i18n 中增加对应 key，并在组件上使用 `data-i18n="key"` 或占位符 key。

## 文章语言（lang）与中英文版本

- **Frontmatter**：每篇文章在 **`site/src/content.config.ts`** 的 blog schema 中支持可选字段 **`lang: 'zh' | 'en'`**。中文文章必须写 **`lang: zh`**，英文文章必须写 **`lang: en`**。
- **中文原文**：放在 `site/src/content/blog/` 下，文件名如 `YYYY-MM-DD-slug.md`，frontmatter 中包含 **`lang: zh`**。
- **英文版本**：同一主题的英文文章使用独立文件，文件名带 **`-en`** 后缀，如 `YYYY-MM-DD-slug-en.md`，frontmatter 中包含 **`lang: en`**。标题、描述与正文为英文；正文可为完整译文或摘要 +「详见中文版」链接。
- **站内互链**：在英文版正文中引用中文版时，使用**相对路径**（同目录 slug），例如 `[Chinese version](slug-without-en)`，以便在 `base: '/blog'` 下正确解析。
- **日期与 UI**：站点根据当前界面语言（中/英）显示日期格式（`dateLocale` 在 i18n 中配置）；列表与文章页的日期会随语言切换更新。

## 布局与样式

- 通用布局：**`site/src/layouts/BlogPost.astro`**（文章与关于页共用）；含代码块顶栏、TOC、全局样式等。
- 全局样式：**`site/src/styles/global.css`**；组件内使用 `<style>` 或 `is:global` 按需。
- 正文与 TOC 比例：正文区约 75–80%，右侧目录约 20–25%；大屏下正文 max-width 980px，目录 300px。

## 检查清单（改链接或加页面时）

- [ ] 新链接使用 `withBase('/...')`，未写死根路径 `/xxx`
- [ ] 若在 Header/导航加入口，使用 HeaderLink 或带 withBase 的 `<a>`
- [ ] 新 head 资源（favicon、字体等）使用 withBase
- [ ] 新文章：中文稿加 `lang: zh`；英文稿用 `-en.md` 且加 `lang: en`；正文内跨语言引用用相对 slug
- [ ] 构建通过：`cd site && bun run build`
