'use client';

import { useState } from 'react';
import { Chart } from 'react-chartjs-2';
import { setupCharts } from '../ChartSetup';
import { buildChartAnnotations } from '../../../lib/publix-financials';

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

export default function RevenueIncomeChart({ data }) {
  const [mode, setMode] = useState('absolute');

  const xLabels = data.map(q => q.period);
  const annotations = buildChartAnnotations(data);

  // Zero-line annotation for growth mode
  const zeroLine = {
    type: 'line', yMin: 0, yMax: 0,
    borderColor: '#a3a3a380', borderWidth: 1, borderDash: [6, 4],
  };

  const absoluteData = {
    labels: xLabels,
    datasets: [
      {
        label: 'Revenue', type: 'bar',
        data: data.map(q => q.revenue / 1e9),
        backgroundColor: '#C8A05080', hoverBackgroundColor: '#C8A050',
        borderColor: '#C8A050', borderWidth: 1, borderRadius: 2,
        yAxisID: 'y', order: 2,
      },
      {
        label: 'Net Income', type: 'line',
        data: data.map(q => q.netIncome / 1e9),
        borderColor: '#2DD4BF', backgroundColor: '#2DD4BF1A',
        borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 5,
        pointHoverBackgroundColor: '#2DD4BF', pointHoverBorderColor: '#0a0a0a',
        pointHoverBorderWidth: 2, tension: 0.2, fill: false,
        yAxisID: 'y1', order: 1,
      },
    ],
  };

  const growthData = {
    labels: xLabels,
    datasets: [
      {
        label: 'Revenue YoY Growth %',
        data: data.map(q => q.yoyRevenueGrowth),
        borderColor: '#C8A050', borderWidth: 2, pointRadius: 0,
        pointHoverRadius: 4, tension: 0.2, spanGaps: true,
      },
      {
        label: 'Net Income YoY Growth %',
        data: data.map(q => q.yoyNetIncomeGrowth),
        borderColor: '#2DD4BF', borderWidth: 2, pointRadius: 0,
        pointHoverRadius: 4, tension: 0.2, spanGaps: true,
      },
    ],
  };

  const xAxis = {
    ticks: {
      color: '#a3a3a3', font: { size: 11 }, maxRotation: 45,
      callback: function (value) {
        const label = this.getLabelForValue(value);
        return label.endsWith('Q1') ? label.replace('-Q1', '') : '';
      },
    },
    grid: { display: false },
  };

  const absoluteOptions = {
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
        ...tooltipStyle,
        callbacks: {
          title: (items) => items[0].label,
          label: (item) => {
            if (item.datasetIndex === 0) return `Revenue: $${item.raw.toFixed(1)}B`;
            return `Net Income: $${item.raw.toFixed(2)}B`;
          },
          afterBody: (items) => {
            const idx = items[0].dataIndex;
            const quarter = data[idx];
            if (quarter.yoyRevenueGrowth != null) {
              return `YoY Revenue: ${quarter.yoyRevenueGrowth > 0 ? '+' : ''}${quarter.yoyRevenueGrowth.toFixed(1)}%`;
            }
            return '';
          },
        },
      },
      annotation: { annotations },
    },
    scales: {
      x: xAxis,
      y: {
        position: 'left',
        title: { display: true, text: 'Revenue ($B)', color: '#a3a3a3', font: { size: 12 } },
        ticks: { color: '#a3a3a3', font: { size: 11 }, callback: (val) => `$${val}B` },
        grid: { color: '#2a2a2a', drawBorder: false },
        beginAtZero: false, suggestedMin: 6,
      },
      y1: {
        position: 'right',
        title: { display: true, text: 'Net Income ($B)', color: '#a3a3a3', font: { size: 12 } },
        ticks: { color: '#a3a3a3', font: { size: 11 }, callback: (val) => `$${val.toFixed(1)}B` },
        grid: { drawOnChartArea: false },
      },
    },
  };

  const growthOptions = {
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
        ...tooltipStyle,
        callbacks: {
          label: (item) => {
            if (item.raw == null) return '';
            const sign = item.raw >= 0 ? '+' : '';
            return `${item.dataset.label}: ${sign}${item.raw.toFixed(1)}%`;
          },
        },
      },
      annotation: { annotations: { zeroLine } },
    },
    scales: {
      x: xAxis,
      y: {
        title: { display: true, text: 'YoY Growth %', color: '#a3a3a3', font: { size: 12 } },
        ticks: {
          color: '#a3a3a3', font: { size: 11 },
          callback: (val) => { const sign = val >= 0 ? '+' : ''; return `${sign}${val.toFixed(0)}%`; },
        },
        grid: { color: '#2a2a2a', drawBorder: false },
      },
    },
  };

  return (
    <div style={{
      background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 12, padding: 24,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#e5e5e5', margin: 0 }}>
          Revenue & Net Income
        </h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setMode('absolute')} style={mode === 'absolute' ? btnActive : btnBase}>
            Absolute
          </button>
          <button onClick={() => setMode('growth')} style={mode === 'growth' ? btnActive : btnBase}>
            YoY Growth %
          </button>
        </div>
      </div>
      <div style={{ height: 400 }}>
        {mode === 'absolute' ? (
          <Chart type="bar" data={absoluteData} options={absoluteOptions} />
        ) : (
          <Chart type="line" data={growthData} options={growthOptions} />
        )}
      </div>
    </div>
  );
}
