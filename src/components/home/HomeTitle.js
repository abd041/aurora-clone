'use client';

import { useRef } from 'react';
import useSplitLines from '@/hooks/useSplitLines';

/**
 * Line-by-line title reveal (original LineByLine / SplitText).
 * Animates on mount when `auto` is true; use `key` on parent to replay (e.g. HomeSlider).
 */
export default function HomeTitle({
  children,
  tag: Tag = 'h1',
  delay = 0,
  duration = 1,
  stagger = 0,
  className = 'home-title title t-center',
  auto = true,
  scroll = false,
  threshold = 0.1,
  margin = '-20%',
}) {
  const ref = useRef(null);

  useSplitLines(ref, {
    delay,
    duration,
    stagger,
    auto,
    scroll,
    threshold,
    margin,
    animated: true,
  });

  return (
    <Tag className={className} ref={ref}>
      {children}
    </Tag>
  );
}
