'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import ArrowIcon from '@/components/shared/ArrowIcon';
import SecondaryBtn from '@/components/ui/SecondaryBtn';
import useIsMobile from '@/hooks/useIsMobile';
import useLazyInView from '@/hooks/useLazyInView';
import SwitzerlandMapSvg from '@/components/home/SwitzerlandMapSvg';
import useSwitzerlandMapAnimation from '@/hooks/useSwitzerlandMapAnimation';

const MAP_IMG = '/_nuxt/map-switzerland-less-dotted.svg';

export default function HomeMap({
  title,
  firstDesc,
  secondDesc,
  cta,
  ctaLink = '/contact',
  list = [],
  ambassadeurs = [],
}) {
  const sectionRef = useRef(null);
  const mapSvgRef = useRef(null);
  const videoRefs = useRef([]);
  const videoObserversRef = useRef([]);
  const isMobile = useIsMobile();
  const { ref: lazyRef, shouldLoad } = useLazyInView({ rootMargin: '300px' });
  const [index, setIndex] = useState(0);
  const [prevVideoIndex, setPrevVideoIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [loadedVideos, setLoadedVideos] = useState(() => new Set([0]));

  const ambassadors = (Array.isArray(ambassadeurs) ? ambassadeurs : []).filter(
    (a) => a?.regionAmbassadeur
  );
  const current = ambassadors[index] || null;
  const steps = Array.isArray(list) ? list : [];
  const mapRegion = current?.regionAmbassadeur?.toLowerCase() || 'interlaken';

  const setSectionRef = (node) => {
    sectionRef.current = node;
    lazyRef.current = node;
  };

  useSwitzerlandMapAnimation(
    mapSvgRef,
    mapRegion,
    Boolean(ambassadors.length && current)
  );

  const observeVideo = (i) => {
    const video = videoRefs.current[i];
    if (!video || videoObserversRef.current.find((o) => o.video === video)) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.5 }
    );
    observer.observe(video);
    videoObserversRef.current.push({ video, observer });
  };

  useEffect(() => {
    setLoadedVideos((s) => new Set([...s, index]));
  }, [index]);

  useEffect(() => {
    if (shouldLoad && loadedVideos.has(index)) {
      setTimeout(() => observeVideo(index), 100);
    }
  }, [shouldLoad, index, loadedVideos]);

  useEffect(
    () => () => {
      videoObserversRef.current.forEach(({ observer }) => observer.disconnect());
      videoObserversRef.current = [];
    },
    []
  );

  const changeAmbassador = (nextIndex) => {
    if (transitioning || !ambassadors.length) return;
    setTransitioning(true);
    setPrevVideoIndex(index);
    setIndex(nextIndex);
    setTimeout(() => setTransitioning(false), 950);
  };

  const prev = () => {
    const next = index === 0 ? ambassadors.length - 1 : index - 1;
    changeAmbassador(next);
  };

  const next = () => {
    const nextI = index === ambassadors.length - 1 ? 0 : index + 1;
    changeAmbassador(nextI);
  };

  const shouldLoadVideo = (i) => shouldLoad && loadedVideos.has(i);

  return (
    <section className="home-map" ref={setSectionRef}>
      {isMobile && (
        <div className="home-map--mobile">
          <h2 className="title t-center">{title}</h2>
          {firstDesc && <p className="text-description t-center">{firstDesc}</p>}
        </div>
      )}
      {ambassadors.length > 0 && (
        <div className="home-map--left">
          <div className="left-bg">
            <div className="left-bg--voile" />
            <div className="left-bg--gradient" />
            {ambassadors.map((amb, i) => (
              <video
                key={i}
                ref={(el) => {
                  if (el) videoRefs.current[i] = el;
                }}
                className={`${prevVideoIndex === i ? 'prev' : ''}${index === i ? ' active' : ''}`.trim()}
                src={shouldLoadVideo(i) ? amb.bgVideoAmbassadeur?.url : undefined}
                loop
                muted
                playsInline
                preload="metadata"
              />
            ))}
          </div>
          <div className="left-container">
            <div className="left-map left-map--switzerland">
              <div className="map-background map-background--switzerland">
                <img src={MAP_IMG} alt="" role="presentation" />
              </div>
              <div className="map-svg" ref={mapSvgRef}>
                <SwitzerlandMapSvg region={mapRegion} />
              </div>
            </div>
            <div className="left-text">
              <div className="left-infos">
                <div className="left-avatar">
                  <img
                    src={current?.avatarAmbassadeur?.url}
                    alt="avatar"
                    width="160"
                  />
                </div>
                {ambassadors.length > 1 && (
                  <button type="button" className="arrow-icon arrow-back" onClick={prev} aria-label="Previous">
                    <ArrowIcon />
                  </button>
                )}
                <div className="left-infos--text">
                  <h6>
                    {current?.nomAmbassadeur || 'Ambassadeur'}
                    {current?.nameRegionAmbassadeur && (
                      <span> ⏤ {current.nameRegionAmbassadeur}</span>
                    )}
                  </h6>
                  {current?.mailAmbassadeur && (
                    <a href={`mailto:${current.mailAmbassadeur.toLowerCase()}`} className="link">
                      Contacter
                    </a>
                  )}
                  {current?.telephoneAmbassadeur && (
                    <a href={`tel:${current.telephoneAmbassadeur}`} className="link">
                      {current.telephoneAmbassadeur}
                    </a>
                  )}
                </div>
                {ambassadors.length > 1 && (
                  <button type="button" className="arrow-icon arrow-next" onClick={next} aria-label="Next">
                    <ArrowIcon />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="home-map--right">
        {!isMobile && (
          <>
            <h2 className="title t-center">{title}</h2>
            {firstDesc && <p className="text-description t-center">{firstDesc}</p>}
          </>
        )}
        <ul className="expertises-list">
          {steps.map((step, i) => (
            <li key={step._key || i}>
              <div>
                <span>{step.etape_titre}</span>
              </div>
              <span className="number-list">0{i + 1}</span>
            </li>
          ))}
        </ul>
        {secondDesc && <p className="text-description t-center">{secondDesc}</p>}
        {cta && (
          <SecondaryBtn tag="Link" href={ctaLink}>
            {cta}
          </SecondaryBtn>
        )}
      </div>
    </section>
  );
}
