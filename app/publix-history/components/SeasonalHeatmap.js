'use client';

import {
  SEASONALITY_MATRIX, REVENUE_MATRIX, getCellBackground, getMinMax, getCellTooltip,
} from '../../../lib/publix-financials';

export default function SeasonalHeatmap({ yearRange }) {
  const startYear = yearRange[0];
  const endYear = yearRange[1];

  const visibleMargin = SEASONALITY_MATRIX.filter(r => r.year >= startYear && r.year <= endYear);
  const visibleYears = visibleMargin.map(r => r.year);
  const { min, max } = getMinMax(REVENUE_MATRIX, visibleYears);

  const quarters = [1, 2, 3, 4];

  return (
    <div style={{
      background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 12, padding: 24,
    }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#e5e5e5', margin: '0 0 16px 0' }}>
        Revenue Seasonality
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '60px repeat(4, 1fr)',
        gap: 3,
      }}>
        {/* Header row */}
        <div />
        {quarters.map(q => (
          <div key={q} style={{
            fontSize: '0.75rem', fontWeight: 600, color: '#a3a3a3',
            textAlign: 'center', padding: '8px 0',
          }}>
            Q{q}
          </div>
        ))}

        {/* Data rows */}
        {visibleMargin.map(row => {
          const revRow = REVENUE_MATRIX.find(r => r.year === row.year);
          return [
            <div key={`y-${row.year}`} style={{
              fontSize: '0.75rem', fontWeight: 500, color: '#a3a3a3',
              display: 'flex', alignItems: 'center', paddingRight: 8,
            }}>
              {row.year}
            </div>,
            ...quarters.map(q => {
              const qKey = `q${q}`;
              const revenue = revRow ? revRow[qKey] : 0;
              const marginVal = row[qKey];
              const bg = getCellBackground(revenue, min, max);
              const tooltip = getCellTooltip(row, q, REVENUE_MATRIX);
              return (
                <div key={`${row.year}-q${q}`} title={tooltip} style={{
                  borderRadius: 4, padding: '8px 4px', textAlign: 'center',
                  fontSize: '0.7rem', fontWeight: 500, fontVariantNumeric: 'tabular-nums',
                  color: '#e5e5e5', background: bg, minHeight: 36,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'default',
                }}>
                  {marginVal.toFixed(1)}%
                </div>
              );
            }),
          ];
        })}
      </div>
      <p style={{ fontSize: '0.7rem', color: '#a3a3a3', marginTop: 8, textAlign: 'center' }}>
        Cell color = revenue intensity · Values = net margin %
      </p>
    </div>
  );
}
