'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import useIsDesktop from '@/hooks/useIsDesktop';
import useHorizontalCarousel from '@/hooks/useHorizontalCarousel';

const OTHER_PROJECTS_ICON = '/_nuxt/other-projects.Cjq-Ezm8.png';

export default function RealisationSimilaires({ realisations = [] }) {
  const listWrapperRef = useRef(null);
  const listRef = useRef(null);
  const isDesktop = useIsDesktop();
  const gap = isDesktop ? 30 : 20;
  const count = realisations.length;

  const { goToIndex, isLoaded } = useHorizontalCarousel(
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

  const coverUrl = (item) =>
    item?.acf?.realisation_cover?.url ||
    item?.highlightCover ||
    item?.acf?.realisation_cover;

  if (!count) return null;

  return (
    <section className="realisation-similaires">
      <h2 className="project-title">
        Projets
        <img src={OTHER_PROJECTS_ICON} alt="" />
        <br />
        {' similaires'}
      </h2>
      <div className="carousel-similaires" ref={listWrapperRef}>
        <ul ref={listRef}>
          {realisations.map((item) => (
            <li className="carousel-item" key={item.slug || item.title}>
              <div className="carousel-item__image">
                {coverUrl(item) && (
                  <img src={coverUrl(item)} alt={item.title} loading="lazy" />
                )}
              </div>
              <div className="carousel-item__mask">
                <div className="carousel-item__mask-item">
                  {coverUrl(item) && (
                    <img src={coverUrl(item)} alt="" loading="lazy" />
                  )}
                </div>
              </div>
              <div className="carousel-item__container">
                <span className="category">
                  {(item.categories || []).map((cat, i) => (
                    <span key={cat}>
                      {cat}
                      {i > 0 ? ', ' : ''}
                    </span>
                  ))}
                </span>
                <h6 className="title">{item.title}</h6>
                <Link className="link" href={`/realisations/${item.slug}`}>
                  Discover the project
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
