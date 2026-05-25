import { redirect } from 'next/navigation';
import { pageTitle } from '@/lib/siteMeta';
import { site } from '@/data/site';

export const metadata = {
  title: pageTitle('Accompagnement'),
  description: site.seo.defaultDescription,
};

/** Live CMS has no accompagnement payload — route forwards to agency page. */
export default function AccompagnementPage() {
  redirect('/agence');
}
