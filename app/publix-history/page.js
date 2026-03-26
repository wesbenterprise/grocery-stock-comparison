'use client';

import { useState, useMemo } from 'react';
import ChartSetup from './ChartSetup';
import DashboardContent from './DashboardContent';
import {
  QUARTERS,
  KPI_SPARKLINE_DATA,
  filterByYears,
} from '../../lib/publix-financials';

const ALL_YEARS = [...new Set(QUARTERS.map(d => d.year))].sort();
const DEFAULT_RANGE = [ALL_YEARS[0], ALL_YEARS[ALL_YEARS.length - 1]];

export default function PublixHistoryPage() {
  const [yearRange, setYearRange] = useState(DEFAULT_RANGE);
  const [activePreset, setActivePreset] = useState('all');

  const filteredData = useMemo(
    () => filterByYears(QUARTERS, yearRange[0], yearRange[1]),
    [yearRange]
  );

  const latestQ = filteredData[filteredData.length - 1] ?? {};
  const prevQ = filteredData[filteredData.length - 2] ?? {};

  return (
    <>
      <ChartSetup />
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
    </>
  );
}
