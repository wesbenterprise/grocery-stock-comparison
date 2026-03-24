'use client';

const presets = [
  { label: 'All', range: [2015, 2025], key: 'all' },
  { label: 'Last 5yr', range: [2021, 2025], key: '5yr' },
  { label: 'Last 3yr', range: [2023, 2025], key: '3yr' },
];

export default function YearRangeSelector({ yearRange, setYearRange, activePreset, setActivePreset }) {
  const handlePreset = (p) => {
    setYearRange(p.range);
    setActivePreset(p.key);
  };

  const handleYear = (year) => {
    setYearRange([year, year]);
    setActivePreset(null);
  };

  const years = Array.from({ length: 11 }, (_, i) => 2015 + i);

  const btnBase = {
    padding: '6px 14px', fontSize: '0.75rem', fontWeight: 500,
    borderRadius: 6, cursor: 'pointer', transition: 'all 150ms ease',
    border: '1px solid #2a2a2a', background: 'transparent', color: '#a3a3a3',
  };
  const btnActive = {
    ...btnBase,
    background: '#C8A05020', borderColor: '#C8A050', color: '#C8A050',
  };

  const isPresetActive = (key) => activePreset === key;
  const isYearActive = (year) => !activePreset && yearRange[0] === year && yearRange[1] === year;

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {presets.map(p => (
          <button key={p.key} onClick={() => handlePreset(p)}
            style={isPresetActive(p.key) ? btnActive : btnBase}
            onMouseEnter={e => { if (!isPresetActive(p.key)) { e.target.style.borderColor = '#C8A05040'; e.target.style.color = '#e5e5e5'; }}}
            onMouseLeave={e => { if (!isPresetActive(p.key)) { e.target.style.borderColor = '#2a2a2a'; e.target.style.color = '#a3a3a3'; }}}
          >
            {p.label}
          </button>
        ))}
        <span style={{ width: 1, background: '#2a2a2a', margin: '0 4px' }} />
        {years.map(y => (
          <button key={y} onClick={() => handleYear(y)}
            style={isYearActive(y) ? btnActive : btnBase}
            onMouseEnter={e => { if (!isYearActive(y)) { e.target.style.borderColor = '#C8A05040'; e.target.style.color = '#e5e5e5'; }}}
            onMouseLeave={e => { if (!isYearActive(y)) { e.target.style.borderColor = '#2a2a2a'; e.target.style.color = '#a3a3a3'; }}}
          >
            {y}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.75rem', color: '#a3a3a3', marginTop: 8 }}>
        Showing: {yearRange[0]}-Q1 → {yearRange[1]}-Q4
      </p>
    </div>
  );
}
