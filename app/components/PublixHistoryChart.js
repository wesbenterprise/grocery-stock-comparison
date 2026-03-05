'use client';

import { useEffect, useRef } from 'react';
import { PUBLIX_RAW } from '../../lib/publix-data';

// Publix prices are announced on an effective date but represent the value at the
// END of the previous quarter. Map to end-of-quarter dates (noon ET).
const NOON_ET = 17;
const PUBLIX_POINTS = PUBLIX_RAW.map(p => {
  const year  = parseInt(p.date.substring(0, 4), 10);
  const month = parseInt(p.date.substring(5, 7), 10);
  if (month === 1) return { x: new Date(Date.UTC(year - 1, 11, 31, NOON_ET)), y: p.price };
  if (month === 4) return { x: new Date(Date.UTC(year, 2, 31, NOON_ET)), y: p.price };
  if (month === 7) return { x: new Date(Date.UTC(year, 5, 30, NOON_ET)), y: p.price };
  return { x: new Date(Date.UTC(year, 8, 30, NOON_ET)), y: p.price };
});

// Custom plugin: draws a vertical dashed line + label at the April 2022 split date
const splitAnnotationPlugin = {
  id: 'splitAnnotation',
  afterDraw(chart) {
    const { ctx, scales: { x, y } } = chart;
    if (!x || !y) return;

    // The split happened April 2022 — use end of Q1 2022 (Mar 31) as the visual marker
    // In our expanded data, Q1 2022 end-of-quarter = Mar 31 2022, Q2 2022 = Jun 30 2022
    // We draw the line right between them: Apr 1 2022
    const splitDate = new Date(Date.UTC(2022, 3, 1, 17)); // noon ET
    const xPixel = x.getPixelForValue(splitDate.getTime());

    if (xPixel < x.left || xPixel > x.right) return;

    ctx.save();

    // Dashed vertical line
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(124, 111, 255, 0.55)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(xPixel, y.top);
    ctx.lineTo(xPixel, y.bottom);
    ctx.stroke();

    // Label background pill
    ctx.setLineDash([]);
    const labelText = '✂ 5-for-1 Split';
    ctx.font = '600 10px "Space Grotesk", monospace';
    const textW = ctx.measureText(labelText).width;
    const padX = 7, padY = 4;
    const boxW = textW + padX * 2;
    const boxH = 20;
    const boxX = xPixel - boxW / 2;
    const boxY = y.top + 10;

    ctx.fillStyle = 'rgba(18, 18, 40, 0.92)';
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, 4);
    ctx.fill();

    ctx.strokeStyle = 'rgba(124, 111, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = 'rgba(180, 170, 255, 0.9)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(labelText, xPixel, boxY + boxH / 2);

    ctx.restore();
  },
};

export default function PublixHistoryChart() {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    let destroyed = false;

    async function init() {
      const [
        { Chart, TimeScale, LinearScale, LineController, PointElement, LineElement, Tooltip },
      ] = await Promise.all([
        import('chart.js'),
        import('chartjs-adapter-date-fns'),
      ]);

      Chart.register(
        TimeScale, LinearScale, LineController,
        PointElement, LineElement, Tooltip,
        splitAnnotationPlugin,
      );

      if (destroyed || !canvasRef.current) return;

      chartRef.current = new Chart(canvasRef.current, {
        type: 'line',
        data: {
          datasets: [
            {
              label: 'Publix',
              data: [...PUBLIX_POINTS],
              borderColor: '#4caf50',
              backgroundColor: 'transparent',
              borderWidth: 2.5,
              pointRadius: 3,
              pointHoverRadius: 7,
              pointBackgroundColor: '#4caf50',
              pointBorderColor: '#16161f',
              pointBorderWidth: 2,
              pointHoverBackgroundColor: '#4caf50',
              pointHoverBorderColor: '#16161f',
              pointHoverBorderWidth: 2,
              tension: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          animation: { duration: 300 },
          scales: {
            x: {
              type: 'time',
              time: {
                displayFormats: { year: 'yyyy', month: 'MMM yy' },
                tooltipFormat: 'MMM d, yyyy',
              },
              grid: { color: 'rgba(255,255,255,0.04)', drawTicks: false },
              border: { display: false },
              ticks: {
                color: '#505068',
                font: { family: "'Space Grotesk', monospace", size: 11, weight: '500' },
                maxRotation: 0,
                autoSkip: true,
                maxTicksLimit: 10,
                padding: 8,
              },
            },
            y: {
              position: 'right',
              grid: { color: 'rgba(255,255,255,0.04)', drawTicks: false },
              border: { display: false },
              ticks: {
                color: '#505068',
                font: { family: "'Space Grotesk', monospace", size: 11, weight: '500' },
                padding: 8,
                callback: (val) => '$' + val.toFixed(2),
              },
            },
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: 'rgba(18, 18, 28, 0.97)',
              titleColor: '#8080a0',
              bodyColor: '#f0f0f5',
              borderColor: 'rgba(255,255,255,0.10)',
              borderWidth: 1,
              padding: { top: 10, bottom: 10, left: 14, right: 14 },
              titleFont: { family: "'DM Sans', system-ui", size: 12, weight: '500' },
              bodyFont: { family: "'Space Grotesk', monospace", size: 13, weight: '600' },
              displayColors: false,
              cornerRadius: 10,
              callbacks: {
                label: (ctx) => `  Price:  $${ctx.parsed.y.toFixed(2)} (split-adj.)`,
              },
            },
            splitAnnotation: {},
          },
        },
      });
    }

    init();

    return () => {
      destroyed = true;
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, []);

  return (
    <div className="chart-wrapper">
      <div className="chart-canvas-container" style={{ height: 420 }}>
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Publix complete stock price history chart Q3 2006 to Q4 2025"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <div className="chart-legend" role="list" style={{ marginTop: 'var(--space-4)' }}>
        <span role="listitem" className="legend-item" style={{ cursor: 'default' }}>
          <span className="legend-dot publix" aria-hidden="true" />
          Publix
          <span style={{ color: 'var(--color-text-dim)', fontWeight: 400, fontSize: '11px' }}>
            split-adjusted
          </span>
        </span>
        <span role="listitem" className="legend-item" style={{ cursor: 'default', color: 'rgba(180,170,255,0.7)', fontSize: '12px' }}>
          <span style={{ display: 'inline-block', width: 20, borderTop: '1.5px dashed rgba(124,111,255,0.6)', verticalAlign: 'middle', marginRight: 6 }} aria-hidden="true" />
          5-for-1 Split (Apr 2022)
        </span>
      </div>
    </div>
  );
}
