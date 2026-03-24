'use client';

import { useState, useMemo } from 'react';
import { Chart, Bar, Line } from 'react-chartjs-2';
import { setupCharts } from '../ChartSetup';
import { CASHFLOW_QUARTERS, computeAnnualCashflow } from '../../../lib/publix-cashflow';
import { formatBillions, formatPercent } from '../../../lib/publix-financials';
import KPICard from './KPICard';

setupCharts();

const tooltipStyle = {
  backgroundColor: '#1a1a1a', borderColor: '#2a2a2a', borderWidth: 1,
  titleColor: '#e5e5e5', bodyColor: '#a3a3a3', titleFont: { size: 13, weight: 600 },
  bodyFont: { size: 12 }, padding: 12, cornerRadius: 8, displayColors: true,
};

const btnBase = {
  padding: '6px 16px', fontSize: '0.75rem', fontWeight: 500,
  borderRadius: 6, cursor: 'pointer', transition: 'all 150ms ease',
  border: '1px solid #2a2a2a', background: 'transparent', color: '#a3a3a3',
};
const btnActive = {
  ...btnBase, background: '#C8A05020', borderColor: '#C8A050', color: '#C8A050',
};

const xAxisConfig = {
  ticks: {
    color: '#a3a3a3', font: { size: 11 }, maxRotation: 45,
    callback: function (value) {
      const label = this.getLabelForValue(value);
      if (!label.includes('-')) return label;
      return label.endsWith('Q1') ? label.replace('-Q1', '') : '';
    },
  },
  grid: { display: false },
};

const legendConfig = {
  display: true, position: 'top', align: 'end',
  labels: {
    color: '#a3a3a3', font: { size: 12 }, boxWidth: 12, boxHeight: 12,
    borderRadius: 2, useBorderRadius: true, padding: 16,
  },
};

const VIEW_OCF = 'ocf';
const VIEW_ALLOC = 'alloc';
const VIEW_CONVERSION = 'conversion';

export default function CashFlowDashboard({ filteredData, yearRange }) {
  const [chartView, setChartView] = useState(VIEW_OCF);
  const [periodMode, setPeriodMode] = useState('quarterly');
  const [daPerMode, setDaPerMode] = useState('quarterly');
  const [tableOpen, setTableOpen] = useState(false);
  const [sortCol, setSortCol] = useState('period');
  const [sortDir, setSortDir] = useState('asc');

  // ── Year range from income statement data ──
  const minYear = useMemo(() => Math.min(...filteredData.map(q => q.fiscalYear ?? q.fiscal_year)), [filteredData]);
  const maxYear = useMemo(() => Math.max(...filteredData.map(q => q.fiscalYear ?? q.fiscal_year)), [filteredData]);

  const cfData = useMemo(
    () => CASHFLOW_QUARTERS.filter(q => q.fiscal_year >= minYear && q.fiscal_year <= maxYear),
    [minYear, maxYear],
  );

  const annualCF = useMemo(() => computeAnnualCashflow(cfData), [cfData]);

  // ── Revenue lookups ──
  const revenueByPeriod = useMemo(() => {
    const map = {};
    for (const q of filteredData) map[q.period] = q.revenue;
    return map;
  }, [filteredData]);

  const revenueByYear = useMemo(() => {
    const map = {};
    for (const q of filteredData) {
      const yr = q.fiscalYear ?? q.fiscal_year;
      if (!map[yr]) map[yr] = 0;
      map[yr] += q.revenue;
    }
    return map;
  }, [filteredData]);

  // ── TTM KPI Computation ──
  const ttm = useMemo(() => {
    const last4 = cfData.slice(-4);
    const last4Rev = filteredData.slice(-4);
    const ttmOCF = last4.reduce((s, q) => s + q.operating_cash_flow, 0);
    const ttmFCF = last4.reduce((s, q) => s + q.free_cash_flow, 0);
    const ttmCapex = last4.reduce((s, q) => s + Math.abs(q.capex), 0);
    const ttmRev = last4Rev.reduce((s, q) => s + q.revenue, 0);
    const ttmFCFMargin = ttmRev > 0 ? (ttmFCF / ttmRev) * 100 : 0;
    const ttmReturns = last4.reduce((s, q) => s + Math.abs(q.stock_repurchases) + Math.abs(q.dividends_paid), 0);
    return { ttmOCF, ttmFCF, ttmCapex, ttmFCFMargin, ttmReturns };
  }, [cfData, filteredData]);

  // Sparklines — last 8 quarters
  const last8 = cfData.slice(-8);
  const sparkOCF = last8.map(q => q.operating_cash_flow / 1e9);
  const sparkFCF = last8.map(q => q.free_cash_flow / 1e9);
  const sparkCapex = last8.map(q => Math.abs(q.capex) / 1e9);
  const sparkFCFMargin = useMemo(() => {
    return last8.map(q => {
      const rev = revenueByPeriod[q.period];
      if (!rev) return null;
      return (q.free_cash_flow / rev) * 100;
    });
  }, [last8, revenueByPeriod]);
  const sparkReturns = last8.map(q => (Math.abs(q.stock_repurchases) + Math.abs(q.dividends_paid)) / 1e9);

  // ── Charts data ──
  const activeCF = periodMode === 'quarterly' ? cfData : annualCF;
  const xLabels = periodMode === 'quarterly'
    ? activeCF.map(q => q.period)
    : activeCF.map(q => String(q.fiscal_year));

  // Chart 1 — OCF / Capex / FCF
  const ocfChartData = {
    labels: xLabels,
    datasets: [
      {
        label: 'Operating Cash Flow', type: 'bar',
        data: activeCF.map(q => q.operating_cash_flow / 1e9),
        backgroundColor: '#C8A05080', hoverBackgroundColor: '#C8A050',
        borderColor: '#C8A050', borderWidth: 1, borderRadius: 2,
        yAxisID: 'y', order: 2,
      },
      {
        label: 'Capex (magnitude)', type: 'bar',
        data: activeCF.map(q => Math.abs(q.capex) / 1e9),
        backgroundColor: '#ef444480', hoverBackgroundColor: '#ef4444',
        borderColor: '#ef4444', borderWidth: 1, borderRadius: 2,
        yAxisID: 'y', order: 3,
      },
      {
        label: 'Free Cash Flow', type: 'line',
        data: activeCF.map(q => q.free_cash_flow / 1e9),
        borderColor: '#2DD4BF', backgroundColor: '#2DD4BF1A',
        borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 5,
        pointHoverBackgroundColor: '#2DD4BF', pointHoverBorderColor: '#0a0a0a',
        pointHoverBorderWidth: 2, tension: 0.2, fill: false,
        yAxisID: 'y1', order: 1,
      },
    ],
  };

  const ocfChartOptions = {
    responsive: true, maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: legendConfig,
      tooltip: {
        ...tooltipStyle,
        callbacks: {
          title: (items) => items[0].label,
          label: (item) => {
            const val = item.raw;
            if (item.dataset.label === 'Operating Cash Flow') return `OCF: $${val.toFixed(2)}B`;
            if (item.dataset.label === 'Capex (magnitude)') return `Capex: -$${val.toFixed(2)}B`;
            return `FCF: $${val.toFixed(2)}B`;
          },
          afterBody: (items) => {
            const idx = items[0].dataIndex;
            const q = activeCF[idx];
            const rev = periodMode === 'quarterly' ? revenueByPeriod[q.period] : revenueByYear[q.fiscal_year];
            if (!rev) return [];
            const margin = (q.free_cash_flow / rev) * 100;
            return [`FCF Margin: ${margin.toFixed(1)}%`];
          },
        },
      },
    },
    scales: {
      x: xAxisConfig,
      y: {
        position: 'left',
        title: { display: true, text: 'OCF / Capex ($B)', color: '#a3a3a3', font: { size: 12 } },
        ticks: { color: '#a3a3a3', font: { size: 11 }, callback: (val) => `$${val.toFixed(1)}B` },
        grid: { color: '#2a2a2a', drawBorder: false },
        suggestedMin: 0,
      },
      y1: {
        position: 'right',
        title: { display: true, text: 'FCF ($B)', color: '#a3a3a3', font: { size: 12 } },
        ticks: { color: '#a3a3a3', font: { size: 11 }, callback: (val) => `$${val.toFixed(1)}B` },
        grid: { drawOnChartArea: false },
      },
    },
  };

  // Chart 2 — Capital Allocation
  const allocChartData = {
    labels: xLabels,
    datasets: [
      {
        label: 'Capex', type: 'bar',
        data: activeCF.map(q => Math.abs(q.capex) / 1e9),
        backgroundColor: '#C8A05099', hoverBackgroundColor: '#C8A050',
        borderColor: '#C8A050', borderWidth: 1, borderRadius: 0,
        stack: 'alloc', yAxisID: 'y', order: 2,
      },
      {
        label: 'Dividends', type: 'bar',
        data: activeCF.map(q => Math.abs(q.dividends_paid) / 1e9),
        backgroundColor: '#2DD4BF99', hoverBackgroundColor: '#2DD4BF',
        borderColor: '#2DD4BF', borderWidth: 1, borderRadius: 0,
        stack: 'alloc', yAxisID: 'y', order: 2,
      },
      {
        label: 'Buybacks', type: 'bar',
        data: activeCF.map(q => Math.abs(q.stock_repurchases) / 1e9),
        backgroundColor: '#22c55e99', hoverBackgroundColor: '#22c55e',
        borderColor: '#22c55e', borderWidth: 1, borderRadius: 0,
        stack: 'alloc', yAxisID: 'y', order: 2,
      },
      {
        label: 'Total Shareholder Returns', type: 'line',
        data: activeCF.map(q => (Math.abs(q.stock_repurchases) + Math.abs(q.dividends_paid)) / 1e9),
        borderColor: '#f59e0b', backgroundColor: 'transparent',
        borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 5,
        pointHoverBackgroundColor: '#f59e0b', pointHoverBorderColor: '#0a0a0a',
        pointHoverBorderWidth: 2, tension: 0.2, fill: false,
        yAxisID: 'y1', order: 1,
      },
    ],
  };

  const allocChartOptions = {
    responsive: true, maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: legendConfig,
      tooltip: {
        ...tooltipStyle,
        callbacks: {
          title: (items) => items[0].label,
          label: (item) => `${item.dataset.label}: $${item.raw.toFixed(2)}B`,
          afterBody: (items) => {
            const barItems = items.filter(i => ['Capex', 'Dividends', 'Buybacks'].includes(i.dataset.label));
            const total = barItems.reduce((s, i) => s + i.raw, 0);
            return [`Total Capital Deployed: $${total.toFixed(2)}B`];
          },
        },
      },
    },
    scales: {
      x: xAxisConfig,
      y: {
        position: 'left',
        stacked: true,
        title: { display: true, text: 'Capital Deployed ($B)', color: '#a3a3a3', font: { size: 12 } },
        ticks: { color: '#a3a3a3', font: { size: 11 }, callback: (val) => `$${val.toFixed(1)}B` },
        grid: { color: '#2a2a2a', drawBorder: false },
        suggestedMin: 0,
      },
      y1: {
        position: 'right',
        title: { display: true, text: 'Shareholder Returns ($B)', color: '#a3a3a3', font: { size: 12 } },
        ticks: { color: '#a3a3a3', font: { size: 11 }, callback: (val) => `$${val.toFixed(1)}B` },
        grid: { drawOnChartArea: false },
      },
    },
  };

  // Chart 3 — Cash Conversion
  const conversionChartData = useMemo(() => {
    const datasets_data = activeCF.map(q => {
      const rev = periodMode === 'quarterly'
        ? revenueByPeriod[q.period]
        : revenueByYear[q.fiscal_year];
      if (!rev) return { ocfPct: null, fcfPct: null };
      return {
        ocfPct: (q.operating_cash_flow / rev) * 100,
        fcfPct: (q.free_cash_flow / rev) * 100,
      };
    });
    return {
      labels: xLabels,
      datasets: [
        {
          label: 'OCF / Revenue %',
          data: datasets_data.map(d => d.ocfPct),
          borderColor: '#C8A050', backgroundColor: '#C8A05020',
          borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 5,
          pointHoverBackgroundColor: '#C8A050', pointHoverBorderColor: '#0a0a0a',
          pointHoverBorderWidth: 2, tension: 0.2, fill: false, spanGaps: true,
        },
        {
          label: 'FCF / Revenue %',
          data: datasets_data.map(d => d.fcfPct),
          borderColor: '#2DD4BF', backgroundColor: '#2DD4BF20',
          borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 5,
          pointHoverBackgroundColor: '#2DD4BF', pointHoverBorderColor: '#0a0a0a',
          pointHoverBorderWidth: 2, tension: 0.2, fill: false, spanGaps: true,
        },
      ],
    };
  }, [activeCF, periodMode, revenueByPeriod, revenueByYear, xLabels]);

  const conversionChartOptions = {
    responsive: true, maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: legendConfig,
      tooltip: {
        ...tooltipStyle,
        callbacks: {
          title: (items) => items[0].label,
          label: (item) => item.raw == null ? '' : `${item.dataset.label}: ${item.raw.toFixed(1)}%`,
        },
      },
      annotation: {
        annotations: {
          zeroLine: {
            type: 'line', yMin: 0, yMax: 0,
            borderColor: '#a3a3a380', borderWidth: 1, borderDash: [6, 4],
          },
        },
      },
    },
    scales: {
      x: xAxisConfig,
      y: {
        title: { display: true, text: 'Cash Conversion (% of Revenue)', color: '#a3a3a3', font: { size: 12 } },
        ticks: {
          color: '#a3a3a3', font: { size: 11 },
          callback: (val) => `${val.toFixed(0)}%`,
        },
        grid: { color: '#2a2a2a', drawBorder: false },
      },
    },
  };

  // ── D&A Charts ──
  const daActive = daPerMode === 'quarterly' ? cfData : annualCF;
  const daXLabels = daPerMode === 'quarterly'
    ? daActive.map(q => q.period)
    : daActive.map(q => String(q.fiscal_year));

  const daChartData = useMemo(() => {
    return {
      labels: daXLabels,
      datasets: [
        {
          label: 'D&A ($B)', type: 'bar',
          data: daActive.map(q => q.depreciation_amortization / 1e9),
          backgroundColor: '#C8A05060', hoverBackgroundColor: '#C8A050aa',
          borderColor: '#C8A05080', borderWidth: 1, borderRadius: 2,
          yAxisID: 'y', order: 2,
        },
        {
          label: 'D&A % of Revenue', type: 'line',
          data: daActive.map(q => {
            const rev = daPerMode === 'quarterly' ? revenueByPeriod[q.period] : revenueByYear[q.fiscal_year];
            if (!rev) return null;
            return (q.depreciation_amortization / rev) * 100;
          }),
          borderColor: '#2DD4BF', backgroundColor: 'transparent',
          borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 4,
          pointHoverBackgroundColor: '#2DD4BF', pointHoverBorderColor: '#0a0a0a',
          pointHoverBorderWidth: 2, tension: 0.2, fill: false, spanGaps: true,
          yAxisID: 'y1', order: 1,
        },
      ],
    };
  }, [daActive, daPerMode, revenueByPeriod, revenueByYear, daXLabels]);

  const daChartOptions = {
    responsive: true, maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: legendConfig,
      tooltip: {
        ...tooltipStyle,
        callbacks: {
          title: (items) => items[0].label,
          label: (item) => {
            if (item.dataset.label === 'D&A ($B)') return `D&A: $${(item.raw * 1000).toFixed(0)}M`;
            if (item.raw == null) return '';
            return `D&A % Revenue: ${item.raw.toFixed(2)}%`;
          },
        },
      },
    },
    scales: {
      x: {
        ...xAxisConfig,
        ticks: {
          ...xAxisConfig.ticks,
          callback: function (value) {
            const label = this.getLabelForValue(value);
            if (!label.includes('-')) return label;
            return label.endsWith('Q1') ? label.replace('-Q1', '') : '';
          },
        },
      },
      y: {
        position: 'left',
        title: { display: true, text: 'D&A ($B)', color: '#a3a3a3', font: { size: 12 } },
        ticks: { color: '#a3a3a3', font: { size: 11 }, callback: (val) => `$${val.toFixed(2)}B` },
        grid: { color: '#2a2a2a', drawBorder: false },
        suggestedMin: 0,
      },
      y1: {
        position: 'right',
        title: { display: true, text: 'D&A % Revenue', color: '#a3a3a3', font: { size: 12 } },
        ticks: { color: '#a3a3a3', font: { size: 11 }, callback: (val) => `${val.toFixed(1)}%` },
        grid: { drawOnChartArea: false },
      },
    },
  };

  // Cash position chart (always quarterly)
  const cashChartData = {
    labels: cfData.map(q => q.period),
    datasets: [
      {
        label: 'Cash & Equivalents',
        data: cfData.map(q => q.cash_end_of_period / 1e9),
        borderColor: '#C8A050',
        backgroundColor: '#C8A05025',
        borderWidth: 2.5,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#C8A050',
        pointHoverBorderColor: '#0a0a0a',
        pointHoverBorderWidth: 2,
        tension: 0.3,
        fill: true,
        spanGaps: true,
      },
    ],
  };

  const cashChartOptions = {
    responsive: true, maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        ...tooltipStyle,
        callbacks: {
          title: (items) => items[0].label,
          label: (item) => `Cash: $${item.raw.toFixed(2)}B`,
        },
      },
    },
    scales: {
      x: {
        ...xAxisConfig,
        ticks: {
          ...xAxisConfig.ticks,
          callback: function (value) {
            const label = this.getLabelForValue(value);
            return label.endsWith('Q1') ? label.replace('-Q1', '') : '';
          },
        },
      },
      y: {
        title: { display: true, text: 'Cash ($B)', color: '#a3a3a3', font: { size: 12 } },
        ticks: { color: '#a3a3a3', font: { size: 11 }, callback: (val) => `$${val.toFixed(1)}B` },
        grid: { color: '#2a2a2a', drawBorder: false },
        suggestedMin: 0,
      },
    },
  };

  // ── Data Table ──
  const tableData = useMemo(() => {
    return cfData.map(q => {
      const rev = revenueByPeriod[q.period];
      const fcfMargin = rev ? (q.free_cash_flow / rev) * 100 : null;
      return {
        period: q.period,
        ocf: q.operating_cash_flow,
        capex: q.capex,
        fcf: q.free_cash_flow,
        fcfMargin,
        da: q.depreciation_amortization,
        buybacks: q.stock_repurchases,
        dividends: q.dividends_paid,
        cash: q.cash_end_of_period,
      };
    });
  }, [cfData, revenueByPeriod]);

  const sortedTable = useMemo(() => {
    return [...tableData].sort((a, b) => {
      let av = a[sortCol], bv = b[sortCol];
      if (sortCol === 'period') { av = av ?? ''; bv = bv ?? ''; }
      else { av = av ?? 0; bv = bv ?? 0; }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [tableData, sortCol, sortDir]);

  function handleSort(col) {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  }

  function fmtM(v) {
    if (v == null) return '—';
    return `$${(v / 1e6).toFixed(0)}M`;
  }

  function fmtMSigned(v) {
    if (v == null) return '—';
    const sign = v >= 0 ? '' : '-';
    return `${sign}$${(Math.abs(v) / 1e6).toFixed(0)}M`;
  }

  const thStyle = (col) => ({
    padding: '10px 12px', fontSize: '0.75rem', fontWeight: 600,
    color: sortCol === col ? '#C8A050' : '#a3a3a3',
    textTransform: 'uppercase', letterSpacing: '0.04em',
    textAlign: 'right', cursor: 'pointer', whiteSpace: 'nowrap',
    borderBottom: '1px solid #2a2a2a', background: '#141414',
    userSelect: 'none',
  });

  const tdStyle = { padding: '8px 12px', fontSize: '0.8125rem', color: '#a3a3a3', textAlign: 'right', borderBottom: '1px solid #1e1e1e' };

  const cardStyle = {
    background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 12, padding: 24,
  };

  return (
    <div>
      {/* ── KPI Strip ── */}
      <div className="cf-kpi-grid" style={{ display: 'grid', gap: 24, marginBottom: 32 }}>
        <KPICard
          label="OPERATING CASH FLOW"
          value={formatBillions(ttm.ttmOCF)}
          trendValue={null}
          trendDirection="neutral"
          sparklineData={sparkOCF}
          sparklineColor="#C8A050"
          sublabel="TTM"
        />
        <KPICard
          label="FREE CASH FLOW"
          value={formatBillions(ttm.ttmFCF)}
          trendValue={null}
          trendDirection="neutral"
          sparklineData={sparkFCF}
          sparklineColor="#2DD4BF"
          sublabel="TTM"
        />
        <KPICard
          label="CAPEX"
          value={formatBillions(ttm.ttmCapex)}
          trendValue={null}
          trendDirection="neutral"
          sparklineData={sparkCapex}
          sparklineColor="#ef4444"
          sublabel="TTM"
        />
        <KPICard
          label="FCF MARGIN"
          value={formatPercent(ttm.ttmFCFMargin)}
          trendValue={null}
          trendDirection="neutral"
          sparklineData={sparkFCFMargin.filter(v => v != null)}
          sparklineColor="#2DD4BF"
          sublabel="TTM FCF / Revenue"
        />
        <KPICard
          label="SHAREHOLDER RETURNS"
          value={formatBillions(ttm.ttmReturns)}
          trendValue={null}
          trendDirection="neutral"
          sparklineData={sparkReturns}
          sparklineColor="#22c55e"
          sublabel="TTM buybacks + dividends"
        />
      </div>

      {/* ── Main Chart (OCF/FCF, Capital Allocation, Cash Conversion) ── */}
      <div style={{ ...cardStyle, marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#e5e5e5', margin: 0 }}>
            {chartView === VIEW_OCF && 'Operating Cash Flow & Free Cash Flow'}
            {chartView === VIEW_ALLOC && 'Capital Allocation'}
            {chartView === VIEW_CONVERSION && 'Cash Conversion'}
          </h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setPeriodMode('quarterly')} style={periodMode === 'quarterly' ? btnActive : btnBase}>Quarterly</button>
            <button onClick={() => setPeriodMode('annual')} style={periodMode === 'annual' ? btnActive : btnBase}>Annual</button>
          </div>
        </div>

        {/* View toggles */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <button onClick={() => setChartView(VIEW_OCF)} style={chartView === VIEW_OCF ? btnActive : btnBase}>OCF / FCF</button>
          <button onClick={() => setChartView(VIEW_ALLOC)} style={chartView === VIEW_ALLOC ? btnActive : btnBase}>Capital Allocation</button>
          <button onClick={() => setChartView(VIEW_CONVERSION)} style={chartView === VIEW_CONVERSION ? btnActive : btnBase}>Cash Conversion</button>
        </div>

        <div style={{ height: 380 }}>
          {chartView === VIEW_OCF && <Chart type="bar" data={ocfChartData} options={ocfChartOptions} />}
          {chartView === VIEW_ALLOC && <Chart type="bar" data={allocChartData} options={allocChartOptions} />}
          {chartView === VIEW_CONVERSION && <Line data={conversionChartData} options={conversionChartOptions} />}
        </div>
      </div>

      {/* ── D&A & Cash Position row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }} className="cf-two-col">
        {/* D&A Trend */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#e5e5e5', margin: 0 }}>Depreciation & Amortization</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setDaPerMode('quarterly')} style={daPerMode === 'quarterly' ? btnActive : btnBase}>Q</button>
              <button onClick={() => setDaPerMode('annual')} style={daPerMode === 'annual' ? btnActive : btnBase}>A</button>
            </div>
          </div>
          <div style={{ height: 280 }}>
            <Chart type="bar" data={daChartData} options={daChartOptions} />
          </div>
        </div>

        {/* Cash Position */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#e5e5e5', margin: '0 0 16px' }}>Cash & Equivalents</h2>
          <div style={{ height: 280 }}>
            <Line data={cashChartData} options={cashChartOptions} />
          </div>
        </div>
      </div>

      {/* ── Raw Data Table ── */}
      <div style={cardStyle}>
        <button
          onClick={() => setTableOpen(o => !o)}
          style={{
            ...btnBase,
            fontSize: '0.875rem', padding: '8px 16px',
            color: tableOpen ? '#C8A050' : '#a3a3a3',
            borderColor: tableOpen ? '#C8A050' : '#2a2a2a',
          }}
        >
          {tableOpen ? 'Hide Raw Data ▴' : 'View Raw Data ▾'}
        </button>

        {tableOpen && (
          <div style={{ overflowX: 'auto', marginTop: 16 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
              <thead>
                <tr>
                  {[
                    { col: 'period', label: 'Quarter' },
                    { col: 'ocf', label: 'OCF' },
                    { col: 'capex', label: 'Capex' },
                    { col: 'fcf', label: 'FCF' },
                    { col: 'fcfMargin', label: 'FCF Margin' },
                    { col: 'da', label: 'D&A' },
                    { col: 'buybacks', label: 'Buybacks' },
                    { col: 'dividends', label: 'Dividends' },
                    { col: 'cash', label: 'Cash Balance' },
                  ].map(({ col, label }) => (
                    <th key={col} style={{ ...thStyle(col), textAlign: col === 'period' ? 'left' : 'right' }}
                      onClick={() => handleSort(col)}>
                      {label} {sortCol === col ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedTable.map(row => (
                  <tr key={row.period} style={{ transition: 'background 100ms' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#222'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ ...tdStyle, textAlign: 'left', color: '#e5e5e5', fontWeight: 500 }}>{row.period}</td>
                    <td style={tdStyle}>{fmtM(row.ocf)}</td>
                    <td style={tdStyle}>{fmtMSigned(row.capex)}</td>
                    <td style={{ ...tdStyle, color: row.fcf >= 0 ? '#22c55e' : '#ef4444' }}>{fmtM(row.fcf)}</td>
                    <td style={tdStyle}>{row.fcfMargin != null ? `${row.fcfMargin.toFixed(1)}%` : '—'}</td>
                    <td style={tdStyle}>{fmtM(row.da)}</td>
                    <td style={tdStyle}>{fmtMSigned(row.buybacks)}</td>
                    <td style={tdStyle}>{fmtMSigned(row.dividends)}</td>
                    <td style={tdStyle}>{fmtM(row.cash)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .cf-kpi-grid { grid-template-columns: repeat(5, 1fr); }
        @media (max-width: 1199px) {
          .cf-kpi-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 767px) {
          .cf-kpi-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .cf-two-col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
