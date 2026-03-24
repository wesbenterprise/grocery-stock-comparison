'use client';

import { useState, useMemo } from 'react';
import { Chart } from 'react-chartjs-2';
import { Bar, Line } from 'react-chartjs-2';
import { setupCharts } from '../ChartSetup';
import { CASHFLOW_QUARTERS, computeAnnualCashflow } from '../../../lib/publix-cashflow';

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
      // For annual mode labels are just years, always show
      if (!label.includes('-')) return label;
      return label.endsWith('Q1') ? label.replace('-Q1', '') : '';
    },
  },
  grid: { display: false },
};

const yAxisConfig = (title) => ({
  title: { display: true, text: title, color: '#a3a3a3', font: { size: 12 } },
  ticks: { color: '#a3a3a3', font: { size: 11 }, callback: (val) => `$${val.toFixed(1)}B` },
  grid: { color: '#2a2a2a', drawBorder: false },
  suggestedMin: 0,
});

const yAxisPercentConfig = (title) => ({
  title: { display: true, text: title, color: '#a3a3a3', font: { size: 12 } },
  ticks: {
    color: '#a3a3a3', font: { size: 11 },
    callback: (val) => { const sign = val >= 0 ? '' : ''; return `${sign}${val.toFixed(1)}%`; },
  },
  grid: { color: '#2a2a2a', drawBorder: false },
  suggestedMin: 0,
});

const legendConfig = {
  display: true, position: 'top', align: 'end',
  labels: {
    color: '#a3a3a3', font: { size: 12 }, boxWidth: 12, boxHeight: 12,
    borderRadius: 2, useBorderRadius: true, padding: 16,
  },
};

const interactionConfig = { mode: 'index', intersect: false };

// VIEW NAMES
const VIEW_OCF = 'ocf';
const VIEW_ALLOC = 'alloc';
const VIEW_CONVERSION = 'conversion';

export default function CashFlowChart({ data }) {
  const [chartView, setChartView] = useState(VIEW_OCF);
  const [periodMode, setPeriodMode] = useState('quarterly');

  // Derive year range from the income statement data prop
  const { minYear, maxYear } = useMemo(() => {
    if (!data || data.length === 0) return { minYear: 2015, maxYear: 2025 };
    const years = data.map(q => q.fiscal_year);
    return { minYear: Math.min(...years), maxYear: Math.max(...years) };
  }, [data]);

  // Filter cashflow quarters to match the visible year range
  const filteredCF = useMemo(
    () => CASHFLOW_QUARTERS.filter(q => q.fiscal_year >= minYear && q.fiscal_year <= maxYear),
    [minYear, maxYear],
  );

  // Annual aggregation
  const annualCF = useMemo(() => computeAnnualCashflow(filteredCF), [filteredCF]);

  // Pick dataset depending on period toggle
  const cfData = periodMode === 'quarterly' ? filteredCF : annualCF;
  const xLabels = periodMode === 'quarterly'
    ? cfData.map(q => q.period)
    : cfData.map(q => String(q.fiscal_year));

  // ── Revenue lookup map for cash conversion ratios (from income stmt data) ──
  const revenueByPeriod = useMemo(() => {
    const map = {};
    for (const q of data) map[q.period] = q.revenue;
    return map;
  }, [data]);

  const revenueByYear = useMemo(() => {
    const map = {};
    for (const q of data) {
      if (!map[q.fiscal_year]) map[q.fiscal_year] = 0;
      map[q.fiscal_year] += q.revenue;
    }
    return map;
  }, [data]);

  // ─────────────────────────────────────────────
  // CHART 1 — OCF / Capex / FCF
  // ─────────────────────────────────────────────
  const ocfChartData = {
    labels: xLabels,
    datasets: [
      {
        label: 'Operating Cash Flow',
        type: 'bar',
        data: cfData.map(q => q.operating_cash_flow / 1e9),
        backgroundColor: '#C8A05080',
        hoverBackgroundColor: '#C8A050',
        borderColor: '#C8A050',
        borderWidth: 1,
        borderRadius: 2,
        yAxisID: 'y',
        order: 2,
      },
      {
        label: 'Capex (magnitude)',
        type: 'bar',
        data: cfData.map(q => Math.abs(q.capex) / 1e9),
        backgroundColor: '#ef444480',
        hoverBackgroundColor: '#ef4444',
        borderColor: '#ef4444',
        borderWidth: 1,
        borderRadius: 2,
        yAxisID: 'y',
        order: 3,
      },
      {
        label: 'Free Cash Flow',
        type: 'line',
        data: cfData.map(q => q.free_cash_flow / 1e9),
        borderColor: '#2DD4BF',
        backgroundColor: '#2DD4BF1A',
        borderWidth: 2.5,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#2DD4BF',
        pointHoverBorderColor: '#0a0a0a',
        pointHoverBorderWidth: 2,
        tension: 0.2,
        fill: false,
        yAxisID: 'y',
        order: 1,
      },
    ],
  };

  const ocfChartOptions = {
    responsive: true, maintainAspectRatio: false,
    interaction: interactionConfig,
    plugins: {
      legend: legendConfig,
      tooltip: {
        ...tooltipStyle,
        callbacks: {
          title: (items) => items[0].label,
          label: (item) => {
            const val = item.raw;
            if (item.dataset.label === 'Operating Cash Flow') return `OCF: $${val.toFixed(2)}B`;
            if (item.dataset.label === 'Capex (magnitude)') return `Capex: $${val.toFixed(2)}B`;
            return `FCF: $${val.toFixed(2)}B`;
          },
        },
      },
    },
    scales: {
      x: xAxisConfig,
      y: yAxisConfig('Cash Flow ($B)'),
    },
  };

  // ─────────────────────────────────────────────
  // CHART 2 — Capital Allocation stacked bar
  // ─────────────────────────────────────────────
  const allocChartData = {
    labels: xLabels,
    datasets: [
      {
        label: 'Capex',
        data: cfData.map(q => Math.abs(q.capex) / 1e9),
        backgroundColor: '#C8A05099',
        hoverBackgroundColor: '#C8A050',
        borderColor: '#C8A050',
        borderWidth: 1,
        borderRadius: 0,
        stack: 'alloc',
      },
      {
        label: 'Dividends',
        data: cfData.map(q => Math.abs(q.dividends_paid) / 1e9),
        backgroundColor: '#2DD4BF99',
        hoverBackgroundColor: '#2DD4BF',
        borderColor: '#2DD4BF',
        borderWidth: 1,
        borderRadius: 0,
        stack: 'alloc',
      },
      {
        label: 'Stock Buybacks',
        data: cfData.map(q => Math.abs(q.stock_repurchases) / 1e9),
        backgroundColor: '#22c55e99',
        hoverBackgroundColor: '#22c55e',
        borderColor: '#22c55e',
        borderWidth: 1,
        borderRadius: 0,
        stack: 'alloc',
      },
    ],
  };

  const allocChartOptions = {
    responsive: true, maintainAspectRatio: false,
    interaction: interactionConfig,
    plugins: {
      legend: legendConfig,
      tooltip: {
        ...tooltipStyle,
        callbacks: {
          title: (items) => items[0].label,
          label: (item) => `${item.dataset.label}: $${item.raw.toFixed(2)}B`,
          afterBody: (items) => {
            const total = items.reduce((sum, i) => sum + i.raw, 0);
            return [`Total Deployed: $${total.toFixed(2)}B`];
          },
        },
      },
    },
    scales: {
      x: xAxisConfig,
      y: {
        ...yAxisConfig('Capital Deployed ($B)'),
        stacked: true,
      },
    },
  };

  // ─────────────────────────────────────────────
  // CHART 3 — Cash Conversion %
  // ─────────────────────────────────────────────
  const conversionData = useMemo(() => {
    return cfData.map((q, i) => {
      const rev = periodMode === 'quarterly'
        ? revenueByPeriod[q.period]
        : revenueByYear[q.fiscal_year];
      if (!rev || rev === 0) return { ocfPct: null, fcfPct: null };
      return {
        ocfPct: (q.operating_cash_flow / rev) * 100,
        fcfPct: (q.free_cash_flow / rev) * 100,
      };
    });
  }, [cfData, periodMode, revenueByPeriod, revenueByYear]);

  const conversionChartData = {
    labels: xLabels,
    datasets: [
      {
        label: 'OCF / Revenue %',
        data: conversionData.map(d => d.ocfPct),
        borderColor: '#C8A050',
        backgroundColor: '#C8A05020',
        borderWidth: 2.5,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#C8A050',
        pointHoverBorderColor: '#0a0a0a',
        pointHoverBorderWidth: 2,
        tension: 0.2,
        fill: false,
        spanGaps: true,
      },
      {
        label: 'FCF / Revenue %',
        data: conversionData.map(d => d.fcfPct),
        borderColor: '#2DD4BF',
        backgroundColor: '#2DD4BF20',
        borderWidth: 2.5,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#2DD4BF',
        pointHoverBorderColor: '#0a0a0a',
        pointHoverBorderWidth: 2,
        tension: 0.2,
        fill: false,
        spanGaps: true,
      },
    ],
  };

  const conversionChartOptions = {
    responsive: true, maintainAspectRatio: false,
    interaction: interactionConfig,
    plugins: {
      legend: legendConfig,
      tooltip: {
        ...tooltipStyle,
        callbacks: {
          title: (items) => items[0].label,
          label: (item) => {
            if (item.raw == null) return '';
            return `${item.dataset.label}: ${item.raw.toFixed(1)}%`;
          },
        },
      },
    },
    scales: {
      x: xAxisConfig,
      y: yAxisPercentConfig('Cash Conversion (% of Revenue)'),
    },
  };

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  const chartTitles = {
    [VIEW_OCF]: 'OCF / Capex / Free Cash Flow',
    [VIEW_ALLOC]: 'Capital Allocation',
    [VIEW_CONVERSION]: 'Cash Conversion',
  };

  return (
    <div style={{
      background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 12, padding: 24,
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#e5e5e5', margin: 0 }}>
          Cash Flow Analysis
        </h2>
        {/* Period toggle */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setPeriodMode('quarterly')} style={periodMode === 'quarterly' ? btnActive : btnBase}>
            Quarterly
          </button>
          <button onClick={() => setPeriodMode('annual')} style={periodMode === 'annual' ? btnActive : btnBase}>
            Annual
          </button>
        </div>
      </div>

      {/* Chart view toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button onClick={() => setChartView(VIEW_OCF)} style={chartView === VIEW_OCF ? btnActive : btnBase}>
          OCF / Capex / FCF
        </button>
        <button onClick={() => setChartView(VIEW_ALLOC)} style={chartView === VIEW_ALLOC ? btnActive : btnBase}>
          Capital Allocation
        </button>
        <button onClick={() => setChartView(VIEW_CONVERSION)} style={chartView === VIEW_CONVERSION ? btnActive : btnBase}>
          Cash Conversion
        </button>
      </div>

      {/* Chart */}
      <div style={{ height: 400 }}>
        {chartView === VIEW_OCF && (
          <Chart type="bar" data={ocfChartData} options={ocfChartOptions} />
        )}
        {chartView === VIEW_ALLOC && (
          <Bar data={allocChartData} options={allocChartOptions} />
        )}
        {chartView === VIEW_CONVERSION && (
          <Line data={conversionChartData} options={conversionChartOptions} />
        )}
      </div>

      {/* Subtitle */}
      <p style={{ fontSize: '0.75rem', color: '#a3a3a360', margin: '12px 0 0', textAlign: 'right' }}>
        Source: SEC EDGAR · Publix 10-K / 10-Q filings
      </p>
    </div>
  );
}
