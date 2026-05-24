'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from '@/lib/gsap';

const MAP_IMG = '/_nuxt/map-france-dotted.D6Ojo-by.png';

export default function ContactMap() {
  const mapRef = useRef(null);
  const circlesRef = useRef([]);

  useEffect(() => {
    circlesRef.current = [...document.querySelectorAll('.contact-map .circle-area')];
    gsap.set(circlesRef.current, { scale: 0, opacity: 1, transformOrigin: 'center' });
  }, []);

  const pulse = (index) => {
    const el = circlesRef.current[index];
    if (!el) return;
    gsap.killTweensOf(el);
    gsap
      .timeline()
      .set(el, { scale: 0, opacity: 1, transformOrigin: 'center' })
      .to(el, { scale: 1, duration: 0.5, ease: 'quart.out' })
      .to(el, { opacity: 0, duration: 0.5, ease: 'quart.out' });
  };

  return (
    <section className="contact-map">
      <div className="contact-map--text">
        <h2>Aurora Agency France</h2>
        <Link href="tel:+33175929475" className="link">
          01 75 92 94 75
        </Link>
        <Link href="mailto:contact@aurora.com" className="link">
          contact@aurora.com
        </Link>
      </div>
      <div className="contact-map--item" ref={mapRef}>
        <div className="map-background">
          <img src={MAP_IMG} alt="Map" />
        </div>
        <div className="map-svg">
          <svg viewBox="0 0 610 650" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M151.736 319.379C169.505 319.379 183.926 304.958 183.926 287.189C183.926 269.421 169.505 255 151.736 255C133.968 255 119.547 269.421 119.547 287.189C119.547 304.958 133.968 319.379 151.736 319.379Z"
              fill="none"
              className="circle-area"
              stroke="url(#contactMapGrad)"
              strokeWidth="2"
            />
            <path
              d="M71.7365 206.379C89.5053 206.379 103.926 191.958 103.926 174.189C103.926 156.421 89.5053 142 71.7365 142C53.9677 142 39.5471 156.421 39.5471 174.189C39.5471 191.958 53.9677 206.379 71.7365 206.379Z"
              fill="none"
              className="circle-area"
              stroke="url(#contactMapGrad)"
              strokeWidth="2"
            />
            <path
              d="M311.736 583.379C329.505 583.379 343.926 568.958 343.926 551.189C343.926 533.421 329.505 519 311.736 519C293.967 519 279.547 533.421 279.547 551.189C279.547 568.958 293.967 583.379 311.736 583.379Z"
              fill="none"
              className="circle-area"
              stroke="url(#contactMapGrad)"
              strokeWidth="2"
            />
            <path
              d="M565.189 592.379C582.958 592.379 597.379 577.958 597.379 560.189C597.379 542.421 582.958 528 565.189 528C547.421 528 533 542.421 533 560.189C533 577.958 547.421 592.379 565.189 592.379Z"
              fill="none"
              className="circle-area"
              stroke="url(#contactMapGrad)"
              strokeWidth="2"
            />
            <rect
              x="105"
              y="246"
              width="94"
              height="85"
              fill="#D9D9D9"
              fillOpacity="0"
              className="rect-area"
              onMouseEnter={() => pulse(0)}
            />
            <rect
              x="24"
              y="136"
              width="94"
              height="85"
              fill="#D9D9D9"
              fillOpacity="0"
              className="rect-area"
              onMouseEnter={() => pulse(1)}
            />
            <rect
              x="264"
              y="514"
              width="94"
              height="85"
              fill="#D9D9D9"
              fillOpacity="0"
              className="rect-area"
              onMouseEnter={() => pulse(2)}
            />
            <rect
              x="513"
              y="520"
              width="94"
              height="85"
              fill="#D9D9D9"
              fillOpacity="0"
              className="rect-area"
              onMouseEnter={() => pulse(3)}
            />
            <defs>
              <linearGradient id="contactMapGrad" x1="120.812" y1="318.595" x2="183.19" y2="256.216" gradientUnits="userSpaceOnUse">
                <stop offset="0.144643" stopColor="#977DBD" />
                <stop offset="0.8625" stopColor="#F3C4C9" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </section>
  );
}
