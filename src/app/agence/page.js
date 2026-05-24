import AgenceHero from '@/components/agence/AgenceHero';
import AgenceMarquee from '@/components/agence/AgenceMarquee';
import AgenceStats from '@/components/agence/AgenceStats';
import AgenceDescription from '@/components/agence/AgenceDescription';
import AgenceCards from '@/components/agence/AgenceCards';
import AgenceSplit from '@/components/agence/AgenceSplit';
import AgenceValeurs from '@/components/agence/AgenceValeurs';
import DoubleMarquee from '@/components/home/DoubleMarquee';
import ContactMap from '@/components/agence/ContactMap';
import { agence } from '@/data/content';

const AGENCE_VIDEOS = {
  hero: '/videos/789f4e986b5fa544580326b32ea727e9b0cfb7c1.mp4',
  card0: '/videos/82abac7f4ce5dfc470e9d26b11076edb29aede37.mp4',
  card1: '/videos/7db34db67c5d532677a9f1326c5630b1b1c02382.mp4',
  card2: '/videos/54ddd736eb805dd0cc687c36e16ffed2a96a413d.mp4',
};

export const metadata = {
  title: 'Agency - Aurora',
  description: 'Discover Aurora Agency, your partner in innovative digital marketing solutions.',
};

export default function AgencePage() {
  const data = {
    ...agence,
    agence_cards: (agence.agence_cards || []).map((card, index) => ({
      ...card,
      video:
        index === 0
          ? { url: AGENCE_VIDEOS.card0, mediaType: 'video' }
          : index === 1
            ? { url: AGENCE_VIDEOS.card1, mediaType: 'video' }
            : index === 2
              ? { url: AGENCE_VIDEOS.card2, mediaType: 'video' }
              : card.video,
    })),
  };

  return (
    <main className="page agence">
      <AgenceHero
        title={data.agence_hero_title}
        videoBg={AGENCE_VIDEOS.hero}
        videoFull={AGENCE_VIDEOS.hero}
      />
      <AgenceMarquee />
      <AgenceStats stats={data.agence_stats || []} />
      <div className="agence-description">
        <AgenceDescription description={data.agence_description} />
      </div>
      <AgenceCards
        title={data.agence_cards_title}
        desc={data.agence_cards_desc}
        cards={data.agence_cards || []}
      />
      <AgenceSplit
        videoUrl={data.agence_split_video}
        title={data.agence_split_title}
        desc={data.agence_split_desc}
      />
      <AgenceValeurs
        valeurs={data.agence_valeurs || []}
        title={data.agence_valeurs_title}
        desc={data.agence_valeurs_desc}
      />
      <DoubleMarquee gap={30} transparent />
      <ContactMap />
    </main>
  );
}
