'use client';

import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

const COLORS = {
  actual: '#22d3ee',   // cyan — actual Publix
  predicted: '#f472b6', // pink — predicted
  projection: '#facc15', // yellow — Q1 2026 projection
};

export default function PredictionPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    fetch('/api/predict')
      .then(r => r.json())
      .then(d => {
        if (d.error) throw new Error(d.error);
        setData(d);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!data || !canvasRef.current) return;

    if (chartRef.current) chartRef.current.destroy();

    // Map quarter start dates to quarter end dates for plotting
    const quarterEndMap = {
      '01': '03-31', '04': '06-30', '07': '09-30', '10': '12-31',
    };

    const toQuarterEnd = (dateStr) => {
      const [y, m] = dateStr.split('-');
      return `${y}-${quarterEndMap[m]}`;
    };

    const actualPts = data.quarters.map(q => ({
      x: new Date(toQuarterEnd(q.date)).getTime(),
      y: q.actualPublix,
    }));

    const predictedPts = data.quarters.map(q => ({
      x: new Date(toQuarterEnd(q.date)).getTime(),
      y: q.predictedPublix,
    }));

    // Add Q1 2026 projection point
    const projectionPts = [];
    if (data.projection.predictedPrice) {
      // Connect from last predicted point
      const lastPredicted = predictedPts[predictedPts.length - 1];
      projectionPts.push({ ...lastPredicted });
      projectionPts.push({
        x: new Date('2026-03-31').getTime(),
        y: data.projection.predictedPrice,
      });
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Actual Publix',
            data: actualPts,
            borderColor: COLORS.actual,
            backgroundColor: 'transparent',
            borderWidth: 2.5,
            pointStyle: 'circle',
            pointRadius: 4,
            pointBackgroundColor: COLORS.actual,
            pointBorderColor: '#16161f',
            pointBorderWidth: 2,
            pointHoverRadius: 7,
            tension: 0,
            order: 1,
          },
          {
            label: 'Predicted (Weighted Basket)',
            data: predictedPts,
            borderColor: COLORS.predicted,
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [6, 3],
            pointStyle: 'rectRot',
            pointRadius: 3,
            pointBackgroundColor: COLORS.predicted,
            pointBorderColor: '#16161f',
            pointBorderWidth: 1,
            pointHoverRadius: 6,
            tension: 0,
            order: 2,
          },
          {
            label: 'Q1 2026 Projection',
            data: projectionPts,
            borderColor: COLORS.projection,
            backgroundColor: 'transparent',
            borderWidth: 2.5,
            borderDash: [4, 4],
            pointStyle: 'star',
            pointRadius: (ctx) =>
              ctx.dataIndex === projectionPts.length - 1 ? 8 : 0,
            pointBackgroundColor: COLORS.projection,
            pointBorderColor: '#16161f',
            pointBorderWidth: 1,
            pointHoverRadius: 10,
            tension: 0,
            order: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        animation: { duration: 400 },
        scales: {
          x: {
            type: 'time',
            time: {
              displayFormats: { quarter: 'QQQ yyyy', month: 'MMM yyyy' },
              tooltipFormat: 'MMM d, yyyy',
              unit: 'quarter',
            },
            grid: { color: 'rgba(255,255,255,0.04)' },
            border: { display: false },
            ticks: {
              color: '#505068',
              font: { family: "'Space Grotesk', monospace", size: 11 },
              maxRotation: 0,
            },
          },
          y: {
            position: 'right',
            grid: { color: 'rgba(255,255,255,0.04)' },
            border: { display: false },
            ticks: {
              color: '#505068',
              font: { family: "'Space Grotesk', monospace", size: 11 },
              callback: (val) => '$' + val.toFixed(2),
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: '#8080a0',
              font: { family: "'Space Grotesk', sans-serif", size: 11 },
              usePointStyle: true,
              padding: 16,
            },
          },
          tooltip: {
            backgroundColor: 'rgba(18, 18, 28, 0.97)',
            titleColor: '#8080a0',
            bodyColor: '#f0f0f5',
            borderColor: 'rgba(255,255,255,0.06)',
            borderWidth: 1,
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: $${ctx.parsed.y.toFixed(2)}`,
            },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [data]);

  if (loading) {
    return (
      <div className="prediction-panel loading">
        <div className="spinner" />
        <p>Running regression on 5 years of quarterly data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="prediction-panel error">
        <p>Error loading prediction: {error}</p>
      </div>
    );
  }

  if (!data) return null;

  const projPrice = data.projection.predictedPrice;
  const lastActual = data.projection.lastActualPublix;
  const projChange = projPrice ? ((projPrice - lastActual) / lastActual * 100).toFixed(1) : null;

  return (
    <div className="prediction-panel">
      <div className="prediction-header">
        <h2>📈 Publix Price Predictor</h2>
        <p className="subtitle">
          Weighted basket of {data.weights.length} public grocery stocks vs actual Publix (last {data.dataPoints} quarters)
        </p>
      </div>

      {/* Projection callout */}
      {projPrice && (
        <div className="projection-callout">
          <div className="proj-label">Q1 2026 Predicted Price</div>
          <div className="proj-price">${projPrice.toFixed(2)}</div>
          <div className={`proj-change ${parseFloat(projChange) >= 0 ? 'up' : 'down'}`}>
            {parseFloat(projChange) >= 0 ? '▲' : '▼'} {projChange}% from Q4 2025 (${lastActual.toFixed(2)})
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="prediction-chart-container">
        <canvas ref={canvasRef} />
      </div>

      {/* Model stats */}
      <div className="model-stats">
        <div className="stat">
          <span className="stat-label">R²</span>
          <span className="stat-value">{(data.r2 * 100).toFixed(1)}%</span>
        </div>
        <div className="stat">
          <span className="stat-label">RMSE</span>
          <span className="stat-value">${data.rmse}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Data Points</span>
          <span className="stat-value">{data.dataPoints}Q</span>
        </div>
      </div>

      {/* Weight breakdown */}
      <div className="weights-section">
        <h3>Optimal Weights</h3>
        <div className="weights-grid">
          {data.weights.map(w => (
            <div key={w.symbol} className="weight-bar">
              <div className="weight-info">
                <span className="weight-label">{w.label}</span>
                <span className="weight-pct">{w.pct}</span>
              </div>
              <div className="weight-track">
                <div
                  className="weight-fill"
                  style={{ width: `${Math.min(w.weight * 100 * 2, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quarter-by-quarter table */}
      <details className="quarters-detail">
        <summary>Quarter-by-quarter breakdown</summary>
        <div className="quarters-table-wrap">
          <table className="quarters-table">
            <thead>
              <tr>
                <th>Quarter</th>
                <th>Actual</th>
                <th>Predicted</th>
                <th>Error</th>
              </tr>
            </thead>
            <tbody>
              {data.quarters.map(q => (
                <tr key={q.date}>
                  <td>{q.date.replace('-01-01', ' Q1').replace('-04-01', ' Q2').replace('-07-01', ' Q3').replace('-10-01', ' Q4')}</td>
                  <td>${q.actualPublix.toFixed(2)}</td>
                  <td>${q.predictedPublix.toFixed(2)}</td>
                  <td className={parseFloat(q.errorPct) >= 0 ? 'pos' : 'neg'}>
                    {q.errorPct}
                  </td>
                </tr>
              ))}
              {projPrice && (
                <tr className="projection-row">
                  <td>2026 Q1 ★</td>
                  <td>—</td>
                  <td>${projPrice.toFixed(2)}</td>
                  <td>—</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
