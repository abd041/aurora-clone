import LoopLine from '@/components/ui/LoopLine';
import SmallLogoBlue from '@/components/icons/SmallLogoBlue';
import SmallLogoGray from '@/components/icons/SmallLogoGray';

export default function DoubleMarquee({ gap = 30, transparent = false, small = false }) {
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
        <span className="marquee-word">Ethics</span>
        <SmallLogoBlue />
        <span className="marquee-word">Humanism</span>
        <SmallLogoBlue />
        <span className="marquee-word">Transparency</span>
        <SmallLogoBlue />
        <span className="marquee-word">Performance</span>
        <SmallLogoBlue />
      </LoopLine>
      <LoopLine
        className="marquee__loop marquee--blue"
        direction="right"
        gap={gap}
        gapSmall={gap}
        autoPlay
        autoPlaySpeed={2}
      >
        <span className="marquee-word">Ethics</span>
        <SmallLogoGray />
        <span className="marquee-word">Humanism</span>
        <SmallLogoGray />
        <span className="marquee-word">Transparency</span>
        <SmallLogoGray />
        <span className="marquee-word">Performance</span>
        <SmallLogoGray />
      </LoopLine>
    </section>
  );
}
