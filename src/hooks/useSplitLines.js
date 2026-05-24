'use client';

import { useCallback, useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { splitIntoLines } from '@/lib/textSplit';

/**
 * LineByLine — GSAP SplitText line reveal (yPercent 140, scaleY 1.5, quart.out).
 */
export function useSplitLines(ref, options = {}) {
  const {
    overflow = true,
    auto = true,
    delay = 0,
    duration = 1,
    stagger = 0,
    animated = true,
    random = false,
    scroll = false,
    threshold = 0.1,
    margin = '-20%',
  } = options;

  const splitRef = useRef(null);
  const playedRef = useRef(false);
  const widthRef = useRef(0);

  const cleanup = useCallback(() => {
    splitRef.current?.revert?.();
    splitRef.current = null;
    playedRef.current = false;
  }, []);

  const animate = useCallback(() => {
    if (!ref.current || !splitRef.current || playedRef.current) return;

    playedRef.current = true;
    const q = gsap.utils.selector(ref.current);
    const tl = gsap.timeline({
      delay,
      onComplete: () => {
        if (ref.current) {
          ref.current.setAttribute('data-title-ready', 'true');
        }
        window.dispatchEvent(new CustomEvent('aurora:titleRevealComplete'));
      },
    });

    tl.from(q('.split'), {
      yPercent: (index) => 140 * (index + 1),
      scaleY: 1.5,
      duration,
      stagger: {
        each: stagger,
        from: random ? 'random' : 'start',
      },
      ease: 'quart.out',
      clearProps: 'all',
    });

    return tl;
  }, [ref, delay, duration, stagger, random]);

  const split = useCallback(
    async (force = false) => {
      if (!ref.current) return;

      const width = typeof window !== 'undefined' ? window.innerWidth : 0;
      if (!force && widthRef.current === width && splitRef.current) return;

      widthRef.current = width;
      if (ref.current) ref.current.style.height = null;
      cleanup();

      await document.fonts.ready;

      splitRef.current = splitIntoLines(ref.current, {
        wrapOverflow: overflow,
      });

      if (force) playedRef.current = false;

      if (animated && auto && !scroll) {
        animate();
      }
    },
    [ref, overflow, animated, auto, scroll, cleanup, animate]
  );

  useEffect(() => {
    if (!ref.current) return undefined;

    split(true);

    const onResize = () => split(false);
    window.addEventListener('resize', onResize);
    window.addEventListener('aurora:updateHeight', onResize);

    let observer;
    if (animated && scroll && ref.current) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animate();
              observer?.disconnect();
            }
          });
        },
        { threshold, rootMargin: `0px 0px ${margin} 0px` }
      );
      observer.observe(ref.current);
    }

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('aurora:updateHeight', onResize);
      observer?.disconnect();
      cleanup();
    };
  }, [ref, split, animate, animated, scroll, threshold, margin, cleanup]);

  return { split, animate, cleanup };
}

export default useSplitLines;
