import { CeoCard } from "../components/CeoCard";
import { HeroOrb } from "../components/HeroOrb";

export function OverviewPage({ ceos, selectedCeo, onSelect }) {
  return (
    <section id="overview" className="snap-section">
      <div className="section-head">
        <p className="eyebrow">Overview</p>
        <h2>Executive Intelligence Matrix</h2>
      </div>
      <div className="overview-grid">
        <HeroOrb ceo={selectedCeo} />
        <div className="ceo-stack">
          {ceos.map((ceo) => (
            <CeoCard key={ceo.id} ceo={ceo} active={ceo.id === selectedCeo.id} onSelect={onSelect} />
          ))}
        </div>
      </div>
    </section>
  );
}
