export default function AgenceStats({ stats = [] }) {
  return (
    <div className="agence-stats">
      {stats.map((stat, index) => (
        <div
          className={`stat-item stat--${index + 1}`}
          key={stat._key || index}
          data-stat={stat.stat_data}
        >
          {index === 1 ? (
            <div className="stat-circle">
              <h3>{stat.stat_data}</h3>
              <p>{stat.stat_legend}</p>
            </div>
          ) : (
            <>
              <h3>{stat.stat_data}</h3>
              <p>{stat.stat_legend}</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
