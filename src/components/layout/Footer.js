'use client';

import Link from 'next/link';
import useIsMobile from '@/hooks/useIsMobile';
import RevealFakeLines from '@/components/ui/RevealFakeLines';

const FOOTER_DESCRIPTION =
  'Where luxury outdoor meets glamping <br /> excellence, integrated marketing <br /> and communication, across the world.';

export default function Footer({ isDescription = true }) {
  const isMobile = useIsMobile();

  return (
    <>
      {isDescription && (
        <section className="footer-description">
          <RevealFakeLines tag="h2">
            <span dangerouslySetInnerHTML={{ __html: FOOTER_DESCRIPTION }} />
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
          <img src="/_nuxt/footer-logo.DGEgvHlG.png" alt="Footer logo" />
        </div>
        <div className="footer-container">
          {!isMobile && (
            <ul className="footer-item">
              <li className="link hide-u">
                Design by{' '}
                <Link
                  href="https://www.linkedin.com/in/clementmerouani"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Flot Noir Studio
                </Link>
              </li>
            </ul>
          )}
          <div className="footer-item">
            <Link href="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="none"
                viewBox="0 0 40 40"
                className="Icon Icon--logo-small no-size"
                aria-hidden
              >
                <path
                  fill="#fff"
                  d="M0 20V10c5.524 0 10-4.477 10-10h10.002c0 11.046-8.956 20-20.002 20M40.006 20V10c-5.524 0-10-4.477-10-10H20.004c0 11.046 8.956 20 20.002 20M0 40V30c5.524 0 10-4.478 10-10.001h10.002c0 11.046-8.956 20-20.002 20M40.006 40V30c-5.524 0-10-4.478-10-10.001H20.004c0 11.046 8.956 20 20.002 20"
                />
              </svg>
            </Link>
          </div>
          {!isMobile && (
            <ul className="footer-item">
              <li className="link hide-u">
                Development by{' '}
                <Link
                  href="https://guillaumecolombel.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Guillaume Colombel
                </Link>
              </li>
            </ul>
          )}
        </div>
      </footer>
    </>
  );
}
