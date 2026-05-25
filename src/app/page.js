import HomePageClient from '@/components/home/HomePageClient';
import { homepageData, realisations } from '@/data/content';
import { pageTitle } from '@/lib/siteMeta';
import { site } from '@/data/site';

export const metadata = {
  title: pageTitle('Home'),
  description: site.seo.defaultDescription,
};

export default function HomePage() {
  return <HomePageClient data={homepageData} realisations={realisations} />;
}
