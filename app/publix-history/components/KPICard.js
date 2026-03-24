'use client';

import { Line } from 'react-chartjs-2';
import { setupCharts } from '../ChartSetup';

setupCharts();

export default function KPICard({ label, value, trendValue, trendDirection, sparklineData, sparklineColor, valueColor, sublabel }) {
  const trendColors = {
    up: { bg: '#22c55e26', color: '#22c55e', arrow: '▲' },
    down: { bg: '#ef444426', color: '#ef4444', arrow: '▼' },
    neutral: { bg: '#a3a3a326', color: '#a3a3a3', arrow: '→' },
  };
  const t = trendColors[trendDirection] || trendColors.neutral;

  const chartData = {
    labels: Array(sparklineData.length).fill(''),
    datasets: [{
      data: sparklineData,
      borderColor: sparklineColor,
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.3,
      fill: { target: 'origin', above: sparklineColor + '1A' },
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: { x: { display: false }, y: { display: false } },
    elements: { line: { borderJoinStyle: 'round' } },
  };

  return (
    <div style={{
      background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 12,
      padding: 24, transition: 'all 150ms ease',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          fontSize: '0.875rem', fontWeight: 500, color: '#a3a3a3',
          textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>
          {label}
        </span>
        <span style={{
          background: t.bg, color: t.color, borderRadius: 9999,
          padding: '2px 8px', fontSize: '0.75rem', fontWeight: 600,
        }}>
          {t.arrow} {typeof trendValue === 'number' ? Math.abs(trendValue).toFixed(1) + '%' : trendValue}
        </span>
      </div>
      <div style={{
        fontSize: '1.75rem', fontWeight: 700, color: valueColor || '#e5e5e5',
        fontVariantNumeric: 'tabular-nums', marginTop: 4,
      }}>
        {value}
      </div>
      {sublabel && (
        <div style={{ fontSize: '0.6875rem', color: '#555', marginTop: 2, fontStyle: 'italic' }}>
          {sublabel}
        </div>
      )}
      <div style={{ height: 40, marginTop: 12 }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
