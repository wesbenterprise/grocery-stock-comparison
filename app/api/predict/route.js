import { NextResponse } from 'next/server';
import { PUBLIX_RAW } from '../../../lib/publix-data';

// Stocks in our basket
const BASKET = [
  { symbol: 'WMT', label: 'Walmart' },
  { symbol: 'KR', label: 'Kroger' },
  { symbol: 'ADRNY', label: 'Ahold' },
  { symbol: 'ACI', label: 'Albertsons' },
  { symbol: 'WMK', label: 'Weis' },
];

// Get the closing price for a stock nearest to a target date
async function getQuarterlyPrice(symbol, targetDate) {
  // Fetch a window around the target date (+/- 10 days)
  const target = new Date(targetDate);
  const p1 = Math.floor((target.getTime() - 15 * 86400000) / 1000);
  const p2 = Math.floor((target.getTime() + 15 * 86400000) / 1000);

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&period1=${p1}&period2=${p2}`;

  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 86400 },
    });

    if (!res.ok) return null;
    const json = await res.json();
    const result = json.chart?.result?.[0];
    if (!result) return null;

    const timestamps = result.timestamp || [];
    const closes = result.indicators?.quote?.[0]?.close || [];

    // Find the closest trading day to the target
    const targetMs = target.getTime();
    let bestIdx = 0;
    let bestDiff = Infinity;

    for (let i = 0; i < timestamps.length; i++) {
      if (closes[i] == null) continue;
      const diff = Math.abs(timestamps[i] * 1000 - targetMs);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestIdx = i;
      }
    }

    return closes[bestIdx] != null ? closes[bestIdx] : null;
  } catch {
    return null;
  }
}

// Map Publix quarter start dates to quarter END dates
// Publix prices are set at end of quarter but labeled as start
function publixDateToQuarterEnd(dateStr) {
  const d = new Date(dateStr);
  const month = d.getMonth(); // 0=Jan (Q1 end Mar), 3=Apr (Q2 end Jun), 6=Jul (Q3 end Sep), 9=Oct (Q4 end Dec)
  const year = d.getFullYear();
  const endMonths = { 0: 2, 3: 5, 6: 8, 9: 11 };
  const endMonth = endMonths[month];
  // Last day of the end month
  const endDate = new Date(year, endMonth + 1, 0);
  return endDate;
}

// Least squares regression: find weights that minimize ||Ax - b||²
// With constraint: weights >= 0 (non-negative)
// Using iterative projected gradient descent
function fitWeights(A, b) {
  const n = A[0].length; // number of stocks
  const m = A.length; // number of observations

  // Initialize equal weights
  let w = new Array(n).fill(1 / n);
  const lr = 0.0001;
  const iterations = 50000;

  for (let iter = 0; iter < iterations; iter++) {
    // Compute gradient: A^T * (A*w - b)
    const grad = new Array(n).fill(0);
    for (let i = 0; i < m; i++) {
      let pred = 0;
      for (let j = 0; j < n; j++) pred += A[i][j] * w[j];
      const err = pred - b[i];
      for (let j = 0; j < n; j++) grad[j] += A[i][j] * err;
    }

    // Gradient step
    for (let j = 0; j < n; j++) {
      w[j] -= lr * grad[j];
    }

    // Project to non-negative
    for (let j = 0; j < n; j++) {
      if (w[j] < 0) w[j] = 0;
    }
  }

  return w;
}

// Compute R² (coefficient of determination)
function rSquared(actual, predicted) {
  const mean = actual.reduce((s, v) => s + v, 0) / actual.length;
  let ssRes = 0, ssTot = 0;
  for (let i = 0; i < actual.length; i++) {
    ssRes += (actual[i] - predicted[i]) ** 2;
    ssTot += (actual[i] - mean) ** 2;
  }
  return 1 - ssRes / ssTot;
}

export async function GET() {
  try {
    // Get Publix quarterly data for last 5 years (Q1 2021 through Q4 2025)
    const cutoff = '2021-01-01';
    const publixQuarters = PUBLIX_RAW.filter(p => p.date >= cutoff);

    // For each Publix quarter, get the closing price of each basket stock
    // at the quarter end date
    const quarterData = [];

    for (const pq of publixQuarters) {
      const quarterEnd = publixDateToQuarterEnd(pq.date);
      const stockPrices = {};
      let allValid = true;

      // Fetch all stocks for this quarter in parallel
      const results = await Promise.all(
        BASKET.map(async (s) => ({
          symbol: s.symbol,
          price: await getQuarterlyPrice(s.symbol, quarterEnd),
        }))
      );

      for (const r of results) {
        if (r.price == null) {
          allValid = false;
          break;
        }
        stockPrices[r.symbol] = r.price;
      }

      if (allValid) {
        quarterData.push({
          date: pq.date,
          quarterEnd: quarterEnd.toISOString().split('T')[0],
          publix: pq.price,
          stocks: stockPrices,
        });
      }
    }

    if (quarterData.length < 4) {
      return NextResponse.json({ error: 'Not enough data points' }, { status: 500 });
    }

    // Build matrices for regression
    // A[i] = [WMT_i, KR_i, ADRNY_i, ACI_i, WMK_i]  (stock prices)
    // b[i] = Publix_i
    const symbols = BASKET.map(s => s.symbol);
    const A = quarterData.map(q => symbols.map(s => q.stocks[s]));
    const b = quarterData.map(q => q.publix);

    // Fit optimal weights
    const weights = fitWeights(A, b);

    // Compute predicted values for each quarter
    const predicted = A.map(row =>
      row.reduce((sum, val, j) => sum + val * weights[j], 0)
    );

    // Compute R²
    const r2 = rSquared(b, predicted);

    // Compute RMSE
    const mse = b.reduce((sum, actual, i) => sum + (actual - predicted[i]) ** 2, 0) / b.length;
    const rmse = Math.sqrt(mse);

    // Build weight results
    const weightResults = BASKET.map((s, i) => ({
      symbol: s.symbol,
      label: s.label,
      weight: weights[i],
      pct: (weights[i] * 100).toFixed(1) + '%',
    })).sort((a, b) => b.weight - a.weight);

    // Build quarter-by-quarter results
    const quarterResults = quarterData.map((q, i) => ({
      date: q.date,
      quarterEnd: q.quarterEnd,
      actualPublix: q.publix,
      predictedPublix: Math.round(predicted[i] * 100) / 100,
      error: Math.round((predicted[i] - q.publix) * 100) / 100,
      errorPct: ((predicted[i] - q.publix) / q.publix * 100).toFixed(1) + '%',
      stocks: q.stocks,
    }));

    // ── Q1 2026 Projection ──────────────────────────────
    // Get CURRENT prices for each stock (latest close)
    const currentPrices = {};
    const currentResults = await Promise.all(
      BASKET.map(async (s) => {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${s.symbol}?interval=1d&range=5d`;
        try {
          const res = await fetch(url, { headers: { Accept: 'application/json' } });
          const json = await res.json();
          const closes = json.chart?.result?.[0]?.indicators?.quote?.[0]?.close || [];
          // Get last valid close
          for (let i = closes.length - 1; i >= 0; i--) {
            if (closes[i] != null) return { symbol: s.symbol, price: closes[i] };
          }
          return { symbol: s.symbol, price: null };
        } catch {
          return { symbol: s.symbol, price: null };
        }
      })
    );

    for (const r of currentResults) {
      if (r.price != null) currentPrices[r.symbol] = r.price;
    }

    // Project Publix Q1 2026 price
    let q1Projection = null;
    if (Object.keys(currentPrices).length === BASKET.length) {
      q1Projection = symbols.reduce(
        (sum, s, j) => sum + currentPrices[s] * weights[j],
        0
      );
      q1Projection = Math.round(q1Projection * 100) / 100;
    }

    return NextResponse.json({
      weights: weightResults,
      r2: Math.round(r2 * 10000) / 10000,
      rmse: Math.round(rmse * 100) / 100,
      dataPoints: quarterData.length,
      quarters: quarterResults,
      projection: {
        quarter: 'Q1 2026',
        date: '2026-03-31',
        predictedPrice: q1Projection,
        currentPrices,
        lastActualPublix: publixQuarters[publixQuarters.length - 1].price,
        lastActualDate: publixQuarters[publixQuarters.length - 1].date,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
