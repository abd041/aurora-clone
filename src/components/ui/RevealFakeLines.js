'use client';

import { createElement, useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { ScrollTrigger } from '@/lib/gsap';
import { splitIntoLines } from '@/lib/textSplit';

export default function RevealFakeLines({ tag = 'div', children, className = 'fake-lines' }) {
  const rootRef = useRef(null);
  const splitRef = useRef(null);
  const timelineRef = useRef(null);

  const cleanup = () => {
    timelineRef.current?.scrollTrigger?.kill(false);
    timelineRef.current?.kill();
    timelineRef.current = null;
    splitRef.current?.revert?.();
    splitRef.current = null;
  };

  const build = async () => {
    cleanup();
    if (!rootRef.current) return;

    await document.fonts.ready;
    await new Promise((r) => requestAnimationFrame(r));

    const split = splitIntoLines(rootRef.current, {
      linesClass: 'line',
      parentClass: 'line',
      wrapOverflow: false,
    });
    splitRef.current = split;

    split.lines.forEach((line) => {
      const fake = document.createElement('div');
      fake.classList.add('fake-line');
      line.appendChild(fake);
    });

    await new Promise((r) => requestAnimationFrame(r));

    const fakeLines = split.lines.map((line) => line.querySelector('.fake-line'));
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: rootRef.current,
        start: 'top bottom-=25%',
        end: 'bottom center',
        scrub: 1,
      },
    });

    fakeLines.forEach((fake) => {
      tl.fromTo(fake, { scaleX: 1 }, { scaleX: 0 });
    });

    timelineRef.current = tl;
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
  }, [tag]);

  return createElement(tag, { className, ref: rootRef }, children);
}
