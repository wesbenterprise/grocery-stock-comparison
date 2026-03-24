'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  QUARTERS, LATEST_QUARTER, KPI_SPARKLINE_DATA, ANNUAL_DATA,
  filterByYears, formatBillions, formatPercent, formatNumber,
  getMarginColor,
} from '../../lib/publix-financials';

// Dynamic imports — all ssr:false
const PasswordGate = dynamic(() => import('./components/PasswordGate'), { ssr: false });
const KPICard = dynamic(() => import('./components/KPICard'), { ssr: false });
const YearRangeSelector = dynamic(() => import('./components/YearRangeSelector'), { ssr: false });
const RevenueIncomeChart = dynamic(() => import('./components/RevenueIncomeChart'), { ssr: false });
const MarginChart = dynamic(() => import('./components/MarginChart'), { ssr: false });
const RevenuePerStoreChart = dynamic(() => import('./components/RevenuePerStoreChart'), { ssr: false });
const SeasonalHeatmap = dynamic(() => import('./components/SeasonalHeatmap'), { ssr: false });
const BalanceSheetChart = dynamic(() => import('./components/BalanceSheetChart'), { ssr: false });
const StoreExpansionChart = dynamic(() => import('./components/StoreExpansionChart'), { ssr: false });
const DataTable = dynamic(() => import('./components/DataTable'), { ssr: false });

export default function PublixHistoryPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [yearRange, setYearRange] = useState([2015, 2025]);
  const [activePreset, setActivePreset] = useState('all');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const val = localStorage.getItem('publix-auth');
      if (val === 'authenticated') setAuthed(true);
      setChecking(false);
    }
  }, []);

  const filteredData = useMemo(
    () => filterByYears(QUARTERS, yearRange[0], yearRange[1]),
    [yearRange]
  );

  const handleLogout = () => {
    localStorage.removeItem('publix-auth');
    setAuthed(false);
  };

  if (checking) {
    return <div style={{ background: '#0a0a0a', minHeight: '100vh' }} />;
  }

  if (!authed) {
    return (
      <main style={{ background: '#0a0a0a', minHeight: '100vh' }}>
        <PasswordGate onAuth={() => setAuthed(true)} />
      </main>
    );
  }

  // Compute KPI data
  const latestQ = LATEST_QUARTER;
  const prev = QUARTERS[QUARTERS.length - 2];
  const qoqRevGrowth = latestQ.qoqRevenueGrowth ?? 0;
  const qoqNIGrowth = latestQ.qoqNetIncomeGrowth ?? 0;
  const storeChange = latestQ.storeCount - prev.storeCount;
  const netMarginChange = latestQ.netMarginPct - prev.netMarginPct;

  const getRevDir = (v) => v > 1.0 ? 'up' : v < -1.0 ? 'down' : 'neutral';
  const getNIDir = (v) => v > 5.0 ? 'up' : v < -5.0 ? 'down' : 'neutral';
  const netMarginColor = getMarginColor(latestQ.netMarginPct, 'net');

  return (
    <main style={{ background: '#0a0a0a', minHeight: '100vh', color: '#e5e5e5',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 max(24px, 4vw)' }}>

        {/* HEADER */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          paddingTop: 48, paddingBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 700, color: '#C8A050', lineHeight: 1.2, margin: 0 }}>
              Publix Super Markets
            </h1>
            <p style={{ fontSize: '1rem', color: '#a3a3a3', marginTop: 4 }}>
              Quarterly Financial History · FY2015–FY2025
            </p>
            <span style={{
              display: 'inline-block', fontSize: '0.75rem', color: '#a3a3a3',
              border: '1px solid #2a2a2a', borderRadius: 9999, padding: '4px 12px', marginTop: 12,
            }}>
              44 Quarters · SEC EDGAR Data
            </span>
          </div>
          <button onClick={handleLogout} style={{
            fontSize: '0.8125rem', color: '#a3a3a3', background: 'transparent',
            border: '1px solid #2a2a2a', borderRadius: 8, padding: '8px 16px', cursor: 'pointer',
            transition: 'all 150ms ease',
          }}
            onMouseEnter={e => { e.target.style.color = '#ef4444'; e.target.style.borderColor = '#ef4444'; }}
            onMouseLeave={e => { e.target.style.color = '#a3a3a3'; e.target.style.borderColor = '#2a2a2a'; }}
          >
            Logout
          </button>
        </header>

        {/* YEAR RANGE SELECTOR */}
        <YearRangeSelector yearRange={yearRange} setYearRange={setYearRange}
          activePreset={activePreset} setActivePreset={setActivePreset} />

        {/* KPI ROW */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 32 }}
          className="kpi-grid">
          <KPICard label="TOTAL REVENUE" value={formatBillions(latestQ.revenue)}
            trendValue={qoqRevGrowth} trendDirection={getRevDir(qoqRevGrowth)}
            sparklineData={KPI_SPARKLINE_DATA.revenue} sparklineColor="#C8A050" />
          <KPICard label="NET INCOME" value={formatBillions(latestQ.netIncome, 2)}
            trendValue={qoqNIGrowth} trendDirection={getNIDir(qoqNIGrowth)}
            sparklineData={KPI_SPARKLINE_DATA.netIncome} sparklineColor="#2DD4BF" />
          <KPICard label="NET MARGIN" value={formatPercent(latestQ.netMarginPct)}
            trendValue={netMarginChange} trendDirection={netMarginChange >= 0 ? 'up' : 'down'}
            sparklineData={KPI_SPARKLINE_DATA.netMarginPct} sparklineColor={netMarginColor}
            valueColor={netMarginColor} />
          <KPICard label="STORE COUNT" value={formatNumber(latestQ.storeCount)}
            trendValue={`+${storeChange}`}
            trendDirection={storeChange > 0 ? 'up' : 'neutral'}
            sparklineData={KPI_SPARKLINE_DATA.storeCount} sparklineColor="#C8A050" />
        </div>

        {/* REVENUE & NET INCOME */}
        <div style={{ marginBottom: 32 }}>
          <RevenueIncomeChart data={filteredData} />
        </div>

        {/* MARGIN ANALYSIS */}
        <div style={{ marginBottom: 32 }}>
          <MarginChart data={filteredData} />
        </div>

        {/* TWO COLUMN: Rev/Store + Heatmap */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}
          className="two-column">
          <RevenuePerStoreChart data={filteredData} />
          <SeasonalHeatmap yearRange={yearRange} />
        </div>

        {/* BALANCE SHEET */}
        <div style={{ marginBottom: 32 }}>
          <BalanceSheetChart data={filteredData} />
        </div>

        {/* STORE EXPANSION */}
        <div style={{ marginBottom: 32 }}>
          <StoreExpansionChart />
        </div>

        {/* DATA TABLE */}
        <div style={{ marginBottom: 48 }}>
          <DataTable />
        </div>

        {/* FOOTER */}
        <footer style={{ textAlign: 'center', padding: '48px 0 32px', borderTop: '1px solid #2a2a2a', marginTop: 48 }}>
          <p style={{ fontSize: '0.75rem', color: '#a3a3a3' }}>
            Data sourced from SEC EDGAR · Publix Super Markets 10-K and 10-Q filings
          </p>
          <p style={{ fontSize: '0.75rem', color: '#a3a3a380', marginTop: 4 }}>
            For informational purposes only
          </p>
        </footer>
      </div>

      <style>{`
        @media (max-width: 1199px) {
          .kpi-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 959px) {
          .two-column { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 599px) {
          .kpi-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
