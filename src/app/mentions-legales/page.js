import Link from 'next/link';
import RevealLines from '@/components/ui/RevealLines';
import { legal } from '@/data/content';
import { pageTitle } from '@/lib/siteMeta';
import { site } from '@/data/site';

export const metadata = {
  title: pageTitle('Mentions Légales'),
  description: `Legal information for ${site.brand.name}.`,
};

export default function MentionsLegalesPage() {
  const credits = site.footer.credits;

  return (
    <main className="mentions-legales page">
      <div className="ml-left">
        <div className="ml-fade" />
        <div className="ml-overlay" />
        <video src="/videos/test-contact.mp4" autoPlay loop muted playsInline />
      </div>
      <div className="ml-right">
        <RevealLines tag="h1" className="ml-title">
          {legal.legal_title || 'Mentions légales'}
        </RevealLines>
        <div className="ml-container">
          <div
            className="ml-wordpress"
            dangerouslySetInnerHTML={{ __html: legal.legal_content }}
          />
          <strong>Réalisation</strong>
          {credits && (
            <p>
              Design by{' '}
              <Link
                href={credits.design.href}
                target="_blank"
                rel="noopener noreferrer"
                className="link hide-u"
              >
                {credits.design.label}
              </Link>
              <br />
              Code by{' '}
              <Link
                href={credits.development.href}
                target="_blank"
                rel="noopener noreferrer"
                className="link hide-u"
              >
                {credits.development.label}
              </Link>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
