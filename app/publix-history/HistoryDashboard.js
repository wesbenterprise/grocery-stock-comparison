'use client';

import { useState, useMemo } from 'react';
import DashboardContent from './DashboardContent';
import {
  QUARTERS,
  KPI_SPARKLINE_DATA,
  filterByYears,
} from '../../lib/publix-financials';

const ALL_YEARS = [...new Set(QUARTERS.map(d => d.fiscalYear))].sort();
const MIN_YEAR = ALL_YEARS[0];
const MAX_YEAR = ALL_YEARS[ALL_YEARS.length - 1];

export default function HistoryDashboard() {
  const [yearRange, setYearRange] = useState([MIN_YEAR, MAX_YEAR]);
  const [activePreset, setActivePreset] = useState('all');

  const filteredData = useMemo(
    () => filterByYears(QUARTERS, yearRange[0], yearRange[1]),
    [yearRange]
  );

  const latestQ = filteredData[filteredData.length - 1] ?? {};
  const prevQ = filteredData[filteredData.length - 2] ?? {};

  return (
    <DashboardContent
      filteredData={filteredData}
      yearRange={yearRange}
      setYearRange={setYearRange}
      activePreset={activePreset}
      setActivePreset={setActivePreset}
      latestQ={latestQ}
      prevQ={prevQ}
      kpiSparklineData={KPI_SPARKLINE_DATA}
      handleLogout={() => {}}
    />
  );
}
