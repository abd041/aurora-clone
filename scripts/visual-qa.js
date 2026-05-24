/**
 * Visual QA — home uses vh scroll only (see qa-utils).
 * Usage:
 *   node scripts/visual-qa.js --base http://localhost:3020 --label clone
 *   node scripts/visual-qa.js --base https://aurora-agency.ovh --label live
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
  stabilizeAgenceHeroFrame,
  stabilizeContactCapture,
  stabilizeRejoindreCapture,
  captureScreenshot,
  sleep,
} = require('./qa-utils');

const ROUTES = [
  {
    path: '/',
    name: 'home',
    skipIntroWait: true,
    scrollPositions: VH_SCROLL_POSITIONS,
  },
  {
    path: '/agence',
    name: 'agence',
    scrollPositions: [0, '100vh', '200vh'],
  },
  {
    path: '/realisations',
    name: 'realisations',
    scrollPositions: [0, '50vh', '100vh', '150vh'],
    scrollSettleMs: 900,
  },
  {
    path: '/realisations/kruger-nyota-resort',
    name: 'realisation-detail',
    scrollPositions: [0, '100vh', '200vh'],
  },
  {
    path: '/contact',
    name: 'contact',
    scrollPositions: [0, '100vh'],
    scrollSettleMs: 900,
  },
  {
    path: '/nous-rejoindre',
    name: 'nous-rejoindre',
    scrollPositions: [0, '100vh'],
    scrollSettleMs: 900,
  },
];

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    base: 'http://localhost:3020',
    label: 'clone',
    out: path.join(__dirname, '..', '_qa'),
  };
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--base') opts.base = args[++i];
    if (args[i] === '--label') opts.label = args[++i];
    if (args[i] === '--out') opts.out = args[++i];
    if (args[i] === '--route') opts.route = args[++i];
  }
  return opts;
}

async function waitForRouteReady(page, route, isClone) {
  if (route.path === '/' && route.skipIntroWait) {
    await waitForCaptureReady(page, { isClone });
    return;
  }

  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent('aurora:skipIntro'));
  });

  await page
    .waitForFunction(() => !document.querySelector('.intro'), null, { timeout: 15000 })
    .catch(() => {});

  await page.waitForFunction(
    () => document.fonts?.status === 'loaded',
    null,
    { timeout: 30000 }
  ).catch(() => {});

  const selectors = {
    '/agence': '.agence-hero',
    '/realisations': '.realisations-slider',
    '/contact': '.contact-head',
    '/nous-rejoindre': '.hero-video-sticky',
  };
  const selector =
    selectors[route.path] ||
    (route.path.startsWith('/realisations/') ? '.realisation-head' : 'main.page');

  await page.waitForSelector(selector, { state: 'attached', timeout: 60000 });
  await page.waitForTimeout(isClone ? 400 : 1200);
}

async function captureRoute(browser, base, label, outDir, route, viewport) {
  const context = await createQaContext(browser, viewport);
  const page = await context.newPage();
  const isClone = isLocalBase(base);

  try {
    const url = `${base.replace(/\/$/, '')}${route.path}`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await waitForRouteReady(page, route, isClone);

    const positions = route.scrollPositions || [0];

    for (let i = 0; i < positions.length; i += 1) {
      const position = positions[i];
      await scrollToVh(page, position, viewport.width);

      if (route.path === '/' && (position === 0 || position === '0vh')) {
        await stabilizeHeroFrame(page);
      }

      if (route.path === '/agence' && (position === 0 || position === '0vh')) {
        await stabilizeAgenceHeroFrame(page);
      }

      if (route.path === '/contact') {
        await stabilizeContactCapture(page, position);
      }

      if (route.path === '/nous-rejoindre') {
        await stabilizeRejoindreCapture(page, position);
      }

      if (route.path === '/realisations') {
        await page.evaluate(() => {
          window.ScrollTrigger?.update?.();
        });
        await sleep(route.scrollSettleMs || 900);
      }

      const file = path.join(
        outDir,
        label,
        viewport.name,
        `${route.name}-scroll-${String(i).padStart(2, '0')}.png`
      );
      await captureScreenshot(page, file);
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
  const routes = opts.route
    ? ROUTES.filter((r) => r.name === opts.route || r.path === opts.route)
    : ROUTES;

  try {
    for (const viewport of DEFAULT_VIEWPORTS) {
      for (const route of routes) {
        process.stdout.write(`[${opts.label}] ${viewport.name} ${route.name}\n`);
        try {
          await captureRoute(
            browser,
            opts.base,
            opts.label,
            opts.out,
            route,
            viewport
          );
          manifest.push({ viewport: viewport.name, route: route.name, ok: true });
        } catch (err) {
          manifest.push({
            viewport: viewport.name,
            route: route.name,
            ok: false,
            error: err.message,
          });
          process.stderr.write(`  FAIL: ${err.message}\n`);
        }
      }
    }
  } finally {
    await browser.close().catch(() => {});
  }

  const reportPath = path.join(opts.out, `${opts.label}-manifest.json`);
  fs.writeFileSync(reportPath, JSON.stringify(manifest, null, 2));
  console.log(`\nSaved to ${opts.out}/${opts.label}/`);
  console.log(`Manifest: ${reportPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
