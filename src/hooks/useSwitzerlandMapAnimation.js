'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

/**
 * Pulsing map indicator — shared by HomeMap and ContactMap.
 */
export default function useSwitzerlandMapAnimation(mapSvgRef, region = 'interlaken', enabled = true) {
  const timelineRef = useRef(null);

  useEffect(() => {
    if (!enabled || !mapSvgRef.current) return undefined;

    const root = mapSvgRef.current;
    const regionEls = [...root.querySelectorAll(`.${region}`)];
    const primary = regionEls[0];
    const ripples = regionEls.slice(1);
    const points = [...root.querySelectorAll('.svg-point')];
    const circles = [...root.querySelectorAll('.svg-circle')];
    const all = points.concat(circles);

    timelineRef.current?.kill();
    gsap.set(all, { transformOrigin: 'center center', transformBox: 'fill-box' });
    gsap.set([circles, all], { opacity: 1, scale: 0 });

    if (!primary) return undefined;

    timelineRef.current = gsap.timeline({ repeat: -1 });
    timelineRef.current
      .to(primary, { scale: 1, opacity: 1, duration: 0.75, ease: 'quart.out' }, 0)
      .to(primary, { opacity: 0, duration: 0.75, ease: 'quart.out' }, 1.5)
      .fromTo(ripples, { scale: 0 }, { scale: 2, duration: 1, stagger: 0.2, ease: 'quart.out' }, 0)
      .to(ripples, { opacity: 0, duration: 0.75, ease: 'quart.out' }, 1.5);

    return () => timelineRef.current?.kill();
  }, [mapSvgRef, region, enabled]);
}
