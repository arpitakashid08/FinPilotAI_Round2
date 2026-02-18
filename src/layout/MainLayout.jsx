import { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { useAppState } from "../context/AppContext";
import { MarketPage } from "../pages/MarketPage";
import { OverviewPage } from "../pages/OverviewPage";
import { VoicePage } from "../pages/VoicePage";

export function MainLayout() {
  const { data, selectedCeo, setSelectedCeoId, loading, error } = useAppState();
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const observed = Array.from(document.querySelectorAll(".snap-section"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 },
    );

    observed.forEach((node) => observer.observe(node));
    return () => observed.forEach((node) => observer.unobserve(node));
  }, []);

  if (loading) {
    return <div className="loading-state">Loading dashboard...</div>;
  }

  return (
    <div className="app-shell">
      <div className="bg-layer" aria-hidden="true" />
      <Sidebar activeSection={activeSection} />
      <main className="content-scroll">
        {error ? <p className="error-banner">{error}</p> : null}
        <OverviewPage ceos={data.ceos} selectedCeo={selectedCeo} onSelect={setSelectedCeoId} />
        <MarketPage market={data.market} selectedCeo={selectedCeo} />
        <VoicePage selectedCeo={selectedCeo} />
      </main>
    </div>
  );
}
