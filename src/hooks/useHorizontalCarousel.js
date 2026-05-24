'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap, getDraggable } from '@/lib/gsap';

/**
 * Horizontal draggable carousel — ported from original D-XPNEMo.js (On).
 */
export default function useHorizontalCarousel(listRef, wrapperRef, gap = 30, itemCount = 0) {
  const draggableRef = useRef(null);
  const DraggableRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const currentIndexRef = useRef(0);
  const maxIndexRef = useRef(0);
  const slideWidthRef = useRef(0);
  const maxDragRef = useRef(0);

  const waitForImages = useCallback(() => {
    const imgs = listRef.current?.querySelectorAll('img');
    if (!imgs?.length) return Promise.resolve();
    return Promise.all(
      [...imgs].map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) resolve();
            else {
              img.addEventListener('load', resolve, { once: true });
              img.addEventListener('error', resolve, { once: true });
            }
          })
      )
    );
  }, [listRef]);

  const killDraggable = useCallback(() => {
    if (draggableRef.current) {
      draggableRef.current.kill();
      draggableRef.current = null;
    }
    if (listRef.current) {
      gsap.set(listRef.current, { clearProps: 'all' });
    }
  }, [listRef]);

  const initDraggable = useCallback(() => {
    const Draggable = DraggableRef.current;
    if (!Draggable || !listRef.current || !wrapperRef.current) return;

    draggableRef.current = Draggable.create(listRef.current, {
      bounds: wrapperRef.current,
      type: 'x',
      edgeResistance: 0.9,
      inertia: true,
      snap: (x) => {
        const sw = slideWidthRef.current;
        const snapped = Math.round(x / sw) * sw;
        currentIndexRef.current = Math.min(
          maxIndexRef.current,
          Math.max(0, -snapped / sw)
        );
        return snapped;
      },
    })[0];
    currentIndexRef.current = 0;
    gsap.set(listRef.current, { x: 0 });
  }, [listRef, wrapperRef]);

  const measure = useCallback(() => {
    if (!listRef.current || !wrapperRef.current) return;
    const firstChild = listRef.current.firstElementChild;
    if (firstChild) {
      slideWidthRef.current = firstChild.offsetWidth + gap;
      maxDragRef.current = listRef.current.offsetWidth - wrapperRef.current.offsetWidth;
      maxIndexRef.current = Math.min(
        Math.ceil(maxDragRef.current / slideWidthRef.current),
        Math.max(0, itemCount - 1)
      );
    }
    killDraggable();
    initDraggable();
  }, [gap, itemCount, initDraggable, killDraggable, listRef, wrapperRef]);

  const goToIndex = useCallback(
    (index) => {
      if (!listRef.current) return;
      const idx = Math.min(itemCount - 1, Math.max(0, index));
      currentIndexRef.current = idx;
      const x = Math.max(-maxDragRef.current, idx * -slideWidthRef.current);
      gsap.set(listRef.current, { x });
    },
    [itemCount, listRef]
  );

  const shift = useCallback(
    (dir) => {
      if (!listRef.current) return;
      const idx = Math.min(
        itemCount - 1,
        Math.max(0, currentIndexRef.current + dir)
      );
      currentIndexRef.current = idx;
      const x = Math.max(-maxDragRef.current, idx * -slideWidthRef.current);
      gsap.to(listRef.current, { x, duration: 0.7, ease: 'quart.out' });
    },
    [itemCount, listRef]
  );

  useEffect(() => {
    let mounted = true;

    (async () => {
      const Draggable = await getDraggable();
      if (!mounted || !Draggable) return;
      DraggableRef.current = Draggable;
      await waitForImages();
      if (!mounted) return;
      setIsLoaded(true);
      measure();
    })();

    return () => {
      mounted = false;
      killDraggable();
    };
  }, [itemCount, gap, killDraggable, measure, waitForImages]);

  return {
    isLoaded,
    goToIndex,
    onPrevBtnClick: () => shift(-1),
    onNextBtnClick: () => shift(1),
  };
}
