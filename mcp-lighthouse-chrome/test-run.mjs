#!/usr/bin/env node
/** 快速测试：不启动 MCP，直接跑一次 Lighthouse 并打印 Performance 分数 */
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const url = process.argv[2] || 'https://example.com';
console.error('正在启动 Chrome 并跑 Lighthouse:', url);

// WSL 下避免 chrome-launcher 使用 Windows 路径导致 EACCES
const tmpDir = process.env.TMPDIR || process.env.TMP || '/tmp';
const os = await import('node:os');
const userDataDir = `${os.tmpdir()}/lighthouse-test-${Date.now()}`;

const chrome = await chromeLauncher.launch({
  chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu', `--user-data-dir=${userDataDir}`],
});

try {
  const result = await lighthouse(url, {
    port: chrome.port,
    logLevel: 'warn',
    output: 'json',
    onlyCategories: ['performance'],
    formFactor: 'desktop',
  });
  const score = result.lhr.categories.performance?.score;
  const num = score != null ? Math.round(score * 100) : null;
  console.log('Performance 分数:', num ?? 'N/A');
  console.log('FCP:', result.lhr.audits['first-contentful-paint']?.displayValue);
  console.log('LCP:', result.lhr.audits['largest-contentful-paint']?.displayValue);
} finally {
  await chrome.kill();
}
