# Astro Blog（Bun）

使用 Bun 创建的 Astro 博客，文章来自 `src/content/blog/`，frontmatter 使用 `pubDatetime`、`modDatetime`、`tags`、`draft`（已通过 schema 映射为 `pubDate`/`updatedDate`）。草稿文章不会出现在列表和路由中。

Features:

- ✅ Minimal styling (make it your own!)
- ✅ 100/100 Lighthouse performance
- ✅ SEO-friendly with canonical URLs and Open Graph data
- ✅ Sitemap support
- ✅ RSS Feed support
- ✅ Markdown & MDX support

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
├── public/
├── src/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   └── pages/
├── astro.config.mjs
├── README.md
├── package.json
└── tsconfig.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

The `src/content/` directory contains "collections" of related Markdown and MDX documents. Use `getCollection()` to retrieve posts from `src/content/blog/`, and type-check your frontmatter using an optional schema. See [Astro's Content Collections docs](https://docs.astro.build/en/guides/content-collections/) to learn more.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `bun install`             | Installs dependencies                            |
| `bun dev`             | Starts local dev server at `localhost:4321`      |
| `bun build`           | Build your production site to `./dist/`          |
| `bun preview`         | Preview your build locally, before deploying     |
| `bun lighthouse`      | 本地 Lighthouse 测评（需先 `bun run preview`，且本机已安装 Chrome/Chromium） |
| `bun astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `bun astro -- --help` | Get help using the Astro CLI                     |

## 📊 本地 Lighthouse 测评

1. 构建并启动预览：`bun run build && bun run preview`（预览默认在 `http://localhost:4321`）。
2. 另开终端执行：`bun run lighthouse`。会检测 `http://localhost:4321/blog` 并生成 `lighthouse-report.html`，完成后自动在浏览器打开。

**注意**：Lighthouse 依赖本机已安装的 **Chrome 或 Chromium**。若在 WSL 下报 “No Chrome installations found”：
- 在 WSL 内安装 Chromium：`sudo apt install chromium-browser`，或
- 在 Windows 上打开 Chrome，访问 [Chrome 的 Lighthouse](https://developer.chrome.com/docs/lighthouse/)（DevTools → Lighthouse），对 `http://localhost:4321/blog` 测评（需确保 WSL 的 4321 端口已转发到 Windows）。

## 👀 Want to learn more?

Check out [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Credit

This theme is based off of the lovely [Bear Blog](https://github.com/HermanMartinus/bearblog/).
