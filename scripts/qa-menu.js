/**
 * Capture navbar closed + menu open states for QA.
 * Usage: node scripts/qa-menu.js [baseUrl] [label]
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const BASE = process.argv[2] || 'http://localhost:3020';
const LABEL = process.argv[3] || 'clone';
const OUT = path.join(__dirname, '..', '_qa', 'menu', LABEL);

const VIEWPORTS = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'mobile-390', width: 390, height: 844 },
];

async function preparePage(page, base) {
  await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 120000 });
  const isClone = base.includes('localhost');
  if (isClone) {
    await page.evaluate(() => window.dispatchEvent(new CustomEvent('aurora:skipIntro')));
    await page
      .waitForFunction(() => !document.querySelector('.intro'), null, { timeout: 20000 })
      .catch(() => {});
  } else {
    await page
      .waitForFunction(() => !document.querySelector('.intro'), null, { timeout: 45000 })
      .catch(() => {});
    await page.waitForTimeout(500);
  }
  await page.waitForSelector('.header-right button.menu', { state: 'visible', timeout: 30000 });
  await page.waitForTimeout(800);
}

async function captureMenuState(page, viewport, state) {
  const file = path.join(OUT, viewport.name, `menu-${state}.png`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  await page.screenshot({ path: file, fullPage: false });

  const dom = await page.evaluate(() => {
    const menu = document.querySelector('.menu.page');
    const header = document.querySelector('.header');
    const btn = document.querySelector('.header .menu');
    return {
      menuOpen: !!menu,
      menuChildren: menu
        ? [...menu.querySelectorAll(':scope > *')].map((el) => el.className)
        : [],
      hasMask: !!document.querySelector('.menu-mask'),
      hasContact: !!document.querySelector('.menu-contact'),
      hasContactBottom: !!document.querySelector('.contact-bottom'),
      headerBtnClass: btn?.className || null,
      computed: header
        ? {
            padding: getComputedStyle(header).padding,
            zIndex: getComputedStyle(header).zIndex,
          }
        : null,
    };
  });

  return { file, dom };
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const report = [];

  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    try {
      await preparePage(page, BASE);
      const closed = await captureMenuState(page, viewport, 'closed');
      report.push({ viewport: viewport.name, state: 'closed', ...closed.dom, file: closed.file });

      await page.click('.header-right button.menu');
      await page.waitForSelector('.menu.page', { state: 'attached', timeout: 10000 });
      await page.waitForTimeout(1200);

      const open = await captureMenuState(page, viewport, 'open');
      report.push({ viewport: viewport.name, state: 'open', ...open.dom, file: open.file });
    } catch (err) {
      report.push({ viewport: viewport.name, error: err.message });
    } finally {
      await page.close().catch(() => {});
      await context.close().catch(() => {});
    }
  }

  await browser.close().catch(() => {});

  const reportPath = path.join(OUT, 'report.json');
  fs.writeFileSync(reportPath, JSON.stringify({ base: BASE, label: LABEL, report }, null, 2));
  console.log(JSON.stringify({ base: BASE, label: LABEL, reportPath, report }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
