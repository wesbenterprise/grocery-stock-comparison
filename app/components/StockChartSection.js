'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

const publixData = [
  { date: '2020-03-01', price: 10.02 },
  { date: '2020-06-01', price: 10.87 },
  { date: '2020-09-01', price: 11.59 },
  { date: '2020-12-01', price: 12.04 },
  { date: '2021-03-01', price: 12.26 },
  { date: '2021-06-01', price: 12.62 },
  { date: '2021-09-01', price: 13.28 },
  { date: '2021-12-01', price: 13.76 },
  { date: '2022-03-01', price: 14.91 },
  { date: '2022-06-01', price: 13.84 },
  { date: '2022-09-01', price: 13.19 },
  { date: '2022-12-01', price: 14.55 },
  { date: '2023-03-01', price: 14.97 },
  { date: '2023-06-01', price: 14.75 },
  { date: '2023-09-01', price: 15.1 },
  { date: '2023-12-01', price: 15.2 },
  { date: '2024-03-01', price: 16.25 },
  { date: '2024-06-01', price: 16.46 },
  { date: '2024-09-01', price: 18.05 },
  { date: '2024-12-01', price: 19.2 },
  { date: '2025-03-01', price: 20.2 },
  { date: '2025-06-01', price: 21.15 },
  { date: '2025-09-01', price: 20.4 },
  { date: '2025-12-01', price: 19.65 },
].map((p) => ({ x: new Date(`${p.date}T00:00:00Z`), y: p.price }));

const SERIES = {
  publix: {
    label: 'Publix',
    color: '#4caf50',
    stepped: 'before',
    data: publixData,
  },
  wmt: {
    label: 'Walmart (WMT)',
    color: '#0071ce',
    stepped: false,
    data: [],
  },
  kr: {
    label: 'Kroger (KR)',
    color: '#e31837',
    stepped: false,
    data: [],
  },
};

function getRangeStartDate(years) {
  if (years === 'all') return null;

  const now = new Date();
  const start = new Date(now);
  start.setFullYear(now.getFullYear() - years);
  const floor = new Date('2020-01-01T00:00:00Z');
  return start < floor ? floor : start;
}

function sliceByRange(data, years) {
  const startDate = getRangeStartDate(years);
  if (!startDate) return data;
  return data.filter((p) => p.x >= startDate);
}

function alignToCommonStart(seriesMap) {
  const starts = Object.values(seriesMap)
    .map((points) => points?.[0]?.x)
    .filter(Boolean)
    .map((d) => d.getTime());

  if (!starts.length) return { aligned: seriesMap, commonStart: null };

  const commonStartTs = Math.max(...starts);
  const commonStart = new Date(commonStartTs);

  const aligned = Object.fromEntries(
    Object.entries(seriesMap).map(([key, points]) => [
      key,
      (points || []).filter((p) => p.x.getTime() >= commonStartTs),
    ])
  );

  return { aligned, commonStart };
}

function normalizePercent(data) {
  if (!data.length) return [];
  const base = data[0].y;
  if (!base) return data.map((p) => ({ ...p, y: 0, rawPrice: p.y }));
  return data.map((p) => ({
    ...p,
    rawPrice: p.y,
    y: ((p.y - base) / base) * 100,
  }));
}

function formatDate(dateObj) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(dateObj);
}

function tooltipLabel(ctx, mode) {
  const val = ctx.parsed.y;
  const point = ctx.raw || {};
  const rawPrice = point.rawPrice ?? point.y ?? val;

  if (mode === 'percent') {
    return `${ctx.dataset.label}: ${val.toFixed(2)}% (Price: $${rawPrice.toFixed(2)})`;
  }

  const base = ctx.dataset.meta?.basePrice;
  const pctChange = base ? ((rawPrice - base) / base) * 100 : 0;
  return `${ctx.dataset.label}: $${rawPrice.toFixed(2)} (${pctChange.toFixed(2)}%)`;
}

async function fetchYahooSeries(symbol, range = 'max', interval = '1wk') {
  const res = await fetch(`/api/stock?symbol=${symbol}&range=${range}&interval=${interval}`);
  if (!res.ok) {
    throw new Error(`Proxy fetch failed for ${symbol}: ${res.status}`);
  }

  const json = await res.json();
  const result = json?.chart?.result?.[0];
  const timestamps = result?.timestamp || [];
  const closes = result?.indicators?.quote?.[0]?.close || [];

  return timestamps
    .map((ts, i) => {
      const close = closes[i];
      if (close == null || Number.isNaN(close)) return null;
      return { x: new Date(ts * 1000), y: close };
    })
    .filter(Boolean);
}

export default function StockChartSection() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [mode, setMode] = useState('percent');
  const [years, setYears] = useState(5);
  const [warning, setWarning] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadedSeries, setLoadedSeries] = useState({ wmt: [], kr: [] });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsLoading(true);

      const [wmtResult, krResult] = await Promise.allSettled([
        fetchYahooSeries('WMT', 'max'),
        fetchYahooSeries('KR', 'max'),
      ]);

      if (cancelled) return;

      const next = { wmt: [], kr: [] };
      const failed = [];

      if (wmtResult.status === 'fulfilled') {
        next.wmt = wmtResult.value;
      } else {
        console.error(wmtResult.reason);
        failed.push('WMT');
      }

      if (krResult.status === 'fulfilled') {
        next.kr = krResult.value;
      } else {
        console.error(krResult.reason);
        failed.push('KR');
      }

      setLoadedSeries(next);
      setWarning(
        failed.length
          ? `Some live data failed to load (${failed.join(', ')}). Showing available series.`
          : ''
      );
      setIsLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const { datasets, commonStart } = useMemo(() => {
    const merged = {
      publix: SERIES.publix,
      wmt: { ...SERIES.wmt, data: loadedSeries.wmt },
      kr: { ...SERIES.kr, data: loadedSeries.kr },
    };

    const ranged = {
      publix: sliceByRange(merged.publix.data, years),
      wmt: sliceByRange(merged.wmt.data, years),
      kr: sliceByRange(merged.kr.data, years),
    };

    const { aligned, commonStart } = alignToCommonStart(ranged);

    const datasets = ['publix', 'wmt', 'kr'].map((key) => {
      const series = merged[key];
      const source = mode === 'percent' ? aligned[key] : ranged[key];
      const points = mode === 'percent' ? normalizePercent(source) : source;
      const basePrice = source?.[0]?.y ?? null;

      return {
        key,
        label: series.label,
        data: points,
        meta: { basePrice },
        borderColor: series.color,
        backgroundColor: series.color,
        borderWidth: 2.5,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: series.stepped ? 0 : 0.22,
        stepped: series.stepped,
        spanGaps: true,
      };
    });

    return { datasets, commonStart };
  }, [loadedSeries, mode, years]);

  useEffect(() => {
    if (!canvasRef.current || isLoading) return;

    if (!chartRef.current) {
      chartRef.current = new Chart(canvasRef.current, {
        type: 'line',
        data: { datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          parsing: false,
          interaction: {
            mode: 'nearest',
            intersect: false,
          },
          plugins: {
            legend: {
              position: 'top',
              labels: {
                usePointStyle: true,
                boxWidth: 10,
              },
            },
            tooltip: {
              callbacks: {
                title(items) {
                  const d = items?.[0]?.parsed?.x;
                  return d ? formatDate(new Date(d)) : '';
                },
                label(ctx) {
                  return tooltipLabel(ctx, mode);
                },
              },
            },
          },
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'month',
                tooltipFormat: 'MMM d, yyyy',
              },
              grid: {
                color: '#edf2f7',
                drawBorder: false,
              },
              title: {
                display: true,
                text: mode === 'percent' && commonStart ? `Date (aligned from ${formatDate(commonStart)})` : 'Date',
              },
            },
            y: {
              grid: {
                color(context) {
                  if (mode === 'percent' && context.tick?.value === 0) {
                    return '#b7c4d6';
                  }
                  return '#edf2f7';
                },
                lineWidth(context) {
                  if (mode === 'percent' && context.tick?.value === 0) {
                    return 1.5;
                  }
                  return 1;
                },
                drawBorder: false,
              },
              title: {
                display: true,
                text: mode === 'percent' ? '% Change from Common Start' : 'Price (USD)',
              },
              ticks: {
                callback(value) {
                  return mode === 'percent' ? `${Number(value).toFixed(0)}%` : `$${Number(value).toFixed(0)}`;
                },
              },
            },
          },
        },
      });
      return;
    }

    chartRef.current.data.datasets = datasets;
    chartRef.current.options.scales.x.title.text =
      mode === 'percent' && commonStart ? `Date (aligned from ${formatDate(commonStart)})` : 'Date';
    chartRef.current.options.scales.y.title.text =
      mode === 'percent' ? '% Change from Common Start' : 'Price (USD)';
    chartRef.current.options.scales.y.ticks.callback = (v) =>
      mode === 'percent' ? `${Number(v).toFixed(0)}%` : `$${Number(v).toFixed(0)}`;
    chartRef.current.update();
  }, [datasets, isLoading, mode, commonStart]);

  useEffect(() => {
    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, []);

  return (
    <section className="card chart-card">
      <div className="chart-top">
        <div>
          <h2>Stock Price Comparison (Publix vs Walmart vs Kroger)</h2>
          <p className="muted section-note">
            Interactive view with weekly live data for KR/WMT and quarterly Publix share updates.
          </p>
          {warning && <p className="muted section-note">{warning}</p>}
        </div>
        <div className="view-toggle" role="group" aria-label="Chart view toggle">
          <button
            id="mode-percent"
            className={`toggle-btn ${mode === 'percent' ? 'active' : ''}`}
            data-mode="percent"
            onClick={() => setMode('percent')}
          >
            % Change
          </button>
          <button
            id="mode-price"
            className={`toggle-btn ${mode === 'price' ? 'active' : ''}`}
            data-mode="price"
            onClick={() => setMode('price')}
          >
            Actual Price
          </button>
        </div>
      </div>

      <div className="range-buttons" role="group" aria-label="Select time range">
        {[1, 2, 3, 5, 'all'].map((r) => (
          <button
            key={r}
            className={`range-btn ${years === r ? 'active' : ''}`}
            data-range={r}
            onClick={() => setYears(r)}
          >
            {r === 'all' ? 'All' : `${r}Y`}
          </button>
        ))}
      </div>

      <div className="chart-wrap">
        {isLoading ? (
          <div className="muted">Loading chart data...</div>
        ) : (
          <canvas id="stockComparisonChart" ref={canvasRef} aria-label="Stock comparison chart" role="img" />
        )}
      </div>
    </section>
  );
}
