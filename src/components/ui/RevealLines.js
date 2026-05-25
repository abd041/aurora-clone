'use client';

import { createElement, useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { ScrollTrigger } from '@/lib/gsap';
import { MARINA_COLORS } from '@/lib/marinaMotion';
import { splitByType } from '@/lib/textSplit';

export default function RevealLines({
  tag = 'div',
  split = 'chars',
  start = 'top bottom-=25%',
  end = 'bottom center',
  theme,
  html,
  children,
  className = 'reveal-lines',
}) {
  const rootRef = useRef(null);
  const splittersRef = useRef([]);
  const timelinesRef = useRef([]);

  const cleanup = () => {
    timelinesRef.current.forEach((tl) => {
      tl.scrollTrigger?.kill(false);
      tl.kill();
    });
    timelinesRef.current = [];
    splittersRef.current.reverse().forEach((s) => s.revert?.());
    splittersRef.current = [];
  };

  const build = async () => {
    cleanup();
    if (!rootRef.current) return;

    if (html != null) {
      rootRef.current.innerHTML = html;
    }

    await document.fonts.ready;

    const result = splitByType(rootRef.current, split);
    splittersRef.current.push(result);

    const targets =
      split === 'lines'
        ? result.lines
        : split === 'words'
          ? result.words
          : result.chars;

    const fromVars = { opacity: 0.4, stagger: 0.1 };
    if (split === 'words' && theme === 'blue') {
      fromVars.color = MARINA_COLORS.primary;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: rootRef.current,
        start,
        end,
        scrub: 1,
      },
    });

    tl.from(targets, fromVars, 0);
    timelinesRef.current.push(tl);
  };

  useEffect(() => {
    build();
    const onResize = () => build();
    window.addEventListener('resize', onResize);
    window.addEventListener('aurora:updateHeight', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('aurora:updateHeight', onResize);
      cleanup();
      ScrollTrigger.refresh();
    };
  }, [split, start, end, theme, html]);

  return createElement(tag, { className, ref: rootRef }, children);
}
