'use client';

import { Line } from 'react-chartjs-2';
import { setupCharts } from '../ChartSetup';

setupCharts();

export default function BalanceSheetChart({ data }) {
  const asc842Idx = data.findIndex(q => q.period === '2019-Q1');
  const annotations = {};
  if (asc842Idx >= 0) {
    annotations.asc842 = {
      type: 'line', xMin: asc842Idx, xMax: asc842Idx,
      borderColor: '#ef444460', borderWidth: 1.5, borderDash: [6, 3],
      label: {
        display: true, content: 'ASC 842 Adoption', position: 'start',
        color: '#ef4444', font: { size: 10, weight: 500 },
        backgroundColor: '#0a0a0aCC', padding: 4,
      },
    };
  }

  const chartData = {
    labels: data.map(q => q.period),
    datasets: [
      {
        label: 'Total Assets',
        data: data.map(q => q.totalAssets / 1e9),
        borderColor: '#C8A050', backgroundColor: '#C8A05020',
        borderWidth: 2, pointRadius: 0, pointHoverRadius: 4,
        tension: 0.3, fill: true, order: 3,
      },
      {
        label: 'Total Liabilities',
        data: data.map(q => q.totalLiabilities / 1e9),
        borderColor: '#ef4444', backgroundColor: '#ef444420',
        borderWidth: 2, pointRadius: 0, pointHoverRadius: 4,
        tension: 0.3, fill: true, order: 2,
      },
      {
        label: "Stockholders' Equity",
        data: data.map(q => q.stockholdersEquity / 1e9),
        borderColor: '#22c55e', backgroundColor: '#22c55e20',
        borderWidth: 2, pointRadius: 0, pointHoverRadius: 4,
        tension: 0.3, fill: true, order: 1,
      },
    ],
  };

  const options = {
    responsive: true, maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        display: true, position: 'top', align: 'end',
        labels: {
          color: '#a3a3a3', font: { size: 12 }, boxWidth: 12, boxHeight: 12,
          borderRadius: 2, useBorderRadius: true, padding: 16,
        },
      },
      tooltip: {
        backgroundColor: '#1a1a1a', borderColor: '#2a2a2a', borderWidth: 1,
        titleColor: '#e5e5e5', bodyColor: '#a3a3a3', padding: 12, cornerRadius: 8,
        callbacks: { label: (item) => `${item.dataset.label}: $${item.raw.toFixed(1)}B` },
      },
      annotation: { annotations },
    },
    scales: {
      x: {
        ticks: {
          color: '#a3a3a3', font: { size: 11 }, maxRotation: 45,
          callback: function (value) {
            const label = this.getLabelForValue(value);
            return label.endsWith('Q1') ? label.replace('-Q1', '') : '';
          },
        },
        grid: { display: false },
      },
      y: {
        title: { display: true, text: 'USD ($B)', color: '#a3a3a3', font: { size: 12 } },
        ticks: { color: '#a3a3a3', font: { size: 11 }, callback: (val) => `$${val}B` },
        grid: { color: '#2a2a2a', drawBorder: false },
        suggestedMin: 0, suggestedMax: 45,
      },
    },
  };

  return (
    <div style={{
      background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 12, padding: 24,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#e5e5e5', margin: 0 }}>
          Balance Sheet Overview
        </h2>
        <span style={{
          background: '#22c55e15', color: '#22c55e', borderRadius: 9999,
          padding: '4px 12px', fontSize: '0.75rem', fontWeight: 600,
        }}>
          +10.3% Equity CAGR (2015–2025)
        </span>
      </div>
      <div style={{ height: 350 }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
