import RealisationsSlider from '@/components/realisations/RealisationsSlider';
import { realisations } from '@/data/content';
import { pageTitle } from '@/lib/siteMeta';
import { site } from '@/data/site';

export const metadata = {
  title: pageTitle('Works'),
  description: site.seo.defaultDescription,
};

export default function RealisationsPage() {
  return (
    <main className="page realisations">
      <RealisationsSlider realisations={realisations} />
    </main>
  );
}
