import JoinHero from '@/components/join/JoinHero';
import RejoindreOffres from '@/components/join/RejoindreOffres';
import LoopLine from '@/components/ui/LoopLine';
import { join } from '@/data/content';
import { Fragment } from 'react';

export const metadata = {
  title: 'Join us - Aurora',
  description: 'Join the Aurora team and participate in our innovative digital marketing projects.',
};

export default function NousRejoindrePage() {
  return (
    <main className="page rejoindre">
      <JoinHero
        background="/images/join-us.avif"
        title={join.hero_td_titre}
        description={join.hero_td_desc}
      />
      <div className="rejoindre-marquee">
        <LoopLine
          className="marquee__loop"
          direction="right"
          gap={50}
          gapSmall={20}
          autoPlay
          autoPlaySpeed={2}
        >
          {[0, 1].map((i) => (
            <Fragment key={i}>
              <span className="marquee-word"> Job openings </span>
              <span className="marquee-number">{join.jobs?.length || 0}</span>
            </Fragment>
          ))}
        </LoopLine>
      </div>
      <RejoindreOffres jobs={join.jobs || []} />
    </main>
  );
}
