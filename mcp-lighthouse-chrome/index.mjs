#!/usr/bin/env node
/**
 * MCP server: run Lighthouse (including Performance) by connecting to an existing Chrome.
 * Chrome 开启远程调试后显示 Server running at: 127.0.0.1:9222，配置 CHROME_CDP_HOST=localhost 即可。
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { z } from 'zod';

const CHROME_CDP_HOST = process.env.CHROME_CDP_HOST;
const CHROME_CDP_PORT = parseInt(process.env.CHROME_CDP_PORT || '9222', 10);

function getLighthouseOptions() {
  if (CHROME_CDP_HOST) {
    return { hostname: CHROME_CDP_HOST, port: CHROME_CDP_PORT };
  }
  return null;
}

async function runLighthouse(url, opts = {}) {
  const { categories = ['performance'], device = 'desktop', throttling = true } = opts;
  let chrome = null;
  let connectionOptions = getLighthouseOptions();

  if (!connectionOptions) {
    const os = await import('node:os');
    const userDataDir = `${os.tmpdir()}/lighthouse-mcp-${Date.now()}`;
    chrome = await chromeLauncher.launch({
      chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu', `--user-data-dir=${userDataDir}`],
    });
    connectionOptions = { port: chrome.port };
  }

  try {
    const flags = {
      ...connectionOptions,
      logLevel: 'warn',
      output: 'json',
      onlyCategories: categories,
      formFactor: device,
      screenEmulation: device === 'mobile'
        ? { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false }
        : { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false },
      maxWaitForLoad: 60_000,
      throttling: throttling
        ? { rttMs: 150, throughputKbps: 1638.4, requestLatencyMs: 0, downloadThroughputKbps: 1474.56, uploadThroughputKbps: 675, cpuSlowdownMultiplier: 4 }
        : undefined,
    };
    const runnerResult = await lighthouse(url, flags, undefined);
    return runnerResult;
  } finally {
    if (chrome) await chrome.kill();
  }
}

const server = new McpServer(
  {
    name: 'mcp-lighthouse-chrome',
    version: '1.0.0',
  },
  { capabilities: {} }
);

server.registerTool(
  'run_audit',
  {
    description: 'Run a full Lighthouse audit on a URL (including Performance). Connects to Chrome via CHROME_CDP_HOST:CHROME_CDP_PORT when set (e.g. Windows Chrome from WSL).',
    inputSchema: {
      url: z.string().url().describe('URL to audit'),
      categories: z.array(z.enum(['performance', 'accessibility', 'best-practices', 'seo', 'pwa'])).optional().describe('Categories (default: performance)'),
      device: z.enum(['mobile', 'desktop']).optional().default('desktop'),
      throttling: z.boolean().optional().default(true),
    },
  },
  async ({ url, categories, device, throttling }) => {
    try {
      const result = await runLighthouse(url, { categories: categories || ['performance'], device, throttling });
      const lhr = result.lhr;
      const summary = {
        performance: lhr.categories.performance?.score != null ? Math.round(lhr.categories.performance.score * 100) : null,
        accessibility: lhr.categories.accessibility?.score != null ? Math.round(lhr.categories.accessibility.score * 100) : null,
        'best-practices': lhr.categories['best-practices']?.score != null ? Math.round(lhr.categories['best-practices'].score * 100) : null,
        seo: lhr.categories.seo?.score != null ? Math.round(lhr.categories.seo.score * 100) : null,
        pwa: lhr.categories.pwa?.score != null ? Math.round(lhr.categories.pwa.score * 100) : null,
      };
      const metrics = {};
      if (lhr.audits['first-contentful-paint']) metrics.fcp = lhr.audits['first-contentful-paint'].displayValue;
      if (lhr.audits['largest-contentful-paint']) metrics.lcp = lhr.audits['largest-contentful-paint'].displayValue;
      if (lhr.audits['total-blocking-time']) metrics.tbt = lhr.audits['total-blocking-time'].displayValue;
      if (lhr.audits['cumulative-layout-shift']) metrics.cls = lhr.audits['cumulative-layout-shift'].displayValue;
      const text = [
        '## Lighthouse 结果',
        '',
        '**分数:** ' + JSON.stringify(summary, null, 2),
        '',
        '**核心指标:** ' + JSON.stringify(metrics),
        '',
        '完整 JSON 已省略，可保存到文件。',
      ].join('\n');
      return { content: [{ type: 'text', text }] };
    } catch (err) {
      return {
        content: [{ type: 'text', text: `Lighthouse 运行失败: ${err.message}\n\n若连接 Windows Chrome，请确认:\n1. Windows 上已执行: chrome.exe --remote-debugging-port=9222\n2. 在 WSL 中设置 CHROME_CDP_HOST 为 Windows 主机 IP（如 \`cat /etc/resolv.conf | grep nameserver | awk '{print $2}'\`）` }],
        isError: true,
      };
    }
  }
);

server.registerTool(
  'get_performance_score',
  {
    description: 'Get only the Performance score for a URL. Uses existing Chrome when CHROME_CDP_HOST is set.',
    inputSchema: {
      url: z.string().url().describe('URL to audit'),
      device: z.enum(['mobile', 'desktop']).optional().default('desktop'),
    },
  },
  async ({ url, device }) => {
    try {
      const result = await runLighthouse(url, { categories: ['performance'], device });
      const score = result.lhr.categories.performance?.score != null
        ? Math.round(result.lhr.categories.performance.score * 100)
        : null;
      const text = score != null ? `Performance 分数: ${score}` : '未得到 Performance 分数';
      return { content: [{ type: 'text', text }] };
    } catch (err) {
      return {
        content: [{ type: 'text', text: `失败: ${err.message}` }],
        isError: true,
      };
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
