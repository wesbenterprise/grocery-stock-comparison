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

const YAHOO_HEADERS = {
  Accept: 'application/json',
};

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

const state = {
  chart: null,
  mode: 'percent',
  years: 5,
};

async function fetchYahooSeries(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1wk&range=5y`;
  const res = await fetch(url, { headers: YAHOO_HEADERS });
  if (!res.ok) {
    throw new Error(`Yahoo fetch failed for ${symbol}: ${res.status}`);
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

function getRangeStartDate(years) {
  const now = new Date();
  const start = new Date(now);
  start.setFullYear(now.getFullYear() - years);
  const floor = new Date('2020-01-01T00:00:00Z');
  return start < floor ? floor : start;
}

function sliceByRange(data, years) {
  const startDate = getRangeStartDate(years);
  return data.filter((p) => p.x >= startDate);
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

function buildDatasets() {
  const keys = ['publix', 'wmt', 'kr'];
  return keys.map((key) => {
    const series = SERIES[key];
    const ranged = sliceByRange(series.data, state.years);
    const points = state.mode === 'percent' ? normalizePercent(ranged) : ranged;

    return {
      key,
      label: series.label,
      data: points,
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
}

function tooltipLabel(ctx) {
  const val = ctx.parsed.y;
  const point = ctx.raw || {};
  const rawPrice = point.rawPrice ?? point.y ?? val;
  const pct = point.rawPrice != null ? point.y : val;

  if (state.mode === 'percent') {
    return `${ctx.dataset.label}: ${pct.toFixed(2)}% (Price: $${rawPrice.toFixed(2)})`;
  }

  const base = sliceByRange(SERIES[ctx.dataset.key].data, state.years)[0]?.y;
  const pctChange = base ? ((rawPrice - base) / base) * 100 : 0;
  return `${ctx.dataset.label}: $${rawPrice.toFixed(2)} (${pctChange.toFixed(2)}%)`;
}

function renderChart() {
  const canvas = document.getElementById('stockComparisonChart');
  const datasets = buildDatasets();

  if (state.chart) {
    state.chart.data.datasets = datasets;
    state.chart.options.scales.y.title.text = state.mode === 'percent' ? '% Change from Start' : 'Price (USD)';
    state.chart.options.scales.y.ticks.callback = (v) =>
      state.mode === 'percent' ? `${Number(v).toFixed(0)}%` : `$${Number(v).toFixed(0)}`;
    state.chart.update();
    return;
  }

  state.chart = new Chart(canvas, {
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
        },
        tooltip: {
          callbacks: {
            title(items) {
              const d = items?.[0]?.parsed?.x;
              return d ? formatDate(new Date(d)) : '';
            },
            label: tooltipLabel,
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
          title: {
            display: true,
            text: 'Date',
          },
        },
        y: {
          title: {
            display: true,
            text: '% Change from Start',
          },
          ticks: {
            callback(value) {
              return state.mode === 'percent' ? `${Number(value).toFixed(0)}%` : `$${Number(value).toFixed(0)}`;
            },
          },
        },
      },
    },
  });
}

function bindControls() {
  document.querySelectorAll('.range-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.range-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.years = Number(btn.dataset.range);
      renderChart();
    });
  });

  document.querySelectorAll('.toggle-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.toggle-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.mode = btn.dataset.mode;
      renderChart();
    });
  });
}

function showChartError(message) {
  const wrap = document.querySelector('.chart-wrap');
  if (!wrap) return;
  wrap.innerHTML = `<div class="muted">${message}</div>`;
}

async function init() {
  bindControls();
  try {
    const [wmt, kr] = await Promise.all([fetchYahooSeries('WMT'), fetchYahooSeries('KR')]);
    SERIES.wmt.data = wmt;
    SERIES.kr.data = kr;
    renderChart();
  } catch (err) {
    console.error(err);
    showChartError('Unable to load live Yahoo Finance data right now. Please refresh to try again.');
  }
}

init();
