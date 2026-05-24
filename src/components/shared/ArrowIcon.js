'use client';

import { useRef } from 'react';
import { gsap } from '@/lib/gsap';

export default function ArrowIcon({ className = '' }) {
  const rootRef = useRef(null);

  const onMouseEnter = () => {
    if (!rootRef.current) return;
    const paths = rootRef.current.querySelectorAll('path');
    gsap.set(paths, { clearProps: 'all' });
    gsap.from(paths, {
      drawSVG: '0%',
      duration: 1,
      stagger: { each: 0.1 },
      ease: 'quart.out',
      clearProps: 'all',
    });
  };

  return (
    <svg
      className={`Icon ${className}`.trim()}
      viewBox="0 0 25 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={onMouseEnter}
      ref={rootRef}
      aria-hidden
    >
      <path d="M24.2275 10L0.314508 10" stroke="white" strokeWidth="1.5" />
      <path
        className="inversed-path"
        d="M0.000465669 10C5.55919 10 10.0654 14.4772 10.0654 20"
        stroke="white"
        strokeWidth="1.5"
      />
      <path
        d="M10.0669 7.27686e-07C10.0669 5.52285 5.56068 10 0.00195312 10"
        stroke="white"
        strokeWidth="1.5"
      />
    </svg>
  );
}
