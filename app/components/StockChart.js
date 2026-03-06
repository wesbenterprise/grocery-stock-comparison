'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { PUBLIX_RAW } from '../../lib/publix-data';

// All dates pinned to noon ET (17:00 UTC) so the calendar date is stable
// regardless of the viewer's browser timezone. US markets run on Eastern Time.
const NOON_ET = 17; // noon ET ≈ 17:00 UTC (EST; 16:00 during EDT — close enough)

function noonET(year, month, day) {
  return new Date(Date.UTC(year, month, day, NOON_ET));
}

// Publix raw data dates represent the quarter the price applies to (Jan=Q1, etc.).
// Plot at end-of-quarter: Jan→Mar 31, Apr→Jun 30, Jul→Sep 30, Oct→Dec 31.
// E.g. '2025-10-01' ($19.65) plots at Dec 31, 2025.
const PUBLIX_POINTS = PUBLIX_RAW.map(p => {
  const year  = parseInt(p.date.substring(0, 4), 10);
  const month = parseInt(p.date.substring(5, 7), 10);
  if (month === 1) return { x: noonET(year, 2, 31), y: p.price };  // Mar 31
  if (month === 4) return { x: noonET(year, 5, 30), y: p.price };  // Jun 30
  if (month === 7) return { x: noonET(year, 8, 30), y: p.price };  // Sep 30
  return { x: noonET(year, 11, 31), y: p.price };                   // Dec 31
});

// Period definitions: startMonth/endMonth are 0-indexed (Jan=0)
const PERIODS = [
  { label: 'Q1',        startMonth: 0,  endMonth: 2  },
  { label: 'Q2',        startMonth: 3,  endMonth: 5  },
  { label: 'Q3',        startMonth: 6,  endMonth: 8  },
  { label: 'Q4',        startMonth: 9,  endMonth: 11 },
  { label: 'H1',        startMonth: 0,  endMonth: 5  },
  { label: 'H2',        startMonth: 6,  endMonth: 11 },
  { label: 'First 3Q',  startMonth: 0,  endMonth: 8  },
  { label: 'Full Year', startMonth: 0,  endMonth: 11 },
  { label: 'YTD',       startMonth: 0,  endMonth: 11, ytd: true },
];

// Return only periods whose date range is fully in the past, plus YTD for the
// current year. For past years every period is available.
function getAvailablePeriods(year) {
  const now = new Date();
  const currentYear = now.getFullYear();
  if (year < currentYear) return PERIODS;
  // Current (or future) year: only completed periods + YTD
  const currentMonth = now.getMonth(); // 0-indexed
  return PERIODS.filter(p => {
    if (p.ytd) return true;
    // Period is complete when we're past its endMonth (i.e. currentMonth > endMonth)
    return currentMonth > p.endMonth;
  });
}

const MIN_YEAR = 2006;
const MAX_YEAR = new Date().getFullYear(); // always include current year
const YEARS    = Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => MAX_YEAR - i); // latest first

const COLORS = {
  publix:  '#4caf50',
  walmart: '#0071ce',
  kroger:  '#e31837',
  ahold:   '#ff6f00',
  albertsons: '#9c27b0',
  weis:    '#00bcd4',
};

function getDateRange(year, periodLabel, rangeEndYear) {
  // Multi-year range: full years from startYear through endYear
  if (rangeEndYear != null && rangeEndYear !== year) {
    const start = new Date(Date.UTC(year, 0, 1, 5));
    const now = new Date();
    const endYr = rangeEndYear;
    const end = endYr >= now.getFullYear()
      ? now
      : new Date(Date.UTC(endYr, 11, 31, 23, 59, 59, 999));
    return { start, end };
  }
  const period = PERIODS.find(p => p.label === periodLabel);
  if (!period) return { start: null, end: null };
  // Range boundaries at midnight ET (05:00 UTC) for start, 11:59pm ET for end
  const start = new Date(Date.UTC(year, period.startMonth, 1, 5));
  let end;
  if (period.ytd) {
    const now = new Date();
    const endOfYear = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));
    end = year < now.getFullYear() ? endOfYear : now;
  } else {
    // Last day of endMonth: day 0 of next month = last day of endMonth
    const lastDay = new Date(Date.UTC(year, period.endMonth + 1, 0));
    end = new Date(Date.UTC(year, period.endMonth, lastDay.getUTCDate(), 23, 59, 59, 999));
  }
  return { start, end };
}

function filterByDateRange(pts, start, end) {
  return pts.filter(p => {
    const d = p.x instanceof Date ? p.x : new Date(p.x || p.date);
    return d >= start && d <= end;
  });
}

// For sparse (quarterly) data: include one point before and after the range
// so the line extends through the full period rather than stopping at the
// last in-range point (e.g. Oct 1 for a full-year view).
function filterWithNeighbors(pts, start, end) {
  let firstIn = -1, lastIn = -1;
  for (let i = 0; i < pts.length; i++) {
    const t = pts[i].x.getTime();
    if (t >= start.getTime() && t <= end.getTime()) {
      if (firstIn === -1) firstIn = i;
      lastIn = i;
    }
  }
  if (firstIn === -1) return [];
  const lo = Math.max(0, firstIn - 1);
  const hi = Math.min(pts.length - 1, lastIn + 1);
  return pts.slice(lo, hi + 1);
}

function normalizeArr(arr) {
  if (!arr.length) return arr;
  const base = arr[0].y;
  if (!base) return arr;
  return arr.map(p => ({ x: p.x, y: ((p.y - base) / base) * 100 }));
}

export default function StockChart({ onLiveDataLoaded }) {
  const canvasRef    = useRef(null);
  const chartRef     = useRef(null);

  const [loading, setLoading]               = useState(true);
  const [liveData, setLiveData]             = useState({ KR: null, WMT: null, ADRNY: null, ACI: null, WMK: null });
  const [allTime, setAllTime]               = useState(true);
  const [selectedYear, setSelectedYear]     = useState(MAX_YEAR);
  const [endYear, setEndYear]               = useState(MAX_YEAR);
  const [selectedPeriod, setSelectedPeriod] = useState('Full Year');
  const [viewMode, setViewMode]             = useState('percent');
  const [hidden, setHidden]                 = useState({ publix: false, walmart: false, kroger: false, ahold: false, albertsons: false, weis: false });
  const [chartReady, setChartReady]         = useState(false);
  const [noData, setNoData]                 = useState({ KR: false, WMT: false, ADRNY: false, ACI: false, WMK: false });

  // Fetch Yahoo Finance daily data for accurate prices
  useEffect(() => {
    let cancelled = false;
    const p1 = Math.floor(Date.UTC(MIN_YEAR, 0, 1) / 1000);
    const p2 = Math.floor(Date.now() / 1000);

    async function fetchSymbol(symbol) {
      try {
        const res  = await fetch(`/api/stock?symbol=${symbol}&interval=1d&period1=${p1}&period2=${p2}`);
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

    Promise.all([
      fetchSymbol('KR'), fetchSymbol('WMT'),
      fetchSymbol('ADRNY'), fetchSymbol('ACI'), fetchSymbol('WMK'),
    ]).then(([kr, wmt, adrny, aci, wmk]) => {
      if (cancelled) return;
      setLiveData({ KR: kr, WMT: wmt, ADRNY: adrny, ACI: aci, WMK: wmk });
      setLoading(false);

      if (onLiveDataLoaded) {
        onLiveDataLoaded({
          KR:    { price: kr?.at(-1)?.y,    prev: kr?.at(-5)?.y    },
          WMT:   { price: wmt?.at(-1)?.y,   prev: wmt?.at(-5)?.y   },
          ADRNY: { price: adrny?.at(-1)?.y, prev: adrny?.at(-5)?.y },
          ACI:   { price: aci?.at(-1)?.y,   prev: aci?.at(-5)?.y   },
          WMK:   { price: wmk?.at(-1)?.y,   prev: wmk?.at(-5)?.y   },
        });
      }
    });

    return () => { cancelled = true; };
  }, [onLiveDataLoaded]);

  // Build datasets from current selection
  // Returns { datasets, dateRange } where dateRange is { start, end } or null for all-time
  const buildDatasets = useCallback((viewModeArg, allTimeArg, yearArg, periodArg, hiddenArg, liveArg, endYearArg) => {
    let publixPts, krPts, wmtPts, adrnyPts, aciPts, wmkPts;
    let dateRange = null;

    const live = (sym) => liveArg[sym] ? [...liveArg[sym]] : [];
    const liveFilter = (sym, s, e) => liveArg[sym] ? filterByDateRange(liveArg[sym], s, e) : [];

    if (allTimeArg) {
      publixPts = [...PUBLIX_POINTS];
      krPts = live('KR'); wmtPts = live('WMT');
      adrnyPts = live('ADRNY'); aciPts = live('ACI'); wmkPts = live('WMK');
    } else {
      const isRange = endYearArg != null && endYearArg !== yearArg;
      const { start, end } = getDateRange(yearArg, periodArg, isRange ? endYearArg : undefined);
      dateRange = { start, end };
      publixPts = filterWithNeighbors(PUBLIX_POINTS, start, end);
      krPts = liveFilter('KR', start, end); wmtPts = liveFilter('WMT', start, end);
      adrnyPts = liveFilter('ADRNY', start, end); aciPts = liveFilter('ACI', start, end);
      wmkPts = liveFilter('WMK', start, end);
    }

    // Track which live series have no data for the selected range
    const noDataMap = {
      KR:    !allTimeArg && liveArg.KR    && krPts.length === 0,
      WMT:   !allTimeArg && liveArg.WMT   && wmtPts.length === 0,
      ADRNY: !allTimeArg && liveArg.ADRNY && adrnyPts.length === 0,
      ACI:   !allTimeArg && liveArg.ACI   && aciPts.length === 0,
      WMK:   !allTimeArg && liveArg.WMK   && wmkPts.length === 0,
    };

    if (viewModeArg === 'percent') {
      publixPts = normalizeArr(publixPts);
      krPts     = normalizeArr(krPts);
      wmtPts    = normalizeArr(wmtPts);
      adrnyPts  = normalizeArr(adrnyPts);
      aciPts    = normalizeArr(aciPts);
      wmkPts    = normalizeArr(wmkPts);
    }

    const makeLiveDataset = (label, data, color, hiddenKey, order) => ({
      label, data,
      borderColor: color,
      backgroundColor: 'transparent',
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: color,
      pointHoverBorderColor: '#16161f',
      pointHoverBorderWidth: 2,
      tension: 0.15,
      hidden: hiddenArg[hiddenKey],
      order,
    });

    return { dateRange, noDataMap, datasets: [
      {
        label: 'Publix',
        data: publixPts,
        borderColor: COLORS.publix,
        backgroundColor: 'transparent',
        borderWidth: 2.5,
        pointRadius: 3,
        pointHoverRadius: 7,
        pointBackgroundColor: COLORS.publix,
        pointBorderColor: '#16161f',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: COLORS.publix,
        pointHoverBorderColor: '#16161f',
        pointHoverBorderWidth: 2,
        tension: 0,
        hidden: hiddenArg.publix,
        order: 1,
      },
      makeLiveDataset('Walmart',    wmtPts,   COLORS.walmart,    'walmart',    2),
      makeLiveDataset('Kroger',     krPts,    COLORS.kroger,     'kroger',     3),
      makeLiveDataset('Ahold',      adrnyPts, COLORS.ahold,      'ahold',      4),
      makeLiveDataset('Albertsons', aciPts,   COLORS.albertsons, 'albertsons', 5),
      makeLiveDataset('Weis',       wmkPts,   COLORS.weis,       'weis',       6),
    ] };
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

      const { datasets, dateRange, noDataMap } = buildDatasets(viewMode, allTime, selectedYear, selectedPeriod, hidden, liveData, endYear);
      setNoData(noDataMap || {});

      chartRef.current = new Chart(canvasRef.current, {
        type: 'line',
        data: { datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          animation: { duration: 400 },
          elements: {
            point: { radius: 0, hoverRadius: 6 },
            line: { borderWidth: 2 },
          },
          scales: {
            x: {
              type: 'time',
              max: dateRange ? dateRange.end.getTime() : undefined,
              time: {
                displayFormats: { day: 'MMM d', week: 'MMM d', month: 'MMM yy', quarter: 'QQQ yyyy', year: 'yyyy' },
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

    const { datasets, dateRange, noDataMap } = buildDatasets(viewMode, allTime, selectedYear, selectedPeriod, hidden, liveData, endYear);
    chartRef.current.data.datasets = datasets;

    // Set x-axis max to end of selected period (don't set min so data starts at left edge)
    if (dateRange) {
      delete chartRef.current.options.scales.x.min;
      chartRef.current.options.scales.x.max = dateRange.end.getTime();
    } else {
      delete chartRef.current.options.scales.x.min;
      delete chartRef.current.options.scales.x.max;
    }

    chartRef.current.options.scales.y.ticks.callback = formatY;
    chartRef.current.options.plugins.tooltip.callbacks.label = (ctx) => {
      const val = ctx.parsed.y;
      const fmt = viewMode === 'percent'
        ? (val >= 0 ? '+' : '') + val.toFixed(2) + '%'
        : '$' + val.toFixed(2);
      return `  ${ctx.dataset.label}:  ${fmt}`;
    };

    setNoData(noDataMap || {});

    chartRef.current.update('active');
  }, [allTime, selectedYear, endYear, selectedPeriod, viewMode, hidden, chartReady, buildDatasets, liveData]);

  const toggleSeries = (key) => {
    setHidden(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isRange = !allTime && selectedYear !== endYear;

  const handleYearSelect = (year) => {
    setAllTime(false);
    setSelectedYear(year);
    // If the new start year is after endYear, move endYear to match
    if (year > endYear) setEndYear(year);
    // If the current period isn't available for this year, pick the best default
    const available = getAvailablePeriods(year);
    if (!available.find(p => p.label === selectedPeriod)) {
      const fullYear = available.find(p => p.label === 'Full Year');
      setSelectedPeriod(fullYear ? 'Full Year' : available[available.length - 1].label);
    }
  };

  const handleEndYearSelect = (year) => {
    setEndYear(year);
  };

  return (
    <div className="chart-section">
      <div className="section-header">
        <h2 className="section-title">Stock Performance</h2>
        <span className="section-subtitle">Publix (quarterly) · KR, WMT, ADRNY, ACI &amp; WMK live</span>
      </div>

      <div className="chart-controls">
        {/* All Time + year dropdown + period dropdown (inline) */}
        <div className="year-selector-row">
          <button
            className={`range-btn all-time-btn${allTime ? ' active' : ''}`}
            onClick={() => setAllTime(true)}
            aria-pressed={allTime}
          >
            All Time
          </button>

          <select
            className="year-dropdown"
            value={allTime ? '' : selectedYear}
            onChange={(e) => {
              const val = e.target.value;
              if (val) handleYearSelect(Number(val));
            }}
            aria-label="Select start year"
          >
            <option value="" disabled>Year…</option>
            {YEARS.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          {!allTime && (
            <>
              <span className="year-range-dash">–</span>
              <select
                className="year-dropdown"
                value={endYear}
                onChange={(e) => handleEndYearSelect(Number(e.target.value))}
                aria-label="Select end year"
              >
                {YEARS.filter(y => y >= selectedYear).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </>
          )}

          {!allTime && !isRange && (
            <select
              className="year-dropdown"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              aria-label="Select period"
            >
              {getAvailablePeriods(selectedYear).map(p => (
                <option key={p.label} value={p.label}>{p.label}</option>
              ))}
            </select>
          )}
        </div>

        {/* View toggle: Price / % Change */}
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

      {viewMode === 'price' && (
        <div className="chart-price-note">
          ⚠️ Note: Stocks have very different price scales. Use <strong>% Change</strong> for direct comparison.
        </div>
      )}

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

        {Object.values(noData).some(Boolean) && (
          <div className="chart-no-data-notice">
            No data available for{' '}
            {[
              noData.KR && 'Kroger (KR)', noData.WMT && 'Walmart (WMT)',
              noData.ADRNY && 'Ahold (ADRNY)', noData.ACI && 'Albertsons (ACI)',
              noData.WMK && 'Weis (WMK)',
            ].filter(Boolean).join(', ')}{' '}
            in {isRange ? `${selectedYear}–${endYear}` : `${selectedYear} ${selectedPeriod !== 'Full Year' ? selectedPeriod : ''}`}
          </div>
        )}

        <div className="chart-legend" role="list">
          {[
            { key: 'publix',     label: 'Publix',     note: 'quarterly' },
            { key: 'walmart',    label: 'Walmart',    note: 'WMT' },
            { key: 'kroger',     label: 'Kroger',     note: 'KR' },
            { key: 'ahold',      label: 'Ahold',      note: 'ADRNY' },
            { key: 'albertsons', label: 'Albertsons', note: 'ACI' },
            { key: 'weis',       label: 'Weis',       note: 'WMK' },
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
