#!/usr/bin/env node
/**
 * 测试能否连上已开启远程调试的 Chrome。
 * Chrome 设置里打开 “Allow remote debugging” 后显示 Server running at: 127.0.0.1:9222，
 * 直接运行: node test-connection.mjs  即可（默认 localhost:9222）。
 */
const host = process.env.CHROME_CDP_HOST || 'localhost';
const port = process.env.CHROME_CDP_PORT || '9222';
const url = `http://${host}:${port}/json/version`;

console.error('正在连接 Chrome:', url);

try {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  console.log('已连接 Chrome');
  console.log('User-Agent:', data.UserAgent?.slice(0, 60) + '...');
  console.log('WebSocket:', data.webSocketDebuggerUrl?.slice(0, 50) + '...');
} catch (err) {
  console.error('连接失败:', err.message);
  console.error('');
  console.error('请确认 Chrome 已开启远程调试（设置 → 系统 → Allow remote debugging），');
  console.error('并显示 Server running at: 127.0.0.1:9222');
  process.exit(1);
}
