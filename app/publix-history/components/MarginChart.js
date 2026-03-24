'use client';

import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { setupCharts } from '../ChartSetup';

setupCharts();

const LINE_CONFIG = [
  { key: 'gross', label: 'Gross Margin %', field: 'grossMarginPct', color: '#C8A050' },
  { key: 'operating', label: 'Operating Margin %', field: 'operatingMarginPct', color: '#2DD4BF' },
  { key: 'net', label: 'Net Margin %', field: 'netMarginPct', color: '#22c55e' },
];

export default function MarginChart({ data }) {
  const [visible, setVisible] = useState({ gross: true, operating: true, net: true });

  const toggle = (key) => {
    const activeCount = Object.values(visible).filter(Boolean).length;
    if (visible[key] && activeCount <= 1) return; // prevent unchecking last
    setVisible(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const datasets = LINE_CONFIG
    .filter(l => visible[l.key])
    .map(l => ({
      label: l.label,
      data: data.map(q => q[l.field]),
      borderColor: l.color, backgroundColor: l.color + '10',
      borderWidth: 2, pointRadius: 0, pointHoverRadius: 4,
      pointHoverBackgroundColor: l.color, tension: 0.3, fill: false,
    }));

  const options = {
    responsive: true, maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1a1a1a', borderColor: '#2a2a2a', borderWidth: 1,
        titleColor: '#e5e5e5', bodyColor: '#a3a3a3', padding: 12, cornerRadius: 8,
        callbacks: {
          label: (item) => `${item.dataset.label}: ${item.raw.toFixed(2)}%`,
        },
      },
      annotation: {
        annotations: {
          industryNetMargin: {
            type: 'line', yMin: 2, yMax: 2,
            borderColor: '#ef444460', borderWidth: 1, borderDash: [6, 4],
            label: {
              display: true, content: 'Industry Avg Net ~2%', position: 'start',
              color: '#ef4444', font: { size: 10 }, backgroundColor: '#0a0a0a',
            },
          },
          industryOpMargin: {
            type: 'line', yMin: 5, yMax: 5,
            borderColor: '#a3a3a340', borderWidth: 1, borderDash: [6, 4],
            label: {
              display: true, content: 'Industry Avg Operating ~5%', position: 'start',
              color: '#a3a3a3', font: { size: 10 }, backgroundColor: '#0a0a0a',
            },
          },
        },
      },
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
        title: { display: true, text: 'Margin %', color: '#a3a3a3', font: { size: 12 } },
        ticks: { color: '#a3a3a3', font: { size: 11 }, callback: (val) => `${val}%` },
        grid: { color: '#2a2a2a', drawBorder: false },
        suggestedMin: 2, suggestedMax: 32,
      },
    },
  };

  return (
    <div style={{
      background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 12, padding: 24,
      position: 'relative',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#e5e5e5', margin: 0 }}>
          Margin Analysis
        </h2>
        <div style={{ display: 'flex', gap: 20 }}>
          {LINE_CONFIG.map(l => (
            <label key={l.key} style={{
              display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
              fontSize: '0.75rem', color: '#a3a3a3',
            }}>
              <span
                onClick={() => toggle(l.key)}
                style={{
                  width: 14, height: 14, borderRadius: 3,
                  border: `2px solid ${l.color}`,
                  background: visible[l.key] ? l.color : 'transparent',
                  display: 'inline-block', cursor: 'pointer', transition: 'background 150ms',
                }}
              />
              {l.label.replace(' %', '')}
            </label>
          ))}
        </div>
      </div>

      {/* Callout box */}
      <div style={{
        position: 'absolute', top: 60, right: 24,
        background: '#1a1a1a', border: '1px solid #C8A05040', borderRadius: 8,
        padding: '8px 14px', fontSize: '0.75rem', color: '#C8A050',
        fontWeight: 500, zIndex: 10,
      }}>
        Publix operates at 2–4× industry margins
      </div>

      <div style={{ height: 350 }}>
        <Line data={{ labels: data.map(q => q.period), datasets }} options={options} />
      </div>
    </div>
  );
}
