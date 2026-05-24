'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import useIsMobile from '@/hooks/useIsMobile';
import { useApp } from '@/context/AppContext';

export default function LoopLine({
  children,
  direction = 'left',
  gap = 0,
  gapSmall = 0,
  autoPlay = false,
  speed = 1,
  autoPlaySpeed = 1,
  theme = 'white',
  className = '',
}) {
  const isMobile = useIsMobile();
  const { lenis } = useApp();
  const rootRef = useRef(null);
  const lineRef = useRef(null);
  const baseRef = useRef(null);
  const [cloneCount, setCloneCount] = useState(0);
  const [baseWidth, setBaseWidth] = useState(0);

  const gapValue = isMobile ? gapSmall : gap;

  const measure = () => {
    if (!rootRef.current || !baseRef.current) return;
    const bw = baseRef.current.offsetWidth;
    const rw = rootRef.current.offsetWidth;
    setBaseWidth(bw);
    if (rw > 0 && bw > 0) {
      setCloneCount(Math.max(0, Math.ceil((rw + bw) / bw) - 1));
    }
  };

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('aurora:resize', measure);
    window.addEventListener('aurora:pageEnter', measure);

    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('aurora:resize', measure);
      window.removeEventListener('aurora:pageEnter', measure);
    };
  }, []);

  useEffect(() => {
    if (!lineRef.current || !baseWidth) return undefined;

    let scrollOffset = 0;
    let autoOffset = 0;
    let lastScroll = 0;
    let directionMult = 1;
    let visible = false;
    let observer;

    const wrapOffset = (value) => {
      const step = baseWidth + gapValue;
      let wrapped = Math.round(value % step * 100) / 100;
      if (wrapped < 0) wrapped += step;
      return wrapped;
    };

    const onScroll = (e) => {
      if (isMobile) return;
      scrollOffset = (e?.scroll ?? lenis?.scroll ?? 0) / 4 * speed * (direction === 'left' ? 1 : -1);
      const current = e?.scroll ?? lenis?.scroll ?? 0;
      if (current > lastScroll) directionMult = 1;
      else if (current < lastScroll) directionMult = -1;
      lastScroll = current;
    };

    const onTick = (_time, deltaTime) => {
      if (!lineRef.current) return;

      if ((isMobile || autoPlay) && baseWidth) {
        autoOffset += deltaTime * 0.02 * autoPlaySpeed * directionMult * (direction === 'left' ? 1 : -1);
      }

      const offset = wrapOffset(scrollOffset + autoOffset);
      if (visible) {
        lineRef.current.style.transform = `translate3d(${-offset}px, 0, 0)`;
      }
    };

    if (rootRef.current) {
      observer = new IntersectionObserver(
        ([entry]) => {
          visible = entry.intersectionRatio > 0;
        },
        { threshold: 0 }
      );
      observer.observe(rootRef.current);
    }

    lenis?.on('scroll', onScroll);
    gsap.ticker.add(onTick);

    return () => {
      lenis?.off('scroll', onScroll);
      gsap.ticker.remove(onTick);
      observer?.disconnect();
    };
  }, [lenis, isMobile, autoPlay, speed, autoPlaySpeed, direction, baseWidth, gapValue]);

  return (
    <div
      className={`loop__line__wrapper ${className}`.trim()}
      ref={rootRef}
      data-theme={theme}
      style={{ '--loop-gap': `${gapValue}px` }}
    >
      <div className="loop__line" ref={lineRef}>
        <div className="loop__item loop__item--base" ref={baseRef}>
          {children}
        </div>
        {Array.from({ length: cloneCount }, (_, i) => (
          <div className="loop__item loop__item--clone" key={`clone-${i}`}>
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}
