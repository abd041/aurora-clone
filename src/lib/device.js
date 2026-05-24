const state = {
  windowWidth: 1200,
  windowHeight: 800,
  isMobile: false,
  isDesktop: true,
};

let initialized = false;

function computeFlags() {
  state.isMobile = state.windowWidth < 768;
  state.isDesktop = state.windowWidth >= 1050;
}

computeFlags();

function onResize() {
  const widthChanged = state.windowWidth !== window.innerWidth;
  state.windowWidth = window.innerWidth;
  state.windowHeight = window.innerHeight;
  computeFlags();
  if (widthChanged) {
    setVh();
    window.dispatchEvent(new CustomEvent('aurora:resize'));
  }
}

export function isMobile() {
  return state.isMobile;
}

export function isDesktop() {
  return state.isDesktop;
}

export function setVh() {
  if (typeof document === 'undefined') return;
  document.documentElement.style.setProperty(
    '--vh',
    `${window.innerHeight * 0.01}px`
  );
}

export function getDeviceState() {
  return state;
}

export function refreshDevice() {
  if (typeof window === 'undefined') return;
  state.windowWidth = window.innerWidth;
  state.windowHeight = window.innerHeight;
  computeFlags();
  setVh();
}

/** Call once after mount — never during module import (avoids hydration mismatch on <html>). */
export function initDevice() {
  if (typeof window === 'undefined' || initialized) return;
  initialized = true;
  refreshDevice();
  window.addEventListener('resize', onResize);
}
