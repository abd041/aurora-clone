'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from '@/lib/gsap';
import { useApp } from '@/context/AppContext';

export default function LenisProvider({ children }) {
  const { setLenis } = useApp();

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    window.scrollTo(0, 0);
    window.history.scrollRestoration = 'manual';

    const coarse = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lenis = new Lenis({
      lerp: reduceMotion ? 1 : coarse ? 0.14 : 0.1,
      smoothWheel: !reduceMotion && !coarse,
      syncTouch: coarse && !reduceMotion,
      touchMultiplier: coarse ? 1 : 1.15,
    });

    lenis.on('scroll', gsap.updateScrollTrigger);

    const onTick = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    setLenis(lenis);
    window.__AURORA_LENIS__ = lenis;
    window.__AURORA_QA__ = { lenis: true, readyAt: Date.now() };

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      delete window.__AURORA_LENIS__;
      delete window.__AURORA_QA__;
      setLenis(null);
    };
  }, [setLenis]);

  return children;
}
