'use client';

import dynamic from 'next/dynamic';

const PublixTimeline = dynamic(() => import('./PublixTimeline'), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', fontFamily: 'system-ui, sans-serif', color: '#6b6b6b' }}>
      Loading timeline…
    </div>
  ),
});

export default function PublixCEOTimelinePage() {
  return (
    <div style={{ paddingTop: 60, width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
      <PublixTimeline />
    </div>
  );
}
