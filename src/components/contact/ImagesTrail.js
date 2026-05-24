'use client';

import { useEffect, useRef } from 'react';
import { ImagesTrailEffect } from '@/lib/imagesTrail';

export default function ImagesTrail({ images = [] }) {
  const containerRef = useRef(null);
  const effectRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !images.length) return undefined;

    const imgs = containerRef.current.querySelectorAll('.content__img');
    imgs.forEach((node) => node.getBoundingClientRect());

    effectRef.current = new ImagesTrailEffect(containerRef.current);

    return () => {
      effectRef.current?.destroy();
      effectRef.current = null;
    };
  }, [images]);

  return (
    <div className="images-trail">
      <div className="content" ref={containerRef}>
        {images.map((item, i) => (
          <div className="content__img" key={item._key || i}>
            <div className="content__img-inner">
              <img src={item.contact_image} alt={`Image ${i}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
