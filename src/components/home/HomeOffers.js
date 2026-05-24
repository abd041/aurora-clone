'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import StackCards from '@/components/home/StackCards';

export default function HomeOffers({ title, offers = [], cards = [] }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const video = document.querySelector('.home-video .video-mask-item video');
    if (!video || !rootRef.current) return undefined;

    const st = ScrollTrigger.create({
      trigger: rootRef.current,
      start: 'top top',
      end: 'top top',
      scrub: true,
      onLeave: () => video.pause(),
      onEnterBack: () => video.play().catch(() => {}),
    });

    return () => st.kill();
  }, []);

  return (
    <section className="home-offers" ref={rootRef}>
      <div className="home-offers--title">
        <h2 className="title">{title}</h2>
        <ul className="offers-list">
          {offers.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <StackCards cards={cards} />
    </section>
  );
}
