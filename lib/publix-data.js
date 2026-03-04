// lib/publix-data.js
// Single source of truth for Publix quarterly share price data.
// Imported by StockChart.js (main comparison) and the /publix-history page.
//
// All prices are 2022 5-for-1 split-adjusted.
// Sources: publixstockholder.com, SEC EDGAR 8-K, Al Ebeling/Barney Barnett spreadsheet

export const PUBLIX_RAW = [
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
  { date: '2017-10-01', price: 8.28 },  // $41.40 pre-split, effective Mar 1 2018
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

/**
 * Helper: convert a PUBLIX_RAW start-of-quarter date to end-of-quarter date.
 * Jan 1 (Q1) → Mar 31 | Apr 1 (Q2) → Jun 30 | Jul 1 (Q3) → Sep 30 | Oct 1 (Q4) → Dec 31
 */
export function endOfQuarter(dateStr) {
  const d = new Date(dateStr);
  const month = d.getMonth();
  if (month === 0)  return new Date(d.getFullYear(), 2, 31);
  if (month === 3)  return new Date(d.getFullYear(), 5, 30);
  if (month === 6)  return new Date(d.getFullYear(), 8, 30);
  return new Date(d.getFullYear(), 11, 31);
}

/**
 * Quarter label from a date string: '2013-01-01' → 'Q1 2013'
 */
export function quarterLabel(dateStr) {
  const month = parseInt(dateStr.substring(5, 7), 10);
  const year  = dateStr.substring(0, 4);
  if (month === 1)  return `Q1 ${year}`;
  if (month === 4)  return `Q2 ${year}`;
  if (month === 7)  return `Q3 ${year}`;
  return `Q4 ${year}`;
}

/**
 * Pre-expand Publix stepped data for chart rendering.
 * Each quarter: one dot at end-of-quarter, plus a flat step connector to next quarter.
 */
export const PUBLIX_EXPANDED = (() => {
  const pts = [];
  for (let i = 0; i < PUBLIX_RAW.length; i++) {
    const curr = PUBLIX_RAW[i];
    const next = PUBLIX_RAW[i + 1];
    const eoc = endOfQuarter(curr.date);

    // Actual data point (renders dot)
    pts.push({ x: eoc, y: curr.price, showDot: true });

    // Step connector — holds price flat until next quarter (no dot)
    if (next) {
      const nextEoc = endOfQuarter(next.date);
      const beforeNext = new Date(nextEoc);
      beforeNext.setDate(beforeNext.getDate() - 1);
      pts.push({ x: beforeNext, y: curr.price, showDot: false });
    }
  }
  return pts;
})();

/**
 * All known Publix stock splits.
 */
export const SPLIT_HISTORY = [
  { date: 'April 1969',    ratio: '4-for-1',  multiplier: 4  },
  { date: 'April 1984',    ratio: '10-for-1', multiplier: 10 },
  { date: 'April 1992',    ratio: '5-for-1',  multiplier: 5  },
  { date: 'April 2006',    ratio: '5-for-1',  multiplier: 5  },
  { date: 'April 2022',    ratio: '5-for-1',  multiplier: 5  },
];

/**
 * Enriched quarterly rows with change calculations, pre-split price, and event flags.
 * Used by the history page data table.
 */
export const PUBLIX_TABLE_ROWS = PUBLIX_RAW.map((entry, i) => {
  const prev = PUBLIX_RAW[i - 1] ?? null;
  const year   = parseInt(entry.date.substring(0, 4), 10);
  const month  = parseInt(entry.date.substring(5, 7), 10);
  const quarter = month === 1 ? 'Q1' : month === 4 ? 'Q2' : month === 7 ? 'Q3' : 'Q4';

  const pctChange = prev ? ((entry.price - prev.price) / prev.price) * 100 : null;
  const dolChange = prev ? entry.price - prev.price : null;

  // Pre-2022-split actual price: split-adjusted × 5
  const isBefore2022Split = entry.date < '2022-04-01';
  const actualPrice = isBefore2022Split ? entry.price * 5 : entry.price;

  // Notable event flags
  let event = null;
  if (entry.date === '2008-10-01') event = 'financial-crisis';
  if (entry.date === '2022-04-01') event = 'split';
  if (entry.date === '2025-04-01') event = 'ath';
  if (entry.date === '2025-07-01') event = 'decline-streak';
  if (entry.date === '2025-10-01') event = 'decline-streak';

  return {
    date: entry.date,
    year,
    quarter,
    price: entry.price,
    actualPrice,
    isBefore2022Split,
    pctChange,
    dolChange,
    event,
  };
});
