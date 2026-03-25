'use client';

import { useState, useEffect } from 'react';

export default function GlobalPasswordGate({ children }) {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined' && localStorage.getItem('publix-auth') === '1') {
      setAuthed(true);
    }
  }, []);

  function attempt() {
    if (pw === 'bfp2026') {
      localStorage.setItem('publix-auth', '1');
      setAuthed(true);
    } else {
      setError(true);
      setPw('');
      setTimeout(() => setError(false), 1500);
    }
  }

  if (!mounted) return null;
  if (authed) return children;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#0a0a0f',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
    }}>
      {/* Logo mark */}
      <div style={{ marginBottom: 32, opacity: 0.9 }}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <rect width="48" height="48" rx="12" fill="#4caf50" fillOpacity="0.12" />
          <path d="M24 10 L36 28 H12 Z" fill="#4caf50" fillOpacity="0.8" />
          <rect x="20" y="28" width="8" height="10" rx="2" fill="#4caf50" fillOpacity="0.6" />
        </svg>
      </div>

      <h1 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#f0f0f5', marginBottom: 4, letterSpacing: '-0.01em' }}>
        Publix Intelligence
      </h1>
      <p style={{ fontSize: '0.75rem', color: '#555', marginBottom: 32 }}>
        Private access only
      </p>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && attempt()}
          placeholder="Password"
          autoFocus
          style={{
            width: 220, height: 44,
            background: error ? 'rgba(239,68,68,0.08)' : '#111118',
            border: `1px solid ${error ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: 8, color: '#f0f0f5',
            padding: '0 14px', fontSize: '0.9rem', outline: 'none',
            transition: 'border-color 0.2s',
          }}
        />
        <button
          onClick={attempt}
          style={{
            height: 44, padding: '0 20px',
            background: '#4caf50', border: 'none',
            borderRadius: 8, color: '#fff',
            fontWeight: 600, fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          Enter
        </button>
      </div>

      {error && (
        <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: 12 }}>
          Incorrect password
        </p>
      )}
    </div>
  );
}
