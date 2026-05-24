import LoopLine from '@/components/ui/LoopLine';

function brHtml(text = '') {
  return text.replace(/\n/g, '<br />');
}

export default function HomeLogos({
  title,
  description,
  subtitle,
  firstLogos = [],
  secondLogos = [],
}) {
  return (
    <section className="home-logos">
      {title && (
        <div className="home-logos--title">
          <h2 className="title" dangerouslySetInnerHTML={{ __html: title }} />
          {description && (
            <p dangerouslySetInnerHTML={{ __html: brHtml(description) }} />
          )}
        </div>
      )}
      <LoopLine
        className="marquee__loop"
        direction="left"
        gap={30}
        gapSmall={30}
        autoPlay
        autoPlaySpeed={2}
      >
        {firstLogos.map((item, index) => (
          <div className="box" key={item._key || index}>
            <img
              src={item.logo}
              alt={`logo ${index}`}
              loading="lazy"
              width="200"
              height="100"
            />
          </div>
        ))}
      </LoopLine>
      <h6>{subtitle}</h6>
      <LoopLine
        className="marquee__loop"
        direction="right"
        gap={30}
        gapSmall={30}
        autoPlay
        autoPlaySpeed={2}
      >
        {secondLogos.map((item, index) => (
          <div className="box" key={item._key || index}>
            <img
              src={item.logo}
              alt={`logo ${index}`}
              loading="lazy"
              width="200"
              height="100"
            />
          </div>
        ))}
      </LoopLine>
    </section>
  );
}
