'use client';

import { useState, useMemo } from 'react';
import { QUARTERS, getMarginColor } from '../../../lib/publix-financials';

const COLUMNS = [
  { key: 'period', label: 'Quarter', align: 'left', format: (q) => q.period },
  { key: 'revenue', label: 'Revenue', align: 'right', format: (q) => `$${Math.round(q.revenue / 1e6).toLocaleString()}M` },
  { key: 'netIncome', label: 'Net Income', align: 'right', format: (q) => `$${Math.round(q.netIncome / 1e6).toLocaleString()}M` },
  { key: 'netMarginPct', label: 'Net Margin %', align: 'right', format: (q) => `${q.netMarginPct.toFixed(2)}%`, color: (q) => getMarginColor(q.netMarginPct, 'net') },
  { key: 'grossMarginPct', label: 'Gross Margin %', align: 'right', format: (q) => `${q.grossMarginPct.toFixed(2)}%` },
  { key: 'epsBasic', label: 'EPS', align: 'right', format: (q) => `$${q.epsBasic.toFixed(2)}` },
  { key: 'storeCount', label: 'Stores', align: 'right', format: (q) => q.storeCount.toLocaleString() },
];

export default function DataTable() {
  const [expanded, setExpanded] = useState(false);
  const [sortKey, setSortKey] = useState('period');
  const [sortDir, setSortDir] = useState('desc');

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const sorted = useMemo(() => {
    const arr = [...QUARTERS];
    arr.sort((a, b) => {
      let va = a[sortKey], vb = b[sortKey];
      if (typeof va === 'string') { va = va.toLowerCase(); vb = vb.toLowerCase(); }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [sortKey, sortDir]);

  return (
    <div>
      <button onClick={() => setExpanded(e => !e)} style={{
        width: '100%', padding: 16, background: '#1a1a1a',
        border: '1px solid #2a2a2a', borderRadius: 12, color: '#a3a3a3',
        fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', textAlign: 'center',
        transition: 'all 150ms ease',
      }}
        onMouseEnter={e => { e.target.style.borderColor = '#C8A05040'; e.target.style.color = '#C8A050'; }}
        onMouseLeave={e => { e.target.style.borderColor = '#2a2a2a'; e.target.style.color = '#a3a3a3'; }}
      >
        {expanded ? 'Hide Raw Data ▴' : 'View Raw Data ▾'}
      </button>

      {expanded && (
        <div style={{
          maxHeight: 500, overflowY: 'auto', overflowX: 'auto',
          borderRadius: 12, border: '1px solid #2a2a2a', marginTop: 16,
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr>
                {COLUMNS.map(col => {
                  const isSorted = sortKey === col.key;
                  return (
                    <th key={col.key} onClick={() => handleSort(col.key)} style={{
                      background: '#1a1a1a', color: '#C8A050', fontSize: '0.75rem',
                      fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
                      padding: '12px 16px', textAlign: col.align, borderBottom: '1px solid #2a2a2a',
                      whiteSpace: 'nowrap', cursor: 'pointer',
                    }}>
                      {col.label}{isSorted ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {sorted.map((q, i) => (
                <tr key={q.period} style={{
                  background: i % 2 === 0 ? '#0a0a0a' : '#141414',
                }}>
                  {COLUMNS.map(col => (
                    <td key={col.key} style={{
                      padding: '10px 16px', textAlign: col.align,
                      color: col.color ? col.color(q) : (col.key === 'period' ? '#a3a3a3' : '#e5e5e5'),
                      fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap',
                      borderBottom: '1px solid #1a1a1a',
                      fontWeight: col.key === 'period' ? 500 : 400,
                    }}>
                      {col.format(q)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
