'use client';

import Link from 'next/link';
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
    <>
      {/* Back nav */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', padding: '12px 20px',
        background: 'rgba(250, 248, 244, 0.92)', backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}>
        <Link href="/" style={{
          fontFamily: 'system-ui, sans-serif', fontSize: 13, fontWeight: 600,
          color: '#3B7C3B', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6,
        }}>
          ← Grocery Stock Compare
        </Link>
      </div>
      <div style={{ paddingTop: 48 }}>
        <PublixTimeline />
      </div>
    </>
  );
}
