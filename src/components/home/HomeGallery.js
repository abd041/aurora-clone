'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { Flip } from 'gsap/Flip';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Flip);
}

export default function HomeGallery({ gallery = [], mainImage }) {
  const parentRef = useRef(null);
  const rootRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const observerRef = useRef(null);

  const items = Array.isArray(gallery) ? gallery : [];
  const firstHalf = items.slice(0, Math.floor(items.length / 2));
  const secondHalf = items.slice(Math.floor(items.length / 2));
  const mainSrc =
    typeof mainImage === 'string'
      ? mainImage
      : mainImage?.gallery_item || mainImage?.url || '';

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setVisible(true);
      return undefined;
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { rootMargin: '500px', threshold: 0 }
    );

    if (parentRef.current) observerRef.current.observe(parentRef.current);
    return () => observerRef.current?.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !rootRef.current) return undefined;

    const itemsEls = [...rootRef.current.querySelectorAll('.gallery-item')];
    if (!itemsEls.length) return undefined;

    rootRef.current.classList.add('gallery--switch');
    const state = Flip.getState(itemsEls, { props: 'opacity' });
    rootRef.current.classList.remove('gallery--switch');

    const flipTween = Flip.to(state, {
      ease: 'none',
      absoluteOnLeave: false,
      absolute: false,
      scale: false,
      simple: true,
      scrollTrigger: {
        trigger: rootRef.current,
        start: 'center center',
        end: '+=200%',
        pin: parentRef.current,
        scrub: true,
      },
      stagger: 0,
    });

    const first = itemsEls.slice(0, 3);
    const last = itemsEls.slice(-3);
    const parallaxTl = gsap.timeline({
      scrollTrigger: {
        trigger: rootRef.current,
        start: 'top bottom',
        end: '+=300%',
        scrub: true,
      },
    });
    parallaxTl.from(first, { yPercent: 75 }, 0).from(last, { yPercent: 150 }, 0);

    return () => {
      flipTween.scrollTrigger?.kill();
      flipTween.kill();
      parallaxTl.scrollTrigger?.kill();
      parallaxTl.kill();
    };
  }, [visible, items.length]);

  const bg = (url) =>
    visible && url ? { backgroundImage: `url('${url}')` } : undefined;

  return (
    <section className="home-gallery" ref={parentRef}>
      <div className="gallery-grid" ref={rootRef}>
        {firstHalf.map((item, index) => (
          <div
            className="gallery-item"
            key={`first-${index}`}
            style={bg(item.gallery_item)}
          />
        ))}
        <div className="gallery-item gallery-item--main" style={bg(mainSrc)} />
        {secondHalf.map((item, index) => (
          <div
            className="gallery-item"
            key={`second-${index}`}
            style={bg(item.gallery_item)}
          />
        ))}
      </div>
    </section>
  );
}
