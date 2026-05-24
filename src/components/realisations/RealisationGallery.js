'use client';

import { useEffect, useRef } from 'react';
import useIsDesktop from '@/hooks/useIsDesktop';
import useHorizontalCarousel from '@/hooks/useHorizontalCarousel';
import ArrowIcon from '@/components/shared/ArrowIcon';

export default function RealisationGallery({ gallery = [] }) {
  const listWrapperRef = useRef(null);
  const listRef = useRef(null);
  const isDesktop = useIsDesktop();
  const gap = isDesktop ? 30 : 20;
  const count = gallery.length;

  const { goToIndex, isLoaded, onPrevBtnClick, onNextBtnClick } = useHorizontalCarousel(
    listRef,
    listWrapperRef,
    gap,
    count
  );

  useEffect(() => {
    if (isLoaded && count > 0) {
      goToIndex(Math.round(count / 2) - 1);
    }
  }, [isLoaded, count, goToIndex]);

  const imageUrl = (item) =>
    item?.gallerie_image?.url || item?.gallerie_image || '';

  if (!count) return null;

  return (
    <section className="realisation-gallery realisation-component">
      <button type="button" className="btn-icon btn-prev" onClick={onPrevBtnClick} aria-label="Previous">
        <ArrowIcon className="no-fill" />
      </button>
      <div className="carousel-container" ref={listWrapperRef}>
        <ul ref={listRef}>
          {gallery.map((item, index) => (
            <li className="carousel-item" key={item._key || index}>
              <div className="carousel-item__image">
                {imageUrl(item) && (
                  <img src={imageUrl(item)} alt={`Gallery ${index + 1}`} loading="eager" />
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <button type="button" className="btn-icon btn-next" onClick={onNextBtnClick} aria-label="Next">
        <ArrowIcon className="no-fill" />
      </button>
    </section>
  );
}
