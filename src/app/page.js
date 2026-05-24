import HomePageClient from '@/components/home/HomePageClient';
import { homepageData, realisations } from '@/data/content';

export const metadata = {
  title: 'Home - Aurora',
  description:
    'Welcome to Aurora, your partner in innovative digital marketing solutions.',
};

export default function HomePage() {
  return <HomePageClient data={homepageData} realisations={realisations} />;
}
