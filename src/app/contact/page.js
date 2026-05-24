import ContactForm from '@/components/contact/ContactForm';
import ImagesTrail from '@/components/contact/ImagesTrail';
import DoubleMarquee from '@/components/home/DoubleMarquee';
import ContactMap from '@/components/agence/ContactMap';
import { contact } from '@/data/content';

export const metadata = {
  title: 'Contact - Aurora',
  description: 'Get in touch with Aurora, your partner in innovative digital marketing solutions.',
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
