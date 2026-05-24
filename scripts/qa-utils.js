/**
 * Shared deterministic QA helpers — vh scroll only, matched lifecycle on clone + live.
 */
const http = require('http');
const https = require('https');

const VH_SCROLL_POSITIONS = [0, '100vh', '150vh', '250vh'];

const DEFAULT_VIEWPORTS = [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'mobile-440', width: 440, height: 844 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'tablet-1024', width: 1024, height: 768 },
  { name: 'desktop-1440', width: 1440, height: 900 },
];

const LOGO_SETTLE_MS = 2200;
const SCROLL_SETTLE_MS = 700;
const CAPTURE_THROTTLE_MS = 400;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isLocalBase(base) {
  return /localhost|127\.0\.0\.1/.test(base);
}

function resolveScrollY(position) {
  if (typeof position === 'number') return position;
  const vhMatch = String(position).match(/^([\d.]+)vh$/);
  if (vhMatch) {
    return Math.round((parseFloat(vhMatch[1]) / 100) * window.innerHeight);
  }
  const pxMatch = String(position).match(/^([\d.]+)px$/);
  if (pxMatch) return Math.round(parseFloat(pxMatch[1]));
  return 0;
}

async function checkServerHealth(base, timeoutMs = 5000) {
  const url = new URL(base);
  const lib = url.protocol === 'https:' ? https : http;

  return new Promise((resolve) => {
    const req = lib.get(
      {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname || '/',
        timeout: timeoutMs,
      },
      (res) => {
        res.resume();
        resolve(res.statusCode >= 200 && res.statusCode < 500);
      }
    );
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function waitForServer(base, attempts = 40, intervalMs = 1500) {
  for (let i = 0; i < attempts; i += 1) {
    if (await checkServerHealth(base)) return true;
    await sleep(intervalMs);
  }
  return false;
}

async function launchQaBrowser() {
  const { chromium } = require('playwright');
  return chromium.launch({
    headless: true,
    args: [
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
    ],
  });
}

async function createQaContext(browser, viewport) {
  return browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
    colorScheme: 'dark',
    reducedMotion: 'reduce',
  });
}

async function waitForCaptureReady(page, { isClone = false } = {}) {
  await page.waitForSelector('.app', { state: 'attached', timeout: 90000 });

  await page.waitForFunction(
    () => {
      const header = document.querySelector('.header');
      if (document.querySelector('.intro')) return false;
      if (!header) return false;
      if (!document.querySelector('.home-hero')) return false;
      if (document.fonts && document.fonts.status !== 'loaded') return false;
      const video = document.querySelector('.home-hero .video-container video');
      if (!video || video.readyState < 2) return false;
      return true;
    },
    null,
    { timeout: 90000 }
  );

  await page.waitForTimeout(2500);

  if (isClone) {
    await page.waitForSelector('.home-hero[data-hero-ready="true"]', {
      timeout: 25000,
    });
    const titleCount = await page.locator('.home-title').count();
    if (titleCount > 0) {
      await page.waitForSelector('.home-title[data-title-ready="true"]', {
        timeout: 25000,
      });
    }
  } else {
    await page.waitForTimeout(LOGO_SETTLE_MS);
  }

  await page.evaluate(() => {
    window.__AURORA_LENIS__?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    window.ScrollTrigger?.refresh(true);
  });

  await page.waitForTimeout(400);
}

async function scrollToVh(page, position, viewportWidth = 1440) {
  await page.evaluate((pos) => {
    const y = (() => {
      if (typeof pos === 'number') return pos;
      const vhMatch = String(pos).match(/^([\d.]+)vh$/);
      if (vhMatch) {
        return Math.round((parseFloat(vhMatch[1]) / 100) * window.innerHeight);
      }
      return 0;
    })();

    const lenis = window.__AURORA_LENIS__;
    if (lenis?.scrollTo) {
      lenis.scrollTo(y, { immediate: true });
    } else {
      window.scrollTo(0, y);
    }
    window.dispatchEvent(new Event('scroll'));
    window.ScrollTrigger?.refresh(true);
  }, position);

  await page.waitForTimeout(SCROLL_SETTLE_MS);

  await page.evaluate(
    () =>
      new Promise((resolve) => {
        requestAnimationFrame(() => {
          window.ScrollTrigger?.update?.();
          requestAnimationFrame(resolve);
        });
      })
  );

  await page.waitForTimeout(100);

  if (viewportWidth <= 440) {
    await page.evaluate(() => {
      window.ScrollTrigger?.refresh(true);
    });
    await page.waitForTimeout(200);
  }
}

async function syncHomeVideoFrame(page, { time = 0 } = {}) {
  await page.evaluate(
    ({ time: targetTime }) =>
      new Promise((resolve) => {
        const video = document.querySelector('.home-video .video-mask video');
        if (!video) {
          resolve();
          return;
        }

        const paintFrame = () => {
          const mask = document.querySelector('.home-video .video-mask-item');
          void mask?.offsetHeight;
          void video.offsetHeight;
          window.ScrollTrigger?.update?.();

          let settled = false;
          const finish = () => {
            if (settled) return;
            settled = true;
            requestAnimationFrame(() => {
              requestAnimationFrame(resolve);
            });
          };

          if (typeof video.requestVideoFrameCallback === 'function') {
            video.requestVideoFrameCallback(finish);
            setTimeout(finish, 400);
            return;
          }

          finish();
        };

        const seekToTime = () => {
          video.pause();
          if (
            video.readyState >= 2 &&
            Math.abs(video.currentTime - targetTime) < 0.001
          ) {
            paintFrame();
            return;
          }

          const onSeeked = () => {
            video.removeEventListener('seeked', onSeeked);
            paintFrame();
          };
          video.addEventListener('seeked', onSeeked);
          video.currentTime = targetTime;
        };

        if (video.readyState >= 2) {
          seekToTime();
        } else {
          video.addEventListener('loadeddata', seekToTime, { once: true });
        }
      }),
    { time }
  );
}

async function waitForUiRevealSettled(page) {
  await page
    .waitForFunction(
      () => {
        const btn = document.querySelector('.home-video .circle-btn');
        const spans = document.querySelectorAll('.home-video .big-title span');
        const desc = document.querySelector('.home-video--container p');
        if (!btn || !spans.length || !desc) return false;

        const btnTransform = getComputedStyle(btn).transform;
        let btnReady = !btnTransform || btnTransform === 'none';

        const spansReady = [...spans].every((el) => {
          const style = getComputedStyle(el);
          return (
            style.visibility !== 'hidden' &&
            parseFloat(style.opacity) > 0.95 &&
            (!style.transform || style.transform === 'none')
          );
        });

        const descStyle = getComputedStyle(desc);
        const descReady =
          descStyle.visibility !== 'hidden' && parseFloat(descStyle.opacity) > 0.95;

        const heroTitleHidden = !document.querySelector('.home-title');

        return btnReady && spansReady && descReady && heroTitleHidden;
      },
      null,
      { timeout: 15000 }
    )
    .catch(() => {});
}

async function waitForHomeVideoScrollFrame(page, position) {
  if (position === 0 || position === '0vh') return;

  await page
    .waitForFunction(
      () => {
        const video = document.querySelector('.home-video .video-mask video');
        return video && video.readyState >= 2;
      },
      null,
      { timeout: 20000 }
    )
    .catch(() => {});

  if (position !== '250vh') {
    await page.evaluate(() => {
      window.ScrollTrigger?.update?.();
      window.ScrollTrigger?.refresh(true);
    });
    await syncHomeVideoFrame(page, { time: 0 });
  }

  if (position === '250vh') {
    await page.evaluate(() => {
      const root = document.querySelector('.home-video');
      const y = Math.round(window.innerHeight * 2.5) + 8;
      const lenis = window.__AURORA_LENIS__;
      if (lenis?.scrollTo) lenis.scrollTo(y, { immediate: true });
      else window.scrollTo(0, y);
      window.dispatchEvent(new Event('scroll'));
      window.ScrollTrigger?.update?.();

      const uiSt = window.ScrollTrigger?.getAll()?.find(
        (st) => st.trigger === root && st.vars.toggleActions && !st.vars.scrub
      );
      if (uiSt?.animation && uiSt.animation.progress() === 0) {
        uiSt.animation.play(0);
      }
    });

    await waitForUiRevealSettled(page);
    await syncHomeVideoFrame(page, { time: 0 });
    await page.waitForTimeout(50);
  } else if (position === '150vh') {
    await page.waitForTimeout(400);
  } else {
    await page.waitForTimeout(250);
  }
}

async function stabilizeHeroFrame(page) {
  await page.evaluate(() => {
    const style = document.createElement('style');
    style.id = 'qa-capture-freeze';
    style.textContent = `
      .scroll-down--icon span {
        animation: none !important;
        transform: translateY(0) scaleX(1) !important;
      }
    `;
    if (!document.getElementById('qa-capture-freeze')) {
      document.head.appendChild(style);
    }

    const video = document.querySelector('.home-hero .video-container video');
    if (video) {
      video.pause();
      const seek = () => {
        video.removeEventListener('seeked', seek);
        window.dispatchEvent(new CustomEvent('aurora:heroFrameSynced'));
      };
      video.addEventListener('seeked', seek);
      video.currentTime = 0;
    }
  });

  await page.waitForFunction(
    () => {
      const video = document.querySelector('.home-hero .video-container video');
      return !video || video.paused;
    },
    null,
    { timeout: 5000 }
  ).catch(() => {});

  await page.waitForTimeout(200);
}

/** Agence hero: sync video to t=0 + wait for LineByLine title (delay 0.75s). */
async function stabilizeAgenceHeroFrame(page) {
  await page.evaluate(() => {
    const video = document.querySelector('.agence-hero--bg video');
    if (video) {
      try {
        video.pause();
        video.currentTime = 0;
      } catch {
        /* ignore seek before metadata */
      }
    }
    window.__AURORA_LENIS__?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    window.ScrollTrigger?.refresh(true);
  });
  await page.waitForTimeout(1800);
}

/** Contact page: title reveal at scroll 0; ScrollTrigger settle when scrolled. */
async function stabilizeContactCapture(page, scrollPosition) {
  const atTop = scrollPosition === 0 || scrollPosition === '0vh';

  if (atTop) {
    await page.evaluate(() => {
      window.__AURORA_LENIS__?.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);
      window.ScrollTrigger?.refresh(true);
    });
    await page.waitForTimeout(1800);
    return;
  }

  await page.evaluate(() => window.ScrollTrigger?.update?.());
  await page.waitForTimeout(600);
}

/** Nous-rejoindre hero: wait for LineByLine title (delay 0.75s) at scroll 0. */
async function stabilizeRejoindreCapture(page, scrollPosition) {
  const atTop = scrollPosition === 0 || scrollPosition === '0vh';

  if (atTop) {
    await page.evaluate(() => {
      window.__AURORA_LENIS__?.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);
      window.ScrollTrigger?.refresh(true);
    });
    await page.waitForTimeout(1800);
    return;
  }

  await page.evaluate(() => window.ScrollTrigger?.update?.());
  await page.waitForTimeout(600);
}

async function captureScreenshot(page, filePath, { allowAnimations = false } = {}) {
  const fs = require('fs');
  fs.mkdirSync(require('path').dirname(filePath), { recursive: true });
  await page.screenshot({
    path: filePath,
    fullPage: false,
    animations: allowAnimations ? 'allow' : 'disabled',
  });
}

module.exports = {
  VH_SCROLL_POSITIONS,
  DEFAULT_VIEWPORTS,
  LOGO_SETTLE_MS,
  SCROLL_SETTLE_MS,
  CAPTURE_THROTTLE_MS,
  sleep,
  isLocalBase,
  resolveScrollY,
  checkServerHealth,
  waitForServer,
  launchQaBrowser,
  createQaContext,
  waitForCaptureReady,
  scrollToVh,
  stabilizeHeroFrame,
  stabilizeAgenceHeroFrame,
  stabilizeContactCapture,
  stabilizeRejoindreCapture,
  waitForHomeVideoScrollFrame,
  waitForUiRevealSettled,
  captureScreenshot,
};
