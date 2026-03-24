'use client';

import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, Filler, Tooltip, Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Filler, Tooltip, Legend);

const STORE_COUNTS = [1114, 1136, 1167, 1211, 1239, 1264, 1293, 1322, 1360, 1390, 1432];
const REV_PER_STORE = [7.437, 8.100, 7.724, 7.734, 7.940, 8.934, 9.822, 11.698, 10.915, 11.256, 11.233];
const YEARS = ['2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025'];

export default function StoreExpansionChart() {
  const chartData = {
    labels: YEARS,
    datasets: [
      {
        label: 'Store Count', type: 'bar',
        data: STORE_COUNTS,
        backgroundColor: '#C8A05060', hoverBackgroundColor: '#C8A050',
        borderColor: '#C8A050', borderWidth: 1, borderRadius: 4,
        yAxisID: 'y', order: 2,
      },
      {
        label: 'Revenue/Store ($M)', type: 'line',
        data: REV_PER_STORE,
        borderColor: '#2DD4BF', borderWidth: 2.5,
        pointRadius: 4, pointBackgroundColor: '#2DD4BF',
        pointBorderColor: '#1a1a1a', pointBorderWidth: 2,
        tension: 0.3, yAxisID: 'y1', order: 1,
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
        callbacks: {
          label: (item) => {
            if (item.datasetIndex === 0) return `Stores: ${item.raw.toLocaleString()}`;
            return `Rev/Store: $${item.raw.toFixed(2)}M`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#a3a3a3', font: { size: 12 } },
        grid: { display: false },
      },
      y: {
        position: 'left',
        title: { display: true, text: 'Store Count', color: '#a3a3a3', font: { size: 12 } },
        ticks: { color: '#a3a3a3', font: { size: 11 }, callback: (val) => val.toLocaleString() },
        grid: { color: '#2a2a2a', drawBorder: false },
        suggestedMin: 1000, suggestedMax: 1500,
      },
      y1: {
        position: 'right',
        title: { display: true, text: 'Rev/Store ($M)', color: '#a3a3a3', font: { size: 12 } },
        ticks: { color: '#a3a3a3', font: { size: 11 }, callback: (val) => `$${val}M` },
        grid: { drawOnChartArea: false },
        suggestedMin: 6, suggestedMax: 13,
      },
    },
  };

  return (
    <div style={{
      background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 12, padding: 24,
    }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#e5e5e5', margin: 0 }}>
        Store Expansion Timeline
      </h2>
      <p style={{ fontSize: '0.875rem', color: '#a3a3a3', marginTop: 2, marginBottom: 16 }}>
        1,114 → 1,432 stores (+28.5% growth, 2015–2025)
      </p>
      <div style={{ height: 300 }}>
        <Chart type="bar" data={chartData} options={options} />
      </div>
    </div>
  );
}
