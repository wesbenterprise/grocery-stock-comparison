'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import PasswordGate from './components/PasswordGate';
import {
  QUARTERS, LATEST_QUARTER, KPI_SPARKLINE_DATA,
  filterByYears,
} from '../../lib/publix-financials';

const DashboardContent = dynamic(() => import('./DashboardContent'), {
  ssr: false,
  loading: () => <div style={{ background: '#0a0a0a', minHeight: '100vh' }} />,
});

export default function PublixHistoryPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [yearRange, setYearRange] = useState([2015, 2025]);
  const [activePreset, setActivePreset] = useState('all');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const val = localStorage.getItem('publix-auth');
      if (val === 'authenticated') setAuthed(true);
      setChecking(false);
    }
  }, []);

  const filteredData = useMemo(
    () => filterByYears(QUARTERS, yearRange[0], yearRange[1]),
    [yearRange]
  );

  const handleLogout = () => {
    localStorage.removeItem('publix-auth');
    setAuthed(false);
  };

  if (checking) {
    return <div style={{ background: '#0a0a0a', minHeight: '100vh' }} />;
  }

  if (!authed) {
    return (
      <main style={{ background: '#0a0a0a', minHeight: '100vh' }}>
        <PasswordGate onAuth={() => setAuthed(true)} />
      </main>
    );
  }

  return (
    <DashboardContent
      filteredData={filteredData}
      yearRange={yearRange}
      setYearRange={setYearRange}
      activePreset={activePreset}
      setActivePreset={setActivePreset}
      latestQ={LATEST_QUARTER}
      prevQ={QUARTERS[QUARTERS.length - 2]}
      kpiSparklineData={KPI_SPARKLINE_DATA}
      handleLogout={handleLogout}
    />
  );
}
