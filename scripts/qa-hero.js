/**
 * Hero QA — deterministic vh captures (0, 100vh, 150vh, 250vh).
 * Usage:
 *   node scripts/qa-hero.js --base http://localhost:3020 --label clone-hero
 *   node scripts/qa-hero.js --base https://aurora-agency.ovh --label live-hero
 */
const fs = require('fs');
const path = require('path');
const {
  VH_SCROLL_POSITIONS,
  DEFAULT_VIEWPORTS,
  CAPTURE_THROTTLE_MS,
  isLocalBase,
  launchQaBrowser,
  createQaContext,
  waitForCaptureReady,
  scrollToVh,
  stabilizeHeroFrame,
  waitForHomeVideoScrollFrame,
  captureScreenshot,
  sleep,
} = require('./qa-utils');

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    base: 'http://localhost:3020',
    label: 'clone-hero',
    out: path.join(__dirname, '..', '_qa'),
  };
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--base') opts.base = args[++i];
    if (args[i] === '--label') opts.label = args[++i];
    if (args[i] === '--out') opts.out = args[++i];
  }
  return opts;
}

async function captureViewport(browser, base, label, outDir, viewport) {
  const context = await createQaContext(browser, viewport);
  const page = await context.newPage();
  const isClone = isLocalBase(base);

  try {
    const url = `${base.replace(/\/$/, '')}/`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await waitForCaptureReady(page, { isClone });

    for (let i = 0; i < VH_SCROLL_POSITIONS.length; i += 1) {
      const position = VH_SCROLL_POSITIONS[i];
      await scrollToVh(page, position, viewport.width);

      if (position === 0 || position === '0vh') {
        await stabilizeHeroFrame(page);
      } else {
        await waitForHomeVideoScrollFrame(page, position);
      }

      const file = path.join(
        outDir,
        label,
        viewport.name,
        `home-scroll-${String(i).padStart(2, '0')}.png`
      );
      const allowAnimations = position === '250vh';
      await captureScreenshot(page, file, { allowAnimations });
      await sleep(CAPTURE_THROTTLE_MS);
    }
  } finally {
    await page.close().catch(() => {});
    await context.close().catch(() => {});
  }
}

async function main() {
  const opts = parseArgs();
  fs.mkdirSync(path.join(opts.out, opts.label), { recursive: true });

  const browser = await launchQaBrowser();
  const manifest = [];

  try {
    for (const viewport of DEFAULT_VIEWPORTS) {
      process.stdout.write(`[${opts.label}] ${viewport.name}\n`);
      try {
        await captureViewport(browser, opts.base, opts.label, opts.out, viewport);
        manifest.push({ viewport: viewport.name, ok: true });
      } catch (err) {
        manifest.push({ viewport: viewport.name, ok: false, error: err.message });
        process.stderr.write(`  FAIL: ${err.message}\n`);
      }
    }
  } finally {
    await browser.close().catch(() => {});
  }

  const manifestPath = path.join(opts.out, `${opts.label}-manifest.json`);
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`Done: ${path.join(opts.out, opts.label)}/`);
  console.log(`Manifest: ${manifestPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
