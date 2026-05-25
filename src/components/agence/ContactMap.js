'use client';

import { useRef } from 'react';
import Link from 'next/link';
import SwitzerlandMapSvg from '@/components/home/SwitzerlandMapSvg';
import useSwitzerlandMapAnimation from '@/hooks/useSwitzerlandMapAnimation';
import { site } from '@/data/site';

const MAP_IMG = '/_nuxt/map-switzerland-less-dotted.svg';

export default function ContactMap() {
  const mapSvgRef = useRef(null);
  const { mapHeading, mapPhone, mapPhoneDisplay, email } = site.contact;

  useSwitzerlandMapAnimation(mapSvgRef, 'interlaken');

  return (
    <section className="contact-map">
      <div className="contact-map--text">
        <h2>{mapHeading}</h2>
        <Link href={`tel:${mapPhone}`} className="link">
          {mapPhoneDisplay}
        </Link>
        <Link href={`mailto:${email}`} className="link">
          {email}
        </Link>
      </div>
      <div className="contact-map--item contact-map--item--switzerland">
        <div className="map-background map-background--switzerland">
          <img src={MAP_IMG} alt="" role="presentation" />
        </div>
        <div className="map-svg" ref={mapSvgRef}>
          <SwitzerlandMapSvg region="interlaken" />
        </div>
      </div>
    </section>
  );
}
