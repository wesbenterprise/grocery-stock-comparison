'use client';

import { useState, useRef } from 'react';

export default function PasswordGate({ onAuth }) {
  const [value, setValue] = useState('');
  const [shaking, setShaking] = useState(false);
  const [error, setError] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = () => {
    if (value === 'tom15bald') {
      localStorage.setItem('publix-auth', 'authenticated');
      onAuth();
    } else {
      setShaking(true);
      setError(true);
      setValue('');
      setTimeout(() => setShaking(false), 500);
      setTimeout(() => setError(false), 1000);
      inputRef.current?.focus();
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100vh', background: '#0a0a0a',
    }}>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C8A050"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>

      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#e5e5e5', marginTop: 24 }}>
        Publix Financial Dashboard
      </h1>
      <p style={{ fontSize: '0.875rem', color: '#a3a3a3', marginTop: 8 }}>
        Enter password to continue
      </p>

      <div style={{
        display: 'flex', gap: 12, marginTop: 32,
        animation: shaking ? 'shake 0.5s ease' : 'none',
      }}>
        <input
          ref={inputRef}
          type="password"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="Password"
          style={{
            width: 280, height: 48, background: '#1a1a1a',
            border: `1px solid ${error ? '#ef4444' : '#2a2a2a'}`,
            borderRadius: 8, color: '#e5e5e5', padding: '0 16px',
            fontSize: '1rem', outline: 'none', transition: 'border-color 150ms ease',
          }}
          onFocus={e => { if (!error) e.target.style.borderColor = '#C8A050'; }}
          onBlur={e => { if (!error) e.target.style.borderColor = '#2a2a2a'; }}
          autoFocus
        />
        <button
          onClick={handleSubmit}
          style={{
            height: 48, padding: '0 24px', background: 'transparent',
            border: '1px solid #C8A050', borderRadius: 8, color: '#C8A050',
            fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
            transition: 'all 150ms ease',
          }}
          onMouseEnter={e => { e.target.style.background = '#C8A050'; e.target.style.color = '#0a0a0a'; }}
          onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#C8A050'; }}
        >
          Enter
        </button>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
