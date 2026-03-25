'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SiteHeader() {
  const pathname = usePathname();

  const nav = [
    { href: '/publix-overview', label: 'Publix: Built to Last' },
    { href: '/publix-ceo-timeline', label: 'CEO Timeline' },
    { href: '/publix-history', label: 'Financial History' },
    { href: '/', label: 'Stock Compare' },
  ];

  return (
    <header className="app-header">
      <div className="header-brand">
        <span className="header-brand-p">P</span>
        <div>
          <h1>Publix Intelligence</h1>
          <span className="header-brand-sub">Built to Last</span>
        </div>
      </div>
      <nav className="header-nav">
        {nav.map(({ href, label }) => {
          const active = pathname === href || (href !== '/' && pathname?.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`header-nav-link${active ? ' active' : ''}`}
            >
              {label}
            </Link>
          );
        })}
        <div className="header-live">
          <span className="header-live-label">LIVE</span>
          <span className="header-dot" aria-label="Live data indicator" />
        </div>
      </nav>
    </header>
  );
}
