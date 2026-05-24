let active = false;
const subs = new Set();

export const cursorStore = {
  get active() {
    return active;
  },
  subscribe(fn) {
    subs.add(fn);
    return () => subs.delete(fn);
  },
  setActive(value) {
    active = value;
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('cursor-active', value);
    }
    subs.forEach((fn) => fn());
  },
};

export function useCursorHandlers() {
  return {
    onCursorEnter: () => cursorStore.setActive(true),
    onCursorLeave: () => cursorStore.setActive(false),
  };
}
