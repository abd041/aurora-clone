'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import PlayIcon from '@/components/icons/PlayIcon';

export default function CircleBtn({ blur = 2, className = '', style, onClick, ...props }) {
  const rootRef = useRef(null);
  const xTo = useRef(null);
  const yTo = useRef(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!finePointer) return undefined;

    xTo.current = gsap.quickTo(el, 'x', { duration: 0.85, ease: 'power3.out' });
    yTo.current = gsap.quickTo(el, 'y', { duration: 0.85, ease: 'power3.out' });

    const onMove = (e) => {
      const { height, width, left, top } = el.getBoundingClientRect();
      const x = e.clientX - (left + width / 2);
      const y = e.clientY - (top + height / 2);
      xTo.current?.(x);
      yTo.current?.(y);
    };

    const onLeave = () => {
      xTo.current?.(0);
      yTo.current?.(0);
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div className="magnetic" ref={rootRef}>
      <button
        type="button"
        className={`circle-btn ${className}`.trim()}
        style={{ '--blur': `${blur}px`, ...style }}
        onClick={onClick}
        {...props}
      >
        <PlayIcon />
      </button>
    </div>
  );
}
