'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import SiteHeader from '../components/SiteHeader';

// Dynamic imports to avoid SSR issues with Chart.js
const PredictionPanel = dynamic(() => import('../components/PredictionPanel'), {
  ssr: false,
  loading: () => (
    <div className="prediction-panel loading">
      <div className="spinner" />
      <p>Loading predictor...</p>
    </div>
  ),
});

const StockChart = dynamic(() => import('../components/StockChart'), {
  ssr: false,
  loading: () => (
    <div className="chart-section">
      <div className="section-header">
        <h2 className="section-title">Stock Performance</h2>
      </div>
      <div className="chart-wrapper">
        <div className="chart-canvas-container">
          <div className="chart-loading">
            <div className="chart-loading-spinner" aria-hidden="true" />
            <p>Loading chart…</p>
          </div>
        </div>
      </div>
    </div>
  ),
});

function formatPrice(p) {
  if (p == null || isNaN(p)) return '—';
  return '$' + p.toFixed(2);
}

function formatChange(current, prev) {
  if (!current || !prev) return null;
  const pct = ((current - prev) / prev) * 100;
  return { pct, isGain: pct >= 0 };
}

function ChangeTag({ pct, isGain }) {
  if (pct == null) return null;
  const sign = isGain ? '+' : '';
  return (
    <span className={`stock-change ${isGain ? 'gain' : 'loss'}`}>
      {sign}{pct.toFixed(2)}%
    </span>
  );
}

export default function Page() {
  const [authed, setAuthed] = useState(null); // null = checking, true = in, false = gate
  const [pwValue, setPwValue] = useState('');
  const [pwError, setPwError] = useState('');
  const [shaking, setShaking] = useState(false);
  const [liveStocks, setLiveStocks] = useState({ KR: null, WMT: null, ADRNY: null, ACI: null, WMK: null });

  useEffect(() => {
    setAuthed(localStorage.getItem('bfp-auth') === 'authenticated');
  }, []);

  const tryLogin = () => {
    if (pwValue === 'bfp2026') {
      localStorage.setItem('bfp-auth', 'authenticated');
      setAuthed(true);
    } else {
      setPwError('Wrong password');
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
    }
  };

  const handleLiveData = useCallback((data) => {
    setLiveStocks(data);
  }, []);

  const wmtChange = formatChange(liveStocks.WMT?.price, liveStocks.WMT?.prev);
  const krChange  = formatChange(liveStocks.KR?.price,  liveStocks.KR?.prev);

  // Still checking localStorage
  if (authed === null) return null;

  // Password gate
  if (!authed) return (
    <div style={{
      position: 'fixed', inset: 0, background: 'var(--color-bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: '24px', zIndex: 9999,
    }}>
      <div style={{ fontSize: '56px', opacity: 0.7 }}>🔒</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: 'var(--color-text)' }}>
        Grocery Stock Compare
      </div>
      <div style={{
        display: 'flex', gap: '8px',
        animation: shaking ? 'shake 0.4s ease-in-out' : 'none',
      }}>
        <input
          type="password"
          placeholder="Password"
          value={pwValue}
          onChange={e => { setPwValue(e.target.value); setPwError(''); }}
          onKeyDown={e => e.key === 'Enter' && tryLogin()}
          autoFocus
          style={{
            background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)',
            color: 'var(--color-text)', padding: '12px 18px', borderRadius: '10px',
            fontFamily: 'var(--font-body)', fontSize: '16px', width: '220px', outline: 'none',
          }}
        />
        <button
          onClick={tryLogin}
          style={{
            background: 'var(--color-publix)', color: '#000', border: 'none',
            padding: '12px 24px', borderRadius: '10px', fontFamily: 'var(--font-display)',
            fontWeight: 700, cursor: 'pointer', fontSize: '15px',
          }}
        >
          Enter
        </button>
      </div>
      {pwError && <div style={{ color: 'var(--color-loss)', fontSize: '14px', fontFamily: 'var(--font-body)' }}>{pwError}</div>}
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}`}</style>
    </div>
  );

  return (
    <>
      <SiteHeader />

      {/* Main */}
      <main className="main-content">
        <div className="page-container">

          {/* Hero: Stock Chart */}
          <section aria-label="Stock performance chart" style={{ marginBottom: 'var(--space-7)' }}>
            <StockChart onLiveDataLoaded={handleLiveData} />
          </section>

          {/* Publix Price Predictor */}
          <section aria-label="Publix price prediction">
            <PredictionPanel />
          </section>

          {/* Company Cards */}
          <section aria-label="Company financials" style={{ marginBottom: 'var(--space-7)' }}>
            <div className="section-header">
              <h2 className="section-title">Latest Results</h2>
              <span className="section-subtitle">Q4 2025 / Full-Year Results</span>
            </div>

            <div className="cards-grid">

              {/* Publix */}
              <article className="company-card publix fadeIn">
                <div className="card-header">
                  <div className="company-name-group">
                    <div className="company-icon publix">P</div>
                    <div>
                      <div className="company-name">Publix</div>
                      <div className="company-ticker">Employee-Owned</div>
                    </div>
                  </div>
                  <div className="stock-price-block">
                    <span className="stock-price">$19.65</span>
                    <span className="stock-change loss">−3.7% QoQ</span>
                  </div>
                </div>

                <div className="card-divider" />

                <div className="card-metrics">
                  <div className="metric-row">
                    <span className="metric-label">Revenue (Full-Year 2025)</span>
                    <span className="metric-value">$62.7B</span>
                  </div>
                  <div className="metric-row">
                    <span className="metric-label">Implied Market Cap</span>
                    <span className="metric-value">~$63B</span>
                  </div>
                  <div className="metric-row">
                    <span className="metric-label">Share Price</span>
                    <span className="metric-value">$19.65 / share</span>
                  </div>
                </div>

                <div className="card-divider" />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="card-note">Not publicly traded on any exchange</span>
                  <span className="private-badge">Private</span>
                </div>

                <div style={{ marginTop: 'var(--space-3)' }}>
                  <Link href="/publix-history" className="publix-history-link">
                    View Complete Publix Stock History →
                  </Link>
                </div>
              </article>

              {/* Walmart */}
              <article className="company-card walmart fadeIn">
                <div className="card-header">
                  <div className="company-name-group">
                    <div className="company-icon walmart">W</div>
                    <div>
                      <div className="company-name">Walmart</div>
                      <div className="company-ticker">NYSE: WMT</div>
                    </div>
                  </div>
                  <div className="stock-price-block">
                    <span className="stock-price">
                      {liveStocks.WMT?.price ? formatPrice(liveStocks.WMT.price) : (
                        <span className="loading-skeleton" style={{ width: 80, height: 22, display: 'inline-block', borderRadius: 4 }} />
                      )}
                    </span>
                    {wmtChange ? <ChangeTag {...wmtChange} /> : null}
                  </div>
                </div>

                <div className="card-divider" />

                <div className="card-metrics">
                  <div className="metric-row">
                    <span className="metric-label">Revenue (Full-Year FY2026)</span>
                    <span className="metric-value">$713.2B</span>
                  </div>
                  <div className="metric-row">
                    <span className="metric-label">Revenue Growth YoY</span>
                    <span className="metric-value gain">+4.7%</span>
                  </div>
                  <div className="metric-row">
                    <span className="metric-label">Q4 Revenue</span>
                    <span className="metric-value">$190.7B</span>
                  </div>
                  <div className="metric-row">
                    <span className="metric-label">eCommerce Growth (Q4)</span>
                    <span className="metric-value gain">+24%</span>
                  </div>
                </div>

                <div className="card-divider" />
                <span className="card-note">FY2026 ended January 31, 2026</span>
              </article>

              {/* Kroger */}
              <article className="company-card kroger fadeIn">
                <div className="card-header">
                  <div className="company-name-group">
                    <div className="company-icon kroger">K</div>
                    <div>
                      <div className="company-name">Kroger</div>
                      <div className="company-ticker">NYSE: KR</div>
                    </div>
                  </div>
                  <div className="stock-price-block">
                    <span className="stock-price">
                      {liveStocks.KR?.price ? formatPrice(liveStocks.KR.price) : (
                        <span className="loading-skeleton" style={{ width: 80, height: 22, display: 'inline-block', borderRadius: 4 }} />
                      )}
                    </span>
                    {krChange ? <ChangeTag {...krChange} /> : null}
                  </div>
                </div>

                <div className="card-divider" />

                <div className="card-metrics">
                  <div className="metric-row">
                    <span className="metric-label">Revenue (Full-Year FY2025)</span>
                    <span className="metric-value">$147.6B</span>
                  </div>
                  <div className="metric-row">
                    <span className="metric-label">Q4 Revenue</span>
                    <span className="metric-value">$34.7B</span>
                  </div>
                  <div className="metric-row">
                    <span className="metric-label">Adjusted FIFO Op. Profit</span>
                    <span className="metric-value">$4.9B</span>
                  </div>
                </div>

                <div className="card-divider" />
                <span className="card-note">FY2025 ended January 31, 2026</span>
              </article>

            </div>
          </section>

          {/* Key Metrics Comparison Table */}
          <section aria-label="Key metrics comparison" style={{ marginBottom: 'var(--space-7)' }}>
            <div className="section-header">
              <h2 className="section-title">Key Metrics</h2>
              <span className="section-subtitle">Side-by-Side Comparison</span>
            </div>

            <div className="metrics-table-wrap"><div className="metrics-table">
              <div className="metrics-table-inner">
                <div className="metrics-table-header">
                  <div className="metrics-table-header-cell">Metric</div>
                  <div className="metrics-table-header-cell company-header-publix">Publix</div>
                  <div className="metrics-table-header-cell company-header-walmart">Walmart</div>
                  <div className="metrics-table-header-cell company-header-kroger">Kroger</div>
                </div>

                {[
                  {
                    label: 'Annual Revenue',
                    publix:  '$62.7B',
                    walmart: '$713.2B',
                    kroger:  '$147.6B',
                  },
                  {
                    label: 'Operating Margin',
                    publix:  '~5.5%',
                    walmart: '~4.5%',
                    kroger:  '~3.0%',
                  },
                  {
                    label: 'Stock Perf. (1Y)',
                    publix:  '+30.0%',
                    walmart: liveStocks.WMT?.price && liveStocks.WMT?.prev
                      ? ((liveStocks.WMT.price - liveStocks.WMT.prev) / liveStocks.WMT.prev * 100).toFixed(1) + '%'
                      : '~+76%',
                    kroger:  liveStocks.KR?.price && liveStocks.KR?.prev
                      ? ((liveStocks.KR.price - liveStocks.KR.prev) / liveStocks.KR.prev * 100).toFixed(1) + '%'
                      : '~+8%',
                  },
                  {
                    label: 'Market Cap',
                    publix:  '~$63B',
                    walmart: '~$950B',
                    kroger:  '~$45B',
                  },
                  {
                    label: 'Stores (US)',
                    publix:  '1,461',
                    walmart: '~4,600',
                    kroger:  '~2,700',
                  },
                  {
                    label: 'Exchange',
                    publix:  'Private',
                    walmart: 'NYSE',
                    kroger:  'NYSE',
                  },
                ].map((row) => (
                  <div key={row.label} className="metrics-table-row">
                    <div className="metrics-table-cell">{row.label}</div>
                    <div className="metrics-table-cell">
                      <span className="publix-val">{row.publix}</span>
                    </div>
                    <div className="metrics-table-cell">
                      <span className="walmart-val">{row.walmart}</span>
                    </div>
                    <div className="metrics-table-cell">
                      <span className="kroger-val">{row.kroger}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div></div>
          </section>

          {/* Footer */}
          <footer className="page-footer">
            <p className="footer-text">
              Data sources: Publix quarterly share prices (hardcoded — employee-owned, not publicly traded).<br />
              KR &amp; WMT prices via Yahoo Finance API (server-side proxy, cached 1hr).<br />
              Financial figures from public earnings reports. For informational purposes only — not financial advice.
            </p>

          </footer>

        </div>
      </main>
    </>
  );
}
