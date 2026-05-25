import ContactForm from '@/components/contact/ContactForm';
import ImagesTrail from '@/components/contact/ImagesTrail';
import DoubleMarquee from '@/components/home/DoubleMarquee';
import ContactMap from '@/components/agence/ContactMap';
import { contact } from '@/data/content';
import { pageTitle } from '@/lib/siteMeta';
import { site } from '@/data/site';

export const metadata = {
  title: pageTitle('Contact'),
  description: site.seo.defaultDescription,
};

export default function ContactPage() {
  return (
    <main className="contact page">
      <ContactForm background={contact.contact_background} />
      <DoubleMarquee gap={30} transparent />
      <ContactMap />
      <ImagesTrail images={contact.contact_images_trail || []} />
    </main>
  );
}
