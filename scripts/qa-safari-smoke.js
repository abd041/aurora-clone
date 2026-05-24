/**
 * Safari / WebKit smoke checks for critical cinematic surfaces.
 * Usage: node scripts/qa-safari-smoke.js [baseUrl]
 */
const { webkit } = require('playwright');

const BASE = process.argv[2] || 'http://localhost:3020';

async function checkPage(page, path, checks) {
  await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.evaluate(() => window.dispatchEvent(new CustomEvent('aurora:skipIntro')));
  await page
    .waitForFunction(() => !document.querySelector('.intro'), null, { timeout: 15000 })
    .catch(() => {});
  await page.waitForTimeout(1200);

  const results = await page.evaluate((checksInPage) => {
    const out = {};
    for (const [key, sel] of Object.entries(checksInPage)) {
      const el = document.querySelector(sel);
      if (!el) {
        out[key] = { ok: false, reason: 'missing element' };
        continue;
      }
      const style = getComputedStyle(el);
      out[key] = {
        ok: true,
        opacity: style.opacity,
        transform: style.transform,
        webkitMaskSize: style.webkitMaskSize || style.maskSize || null,
        backdropFilter: style.backdropFilter || style.webkitBackdropFilter || null,
      };
    }
    return out;
  }, checks);

  return { path, results };
}

async function main() {
  const browser = await webkit.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
  });

  const pages = [
    {
      path: '/',
      checks: {
        heroVideo: '.home-hero .video-container video',
        homeVideoMask: '.home-video .video-mask-item',
        circleBtn: '.home-video .circle-btn',
        header: '.header',
      },
    },
    {
      path: '/agence',
      checks: { hero: '.agence-hero' },
    },
    {
      path: '/contact',
      checks: { form: '.contact-head' },
    },
  ];

  const report = [];
  for (const item of pages) {
    report.push(await checkPage(page, item.path, item.checks));
  }

  console.log(JSON.stringify({ engine: 'webkit', base: BASE, report }, null, 2));
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
