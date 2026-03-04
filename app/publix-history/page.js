'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState } from 'react';
import { PUBLIX_TABLE_ROWS, SPLIT_HISTORY } from '../../lib/publix-data';

const PublixHistoryChart = dynamic(
  () => import('../components/PublixHistoryChart'),
  {
    ssr: false,
    loading: () => (
      <div className="chart-wrapper">
        <div className="chart-canvas-container" style={{ height: 420 }}>
          <div className="chart-loading">
            <div className="chart-loading-spinner" aria-hidden="true" />
            <p>Loading chart…</p>
          </div>
        </div>
      </div>
    ),
  }
);

// ─── Key stats ────────────────────────────────────────────────────────────────
const KEY_STATS = [
  { label: 'Starting Price',       value: '$3.65',    sub: 'Q3 2006 (split-adj.)' },
  { label: 'Current Price',        value: '$19.65',   sub: 'Q4 2025' },
  { label: 'Total Return',         value: '+438%',    sub: 'Q3 2006 → Q4 2025', gain: true },
  { label: 'All-Time High',        value: '$21.15',   sub: 'Q2 2025' },
  { label: 'Largest Quarterly Gain',   value: '+16.0%',   sub: 'Q1 2013', gain: true },
  { label: 'Largest Quarterly Decline', value: '−10.1%',  sub: 'Q4 2008', loss: true },
];

// ─── Event badge config ───────────────────────────────────────────────────────
const EVENT_CONFIG = {
  'financial-crisis': { label: '📉 Financial Crisis',      style: 'event-crisis'  },
  'split':            { label: '✂ 5-for-1 Split',          style: 'event-split'   },
  'ath':              { label: '🏆 All-Time High',          style: 'event-ath'     },
  'decline-streak':   { label: '↘ Back-to-back decline',   style: 'event-decline' },
};

// ─── Sortable data table ──────────────────────────────────────────────────────
const SORT_KEYS = ['year', 'quarter', 'price', 'pctChange', 'dolChange'];

function fmt(n, decimals = 2) {
  if (n == null) return '—';
  return n.toFixed(decimals);
}

function DataTable() {
  const [sortKey, setSortKey]   = useState('date'); // default: chronological
  const [sortDir, setSortDir]   = useState('asc');

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const sorted = [...PUBLIX_TABLE_ROWS].sort((a, b) => {
    let av = a[sortKey], bv = b[sortKey];
    if (av == null) av = -Infinity;
    if (bv == null) bv = -Infinity;
    if (typeof av === 'string') av = av.charCodeAt(0);
    if (typeof bv === 'string') bv = bv.charCodeAt(0);
    return sortDir === 'asc' ? av - bv : bv - av;
  });

  function SortIcon({ k }) {
    if (sortKey !== k) return <span className="sort-icon sort-none">⇅</span>;
    return <span className="sort-icon sort-active">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  }

  // Group rows by year for subtle year separators (only relevant in default sort)
  const isChronological = sortKey === 'date' && sortDir === 'asc';

  let lastYear = null;

  return (
    <div className="history-table-scroll">
      <table className="history-table" aria-label="Publix quarterly stock price history">
        <thead>
          <tr>
            <th onClick={() => handleSort('year')} className="sortable-th">
              Year <SortIcon k="year" />
            </th>
            <th onClick={() => handleSort('quarter')} className="sortable-th">
              Quarter <SortIcon k="quarter" />
            </th>
            <th onClick={() => handleSort('price')} className="sortable-th" title="2022 split-adjusted price">
              Price (Split-Adj.) <SortIcon k="price" />
            </th>
            <th title="Actual price at the time — pre-Apr-2022 was 5× higher">
              Actual Price
            </th>
            <th onClick={() => handleSort('pctChange')} className="sortable-th">
              Chg % <SortIcon k="pctChange" />
            </th>
            <th onClick={() => handleSort('dolChange')} className="sortable-th">
              Chg $ <SortIcon k="dolChange" />
            </th>
            <th>Event</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, idx) => {
            const isNewYear = isChronological && row.year !== lastYear;
            if (isChronological) lastYear = row.year;

            const isGain = row.pctChange != null && row.pctChange > 0;
            const isLoss = row.pctChange != null && row.pctChange < 0;
            const evCfg  = row.event ? EVENT_CONFIG[row.event] : null;

            return (
              <tr
                key={row.date}
                className={[
                  isNewYear ? 'year-separator' : '',
                  evCfg ? `highlight-${row.event}` : '',
                ].filter(Boolean).join(' ')}
              >
                <td className="td-year">{isChronological && !isNewYear ? '' : row.year}</td>
                <td className="td-quarter">{row.quarter}</td>
                <td className="td-price">${fmt(row.price)}</td>
                <td className="td-actual" title={row.isBefore2022Split ? 'Pre-Apr-2022 actual price (×5)' : 'Post-split actual price'}>
                  ${fmt(row.actualPrice)}
                  {row.isBefore2022Split && <span className="pre-split-tag">pre-split</span>}
                </td>
                <td className={`td-change ${isGain ? 'gain' : isLoss ? 'loss' : 'neutral'}`}>
                  {row.pctChange != null
                    ? `${row.pctChange > 0 ? '+' : ''}${fmt(row.pctChange)}%`
                    : '—'}
                </td>
                <td className={`td-change ${isGain ? 'gain' : isLoss ? 'loss' : 'neutral'}`}>
                  {row.dolChange != null
                    ? `${row.dolChange > 0 ? '+$' : '-$'}${Math.abs(row.dolChange).toFixed(2)}`
                    : '—'}
                </td>
                <td className="td-event">
                  {evCfg && (
                    <span className={`event-badge ${evCfg.style}`}>{evCfg.label}</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PublixHistoryPage() {
  return (
    <>
      {/* Fixed Header */}
      <header className="app-header">
        <div className="header-brand">
          <Link href="/" className="back-link" aria-label="Back to comparison">
            ← Back
          </Link>
          <h1 style={{ fontSize: 'var(--text-base)' }}>Publix Stock History</h1>
          <span className="header-badge">Private</span>
        </div>
        <span className="private-badge">Employee-Owned</span>
      </header>

      <main className="main-content">
        <div className="page-container">

          {/* Page Title */}
          <div style={{ marginBottom: 'var(--space-6)', paddingTop: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
              <div className="company-icon publix" style={{ width: 44, height: 44, fontSize: 22 }}>P</div>
              <div>
                <h1 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  background: 'linear-gradient(135deg, #f0f0f5 0%, #8fc98f 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.1,
                }}>
                  Complete Publix Stock Price History
                </h1>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-muted)',
                  marginTop: 'var(--space-1)',
                }}>
                  Q3 2006 – Q4 2025 · All prices 2022 split-adjusted · Employee-owned, not publicly traded
                </p>
              </div>
            </div>
          </div>

          {/* Hero Chart */}
          <section aria-label="Publix full price history chart" style={{ marginBottom: 'var(--space-7)' }}>
            <div className="section-header">
              <h2 className="section-title">Price History</h2>
              <span className="section-subtitle">Q3 2006 → Q4 2025 · Quarterly</span>
            </div>
            <PublixHistoryChart />
          </section>

          {/* Key Stats Banner */}
          <section aria-label="Key statistics" style={{ marginBottom: 'var(--space-7)' }}>
            <div className="section-header">
              <h2 className="section-title">Key Stats</h2>
              <span className="section-subtitle">19-Year Overview</span>
            </div>

            <div className="stats-banner">
              {KEY_STATS.map(s => (
                <div key={s.label} className="stat-card">
                  <div className={`stat-value ${s.gain ? 'gain' : s.loss ? 'loss' : ''}`}>
                    {s.value}
                  </div>
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-sub">{s.sub}</div>
                </div>
              ))}
            </div>

            <div className="employee-note">
              <span className="private-badge" style={{ marginRight: 'var(--space-2)' }}>Private</span>
              Employee-owned. Not publicly traded. Price set internally each quarter by the board of directors.
            </div>
          </section>

          {/* Full Data Table */}
          <section aria-label="Full quarterly data table" style={{ marginBottom: 'var(--space-7)' }}>
            <div className="section-header">
              <h2 className="section-title">Quarterly Data</h2>
              <span className="section-subtitle">
                {PUBLIX_TABLE_ROWS.length} data points · Click column header to sort
              </span>
            </div>
            <DataTable />
          </section>

          {/* Split History */}
          <section aria-label="Stock split history" style={{ marginBottom: 'var(--space-7)' }}>
            <div className="section-header">
              <h2 className="section-title">Split History</h2>
              <span className="section-subtitle">All 5 stock splits since 1969</span>
            </div>

            <div className="metrics-table">
              <div className="metrics-table-inner">
                <div className="split-table-header">
                  <div>Split Date</div>
                  <div>Ratio</div>
                  <div>Effect</div>
                  <div>Cumulative Multiplier</div>
                </div>
                {SPLIT_HISTORY.map((s, i) => {
                  const cumulative = SPLIT_HISTORY.slice(0, i + 1).reduce((acc, x) => acc * x.multiplier, 1);
                  return (
                    <div key={s.date} className="split-table-row">
                      <div className="split-td">{s.date}</div>
                      <div className="split-td split-ratio">{s.ratio}</div>
                      <div className="split-td" style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                        1 share → {s.multiplier} shares
                      </div>
                      <div className="split-td" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-publix)' }}>
                        {cumulative.toLocaleString()}×
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-dim)',
              marginTop: 'var(--space-3)',
              lineHeight: 1.6,
            }}>
              One share purchased at Publix&apos;s founding in 1930 would represent{' '}
              <strong style={{ color: 'var(--color-text-secondary)' }}>2,000 shares</strong> today
              (4×10×5×5×5 = 5,000 — but post-1930 buyback programs and employee stock plan terms affect exact counts).
              All prices in the chart and table above are adjusted to reflect today&apos;s post-2022-split share price equivalent.
            </p>
          </section>

          {/* Back Link + Footer */}
          <footer className="page-footer">
            <div style={{ marginBottom: 'var(--space-5)' }}>
              <Link href="/" className="back-to-compare-btn">
                ← Back to Comparison View
              </Link>
            </div>
            <p className="footer-text">
              Publix quarterly share prices are hardcoded — employee-owned, not publicly traded.<br />
              Sources: publixstockholder.com, SEC EDGAR 8-K filings, Al Ebeling/Barney Barnett spreadsheet.<br />
              All prices are 2022 5-for-1 split-adjusted. For informational purposes only — not financial advice.
            </p>
          </footer>

        </div>
      </main>
    </>
  );
}
