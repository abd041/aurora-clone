import RealisationsSlider from '@/components/realisations/RealisationsSlider';
import { realisations } from '@/data/content';

export const metadata = {
  title: 'Works - Aurora',
  description: 'Discover our portfolio of luxury hospitality projects.',
};

export default function RealisationsPage() {
  return (
    <main className="page realisations">
      <RealisationsSlider realisations={realisations} />
    </main>
  );
}
