import { VoiceChatPanel } from "../components/VoiceChatPanel";

export function VoicePage({ selectedCeo }) {
  return (
    <section id="voice" className="snap-section">
      <div className="section-head">
        <p className="eyebrow">Voice</p>
        <h2>Conversation-Ready Copilot</h2>
      </div>
      <div className="voice-grid">
        <VoiceChatPanel />
        <article className="bento-panel transcript-hint">
          <img src={selectedCeo.photo} alt={`${selectedCeo.name} avatar`} />
          <div>
            <p>Conversation Context</p>
            <h3>{selectedCeo.name}</h3>
            <p>Ask for strategy notes, sentiment comparison, or risk snapshots.</p>
          </div>
        </article>
      </div>
    </section>
  );
}
