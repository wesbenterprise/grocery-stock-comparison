'use client';

import Link from 'next/link';


// ─── Data ────────────────────────────────────────────────────────────────────

const FAST_FACTS = [
  { value: '1,400+', label: 'Stores', sub: 'across 8 states' },
  { value: '240,000+', label: 'Associates', sub: 'all employee-owners' },
  { value: '$60B+', label: 'Annual Sales', sub: 'estimated 2024' },
  { value: '#1', label: 'Employee-Owned', sub: 'largest in America' },
  { value: '1930', label: 'Founded', sub: 'Winter Haven, FL' },
  { value: 'Private', label: 'Ownership', sub: 'never publicly traded' },
];

const MILESTONES = [
  {
    year: '1930',
    title: 'The First Store Opens',
    body: 'George W. Jenkins opens the first Publix Food Store in Winter Haven, Florida — directly across the street from the Piggly Wiggly where he had been working. He was 22 years old.',
    tag: 'Origin',
    tagColor: 'green',
  },
  {
    year: '1935',
    title: 'The Model Store',
    body: 'Jenkins opens a revolutionary new store — air-conditioned, with wide aisles, electric-eye doors, and frozen food cases. It was a supermarket before the word existed. Floridians had never seen anything like it.',
    tag: 'Innovation',
    tagColor: 'blue',
  },
  {
    year: '1945',
    title: 'Employee Ownership Begins',
    body: 'Jenkins begins sharing equity with his associates — years before the ESOP concept was formalized in US law. His belief: the people who build the company should own it.',
    tag: 'ESOP',
    tagColor: 'gold',
  },
  {
    year: '1956',
    title: 'Headquarters Moves to Lakeland',
    body: 'Publix relocates its headquarters to Lakeland, Florida, where it remains today. The iconic green marble building becomes a landmark of the city and a symbol of the company\'s permanence.',
    tag: 'Growth',
    tagColor: 'green',
  },
  {
    year: '1966',
    title: 'Publix Super Markets Charities',
    body: 'Jenkins establishes Publix Super Markets Charities, formalizing the company\'s commitment to giving back to the communities where its associates live and work. To date, the foundation has donated hundreds of millions of dollars.',
    tag: 'Community',
    tagColor: 'gold',
  },
  {
    year: '1974',
    title: 'ESOP Formally Established',
    body: 'Publix establishes one of the earliest formal Employee Stock Ownership Plans in the country following the passage of ERISA. Every associate who meets eligibility requirements becomes a shareholder.',
    tag: 'ESOP',
    tagColor: 'gold',
  },
  {
    year: '1991',
    title: 'The Deli Changes Everything',
    body: 'Publix expands its fresh deli and prepared foods program — the Pub Sub is born. What started as a convenience becomes a cultural institution. Customers don\'t just shop at Publix; they eat at Publix.',
    tag: 'Innovation',
    tagColor: 'blue',
  },
  {
    year: '1991',
    title: 'Expanding Beyond Florida',
    body: 'After six decades of dominance in Florida, Publix opens its first store outside the state — in Georgia. Measured, deliberate growth follows into South Carolina, Alabama, Tennessee, North Carolina, and Virginia. Always on its own terms.',
    tag: 'Expansion',
    tagColor: 'blue',
  },
  {
    year: '1996',
    title: 'George Jenkins Passes',
    body: '"Mr. George" passes away at age 88. He leaves behind a company with 500+ stores, more than 100,000 employees who own it, and a culture built entirely on his conviction that people matter more than profit.',
    tag: 'Legacy',
    tagColor: 'muted',
  },
  {
    year: '2003',
    title: 'Publix Crosses $1,000 Stores',
    body: 'Publix opens its 1,000th store — a milestone achieved without a single acquisition, merger, or leveraged buyout. Every one of those stores was built, not bought.',
    tag: 'Growth',
    tagColor: 'green',
  },
  {
    year: '2025',
    title: 'Still Standing. Still Private. Still Theirs.',
    body: 'Publix operates over 1,400 stores across 8 states with $60B+ in annual revenue. It has never been acquired, never gone public, never stopped being owned by the people who run it. The shelves are stocked by shareholders.',
    tag: 'Today',
    tagColor: 'green',
  },
];

const TAG_COLORS = {
  green: { color: 'var(--color-publix)', bg: 'rgba(76,175,80,0.12)', border: 'rgba(76,175,80,0.3)' },
  gold:  { color: '#c9a84c', bg: 'rgba(201,168,76,0.12)', border: 'rgba(201,168,76,0.3)' },
  blue:  { color: '#7c9fff', bg: 'rgba(124,159,255,0.12)', border: 'rgba(124,159,255,0.3)' },
  muted: { color: 'var(--color-text-muted)', bg: 'var(--color-bg-elevated)', border: 'var(--color-border)' },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function PublixOverview() {
  return (
    <main className="main-content">
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* ── Hero ── */}
        <section style={{ marginBottom: 72, textAlign: 'center' }}>
          <span className="section-eyebrow" style={{ display: 'block', marginBottom: 16 }}>
            Publix Super Markets · Est. 1930
          </span>

          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            color: 'var(--color-text)',
            marginBottom: 24,
          }}>
            Built to Last.
          </h1>

          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            lineHeight: 1.7,
            color: 'var(--color-text-secondary)',
            maxWidth: 620,
            margin: '0 auto 32px',
          }}>
            A <strong style={{ color: 'var(--color-text)' }}>$1,800 loan</strong>.
            A manager who wouldn't leave his golf conversation.
            And a twenty-two-year-old who opened his own store
            across the street from the one that wouldn't promote him.
          </p>

          {/* Decorative rule */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 40 }}>
            <div style={{ height: 1, width: 60, background: 'rgba(76,175,80,0.4)' }} />
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--color-publix)' }} />
            <div style={{ height: 1, width: 60, background: 'rgba(76,175,80,0.4)' }} />
          </div>

          {/* Pull quote */}
          <blockquote style={{
            borderLeft: '3px solid var(--color-publix)',
            paddingLeft: 24,
            textAlign: 'left',
            maxWidth: 560,
            margin: '0 auto',
          }}>
            <p style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '1.2rem',
              lineHeight: 1.6,
              color: 'var(--color-text)',
              marginBottom: 8,
            }}>
              "I want Publix to be a place where shopping is a pleasure — but more than that,
              I want it to be a place where working is a pleasure."
            </p>
            <cite style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              fontStyle: 'normal',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>
              — George W. Jenkins, Founder
            </cite>
          </blockquote>
        </section>

        {/* ── The Atlanta Story ── */}
        <section style={{ marginBottom: 72 }}>
          <span className="section-eyebrow">The Origin Story</span>
          <h2 className="section-headline" style={{ marginBottom: 8 }}>The Trip to Atlanta</h2>
          <div className="section-rule" style={{ marginBottom: 28 }} />

          <div style={{
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '32px 36px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Subtle green accent top */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 2,
              background: 'linear-gradient(90deg, var(--color-publix), transparent)',
            }} />

            <p style={{ fontSize: '1.0625rem', lineHeight: 1.8, color: 'var(--color-text-secondary)', marginBottom: 20 }}>
              In 1930, a twenty-two-year-old grocery clerk named George W. Jenkins drove to Atlanta to meet
              with the regional manager of <strong style={{ color: 'var(--color-text)' }}>Piggly Wiggly</strong> —
              the chain where he'd been working — to ask about a promotion.
            </p>
            <p style={{
              fontSize: '1.25rem', lineHeight: 1.8, color: 'var(--color-text)',
              marginBottom: 12, marginTop: 8,
              fontFamily: 'var(--font-serif)', fontStyle: 'italic',
              paddingLeft: 20, borderLeft: '2px solid rgba(76,175,80,0.3)',
            }}>
              The manager wouldn't see him. Jenkins could hear him through the door — talking about golf.
            </p>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--color-text-muted)', marginBottom: 28, paddingLeft: 20 }}>
              Not playing golf. Not in a meeting. Just talking about it while a twenty-two-year-old
              who would build a $60 billion company sat waiting on the other side of the wall.
            </p>
            <p style={{ fontSize: '1.0625rem', lineHeight: 1.8, color: 'var(--color-text-secondary)', marginBottom: 20 }}>
              Jenkins drove home to Winter Haven, Florida. He borrowed{' '}
              <strong style={{ color: 'var(--color-text)' }}>$1,800</strong>, found a storefront,
              and opened the first Publix Food Store —{' '}
              <strong style={{ color: 'var(--color-publix)' }}>directly across the street from the Piggly Wiggly</strong> where he'd been employed.
            </p>
            <p style={{ fontSize: '1.0625rem', lineHeight: 1.8, color: 'var(--color-text-secondary)' }}>
              That Piggly Wiggly is long gone. Publix now operates over 1,400 stores and employs
              more than 240,000 people — every one of them a partial owner of the company.
              It is the largest employee-owned business in the United States.
            </p>
          </div>
        </section>

        {/* ── Fast Facts ── */}
        <section style={{ marginBottom: 72 }}>
          <span className="section-eyebrow">By the Numbers</span>
          <h2 className="section-headline" style={{ marginBottom: 8 }}>The Scale of It</h2>
          <div className="section-rule" style={{ marginBottom: 28 }} />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 12,
          }}>
            {FAST_FACTS.map((f) => (
              <div key={f.label} style={{
                background: 'var(--color-bg-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px 16px',
                textAlign: 'center',
              }}>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
                  fontWeight: 700,
                  color: 'var(--color-publix)',
                  lineHeight: 1.1,
                  marginBottom: 4,
                }}>
                  {f.value}
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: 'var(--color-text)',
                  marginBottom: 2,
                }}>
                  {f.label}
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.7rem',
                  color: 'var(--color-text-muted)',
                  letterSpacing: '0.02em',
                }}>
                  {f.sub}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Employee Ownership ── */}
        <section style={{ marginBottom: 72 }}>
          <span className="section-eyebrow">What Makes Publix Different</span>
          <h2 className="section-headline" style={{ marginBottom: 8 }}>The People Own the Place</h2>
          <div className="section-rule" style={{ marginBottom: 28 }} />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 16,
            marginBottom: 28,
          }}>
            {[
              {
                icon: '🏦',
                title: 'One of the Earliest ESOPs',
                body: 'Long before Congress formalized Employee Stock Ownership Plans in the Employee Retirement Income Security Act (ERISA) of 1974, George Jenkins was already sharing equity with his people. Publix was ahead of the law.'
              },
              {
                icon: '📈',
                title: 'Stock That Actually Means Something',
                body: 'Publix stock is not publicly traded. It is only available to current and former associates. The price is set quarterly based on earnings. You cannot buy it on the open market — you have to earn it.'
              },
              {
                icon: '🤝',
                title: 'Never Acquired. Never Merged.',
                body: 'In an industry defined by consolidation — Kroger-Albertsons, Ahold-Delhaize, Amazon-Whole Foods — Publix has never been bought, never gone public, never answered to Wall Street. It answers to its associates.'
              },
            ].map((card) => (
              <div key={card.title} style={{
                background: 'var(--color-bg-card)',
                border: '1px solid rgba(76,175,80,0.15)',
                borderRadius: 'var(--radius-xl)',
                padding: '24px',
              }}>
                <div style={{ fontSize: '1.75rem', marginBottom: 12 }}>{card.icon}</div>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: 'var(--color-text)',
                  marginBottom: 10,
                }}>
                  {card.title}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  lineHeight: 1.7,
                  color: 'var(--color-text-secondary)',
                }}>
                  {card.body}
                </p>
              </div>
            ))}
          </div>

          {/* ESOP stat callout */}
          <div style={{
            background: 'rgba(76,175,80,0.06)',
            border: '1px solid rgba(76,175,80,0.2)',
            borderRadius: 'var(--radius-xl)',
            padding: '20px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            flexWrap: 'wrap',
          }}>
            <div style={{ fontSize: '2rem' }}>🟢</div>
            <div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-publix)',
                marginBottom: 4,
              }}>
                Employee Ownership
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.9375rem',
                lineHeight: 1.6,
                color: 'var(--color-text-secondary)',
              }}>
                The person bagging your groceries owns a piece of the company.
                So does the person behind the deli counter. And the pharmacist.
                And the store manager. <strong style={{ color: 'var(--color-text)' }}>That's not a policy. That's a promise Mr. George made in 1945 and Publix has never broken it.</strong>
              </div>
            </div>
          </div>
        </section>

        {/* ── Timeline ── */}
        <section style={{ marginBottom: 72 }}>
          <span className="section-eyebrow">From Then to Now</span>
          <h2 className="section-headline" style={{ marginBottom: 8 }}>95 Years of History</h2>
          <div className="section-rule" style={{ marginBottom: 36 }} />

          <div style={{ position: 'relative' }}>
            <style>{`
              .tl-line { position: absolute; top: 0; bottom: 0; width: 1px; background: linear-gradient(to bottom, var(--color-publix), rgba(76,175,80,0.1)); left: 52px; }
              .tl-row { display: flex; gap: 0; align-items: flex-start; }
              .tl-left { width: 104px; flex-shrink: 0; display: flex; align-items: center; padding-top: 18px; }
              .tl-card { margin-left: 16px; margin-bottom: 12px; }
              @media (max-width: 600px) {
                .tl-line { left: 16px; }
                .tl-row { flex-direction: column; padding-left: 36px; position: relative; }
                .tl-left { width: auto; padding-top: 0; margin-bottom: 4px; position: absolute; left: -36px; top: 16px; flex-direction: column; align-items: center; gap: 2px; }
                .tl-card { margin-left: 0; }
              }
            `}</style>
            <div className="tl-line" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {MILESTONES.map((m, i) => {
                const tc = TAG_COLORS[m.tagColor];
                const isLast = i === MILESTONES.length - 1;
                return (
                  <div key={`${m.year}-${i}`} className="tl-row">
                    {/* Year + dot */}
                    <div className="tl-left">
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--color-publix)',
                        letterSpacing: '0.04em',
                        marginRight: 8,
                      }}>
                        {m.year}
                      </span>
                      <div style={{
                        width: 10, height: 10, borderRadius: '50%',
                        background: isLast ? 'var(--color-publix)' : 'var(--color-bg-card)',
                        border: '2px solid var(--color-publix)',
                        boxShadow: isLast ? '0 0 10px rgba(76,175,80,0.5)' : 'none',
                        flexShrink: 0,
                        zIndex: 1,
                      }} />
                    </div>

                    {/* Content */}
                    <div className="tl-card" style={{
                      flex: 1,
                      background: 'var(--color-bg-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '16px 20px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                        <h3 style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '0.9375rem',
                          fontWeight: 800,
                          color: 'var(--color-text)',
                        }}>
                          {m.title}
                        </h3>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          color: tc.color,
                          background: tc.bg,
                          border: `1px solid ${tc.border}`,
                        }}>
                          {m.tag}
                        </span>
                      </div>
                      <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.875rem',
                        lineHeight: 1.7,
                        color: 'var(--color-text-secondary)',
                        margin: 0,
                      }}>
                        {m.body}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Shopping is a Pleasure ── */}
        <section style={{ marginBottom: 72 }}>
          <span className="section-eyebrow">The Brand</span>
          <h2 className="section-headline" style={{ marginBottom: 8 }}>Where Shopping Is a Pleasure</h2>
          <div className="section-rule" style={{ marginBottom: 28 }} />

          <div style={{
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '32px 36px',
            textAlign: 'center',
          }}>
            <p style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
              fontStyle: 'italic',
              color: 'var(--color-publix)',
              marginBottom: 20,
              lineHeight: 1.3,
            }}>
              "Where Shopping Is a Pleasure"
            </p>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              lineHeight: 1.8,
              color: 'var(--color-text-secondary)',
              maxWidth: 640,
              margin: '0 auto 16px',
            }}>
              The slogan didn't come from an ad agency. It came from a Publix employee — someone
              who worked in the stores and understood what Mr. George was building from the inside.
              Management liked it. Jenkins loved it. It stuck.
            </p>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              lineHeight: 1.8,
              color: 'var(--color-text-secondary)',
              maxWidth: 640,
              margin: '0 auto 16px',
            }}>
              That's the whole Publix story in five words. The pleasure was real because the people
              creating it had a stake in the outcome. Wide aisles. Clean stores.
              Employees who smiled because they owned part of the building you were standing in.
            </p>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              lineHeight: 1.8,
              color: 'var(--color-text-secondary)',
              maxWidth: 640,
              margin: '0 auto 16px',
            }}>
              Other grocers tried to copy the experience. They couldn't.
              Because the difference was never the layout or the lighting.
            </p>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
              letterSpacing: '0.03em',
              color: 'var(--color-publix)',
              maxWidth: 640,
              margin: '0 auto',
            }}>
              The pleasure wasn't manufactured. It was structural.
            </p>
          </div>
        </section>

        {/* ── Navigation Bridge ── */}
        <section>
          <div style={{
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '28px 32px',
          }}>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              fontWeight: 800,
              color: 'var(--color-text)',
              marginBottom: 6,
            }}>
              Explore the Full Picture
            </h3>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              color: 'var(--color-text-muted)',
              marginBottom: 20,
              lineHeight: 1.6,
            }}>
              The history is the foundation. The data tells the rest of the story.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/publix-ceo-timeline" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--color-publix)',
                textDecoration: 'none',
                padding: '10px 18px',
                border: '1px solid rgba(76,175,80,0.3)',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(76,175,80,0.07)',
                transition: 'all 0.15s ease',
              }}>
                → CEO Timeline
              </Link>
              <Link href="/publix-history" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--color-text-secondary)',
                textDecoration: 'none',
                padding: '10px 18px',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-bg-elevated)',
                transition: 'all 0.15s ease',
              }}>
                → Financial History
              </Link>
              <Link href="/stock-compare" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--color-text-secondary)',
                textDecoration: 'none',
                padding: '10px 18px',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-bg-elevated)',
                transition: 'all 0.15s ease',
              }}>
                → Stock Compare
              </Link>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
