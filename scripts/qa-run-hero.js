/**
 * Full hero QA pipeline: health-check server → clone → live → compare.
 * Usage: node scripts/qa-run-hero.js [--skip-server-check]
 */
const { spawn } = require('child_process');
const path = require('path');
const { waitForServer, checkServerHealth } = require('./qa-utils');

const CLONE_BASE = 'http://localhost:3020';
const ROOT = path.join(__dirname, '..');

function runNode(script, args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [script, ...args], {
      cwd: ROOT,
      stdio: 'inherit',
      env: process.env,
    });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${path.basename(script)} exited with ${code}`));
    });
  });
}

async function main() {
  const skipServer = process.argv.includes('--skip-server-check');

  if (!skipServer) {
    process.stdout.write(`Checking ${CLONE_BASE}...\n`);
    const up = await checkServerHealth(CLONE_BASE);
    if (!up) {
      process.stderr.write(
        `Server not reachable at ${CLONE_BASE}. Start with: npm run qa:server\n`
      );
      process.exit(1);
    }
    process.stdout.write('Server OK\n');
  }

  await runNode(path.join('scripts', 'qa-hero.js'), [
    '--base',
    CLONE_BASE,
    '--label',
    'clone-hero',
  ]);

  await runNode(path.join('scripts', 'qa-hero.js'), [
    '--base',
    'https://aurora-agency.ovh',
    '--label',
    'live-hero',
  ]);

  await runNode(path.join('scripts', 'qa-hero-compare.js'));

  process.stdout.write('\nHero QA pipeline complete.\n');
  process.stdout.write('Report: _qa/hero-compare-report.json\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
