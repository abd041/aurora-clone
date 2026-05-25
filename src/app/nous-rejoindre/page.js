import JoinHero from '@/components/join/JoinHero';
import RejoindreOffres from '@/components/join/RejoindreOffres';
import LoopLine from '@/components/ui/LoopLine';
import { join } from '@/data/content';
import { pageTitle } from '@/lib/siteMeta';
import { site } from '@/data/site';
import { Fragment } from 'react';

export const metadata = {
  title: pageTitle('Join us'),
  description: site.seo.defaultDescription,
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
              <span className="marquee-word"> {join.marquee_word} </span>
              <span className="marquee-number">{join.jobs?.length || 0}</span>
            </Fragment>
          ))}
        </LoopLine>
      </div>
      <RejoindreOffres jobs={join.jobs || []} />
    </main>
  );
}
