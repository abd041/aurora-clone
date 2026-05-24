import Link from 'next/link';
import RevealLines from '@/components/ui/RevealLines';
import { legal } from '@/data/content';

export const metadata = {
  title: 'Mentions Légales - Aurora',
  description: 'Legal information for Aurora Agency.',
};

export default function MentionsLegalesPage() {
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
          <p>
            Design by{' '}
            <Link
              href="https://www.linkedin.com/in/clementmerouani"
              target="_blank"
              rel="noopener noreferrer"
              className="link hide-u"
            >
              Flot Noir Studio
            </Link>
            <br />
            Code by{' '}
            <Link
              href="https://guillaumecolombel.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="link hide-u"
            >
              Guillaume Colombel
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
