'use client';

import Link from 'next/link';
import useIsMobile from '@/hooks/useIsMobile';
import RevealFakeLines from '@/components/ui/RevealFakeLines';
import AuroraHeroMark from '@/components/brand/AuroraHeroMark';
import { BrandIcon } from '@/components/brand/BrandLogo';
import { site } from '@/data/site';

export default function Footer({ isDescription = true }) {
  const isMobile = useIsMobile();
  const { description, credits } = site.footer;

  return (
    <>
      {isDescription && (
        <section className="footer-description">
          <RevealFakeLines tag="h2">
            <span dangerouslySetInnerHTML={{ __html: description }} />
          </RevealFakeLines>
        </section>
      )}
      <footer className="footer">
        <div className="footer-bg">
          <div className="fade-rosey" />
          <div className="round-purple" />
          <div className="round-black" />
          <div className="fade-black" />
        </div>
        <div className="footer-logo">
          <AuroraHeroMark className="footer-logo-watermark" strokeWidth={1} />
        </div>
        <div className="footer-container">
          {!isMobile && credits && (
            <ul className="footer-item">
              <li className="link hide-u">
                Design by{' '}
                <Link href={credits.design.href} target="_blank" rel="noopener noreferrer">
                  {credits.design.label}
                </Link>
              </li>
            </ul>
          )}
          <div className="footer-item">
            <Link href="/">
              <BrandIcon />
            </Link>
          </div>
          {!isMobile && credits && (
            <ul className="footer-item">
              <li className="link hide-u">
                Development by{' '}
                <Link href={credits.development.href} target="_blank" rel="noopener noreferrer">
                  {credits.development.label}
                </Link>
              </li>
            </ul>
          )}
        </div>
      </footer>
    </>
  );
}
