import StockChartSection from './components/StockChartSection';

export default function HomePage() {
  return (
    <div className="container">
      <header className="page-header card">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Grocery Stock Comparison — Q4 2025</h1>
          <p className="subtitle">
            Side-by-side view of Publix (private), Walmart (WMT), and Kroger (KR) using latest available quarter disclosures.
          </p>
        </div>
        <div className="timestamp">Data as of March 3, 2026</div>
      </header>

      <StockChartSection />

      <section className="disclosure card">
        <h2>Quarter alignment matters</h2>
        <ul>
          <li>
            <strong>Publix:</strong> Q4 2025 = calendar quarter (Oct–Dec 2025), estimates for private-company figures.
          </li>
          <li>
            <strong>Walmart:</strong> Q4 FY2026 ended Jan 2026 (audited public filing).
          </li>
          <li>
            <strong>Kroger:</strong> Q4 FY2025 not yet reported (ends Feb 2026). Showing <strong>Q3 FY2025 (ended Nov 2025)</strong> as
            most recent quarter.
          </li>
        </ul>
      </section>

      <section className="companies-grid">
        <article className="company card publix">
          <div className="company-head">
            <div className="logo">P</div>
            <div>
              <h3>Publix</h3>
              <p className="muted">Private | Employee-owned ESOP</p>
            </div>
          </div>
          <p className="stock-price">$19.65</p>
          <p className="change negative">QoQ: -3.7%</p>
          <div className="mini-meta">
            <span>Implied Mkt Cap: ~$51B</span>
            <span>~2.6B implied shares</span>
          </div>
        </article>

        <article className="company card walmart">
          <div className="company-head">
            <div className="logo">W</div>
            <div>
              <h3>Walmart (WMT)</h3>
              <p className="muted">Public | Global big-box + grocery</p>
            </div>
          </div>
          <p className="stock-price">$127.35</p>
          <p className="change positive">1Y: +30.5%</p>
          <div className="mini-meta">
            <span>Market Cap: ~$700B</span>
            <span>FY2026 Net Income: $21.9B</span>
          </div>
        </article>

        <article className="company card kroger">
          <div className="company-head">
            <div className="logo">K</div>
            <div>
              <h3>Kroger (KR)</h3>
              <p className="muted">Public | Regional/national grocery</p>
            </div>
          </div>
          <p className="stock-price">$68.70</p>
          <p className="change positive">1Y: +9.2%</p>
          <div className="mini-meta">
            <span>Market Cap: ~$45B</span>
            <span>CEO: Greg Foran (Feb 2026)</span>
          </div>
        </article>
      </section>

      <section className="card">
        <h2>Q4 Revenue Comparison</h2>
        <p className="muted section-note">
          Kroger shown on latest reported quarter (Q3 FY2025) because Q4 FY2025 has not been reported yet.
        </p>
        <div className="metric-grid">
          <div className="metric-item">
            <div className="metric-head">
              <span>Publix (Q4 2025 est.)</span>
              <strong>$14.8B</strong>
            </div>
            <div className="bar">
              <div style={{ width: '7.8%' }} />
            </div>
          </div>
          <div className="metric-item">
            <div className="metric-head">
              <span>Walmart (Q4 FY2026)</span>
              <strong>$190.7B</strong>
            </div>
            <div className="bar">
              <div style={{ width: '100%' }} />
            </div>
          </div>
          <div className="metric-item">
            <div className="metric-head">
              <span>Kroger* (Q3 FY2025)</span>
              <strong>$33.9B</strong>
            </div>
            <div className="bar">
              <div style={{ width: '17.8%' }} />
            </div>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Margins Comparison</h2>
        <div className="two-col">
          <div>
            <h4>Gross Margin</h4>
            <div className="metric-item">
              <div className="metric-head">
                <span>Publix</span>
                <strong>~28.5%</strong>
              </div>
              <div className="bar margin">
                <div style={{ width: '100%' }} />
              </div>
            </div>
            <div className="metric-item">
              <div className="metric-head">
                <span>Walmart</span>
                <strong>24.67%</strong>
              </div>
              <div className="bar margin">
                <div style={{ width: '86.6%' }} />
              </div>
            </div>
            <div className="metric-item">
              <div className="metric-head">
                <span>Kroger</span>
                <strong>24.02%</strong>
              </div>
              <div className="bar margin">
                <div style={{ width: '84.3%' }} />
              </div>
            </div>
          </div>

          <div>
            <h4>Operating Margin</h4>
            <div className="metric-item">
              <div className="metric-head">
                <span>Publix</span>
                <strong>~8.5%</strong>
              </div>
              <div className="bar margin">
                <div style={{ width: '100%' }} />
              </div>
            </div>
            <div className="metric-item">
              <div className="metric-head">
                <span>Walmart</span>
                <strong>4.57%</strong>
              </div>
              <div className="bar margin">
                <div style={{ width: '53.8%' }} />
              </div>
            </div>
            <div className="metric-item">
              <div className="metric-head">
                <span>Kroger</span>
                <strong>3.21%</strong>
              </div>
              <div className="bar margin">
                <div style={{ width: '37.8%' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Stock Performance &amp; Scale</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Publix</th>
                <th>Walmart</th>
                <th>Kroger</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Stock move</td>
                <td>-3.7% QoQ</td>
                <td>+30.5% YoY</td>
                <td>+9.2% YoY</td>
              </tr>
              <tr>
                <td>Market cap</td>
                <td>~$51B implied</td>
                <td>~$700B</td>
                <td>~$45B</td>
              </tr>
              <tr>
                <td>Stores</td>
                <td>~1,400+</td>
                <td>~10,500 global</td>
                <td>~2,700+</td>
              </tr>
              <tr>
                <td>States/footprint</td>
                <td>8 (Southeast U.S.)</td>
                <td>All 50 + international</td>
                <td>35 states</td>
              </tr>
              <tr>
                <td>Employees</td>
                <td>~255,000</td>
                <td>~2.1M</td>
                <td>~410,000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="card takeaway">
        <h2>Key Takeaways</h2>
        <ul>
          <li>Publix gross margin (~28–29%) materially exceeds Walmart (24.7%) and Kroger (24.0%).</li>
          <li>Publix operating margin (~8–9%) is roughly 2x Walmart (4.6%) and ~3x Kroger (3.2%).</li>
          <li>Walmart clearly leads on scale and public-market momentum (+30.5% YoY).</li>
          <li>Publix&apos;s -3.7% QoQ stock decline appears mild versus broader grocery pressure.</li>
          <li>Publix implied market cap (~$51B) currently screens above Kroger (~$45B).</li>
        </ul>
      </section>

      <footer className="footnote">
        <p>
          <strong>Disclosure:</strong> Publix is privately held; selected figures (Q4 revenue, annual revenue, margin ranges, implied market
          cap) are estimates and internal-share-price based. Walmart and Kroger figures are from public filings/consensus as noted.
        </p>
        <p>* Kroger Q4 FY2025 pending report; latest available quarter displayed is Q3 FY2025 (ended Nov 2025).</p>
      </footer>
    </div>
  );
}
