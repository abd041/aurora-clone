'use client';

import { useEffect, useRef, useState } from 'react';
import Menu from '@/components/layout/Menu';

/**
 * Vue <Transition name="fade"> parity for the menu overlay (0.3s opacity).
 */
export default function MenuTransition({ open }) {
  const [mounted, setMounted] = useState(open);
  const [phase, setPhase] = useState(open ? 'enter-from' : 'leave');
  const openRef = useRef(open);

  useEffect(() => {
    openRef.current = open;

    if (open) {
      setMounted(true);
      setPhase('enter-from');
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (openRef.current) setPhase('enter-active');
        });
      });
      return () => cancelAnimationFrame(raf);
    }

    if (mounted) {
      setPhase('leave-active');
    }

    return undefined;
  }, [open, mounted]);

  const handleTransitionEnd = (event) => {
    if (event.propertyName !== 'opacity') return;
    if (!openRef.current) {
      setMounted(false);
      setPhase('leave');
    }
  };

  if (!mounted) return null;

  const className = [
    phase === 'enter-from' && 'fade-enter fade-enter-from',
    phase === 'enter-active' && 'fade-enter-active',
    phase === 'leave-active' && 'fade-leave-active fade-leave-to',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={`menu-fade-wrapper ${className}`.trim()}
      onTransitionEnd={handleTransitionEnd}
    >
      <Menu />
    </div>
  );
}
