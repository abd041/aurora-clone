'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import ArrowIcon from '@/components/shared/ArrowIcon';
import SecondaryBtn from '@/components/ui/SecondaryBtn';
import useIsMobile from '@/hooks/useIsMobile';
import useLazyInView from '@/hooks/useLazyInView';

const MAP_IMG = '/_nuxt/map-france-less-dotted.BJ8qf9St.png';

function FranceMapSvg() {
  return (
    <svg viewBox="0 0 610 558" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        className="svg-point nantes"
        d="M160.5 269C162.433 269 164 267.433 164 265.5C164 263.567 162.433 262 160.5 262C158.567 262 157 263.567 157 265.5C157 267.433 158.567 269 160.5 269Z"
        fill="white"
      />
      <path
        className="svg-point svg-circle nantes"
        d="M160.736 297.379C178.505 297.379 192.926 282.958 192.926 265.189C192.926 247.421 178.505 233 160.736 233C142.967 233 128.547 247.421 128.547 265.189C128.547 282.958 142.967 297.379 160.736 297.379Z"
        fill="none"
        stroke="url(#paint0_linear_map)"
        strokeWidth="2"
      />
      <path
        className="svg-point svg-circle nantes"
        d="M160.736 297.379C178.505 297.379 192.926 282.958 192.926 265.189C192.926 247.421 178.505 233 160.736 233C142.967 233 128.547 247.421 128.547 265.189C128.547 282.958 142.967 297.379 160.736 297.379Z"
        fill="none"
        stroke="url(#paint0_linear_map)"
        strokeWidth="2"
      />
      <path
        className="svg-point svg-circle nantes"
        d="M160.736 297.379C178.505 297.379 192.926 282.958 192.926 265.189C192.926 247.421 178.505 233 160.736 233C142.967 233 128.547 247.421 128.547 265.189C128.547 282.958 142.967 297.379 160.736 297.379Z"
        fill="none"
        stroke="url(#paint0_linear_map)"
        strokeWidth="2"
      />
      <path
        className="svg-point toulouse"
        d="M344.5 479.003C346.433 479.003 348 477.436 348 475.502C348 473.568 346.433 472 344.5 472C342.567 472 341 473.568 341 475.502C341 477.436 342.567 479.003 344.5 479.003Z"
        fill="white"
      />
      <path
        className="svg-point svg-circle toulouse"
        d="M344.736 507.379C362.505 507.379 376.926 492.958 376.926 475.189C376.926 457.421 362.505 443 344.736 443C326.967 443 312.547 457.421 312.547 475.189C312.547 492.958 326.967 507.379 344.736 507.379Z"
        fill="none"
        stroke="url(#paint1_linear_map)"
        strokeWidth="2"
      />
      <path
        className="svg-point svg-circle toulouse"
        d="M344.736 507.379C362.505 507.379 376.926 492.958 376.926 475.189C376.926 457.421 362.505 443 344.736 443C326.967 443 312.547 457.421 312.547 475.189C312.547 492.958 326.967 507.379 344.736 507.379Z"
        fill="none"
        stroke="url(#paint1_linear_map)"
        strokeWidth="2"
      />
      <path
        className="svg-point svg-circle toulouse"
        d="M344.736 507.379C362.505 507.379 376.926 492.958 376.926 475.189C376.926 457.421 362.505 443 344.736 443C326.967 443 312.547 457.421 312.547 475.189C312.547 492.958 326.967 507.379 344.736 507.379Z"
        fill="none"
        stroke="url(#paint1_linear_map)"
        strokeWidth="2"
      />
      <defs>
        <linearGradient id="paint0_linear_map" x1="129.811" y1="296.595" x2="192.19" y2="234.216" gradientUnits="userSpaceOnUse">
          <stop offset="0.144643" stopColor="#977DBD" />
          <stop offset="0.8625" stopColor="#F3C4C9" />
        </linearGradient>
        <linearGradient id="paint1_linear_map" x1="313.811" y1="506.595" x2="376.19" y2="444.216" gradientUnits="userSpaceOnUse">
          <stop offset="0.144643" stopColor="#977DBD" />
          <stop offset="0.8625" stopColor="#F3C4C9" />
        </linearGradient>
      </defs>
    </svg>
  );
}

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
  const mapTimelineRef = useRef(null);
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

  const setSectionRef = (node) => {
    sectionRef.current = node;
    lazyRef.current = node;
  };

  const animateMapPoint = () => {
    if (!mapSvgRef.current || !current) return;
    const region = current.regionAmbassadeur?.toLowerCase();
    if (!region) return;

    const points = [...mapSvgRef.current.querySelectorAll('.svg-point')];
    const circles = [...mapSvgRef.current.querySelectorAll('.svg-circle')];
    const all = points.concat(circles);
    const regionEls = [...mapSvgRef.current.querySelectorAll(`.${region}`)];
    const primary = regionEls[0];
    const ripples = regionEls.slice(1);

    mapTimelineRef.current?.kill();
    gsap.set([circles, all], { opacity: 1, scale: 0 });

    mapTimelineRef.current = gsap.timeline({ repeat: -1 });
    mapTimelineRef.current
      .to(primary, { scale: 1, opacity: 1, duration: 0.75, ease: 'quart.out' }, 0)
      .to(primary, { opacity: 0, duration: 0.75, ease: 'quart.out' }, 1.5)
      .fromTo(ripples, { scale: 0 }, { scale: 2, duration: 1, stagger: 0.2, ease: 'quart.out' }, 0)
      .to(ripples, { opacity: 0, duration: 0.75, ease: 'quart.out' }, 1.5);
  };

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
    if (ambassadors.length) {
      gsap.set('.svg-point', { transformOrigin: 'center', scale: 0 });
      animateMapPoint();
    }
    return () => mapTimelineRef.current?.kill();
  }, [index, ambassadors.length]);

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
            <div className="left-map">
              <div className="map-background">
                <img src={MAP_IMG} alt="Map" />
              </div>
              <div className="map-svg" ref={mapSvgRef}>
                <FranceMapSvg />
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
