import { NextResponse } from 'next/server';
import { PUBLIX_RAW } from '../../../lib/publix-data';

// Stocks in our basket
const BASKET = [
  { symbol: 'KR', label: 'Kroger' },
  { symbol: 'WMT', label: 'Walmart' },
  { symbol: 'ADRNY', label: 'Ahold' },
  { symbol: 'ACI', label: 'Albertsons' },
  { symbol: 'WMK', label: 'Weis' },
];

// Get the closing price for a stock nearest to a target date
async function getQuarterlyPrice(symbol, targetDate) {
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

    const targetMs = target.getTime();
    let bestIdx = 0, bestDiff = Infinity;
    for (let i = 0; i < timestamps.length; i++) {
      if (closes[i] == null) continue;
      const diff = Math.abs(timestamps[i] * 1000 - targetMs);
      if (diff < bestDiff) { bestDiff = diff; bestIdx = i; }
    }
    return closes[bestIdx] != null ? closes[bestIdx] : null;
  } catch {
    return null;
  }
}

// Map Publix quarter start dates to quarter END dates
function publixDateToQuarterEnd(dateStr) {
  const d = new Date(dateStr);
  const month = d.getMonth();
  const year = d.getFullYear();
  const endMonths = { 0: 2, 3: 5, 6: 8, 9: 11 };
  return new Date(year, endMonths[month] + 1, 0);
}

// Constrained least squares: weights >= 0 AND sum to 1.0
// Uses projected gradient descent with simplex projection
function fitWeights(A, b) {
  const n = A[0].length;
  const m = A.length;

  // Initialize equal weights
  let w = new Array(n).fill(1 / n);
  const lr = 0.001;
  const iterations = 100000;

  for (let iter = 0; iter < iterations; iter++) {
    // Adaptive learning rate
    const alpha = lr / (1 + iter * 0.00001);

    // Compute gradient: 2/m * A^T * (A*w - b)
    const grad = new Array(n).fill(0);
    for (let i = 0; i < m; i++) {
      let pred = 0;
      for (let j = 0; j < n; j++) pred += A[i][j] * w[j];
      const err = pred - b[i];
      for (let j = 0; j < n; j++) grad[j] += (2 / m) * A[i][j] * err;
    }

    // Gradient step
    for (let j = 0; j < n; j++) w[j] -= alpha * grad[j];

    // Project onto simplex: weights >= 0 and sum to 1
    // Using Duchi et al. (2008) simplex projection
    w = projectOntoSimplex(w);
  }

  return w;
}

// Project a vector onto the probability simplex (non-negative, sums to 1)
function projectOntoSimplex(v) {
  const n = v.length;
  const sorted = [...v].sort((a, b) => b - a);
  let tSum = 0;
  let tMax = -Infinity;

  for (let i = 0; i < n; i++) {
    tSum += sorted[i];
    const t = (tSum - 1) / (i + 1);
    if (sorted[i] - t > 0) tMax = t;
  }

  return v.map(vi => Math.max(vi - tMax, 0));
}

// R² (coefficient of determination)
function rSquared(actual, predicted) {
  const mean = actual.reduce((s, v) => s + v, 0) / actual.length;
  let ssRes = 0, ssTot = 0;
  for (let i = 0; i < actual.length; i++) {
    ssRes += (actual[i] - predicted[i]) ** 2;
    ssTot += (actual[i] - mean) ** 2;
  }
  return ssTot === 0 ? 0 : 1 - ssRes / ssTot;
}

export async function GET() {
  try {
    // Get Publix quarterly data for last 5 years (Q1 2021 through Q4 2025)
    const cutoff = '2021-01-01';
    const publixQuarters = PUBLIX_RAW.filter(p => p.date >= cutoff);

    // Fetch stock prices at each Publix quarter end
    const quarterData = [];

    for (const pq of publixQuarters) {
      const quarterEnd = publixDateToQuarterEnd(pq.date);
      let allValid = true;
      const stockPrices = {};

      const results = await Promise.all(
        BASKET.map(async (s) => ({
          symbol: s.symbol,
          price: await getQuarterlyPrice(s.symbol, quarterEnd),
        }))
      );

      for (const r of results) {
        if (r.price == null) { allValid = false; break; }
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

    // ── Normalize everything to indexed returns (base = first quarter = 1.0) ──
    const symbols = BASKET.map(s => s.symbol);
    const basePublix = quarterData[0].publix;
    const baseStocks = {};
    for (const s of symbols) baseStocks[s] = quarterData[0].stocks[s];

    // Normalized values: each stock / its starting price
    // So we're fitting: publix_index = w1 * KR_index + w2 * WMT_index + ...
    const A = quarterData.map(q =>
      symbols.map(s => q.stocks[s] / baseStocks[s])
    );
    const b = quarterData.map(q => q.publix / basePublix);

    // Fit weights (constrained: non-negative, sum to 1.0)
    const weights = fitWeights(A, b);

    // Verify weights sum to ~1.0
    const weightSum = weights.reduce((s, w) => s + w, 0);

    // Compute predicted INDEX values, then convert back to prices
    const predictedIndex = A.map(row =>
      row.reduce((sum, val, j) => sum + val * weights[j], 0)
    );
    const predicted = predictedIndex.map(idx => idx * basePublix);

    // R² on actual prices
    const actualPrices = quarterData.map(q => q.publix);
    const r2 = rSquared(actualPrices, predicted);

    // RMSE on actual prices
    const mse = actualPrices.reduce((sum, actual, i) =>
      sum + (actual - predicted[i]) ** 2, 0) / actualPrices.length;
    const rmse = Math.sqrt(mse);

    // Build weight results (sorted by weight descending)
    const weightResults = BASKET.map((s, i) => ({
      symbol: s.symbol,
      label: s.label,
      weight: weights[i],
      pct: (weights[i] * 100).toFixed(1) + '%',
    })).sort((a, b) => b.weight - a.weight);

    // Quarter-by-quarter results
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
    const currentPrices = {};
    const currentResults = await Promise.all(
      BASKET.map(async (s) => {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${s.symbol}?interval=1d&range=5d`;
        try {
          const res = await fetch(url, { headers: { Accept: 'application/json' } });
          const json = await res.json();
          const closes = json.chart?.result?.[0]?.indicators?.quote?.[0]?.close || [];
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

    // Project: compute the weighted normalized basket with current prices
    let q1Projection = null;
    if (Object.keys(currentPrices).length === BASKET.length) {
      const currentIndex = symbols.reduce(
        (sum, s, j) => sum + (currentPrices[s] / baseStocks[s]) * weights[j],
        0
      );
      q1Projection = Math.round(currentIndex * basePublix * 100) / 100;
    }

    return NextResponse.json({
      weights: weightResults,
      weightSum: Math.round(weightSum * 1000) / 1000,
      r2: Math.round(r2 * 10000) / 10000,
      rmse: Math.round(rmse * 100) / 100,
      dataPoints: quarterData.length,
      quarters: quarterResults,
      projection: {
        quarter: 'Q1 2026',
        date: '2026-03-31',
        predictedPrice: q1Projection,
        currentPrices,
        basePrices: baseStocks,
        lastActualPublix: publixQuarters[publixQuarters.length - 1].price,
        lastActualDate: publixQuarters[publixQuarters.length - 1].date,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
