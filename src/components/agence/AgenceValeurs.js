'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export default function AgenceValeurs({ valeurs = [], title, desc }) {
  const rootRef = useRef(null);
  const left = valeurs.slice(0, Math.ceil(valeurs.length / 2));
  const right = valeurs.slice(Math.ceil(valeurs.length / 2));

  useEffect(() => {
    if (!rootRef.current) return undefined;
    const q = gsap.utils.selector(rootRef.current);
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: rootRef.current,
        start: 'top bottom',
        end: '300%',
        scrub: true,
      },
    });
    tl.from(q('.card--engagement'), { yPercent: 400, rotate: 25 }, 0)
      .from(q('.card--independence'), { yPercent: 200, rotate: -25 }, 0)
      .from(q('.card--humanism'), { yPercent: 200, rotate: 25 }, 0)
      .from(q('.card--performance'), { yPercent: 200, rotate: -25 }, 0);
    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [valeurs.length]);

  const Card = ({ item }) => (
    <div className={`card-valeur card--${item.titre?.toLowerCase()}`}>
      <div className="card-bg">
        <div className="o-hidden">
          <img src={item.image} alt={item.titre} />
        </div>
      </div>
      <div className="card-text">
        <h6>{item.titre}</h6>
        <p>{item.description}</p>
      </div>
    </div>
  );

  return (
    <div className="agence-valeurs">
      <div className="valeurs-left" />
      <div className="valeurs-container">
        <div className="valeurs-text">
          <h2 className="valeurs-title">{title}</h2>
          <p className="valeurs-desc" dangerouslySetInnerHTML={{ __html: desc || '' }} />
        </div>
        <div className="valeurs-cards" ref={rootRef}>
          <div className="grid-left">
            {left.map((item, i) => (
              <Card key={i} item={item} />
            ))}
          </div>
          <div className="grid-right">
            {right.map((item, i) => (
              <Card key={i} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
