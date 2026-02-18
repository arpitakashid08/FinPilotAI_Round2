export function CeoCard({ ceo, active, onSelect }) {
  return (
    <article className={`ceo-card ${active ? "is-active" : ""}`} onClick={() => onSelect(ceo.id)}>
      <img src={ceo.photo} alt={`${ceo.name} placeholder`} loading="lazy" />
      <div>
        <p className="ceo-company">{ceo.company}</p>
        <h3>{ceo.name}</h3>
        <p>{ceo.notes}</p>
      </div>
      <span className="ceo-stat">{ceo.stat}</span>
    </article>
  );
}
