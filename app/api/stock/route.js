import { NextResponse } from 'next/server';

const VALID_INTERVALS = new Set(['1d', '5d', '1wk', '1mo', '3mo']);
const VALID_RANGES = new Set(['1mo', '3mo', '6mo', '1y', '2y', '5y', '10y', 'ytd', 'max']);

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const symbol = (searchParams.get('symbol') || 'KR').toUpperCase();
  const range = searchParams.get('range') || 'max';
  const interval = searchParams.get('interval') || '1wk';

  if (!/^[A-Z.\-]{1,10}$/.test(symbol)) {
    return NextResponse.json({ error: 'Invalid symbol' }, { status: 400 });
  }

  if (!VALID_RANGES.has(range)) {
    return NextResponse.json({ error: 'Invalid range' }, { status: 400 });
  }

  if (!VALID_INTERVALS.has(interval)) {
    return NextResponse.json({ error: 'Invalid interval' }, { status: 400 });
  }

  const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`;

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
