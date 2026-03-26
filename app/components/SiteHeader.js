'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const nav = [
    { href: '/', label: '🟢 Publix: Built to Last' },
    { href: '/publix-ceo-timeline', label: '👔 CEO Timeline' },
    { href: '/publix-history', label: '📊 Financial History' },
    { href: '/stock-compare', label: '📈 Stock Comparison' },
    { href: '/mr-george', label: "🏛️ Mr. George's Office" },
  ];

  const isActive = (href) => {
    if (href.includes('#')) return false;
    return pathname === href || (href !== '/' && pathname?.startsWith(href));
  };

  return (
    <>
      <header className="app-header">
        <div className="header-brand">
          <span className="header-brand-p">P</span>
          <div>
            <h1>Publix Intelligence</h1>
            <span className="header-brand-sub">Built to Last</span>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="header-nav desktop-nav">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`header-nav-link${isActive(href) ? ' active' : ''}`}
            >
              {label}
            </Link>
          ))}
          <div className="header-live">
            <span className="header-live-label">LIVE</span>
            <span className="header-dot" aria-label="Live data indicator" />
          </div>
        </nav>

        {/* Mobile hamburger button */}
        <button
          className="hamburger-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className={`hamburger-icon${menuOpen ? ' open' : ''}`}>
            <span /><span /><span />
          </span>
        </button>
      </header>

      {/* Mobile dropdown overlay */}
      {menuOpen && (
        <div className="mobile-nav-overlay" onClick={() => setMenuOpen(false)}>
          <nav className="mobile-nav" onClick={e => e.stopPropagation()}>
            {nav.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`mobile-nav-link${isActive(href) ? ' active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
