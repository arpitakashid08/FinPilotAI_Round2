import { TrendPanel } from "../components/TrendPanel";

export function MarketPage({ market, selectedCeo }) {
  return (
    <section id="market" className="snap-section">
      <div className="section-head">
        <p className="eyebrow">Market</p>
        <h2>Asymmetrical Signal Board</h2>
      </div>
      <div className="market-grid">
        <TrendPanel market={market} />
        <article className="bento-panel ceo-focus">
          <img src={selectedCeo.photo} alt={`${selectedCeo.name} profile`} />
          <div>
            <p>CEO Focus</p>
            <h3>{selectedCeo.name}</h3>
            <span>{selectedCeo.company}</span>
            <p>{selectedCeo.focus}</p>
          </div>
        </article>
      </div>
    </section>
  );
}
