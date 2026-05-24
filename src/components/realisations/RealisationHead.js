'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import useSplitLines from '@/hooks/useSplitLines';
import { RealisationHeadLogoClip } from '@/components/realisations/RealisationLogoClip';

function ProjectTitle({ children }) {
  const ref = useRef(null);
  useSplitLines(ref, { delay: 0.75 });
  return (
    <h1 className="project-title" ref={ref}>
      {children}
    </h1>
  );
}

export default function RealisationHead({ cover, title, categories = [] }) {
  const rootRef = useRef(null);
  const timelinesRef = useRef([]);

  const coverUrl =
    typeof cover === 'string' ? cover : cover?.url || cover?.gallerie_image?.url || '';

  useEffect(() => {
    const setup = async () => {
      await new Promise((r) => requestAnimationFrame(r));
      timelinesRef.current.forEach((tl) => {
        tl.scrollTrigger?.kill();
        tl.kill();
      });
      timelinesRef.current = [];

      if (!rootRef.current) return;
      const img = rootRef.current.querySelector('.video-mask-item img');
      if (!img) return;

      gsap.set(img, { clearProps: 'all' });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: '+=100%',
          scrub: true,
        },
      });
      tl.to(img, { yPercent: 25 }, 0);
      timelinesRef.current.push(tl);
      ScrollTrigger.refresh();
    };

    setup();
    window.addEventListener('aurora:introCompleted', setup);
    window.addEventListener('aurora:pageEnter', setup);

    return () => {
      window.removeEventListener('aurora:introCompleted', setup);
      window.removeEventListener('aurora:pageEnter', setup);
      timelinesRef.current.forEach((tl) => {
        tl.scrollTrigger?.kill();
        tl.kill();
      });
    };
  }, [coverUrl, title]);

  return (
    <>
      <section className="home-hero" ref={rootRef}>
        <div className="video-container">
          {coverUrl && <img src={coverUrl} alt={title} />}
        </div>
        <div className="home-hero--sticky">
          <div className="video-mask">
            <div className="video-mask-item">
              {coverUrl && <img src={coverUrl} alt={title} />}
            </div>
          </div>
          <div className="realisation-head">
            <span className="category">
              {categories.map((cat, i) => (
                <span key={cat}>
                  {cat}
                  {i < categories.length - 1 ? ', ' : ''}
                </span>
              ))}
            </span>
            <ProjectTitle>{title}</ProjectTitle>
          </div>
        </div>
      </section>
      <RealisationHeadLogoClip />
    </>
  );
}
