'use client';

import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

const COLORS = {
  actual: '#22d3ee',   // cyan — actual Publix
  predicted: '#f472b6', // pink — predicted (5yr trend)
  projection: '#facc15', // yellow — Q1 2026 trend projection
  q1tracker: '#4ade80', // green — Q1 live weighted tracker
};

export default function PredictionPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('full');
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

    // Add Q1 2026 trend projection point (from 5yr model)
    const projectionPts = [];
    if (data.projection.predictedPrice) {
      const lastPredicted = predictedPts[predictedPts.length - 1];
      projectionPts.push({ ...lastPredicted });
      projectionPts.push({
        x: new Date('2026-03-31').getTime(),
        y: data.projection.predictedPrice,
      });
    }

    // Q1 2026 daily weighted tracker line
    const q1TrackerPts = [];
    if (data.q1Tracker && data.q1Tracker.daily.length > 0) {
      // Start from the last actual Publix point (Q4 2025 end = Dec 31 2025)
      const lastActual = actualPts[actualPts.length - 1];
      q1TrackerPts.push({ x: lastActual.x, y: lastActual.y });
      // Add each daily point
      for (const d of data.q1Tracker.daily) {
        q1TrackerPts.push({ x: d.ts, y: d.impliedPrice });
      }
    }

    // Zoom mode: constrain to 6 months before today through Mar 31 2026
    const isZoom = viewMode === 'zoom';
    const zoomMax = new Date('2026-03-31').getTime();
    const zoomMin = new Date(new Date().getTime() - 6 * 30 * 24 * 60 * 60 * 1000).getTime();

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
            label: 'Q1 2026 Trend (5yr model)',
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
          {
            label: 'Q1 Weighted Tracker (live)',
            data: q1TrackerPts,
            borderColor: COLORS.q1tracker,
            backgroundColor: 'transparent',
            borderWidth: 2.5,
            pointStyle: false,
            pointRadius: 0,
            pointHitRadius: 10,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: COLORS.q1tracker,
            tension: 0.1,
            order: -1,
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
              unit: isZoom ? 'month' : 'quarter',
            },
            ...(isZoom ? { min: zoomMin, max: zoomMax } : {}),
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
          legend: { display: false },
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
  }, [data, viewMode]);

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
  const trackerPrice = data.q1Tracker?.latestImplied;
  const trackerReturn = data.q1Tracker?.latestReturn;

  return (
    <div className="prediction-panel">
      <div className="prediction-header">
        <h2>📈 Publix Price Predictor</h2>
        <p className="subtitle">
          Weighted basket of {data.weights.length} public grocery stocks vs actual Publix (last {data.dataPoints} quarters)
        </p>
      </div>

      {/* Dual callouts: trend projection + live tracker */}
      <div className="projection-row">
        {projPrice && (
          <div className="projection-callout trend">
            <div className="proj-label">5yr Trend → Q1 2026</div>
            <div className="proj-price trend-color">${projPrice.toFixed(2)}</div>
            <div className={`proj-change ${parseFloat(projChange) >= 0 ? 'up' : 'down'}`}>
              {parseFloat(projChange) >= 0 ? '▲' : '▼'} {projChange}% from Q4 2025
            </div>
          </div>
        )}
        {trackerPrice && (
          <div className="projection-callout tracker">
            <div className="proj-label">Q1 Weighted Returns → Today</div>
            <div className="proj-price tracker-color">${trackerPrice.toFixed(2)}</div>
            <div className={`proj-change ${trackerReturn >= 0 ? 'up' : 'down'}`}>
              {trackerReturn >= 0 ? '▲' : '▼'} {Math.abs(trackerReturn).toFixed(1)}% Q1 basket return
            </div>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="prediction-chart-container">
        <div className="view-toggle" role="group" aria-label="Chart zoom">
          <button
            className={`view-toggle-btn${viewMode === 'full' ? ' active' : ''}`}
            onClick={() => setViewMode('full')}
          >
            Full
          </button>
          <button
            className={`view-toggle-btn${viewMode === 'zoom' ? ' active' : ''}`}
            onClick={() => setViewMode('zoom')}
          >
            6-Month Focus
          </button>
        </div>
        <div className="chart-legend" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 20px', padding: '4px 0 8px', justifyContent: 'center' }}>
          {[
            { color: COLORS.actual, label: 'Actual Publix', dash: false },
            { color: COLORS.predicted, label: 'Predicted (Weighted Basket)', dash: true },
            { color: COLORS.projection, label: 'Q1 2026 Trend (5yr model)', dash: true, star: true },
            { color: COLORS.q1tracker, label: 'Q1 Weighted Tracker (live)', dash: false },
          ].map(item => (
            <span key={item.label} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#8080a0', fontFamily: "'Space Grotesk', sans-serif" }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                {item.star && <span style={{ color: item.color, fontSize: '10px', lineHeight: 1 }}>★</span>}
                <span style={{ display: 'inline-block', width: '20px', height: '2px', background: item.color, ...(item.dash ? { backgroundImage: `repeating-linear-gradient(90deg, ${item.color} 0 4px, transparent 4px 8px)`, backgroundColor: 'transparent' } : {}) }} />
              </span>
              {item.label}
            </span>
          ))}
        </div>
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

      {/* Methodology Explainer */}
      <details className="methodology-detail" open>
        <summary>How this works</summary>
        <div className="methodology-content">

          <div className="method-section">
            <h4>
              <span className="method-icon" style={{ color: '#f472b6' }}>━ ━</span>
              {' '}1. Best-Fit Regression Model
            </h4>
            <p>
              We take 5 publicly traded grocery stocks — Kroger, Walmart, Ahold Delhaize,
              Albertsons, and Weis Markets — and ask: <em>what blend of these stocks best
              explains Publix's quarterly share price over the last 5 years?</em>
            </p>
            <p>
              First, every stock (including Publix) is <strong>normalized to an index</strong> starting
              at 1.0 in Q1 2021. This removes the dollar-price distortion (Walmart at $90 vs Publix
              at $12) and focuses purely on <em>how each stock has grown</em> over time.
            </p>
            <p>
              Then we run <strong>constrained least-squares regression</strong> to find the weight for
              each stock that minimizes the squared error between the weighted basket and actual Publix.
              The constraints: all weights must be ≥ 0 (no shorting) and must sum to exactly 100%
              (a real portfolio). This uses simplex-projected gradient descent — think of it as
              repeatedly adjusting the dial on each stock until the error can't get any smaller.
            </p>
            <p>
              The result: Kroger gets the highest weight because its growth trajectory most closely
              mirrors Publix's. The <strong>R² of {(data.r2 * 100).toFixed(1)}%</strong> means this
              basket explains {(data.r2 * 100).toFixed(0)}% of Publix's price movement. The <strong>RMSE
              of ${data.rmse}</strong> is the average dollar error per quarter — how far off the
              prediction typically is.
            </p>
          </div>

          <div className="method-section">
            <h4>
              <span className="method-icon" style={{ color: '#facc15' }}>★</span>
              {' '}2. Five-Year Trend Projection (yellow)
            </h4>
            <p>
              The yellow number (${projPrice?.toFixed(2)}) answers: <em>based on the full 5-year
              relationship between these stocks and Publix, where does the model say Publix should
              be right now?</em>
            </p>
            <p>
              It takes today's price for each basket stock, normalizes it to the same Q1 2021 index,
              applies the model weights, and converts back to a dollar price. This captures the
              <strong> cumulative growth</strong> of the basket vs Publix over the entire period.
            </p>
            <p>
              If this number is significantly higher than the last actual Publix price, it suggests
              Publix is <strong>underpriced relative to peers</strong> — either the public stocks
              ran ahead, or Publix is due for a correction upward. If it's lower, the reverse.
              Currently showing a ${projPrice ? ('$' + Math.abs(projPrice - lastActual).toFixed(2)) : ''} gap.
            </p>
          </div>

          <div className="method-section">
            <h4>
              <span className="method-icon" style={{ color: '#4ade80' }}>━━</span>
              {' '}3. Q1 Weighted Tracker (green)
            </h4>
            <p>
              The green line answers a different question: <em>if Publix moved in exact lockstep
              with the weighted basket during Q1 2026, where would it be today?</em>
            </p>
            <p>
              Starting from the last known Publix price (${lastActual.toFixed(2)} as of Q4 2025),
              we fetch <strong>daily closing prices</strong> for each basket stock from January 1, 2026
              to today. For each trading day, we compute each stock's return since Q1 open, weight
              them by the model weights, and apply that blended return to ${lastActual.toFixed(2)}.
            </p>
            <p>
              This is a <strong>pure return-based projection</strong> — it doesn't carry the 5-year
              cumulative gap. If Kroger is up 5% this quarter and has 37% weight, it contributes
              +1.85% to the tracker. The green number reflects what the market is doing <em>right
              now</em>, not the historical trend.
            </p>
            <p>
              <strong>Key difference:</strong> The yellow number says "Publix should be <em>here</em>
              based on 5 years of data." The green number says "Publix has probably moved <em>this
              much</em> since last quarter, based on what peers did this quarter." When the actual
              Q1 2026 price is announced (March 31), we'll see which signal was closer.
            </p>
          </div>

          <div className="method-note">
            <strong>⚠️ Limitations:</strong> This is a first-pass price-only model. It doesn't
            account for EBITDA, earnings, margins, or Publix-specific factors (employee ownership,
            regional concentration, no debt). The next iteration will incorporate fundamental data.
            Not financial advice — just math.
          </div>
        </div>
      </details>

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
