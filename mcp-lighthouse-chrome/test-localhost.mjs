#!/usr/bin/env node
/** 连接 localhost:9222 的 Chrome 跑一次 Lighthouse，超时 60 秒 */
import lighthouse from 'lighthouse';

const url = process.argv[2] || 'http://localhost:4322/blog';
const port = parseInt(process.env.CHROME_CDP_PORT || '9222', 10);
console.error('连接 localhost:' + port + '，审计', url, '（最多 60 秒）');

try {
  const result = await lighthouse(url, {
    hostname: 'localhost',
    port,
    logLevel: 'warn',
    onlyCategories: ['performance'],
    formFactor: 'desktop',
    screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false },
    maxWaitForLoad: 60000,
  }, undefined);
  const score = result.lhr.categories.performance?.score;
  const n = score != null ? Math.round(score * 100) : null;
  console.log('Performance 分数:', n ?? 'N/A');
  console.log('FCP:', result.lhr.audits['first-contentful-paint']?.displayValue);
  console.log('LCP:', result.lhr.audits['largest-contentful-paint']?.displayValue);
} catch (e) {
  console.error('失败:', e.message);
  process.exit(1);
}
