export function HeroOrb({ ceo }) {
  return (
    <section className="orb-shell">
      <div className="orb-ring orb-ring-one" />
      <div className="orb-ring orb-ring-two" />
      <div className="orb-core">
        <p className="orb-label">Featured CEO</p>
        <h1>{ceo.name}</h1>
        <p>{ceo.focus}</p>
      </div>
    </section>
  );
}
