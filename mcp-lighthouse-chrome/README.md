# MCP Lighthouse Chrome

通过 MCP 对**已开启远程调试的 Chrome** 跑 Lighthouse，包含 **Performance** 等全部分类。  
Chrome 需用**自定义用户数据目录**启动并监听 9222 后，MCP 连 `127.0.0.1:9222` 即可。

### Chrome 136+ 说明（避免 404）

自 **Chrome 136**（2025 年 3 月）起，出于安全考虑，**默认用户数据目录**下不再提供 CDP 的 HTTP 接口（如 `/json/version`），访问会返回 **404 Not Found**。  
必须用 **`--user-data-dir` 指定非默认目录** 启动 Chrome，CDP 才会完整可用。详见 [Chrome 官方说明](https://developer.chrome.com/blog/remote-debugging-port)。

## 使用方式

### 方式一：连接本机已打开的 Chrome（推荐）

1. **用「自定义用户数据目录」启动 Chrome（Chrome 136+ 必须）**
   - 关闭所有 Chrome 窗口后，在 Windows 上执行（路径可自定）：
   - **CMD：**
   ```bat
   "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir=%USERPROFILE%\chrome-cdp-profile
   ```
   - **PowerShell**（若在 CMD 下报 ParserError，改用下面这行）：
   ```powershell
   & "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="$env:USERPROFILE\chrome-cdp-profile"
   ```
   - 首次会新建配置目录 `chrome-cdp-profile`，之后用同一命令启动即可。
   - 打开 `chrome://inspect` 应看到：`Server running at: 127.0.0.1:9222`；访问 `http://127.0.0.1:9222/json/version` 应返回 JSON（不再 404）。

2. **在 Cursor 中配置 MCP**
   - 设置 → MCP → 添加 Server，配置如下（路径按你的项目改）：

   ```json
   {
     "mcpServers": {
       "lighthouse-chrome": {
         "command": "node",
         "args": ["/home/asus/Work/Blog/mcp-lighthouse-chrome/index.mjs"],
         "env": {
           "CHROME_CDP_HOST": "localhost",
           "CHROME_CDP_PORT": "9222"
         }
       }
     }
   }
   ```

3. **在 Cursor 里使用**
   - 调用工具 `run_audit` 或 `get_performance_score`，传入要测的 URL（如 `http://localhost:4322/blog`）即可。

### 方式二：WSL 连 Windows 上的 Chrome

若 Cursor 在 WSL、Chrome 在 Windows：

1. **Chrome 启动方式**
   - **WSL 镜像网络模式**（`.wslconfig` 里 `networkingMode=mirrored`）：用方式一的命令即可，WSL 内 `localhost`/`127.0.0.1` 即指向 Windows，无需改 `CHROME_CDP_HOST`。启动后可在 WSL 里验证：`curl -s http://127.0.0.1:9222/json/version` 应返回 JSON。
   - **非镜像模式（NAT）**：Chrome 需加 `--remote-debugging-address=0.0.0.0`，并在 WSL 中查 Windows 主机 IP：`grep nameserver /etc/resolv.conf | awk '{print $2}'`，把该 IP 填进 `CHROME_CDP_HOST`。
   - Windows 上启动 Chrome（PowerShell）：
   ```powershell
   & "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="$env:USERPROFILE\chrome-cdp-profile"
   ```
   - 若需从 WSL 通过主机 IP 访问，再加：`--remote-debugging-address=0.0.0.0`。

### 方式三：不设环境变量（自动启动本机 headless Chrome）

不设置 `CHROME_CDP_HOST` 时，MCP 会尝试自动启动本机 headless Chrome 并跑 Lighthouse（需本机已装 Chrome/Chromium）。

## 工具说明

| 工具 | 说明 |
|------|------|
| `run_audit` | 对指定 URL 跑完整 Lighthouse（可指定 categories、device、throttling），返回各分类分数与核心指标摘要。 |
| `get_performance_score` | 仅返回 Performance 分数，用于快速查看。 |

## 依赖与安装

- Node 18+ 或 Bun
- 已安装的 Chrome/Chromium（连接远程时由你在 Windows 上启动；本地模式由 chrome-launcher 查找）

在项目目录下安装依赖：

```bash
cd mcp-lighthouse-chrome
bun install
# 或 npm install
```

## 测试连接

Chrome 已显示 `Server running at: 127.0.0.1:9222` 时，在项目目录执行：

```bash
cd mcp-lighthouse-chrome
CHROME_CDP_HOST=localhost node test-connection.mjs
```

显示「已连接 Chrome」即表示可正常使用 MCP 跑 Lighthouse。

## 配合 chrome-devtools-mcp 使用

若同时使用 [chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp)（导航、性能录制等），需用**同一方式**启动 Chrome（`--remote-debugging-port=9222 --user-data-dir=...`），否则会 404。MCP 配置用 `--browserUrl http://localhost:9222`，不要与 `--autoConnect` 混用：

```json
"chrome-devtools": {
  "command": "npx",
  "args": ["-y", "chrome-devtools-mcp@latest", "--browserUrl", "http://localhost:9222"]
}
```

---

可选：chrome-devtools-mcp 的 **lighthouse_audit 不包含 Performance**。本 MCP 专注「连 localhost:9222 已有 Chrome + 跑完整 Lighthouse（含 Performance）」。
