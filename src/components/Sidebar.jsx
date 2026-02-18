const nav = [
  { id: "overview", label: "Overview" },
  { id: "market", label: "Market" },
  { id: "voice", label: "Voice Chat" },
];

export function Sidebar({ activeSection }) {
  return (
    <aside className="sidebar glass-panel">
      <h2>FinPilot</h2>
      <nav>
        {nav.map((item) => (
          <a key={item.id} href={`#${item.id}`} className={activeSection === item.id ? "active" : ""}>
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
