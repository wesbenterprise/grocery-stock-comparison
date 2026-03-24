'use client';

import { useState } from 'react';
import KPICard from './components/KPICard';
import YearRangeSelector from './components/YearRangeSelector';
import RevenueIncomeChart from './components/RevenueIncomeChart';
import MarginChart from './components/MarginChart';
import RevenuePerStoreChart from './components/RevenuePerStoreChart';
import SeasonalHeatmap from './components/SeasonalHeatmap';
import BalanceSheetChart from './components/BalanceSheetChart';
import StoreExpansionChart from './components/StoreExpansionChart';
import DataTable from './components/DataTable';
import CashFlowDashboard from './components/CashFlowDashboard';
import {
  formatBillions, formatPercent, formatNumber, getMarginColor,
} from '../../lib/publix-financials';

export default function DashboardContent({
  filteredData, yearRange, setYearRange, activePreset, setActivePreset,
  latestQ, prevQ, kpiSparklineData, handleLogout,
}) {
  const [activeTab, setActiveTab] = useState('income');

  const qoqRevGrowth = latestQ.qoqRevenueGrowth ?? 0;
  const qoqNIGrowth = latestQ.qoqNetIncomeGrowth ?? 0;
  const storeChange = latestQ.storeCount - prevQ.storeCount;
  const netMarginChange = latestQ.operatingNetMarginPct - prevQ.operatingNetMarginPct;

  const getRevDir = (v) => v > 1.0 ? 'up' : v < -1.0 ? 'down' : 'neutral';
  const getNIDir = (v) => v > 5.0 ? 'up' : v < -5.0 ? 'down' : 'neutral';
  const netMarginColor = getMarginColor(latestQ.operatingNetMarginPct, 'net');

  const tabBase = {
    padding: '10px 28px',
    fontSize: '1rem',
    fontWeight: 600,
    background: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    cursor: 'pointer',
    transition: 'all 150ms ease',
    color: '#a3a3a3',
    letterSpacing: '0.02em',
  };

  const tabActive = {
    ...tabBase,
    color: '#C8A050',
    borderBottom: '2px solid #C8A050',
  };

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

        {/* TAB SWITCHER */}
        <div style={{
          display: 'flex',
          gap: 0,
          borderBottom: '1px solid #2a2a2a',
          marginBottom: 32,
        }}>
          <button
            onClick={() => setActiveTab('income')}
            style={activeTab === 'income' ? tabActive : tabBase}
          >
            Income Statement
          </button>
          <button
            onClick={() => setActiveTab('cashflow')}
            style={activeTab === 'cashflow' ? tabActive : tabBase}
          >
            Cash Flow
          </button>
        </div>

        {/* YEAR RANGE SELECTOR */}
        <YearRangeSelector yearRange={yearRange} setYearRange={setYearRange}
          activePreset={activePreset} setActivePreset={setActivePreset} />

        {/* ── INCOME STATEMENT TAB ── */}
        {activeTab === 'income' && (
          <>
            {/* KPI ROW */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 32 }}
              className="kpi-grid">
              <KPICard label="TOTAL REVENUE" value={formatBillions(latestQ.revenue)}
                trendValue={qoqRevGrowth} trendDirection={getRevDir(qoqRevGrowth)}
                sparklineData={kpiSparklineData.revenue} sparklineColor="#C8A050" />
              <KPICard label="OPERATING NET INCOME" value={formatBillions(latestQ.operatingNetIncome, 2)}
                trendValue={qoqNIGrowth} trendDirection={getNIDir(qoqNIGrowth)}
                sparklineData={kpiSparklineData.operatingNetIncome} sparklineColor="#2DD4BF"
                sublabel="ex. securities G/L" />
              <KPICard label="OPERATING NET MARGIN" value={formatPercent(latestQ.operatingNetMarginPct)}
                trendValue={netMarginChange} trendDirection={netMarginChange >= 0 ? 'up' : 'down'}
                sparklineData={kpiSparklineData.operatingNetMarginPct} sparklineColor={netMarginColor}
                valueColor={netMarginColor} sublabel="ex. securities G/L" />
              <KPICard label="STORE COUNT" value={formatNumber(latestQ.storeCount)}
                trendValue={`+${storeChange}`}
                trendDirection={storeChange > 0 ? 'up' : 'neutral'}
                sparklineData={kpiSparklineData.storeCount} sparklineColor="#C8A050" />
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
          </>
        )}

        {/* ── CASH FLOW TAB ── */}
        {activeTab === 'cashflow' && (
          <div style={{ marginBottom: 48 }}>
            <CashFlowDashboard filteredData={filteredData} yearRange={yearRange} />
          </div>
        )}

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
