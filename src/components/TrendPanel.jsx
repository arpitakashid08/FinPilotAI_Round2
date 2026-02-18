export function TrendPanel({ market }) {
  return (
    <section className="bento-panel trend-panel">
      <header>
        <p>Real-Time Market Trends</p>
      </header>
      <ul>
        {market.map((item) => (
          <li key={item.name}>
            <div>
              <strong>{item.name}</strong>
              <span>{item.change}</span>
            </div>
            <div className="meter-track">
              <div className="meter-fill" style={{ width: `${item.momentum}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
