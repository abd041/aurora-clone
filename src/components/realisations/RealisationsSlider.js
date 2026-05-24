'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from '@/lib/gsap';
import { RealSliderLogoClip } from '@/components/realisations/RealisationLogoClip';
import useSplitLines from '@/hooks/useSplitLines';

function ProjectTitle({ children }) {
  const ref = useRef(null);
  useSplitLines(ref, { delay: 0.75 });
  return (
    <h2 className="project-title" ref={ref}>
      {children}
    </h2>
  );
}

export default function RealisationsSlider({ realisations = [] }) {
  const rootRef = useRef(null);

  useEffect(() => {
    if (!rootRef.current) return undefined;
    const q = gsap.utils.selector(rootRef.current);

    const entryTl = gsap
      .timeline()
      .addLabel('start', 0.75)
      .from(q('.category'), { scale: 0.75, opacity: 0, duration: 1, ease: 'quart.out', clearProps: 'all' }, 'start')
      .from(q('.link'), { scale: 0.75, opacity: 0, duration: 1, ease: 'quart.out', clearProps: 'all' }, 'start+=0.25');

    const triggers = [];
    rootRef.current.querySelectorAll('.slider-item').forEach((item) => {
      const img = item.querySelector('.img-mask-item img');
      if (!img) return;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
        defaults: { ease: 'none' },
      });
      tl.to(img, { yPercent: 25, clearProps: 'all' }, 0);
      triggers.push(tl);
    });

    return () => {
      entryTl.kill();
      triggers.forEach((tl) => {
        tl.scrollTrigger?.kill();
        tl.kill();
      });
    };
  }, [realisations.length]);

  const coverSrc = (item) =>
    item?.acf?.realisation_cover?.url || item?.highlightCover || item?.acf?.realisation_cover;

  return (
    <section className="realisations-slider" ref={rootRef}>
      <div className="slider-container">
        {realisations.map((item) => (
          <div className="slider-item" key={item.slug || item.title}>
            <div className="img-mask">
              <div className="img-mask-item">
                <img src={coverSrc(item)} alt={item.title} />
              </div>
            </div>
            <div className="slider-bg">
              <div className="fade-bg" />
              <img src={coverSrc(item)} alt="slider" loading="lazy" />
            </div>
            <span className="category uppercase">
              {(item.categories || []).map((cat, ci) => (
                <span key={ci}>
                  {cat}
                  {ci > 0 ? ', ' : ''}
                </span>
              ))}
            </span>
            <ProjectTitle>{item.title}</ProjectTitle>
            <Link className="link" href={`/realisations/${item.slug}`}>
              Discover the project
            </Link>
          </div>
        ))}
      </div>
      <RealSliderLogoClip />
    </section>
  );
}
