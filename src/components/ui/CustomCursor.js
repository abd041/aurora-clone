'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { gsap, Observer } from '@/lib/gsap';
import { cursorStore } from '@/lib/cursorStore';
import useIsMobile from '@/hooks/useIsMobile';

export default function CustomCursor({ hidden = false }) {
  const rootRef = useRef(null);
  const isMobile = useIsMobile();
  const active = useSyncExternalStore(
    cursorStore.subscribe,
    () => cursorStore.active,
    () => false
  );
  const observerRef = useRef(null);
  const quickSetterRef = useRef(null);
  const xToRef = useRef(null);
  const yToRef = useRef(null);

  useEffect(() => {
    if (isMobile || !rootRef.current) return undefined;

    const content = rootRef.current.querySelector('.cursor-content');
    if (!content) return undefined;

    const show = () => {
      gsap.to(content, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'quart.out',
      });
    };

    const hide = () => {
      gsap.to(content, {
        scale: 0.5,
        opacity: 0,
        duration: 0.5,
        ease: 'quart.out',
      });
    };

    const pointerMove = ({ x, y }) => {
      quickSetterRef.current?.({ x, y });
      xToRef.current?.(x);
      yToRef.current?.(y);
    };

    quickSetterRef.current = gsap.quickSetter(content, 'css');
    xToRef.current = gsap.quickTo(content, 'x', { duration: 0.3, ease: 'cubic' });
    yToRef.current = gsap.quickTo(content, 'y', { duration: 0.3, ease: 'cubic' });

    observerRef.current = Observer.create({
      type: 'pointer',
      onMove: pointerMove,
    });

    show();

    return () => {
      observerRef.current?.kill();
      hide();
      gsap.killTweensOf(content);
    };
  }, [isMobile]);

  useEffect(() => {
    if (isMobile || !rootRef.current) return;
    const content = rootRef.current.querySelector('.cursor-content');
    if (!content) return;

    if (active) {
      gsap.to(content, { scale: 1, opacity: 1, duration: 0.5, ease: 'quart.out' });
    } else {
      gsap.to(content, { scale: 0.5, opacity: 0, duration: 0.5, ease: 'quart.out' });
    }
  }, [active, isMobile]);

  if (isMobile || hidden) {
    return null;
  }

  return (
    <div className={`cursor${active ? ' active' : ''}`} ref={rootRef}>
      <div className="cursor-content">
        <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <circle
            className="draw-svg"
            cx="80"
            cy="80"
            r="79.25"
            stroke="url(#paint0_linear_cursor)"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            className="draw-svg cursor-play-icon"
            fill="none"
            d="M87.979 77.3083C89.6629 78.7077 89.6628 81.2923 87.979 82.6917L77.8366 91.1211C75.5561 93.0164 72.0995 91.3946 72.0995 88.4293L72.0995 71.5707C72.0995 68.6054 75.5561 66.9836 77.8366 68.8789L87.979 77.3083Z"
            stroke="currentColor"
          />
          <defs>
            <linearGradient
              id="paint0_linear_cursor"
              x1="132"
              y1="28"
              x2="27.5"
              y2="132.5"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="var(--secondary)" />
              <stop offset="1" stopColor="var(--primary)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
