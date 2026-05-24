export default function AgenceSplit({ videoUrl, title, desc }) {
  const src =
    typeof videoUrl === 'string'
      ? videoUrl
      : videoUrl?.image || videoUrl?.url || '';

  return (
    <div className="agence-split">
      <div className="split-left">
        {src && <img src={src} alt="" width="1920" />}
      </div>
      <div className="split-right">
        <h2 className="title">{title}</h2>
        <p dangerouslySetInnerHTML={{ __html: desc || '' }} />
      </div>
    </div>
  );
}
