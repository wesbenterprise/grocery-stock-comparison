'use client';

import {
  Chart as ChartJS, CategoryScale, LinearScale, LineElement,
  PointElement, Filler, Tooltip, Legend,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Filler, Tooltip, Legend, annotationPlugin);

export default function RevenuePerStoreChart({ data }) {
  const covidIdx = data.findIndex(q => q.period === '2020-Q1');

  const annotations = {};
  if (covidIdx >= 0) {
    annotations.covidFloorReset = {
      type: 'line', xMin: covidIdx, xMax: covidIdx,
      borderColor: '#ef444460', borderWidth: 1.5, borderDash: [6, 3],
      label: {
        display: true, content: 'COVID Floor Reset', position: 'start',
        color: '#ef4444', font: { size: 10, weight: 500 },
        backgroundColor: '#0a0a0aCC', padding: 4,
      },
    };
  }

  const chartData = {
    labels: data.map(q => q.period),
    datasets: [{
      label: 'Revenue Per Store ($M)',
      data: data.map(q => q.revenuePerStore / 1e6),
      borderColor: '#C8A050', borderWidth: 2.5, pointRadius: 0,
      pointHoverRadius: 5, pointHoverBackgroundColor: '#C8A050',
      tension: 0.3, fill: { target: 'origin', above: '#C8A05015' },
    }],
  };

  const options = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1a1a1a', borderColor: '#2a2a2a', borderWidth: 1,
        titleColor: '#e5e5e5', bodyColor: '#a3a3a3', padding: 12, cornerRadius: 8,
        callbacks: { label: (item) => `$${item.raw.toFixed(2)}M per store` },
      },
      annotation: { annotations },
    },
    scales: {
      x: {
        ticks: {
          color: '#a3a3a3', font: { size: 10 }, maxRotation: 45,
          callback: function (value) {
            const label = this.getLabelForValue(value);
            return label.endsWith('Q1') ? label.replace('-Q1', '') : '';
          },
        },
        grid: { display: false },
      },
      y: {
        title: { display: true, text: '$/Store ($M)', color: '#a3a3a3', font: { size: 11 } },
        ticks: { color: '#a3a3a3', font: { size: 11 }, callback: (val) => `$${val}M` },
        grid: { color: '#2a2a2a', drawBorder: false },
        suggestedMin: 6,
      },
    },
  };

  return (
    <div style={{
      background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 12, padding: 24,
    }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#e5e5e5', margin: '0 0 16px 0' }}>
        Revenue Per Store
      </h2>
      <div style={{ height: 300 }}>
        <Line data={chartData} options={options} />
      </div>
      <p style={{ fontSize: '0.75rem', color: '#a3a3a3', textAlign: 'center', marginTop: 8 }}>
        $7.44M/store (2015-Q4) → $11.23M/store (2025-Q4) · +51.0% productivity gain
      </p>
    </div>
  );
}
