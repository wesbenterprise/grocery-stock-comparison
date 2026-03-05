import { NextResponse } from 'next/server';

const VALID_INTERVALS = new Set(['1d', '5d', '1wk', '1mo', '3mo']);
const VALID_RANGES = new Set(['1mo', '3mo', '6mo', '1y', '2y', '5y', '10y', 'ytd', 'max']);

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const symbol = (searchParams.get('symbol') || 'KR').toUpperCase();
  const range = searchParams.get('range');
  const interval = searchParams.get('interval') || '1wk';
  const period1 = searchParams.get('period1');
  const period2 = searchParams.get('period2');

  if (!/^[A-Z.\-]{1,10}$/.test(symbol)) {
    return NextResponse.json({ error: 'Invalid symbol' }, { status: 400 });
  }

  if (!VALID_INTERVALS.has(interval)) {
    return NextResponse.json({ error: 'Invalid interval' }, { status: 400 });
  }

  // Build Yahoo URL: use period1/period2 (unix seconds) when provided for
  // precise date ranges with true weekly granularity. Fall back to range param.
  let yahooUrl;
  if (period1 && period2) {
    const p1 = parseInt(period1, 10);
    const p2 = parseInt(period2, 10);
    if (isNaN(p1) || isNaN(p2) || p1 < 0 || p2 < p1) {
      return NextResponse.json({ error: 'Invalid period1/period2' }, { status: 400 });
    }
    yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&period1=${p1}&period2=${p2}`;
  } else {
    const r = range || 'max';
    if (!VALID_RANGES.has(r)) {
      return NextResponse.json({ error: 'Invalid range' }, { status: 400 });
    }
    yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${r}`;
  }

  try {
    const response = await fetch(yahooUrl, {
      headers: {
        Accept: 'application/json',
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Yahoo request failed (${response.status})` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stock data' }, { status: 500 });
  }
}
