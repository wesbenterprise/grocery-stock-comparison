'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// Publix quarterly share price data (employee-owned, not publicly traded)
// All prices are 2022 5-for-1 split adjusted
// Sources: publixstockholder.com, SEC EDGAR 8-K, Al Ebeling/Barney Barnett spreadsheet
const PUBLIX_RAW = [
  // 2006 (post 5/1 split)
  { date: '2006-07-01', price: 3.65 },
  { date: '2006-10-01', price: 3.92 },
  // 2007
  { date: '2007-01-01', price: 3.98 },
  { date: '2007-04-01', price: 4.18 },
  { date: '2007-07-01', price: 4.18 },
  { date: '2007-10-01', price: 4.16 },
  // 2008
  { date: '2008-01-01', price: 4.14 },
  { date: '2008-04-01', price: 3.89 },
  { date: '2008-07-01', price: 3.94 },
  { date: '2008-10-01', price: 3.22 },
  // 2009
  { date: '2009-01-01', price: 3.11 },
  { date: '2009-04-01', price: 3.21 },
  { date: '2009-07-01', price: 3.26 },
  { date: '2009-10-01', price: 3.47 },
  // 2010
  { date: '2010-01-01', price: 3.70 },
  { date: '2010-04-01', price: 3.69 },
  { date: '2010-07-01', price: 3.97 },
  { date: '2010-10-01', price: 4.18 },
  // 2011
  { date: '2011-01-01', price: 4.33 },
  { date: '2011-04-01', price: 4.41 },
  { date: '2011-07-01', price: 4.04 },
  { date: '2011-10-01', price: 4.48 },
  // 2012
  { date: '2012-01-01', price: 4.54 },
  { date: '2012-04-01', price: 4.40 },
  { date: '2012-07-01', price: 4.50 },
  { date: '2012-10-01', price: 4.64 },
  // 2013
  { date: '2013-01-01', price: 5.38 },
  { date: '2013-04-01', price: 5.51 },
  { date: '2013-07-01', price: 6.00 },
  { date: '2013-10-01', price: 6.03 },
  // 2014
  { date: '2014-01-01', price: 6.50 },
  { date: '2014-04-01', price: 6.77 },
  { date: '2014-07-01', price: 6.76 },
  { date: '2014-10-01', price: 7.81 },
  // 2015
  { date: '2015-01-01', price: 8.42 },
  { date: '2015-04-01', price: 8.40 },
  { date: '2015-07-01', price: 8.36 },
  { date: '2015-10-01', price: 9.04 },
  // 2016
  { date: '2016-01-01', price: 8.79 },
  { date: '2016-04-01', price: 8.38 },
  { date: '2016-07-01', price: 8.03 },
  { date: '2016-10-01', price: 8.18 },
  // 2017
  { date: '2017-01-01', price: 7.83 },
  { date: '2017-04-01', price: 7.21 },
  { date: '2017-07-01', price: 7.37 },
  { date: '2017-10-01', price: 7.37 },
  // 2018
  { date: '2018-01-01', price: 8.35 },
  { date: '2018-04-01', price: 8.51 },
  { date: '2018-07-01', price: 8.54 },
  { date: '2018-10-01', price: 8.57 },
  // 2019
  { date: '2019-01-01', price: 8.95 },
  { date: '2019-04-01', price: 8.82 },
  { date: '2019-07-01', price: 9.42 },
  { date: '2019-10-01', price: 9.78 },
  // 2020
  { date: '2020-01-01', price: 10.02 },
  { date: '2020-04-01', price: 10.87 },
  { date: '2020-07-01', price: 11.59 },
  { date: '2020-10-01', price: 12.04 },
  // 2021
  { date: '2021-01-01', price: 12.26 },
  { date: '2021-04-01', price: 12.62 },
  { date: '2021-07-01', price: 13.28 },
  { date: '2021-10-01', price: 13.76 },
  // 2022 (post 5-for-1 split Apr 2022)
  { date: '2022-01-01', price: 14.91 },
  { date: '2022-04-01', price: 13.84 },
  { date: '2022-07-01', price: 13.19 },
  { date: '2022-10-01', price: 14.55 },
  // 2023
  { date: '2023-01-01', price: 14.97 },
  { date: '2023-04-01', price: 14.75 },
  { date: '2023-07-01', price: 15.10 },
  { date: '2023-10-01', price: 15.20 },
  // 2024
  { date: '2024-01-01', price: 16.25 },
  { date: '2024-04-01', price: 16.46 },
  { date: '2024-07-01', price: 18.05 },
  { date: '2024-10-01', price: 19.20 },
  // 2025
  { date: '2025-01-01', price: 20.20 },
  { date: '2025-04-01', price: 21.15 },
  { date: '2025-07-01', price: 20.40 },
  { date: '2025-10-01', price: 19.65 },
];

const RANGES = [
  { label: '1Y', years: 1 },
  { label: '2Y', years: 2 },
  { label: '3Y', years: 3 },
  { label: '5Y', years: 5 },
  { label: '10Y', years: 10 },
  { label: 'All', years: null },
];

const COLORS = {
  publix:  '#4caf50',
  walmart: '#0071ce',
  kroger:  '#e31837',
};

function filterByYears(pts, years) {
  if (!years) return pts;
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - years);
  return pts.filter(p => new Date(p.x || p.date) >= cutoff);
}

function normalizeArr(arr) {
  if (!arr.length) return arr;
  const base = arr[0].y;
  if (!base) return arr;
  return arr.map(p => ({ x: p.x, y: ((p.y - base) / base) * 100 }));
}

export default function StockChart({ onLiveDataLoaded }) {
  const canvasRef             = useRef(null);
  const chartRef              = useRef(null);

  const [loading, setLoading]         = useState(true);
  const [liveData, setLiveData]       = useState({ KR: null, WMT: null });
  const [activeRange, setActiveRange] = useState('5Y');
  const [viewMode, setViewMode]       = useState('price');
  const [hidden, setHidden]           = useState({ publix: false, walmart: false, kroger: false });
  const [chartReady, setChartReady]   = useState(false);

  // Fetch Yahoo Finance data
  useEffect(() => {
    let cancelled = false;

    async function fetchSymbol(symbol) {
      try {
        const res = await fetch(`/api/stock?symbol=${symbol}&range=max&interval=1wk`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const result = json?.chart?.result?.[0];
        if (!result) throw new Error('empty');
        const timestamps = result.timestamp || [];
        const closes     = result.indicators?.quote?.[0]?.close || [];
        return timestamps
          .map((ts, i) => ({ x: new Date(ts * 1000), y: closes[i] }))
          .filter(p => p.y != null && !isNaN(p.y));
      } catch (e) {
        console.warn(`[StockChart] ${symbol} fetch failed:`, e.message);
        return null;
      }
    }

    Promise.all([fetchSymbol('KR'), fetchSymbol('WMT')]).then(([kr, wmt]) => {
      if (cancelled) return;
      setLiveData({ KR: kr, WMT: wmt });
      setLoading(false);

      if (onLiveDataLoaded) {
        onLiveDataLoaded({
          KR:  { price: kr?.at(-1)?.y,  prev: kr?.at(-5)?.y  },
          WMT: { price: wmt?.at(-1)?.y, prev: wmt?.at(-5)?.y },
        });
      }
    });

    return () => { cancelled = true; };
  }, [onLiveDataLoaded]);

  // Build datasets
  const buildDatasets = useCallback((viewModeArg, rangeArg, hiddenArg, liveArg) => {
    const years = RANGES.find(r => r.label === rangeArg)?.years ?? null;

    // Publix: expand stepped data
    const publixFiltered = filterByYears(PUBLIX_RAW, years);
    let publixPts = [];
    for (let i = 0; i < publixFiltered.length; i++) {
      const curr = publixFiltered[i];
      const next = publixFiltered[i + 1];
      publixPts.push({ x: new Date(curr.date), y: curr.price });
      if (next) {
        const beforeNext = new Date(next.date);
        beforeNext.setDate(beforeNext.getDate() - 1);
        publixPts.push({ x: beforeNext, y: curr.price });
      }
    }

    let krPts  = liveArg.KR  ? filterByYears(liveArg.KR,  years) : [];
    let wmtPts = liveArg.WMT ? filterByYears(liveArg.WMT, years) : [];

    if (viewModeArg === 'percent') {
      const allFirstDates = [publixPts[0]?.x, krPts[0]?.x, wmtPts[0]?.x].filter(Boolean);
      if (allFirstDates.length) {
        const commonStart = new Date(Math.max(...allFirstDates.map(d => d.getTime())));
        publixPts = publixPts.filter(p => p.x >= commonStart);
        krPts     = krPts.filter(p => p.x >= commonStart);
        wmtPts    = wmtPts.filter(p => p.x >= commonStart);
      }
      publixPts = normalizeArr(publixPts);
      krPts     = normalizeArr(krPts);
      wmtPts    = normalizeArr(wmtPts);
    }

    return [
      {
        label: 'Publix',
        data: publixPts,
        borderColor: COLORS.publix,
        backgroundColor: 'transparent',
        borderWidth: 2.5,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: COLORS.publix,
        pointHoverBorderColor: '#16161f',
        pointHoverBorderWidth: 2,
        stepped: 'before',
        tension: 0,
        hidden: hiddenArg.publix,
        order: 1,
      },
      {
        label: 'Walmart',
        data: wmtPts,
        borderColor: COLORS.walmart,
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: COLORS.walmart,
        pointHoverBorderColor: '#16161f',
        pointHoverBorderWidth: 2,
        tension: 0.15,
        hidden: hiddenArg.walmart,
        order: 2,
      },
      {
        label: 'Kroger',
        data: krPts,
        borderColor: COLORS.kroger,
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: COLORS.kroger,
        pointHoverBorderColor: '#16161f',
        pointHoverBorderWidth: 2,
        tension: 0.15,
        hidden: hiddenArg.kroger,
        order: 3,
      },
    ];
  }, []);

  // Create chart on mount (after loading)
  useEffect(() => {
    if (loading || !canvasRef.current) return;

    let destroyed = false;

    async function initChart() {
      const [
        { Chart, TimeScale, LinearScale, LineController, PointElement, LineElement, Tooltip },
      ] = await Promise.all([
        import('chart.js'),
        import('chartjs-adapter-date-fns'),
      ]);

      Chart.register(TimeScale, LinearScale, LineController, PointElement, LineElement, Tooltip);

      if (destroyed || !canvasRef.current) return;

      const formatY = (val, vm) => vm === 'percent'
        ? (val >= 0 ? '+' : '') + val.toFixed(1) + '%'
        : '$' + val.toFixed(2);

      const datasets = buildDatasets(viewMode, activeRange, hidden, liveData);

      chartRef.current = new Chart(canvasRef.current, {
        type: 'line',
        data: { datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          animation: { duration: 400 },
          scales: {
            x: {
              type: 'time',
              time: {
                displayFormats: { month: 'MMM yy', year: 'yyyy' },
                tooltipFormat: 'MMM d, yyyy',
              },
              grid: { color: 'rgba(255,255,255,0.04)', drawTicks: false },
              border: { display: false },
              ticks: {
                color: '#505068',
                font: { family: "'Space Grotesk', monospace", size: 11, weight: '500' },
                maxRotation: 0,
                autoSkip: true,
                maxTicksLimit: 8,
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
                callback: (val) => formatY(val, viewMode),
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
              displayColors: true,
              boxWidth: 8,
              boxHeight: 8,
              boxPadding: 6,
              cornerRadius: 10,
              callbacks: {
                label: (ctx) => {
                  const val = ctx.parsed.y;
                  const fmt = viewMode === 'percent'
                    ? (val >= 0 ? '+' : '') + val.toFixed(2) + '%'
                    : '$' + val.toFixed(2);
                  return `  ${ctx.dataset.label}:  ${fmt}`;
                },
              },
            },
          },
        },
      });

      setChartReady(true);
    }

    initChart();

    return () => {
      destroyed = true;
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
      setChartReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  // Update chart data when state changes (after chart is ready)
  useEffect(() => {
    if (!chartReady || !chartRef.current) return;

    const formatY = (val) => viewMode === 'percent'
      ? (val >= 0 ? '+' : '') + val.toFixed(1) + '%'
      : '$' + val.toFixed(2);

    const datasets = buildDatasets(viewMode, activeRange, hidden, liveData);
    chartRef.current.data.datasets = datasets;

    chartRef.current.options.scales.y.ticks.callback = formatY;
    chartRef.current.options.plugins.tooltip.callbacks.label = (ctx) => {
      const val = ctx.parsed.y;
      const fmt = viewMode === 'percent'
        ? (val >= 0 ? '+' : '') + val.toFixed(2) + '%'
        : '$' + val.toFixed(2);
      return `  ${ctx.dataset.label}:  ${fmt}`;
    };

    chartRef.current.update('active');
  }, [activeRange, viewMode, hidden, chartReady, buildDatasets, liveData]);

  const toggleSeries = (key) => {
    setHidden(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="chart-section">
      <div className="section-header">
        <h2 className="section-title">Stock Performance</h2>
        <span className="section-subtitle">Publix (quarterly) · KR & WMT live</span>
      </div>

      <div className="chart-controls">
        <div className="range-buttons" role="group" aria-label="Time range">
          {RANGES.map(r => (
            <button
              key={r.label}
              className={`range-btn${activeRange === r.label ? ' active' : ''}`}
              onClick={() => setActiveRange(r.label)}
              aria-pressed={activeRange === r.label}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="view-toggle" role="group" aria-label="View mode">
          <button
            className={`view-toggle-btn${viewMode === 'price' ? ' active' : ''}`}
            onClick={() => setViewMode('price')}
          >
            Price $
          </button>
          <button
            className={`view-toggle-btn${viewMode === 'percent' ? ' active' : ''}`}
            onClick={() => setViewMode('percent')}
          >
            % Change
          </button>
        </div>
      </div>

      <div className="chart-wrapper">
        <div className="chart-canvas-container">
          {loading && (
            <div className="chart-loading">
              <div className="chart-loading-spinner" aria-hidden="true" />
              <p>Fetching live market data…</p>
            </div>
          )}
          <canvas
            ref={canvasRef}
            role="img"
            aria-label="Stock price comparison chart"
            style={{ display: loading ? 'none' : 'block', width: '100%', height: '100%' }}
          />
        </div>

        <div className="chart-legend" role="list">
          {[
            { key: 'publix',  label: 'Publix',  note: 'stepped' },
            { key: 'walmart', label: 'Walmart', note: 'WMT' },
            { key: 'kroger',  label: 'Kroger',  note: 'KR' },
          ].map(({ key, label, note }) => (
            <button
              key={key}
              role="listitem"
              className={`legend-item${hidden[key] ? ' hidden' : ''}`}
              onClick={() => toggleSeries(key)}
              aria-pressed={!hidden[key]}
              aria-label={`Toggle ${label} series`}
            >
              <span className={`legend-dot ${key}`} aria-hidden="true" />
              {label}
              <span style={{ color: 'var(--color-text-dim)', fontWeight: 400, fontSize: '11px' }}>
                {note}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
