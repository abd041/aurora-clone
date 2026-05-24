'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';
import { DrawSVGPlugin } from '@/lib/drawSVG';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, Observer, DrawSVGPlugin);
  window.ScrollTrigger = ScrollTrigger;
}

export { gsap, ScrollTrigger, Observer, DrawSVGPlugin };
export default gsap;

/**
 * Lazy-load Draggable (avoids SSR/webpack chunk errors in App Router).
 */
export async function getDraggable() {
  if (typeof window === 'undefined') return null;
  const { Draggable } = await import('gsap/Draggable');
  gsap.registerPlugin(Draggable);
  return Draggable;
}
