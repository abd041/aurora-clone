export default function RealisationStats({ description, keywords = [], stats = [] }) {
  const tags = keywords.filter((kw) => kw?.realisation_keyword);

  return (
    <section className="realisation-stats realisation-component">
      <div className="stats-container">
        <div className="stats-head">
          <h2>{description}</h2>
          {tags.length > 0 && (
            <ul className="stats-tags">
              {tags.map((kw) => (
                <li className="tag" key={kw._key || kw.realisation_keyword}>
                  {kw.realisation_keyword}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="separator" />
        <div className="stats-items">
          {stats.map((stat) => (
            <div className="stats-item" key={stat._key || stat.statistique_legend}>
              <h3>{stat.statistique_data}</h3>
              <span>{stat.statistique_legend}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
