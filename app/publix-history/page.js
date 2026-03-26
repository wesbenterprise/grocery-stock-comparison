'use client';
import dynamic from 'next/dynamic';

const HistoryDashboard = dynamic(() => import('./HistoryDashboard'), { ssr: false });

export default function PublixHistoryPage() {
  return <HistoryDashboard />;
}
