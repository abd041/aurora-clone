/**
 * Start Next production server for QA (stable, logs keepalive).
 * Usage: node scripts/qa-server.js [--port 3020]
 */
const { spawn } = require('child_process');
const path = require('path');

const port = process.argv.includes('--port')
  ? process.argv[process.argv.indexOf('--port') + 1]
  : '3020';

const root = path.join(__dirname, '..');

const child = spawn('npx', ['next', 'start', '-p', port], {
  cwd: root,
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, NODE_ENV: 'production' },
});

const keepalive = setInterval(() => {
  process.stdout.write(`[qa-server] alive ${new Date().toISOString()}\n`);
}, 60000);

function shutdown(signal) {
  process.stdout.write(`[qa-server] ${signal}, shutting down...\n`);
  clearInterval(keepalive);
  child.kill('SIGTERM');
  setTimeout(() => child.kill('SIGKILL'), 5000);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

child.on('exit', (code) => {
  clearInterval(keepalive);
  process.exit(code ?? 0);
});

process.stdout.write(`[qa-server] http://localhost:${port}\n`);
