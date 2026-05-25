import LoopLine from '@/components/ui/LoopLine';
import SmallLogoBlue from '@/components/icons/SmallLogoBlue';
import SmallLogoGray from '@/components/icons/SmallLogoGray';
import { sharedUi } from '@/data/content';

function MarqueeItems({ words, LogoIcon }) {
  return words.flatMap((word) => [
    <span key={word} className="marquee-word">
      {word}
    </span>,
    <LogoIcon key={`${word}-logo`} />,
  ]);
}

export default function DoubleMarquee({ gap = 30, transparent = false, small = false }) {
  const words = sharedUi.marqueeWords;

  return (
    <section
      className={`double-marquee${transparent ? ' transparent-background' : ''}${small ? ' small' : ''}`.trim()}
    >
      <LoopLine
        className="marquee__loop marquee--gray"
        direction="left"
        gap={gap}
        gapSmall={gap}
        autoPlay
        autoPlaySpeed={2}
      >
        <MarqueeItems words={words} LogoIcon={SmallLogoBlue} />
      </LoopLine>
      <LoopLine
        className="marquee__loop marquee--blue"
        direction="right"
        gap={gap}
        gapSmall={gap}
        autoPlay
        autoPlaySpeed={2}
      >
        <MarqueeItems words={words} LogoIcon={SmallLogoGray} />
      </LoopLine>
    </section>
  );
}
