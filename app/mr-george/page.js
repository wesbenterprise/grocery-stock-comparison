export const metadata = {
  title: "Mr. George's Office — Publix Intelligence",
  description: "A virtual 3D walkthrough of George W. Jenkins' historic Lakeland office, preserved exactly as he left it.",
};

export default function MrGeorgePage() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: '80px', paddingBottom: '64px' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '48px 24px 40px', maxWidth: 720, margin: '0 auto' }}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>🏛️</div>
        <h1 style={{
          fontFamily: 'var(--font-display, serif)',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          marginBottom: 16,
          color: 'var(--color-text, #f0f0f5)',
        }}>
          Mr. George's Office
        </h1>
        <p style={{
          fontFamily: 'var(--font-body, system-ui)',
          fontSize: '1.0625rem',
          lineHeight: 1.65,
          color: 'var(--color-text-muted, #a0a0b8)',
          marginBottom: 28,
        }}>
          A virtual walkthrough of George W. Jenkins' historic Lakeland office —
          preserved exactly as he left it.
        </p>
        <div style={{
          display: 'inline-block',
          background: 'var(--color-publix, #4caf50)',
          color: '#000',
          fontFamily: 'var(--font-display, serif)',
          fontWeight: 700,
          fontSize: 12,
          padding: '7px 18px',
          borderRadius: 8,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          Coming Soon
        </div>
      </div>

      {/* Matterport embed placeholder */}
      <div style={{
        maxWidth: 960,
        margin: '0 auto 48px',
        padding: '0 24px',
      }}>
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/9',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
        }}>
          <div style={{ fontSize: 72, opacity: 0.1 }}>🏛️</div>
          <p style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: 12,
            color: 'rgba(255,255,255,0.25)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            Matterport 3D Tour — Loading Soon
          </p>
          <a
            href="https://discover.matterport.com/space/4iSaq1EDHCU"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 12,
              color: 'var(--color-publix, #4caf50)',
              textDecoration: 'none',
              letterSpacing: '0.04em',
              borderBottom: '1px solid currentColor',
              paddingBottom: 2,
            }}
          >
            Preview on Matterport →
          </a>
        </div>
      </div>

      {/* Story card */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px' }}>
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 12,
          padding: '28px 32px',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: 11,
            fontWeight: 700,
            fontStyle: 'italic',
            color: 'var(--color-publix, #4caf50)',
            letterSpacing: '0.04em',
            marginBottom: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            ◆ About This Space
          </div>
          <p style={{
            fontFamily: 'var(--font-body, system-ui)',
            fontSize: 14,
            lineHeight: 1.75,
            color: 'rgba(240,240,245,0.72)',
            margin: 0,
          }}>
            "Mr. George" — George W. Jenkins — opened the first Publix on September 6, 1930
            in Winter Haven, Florida, with $1,300 in savings and a conviction that a grocery
            store could treat people right. His Lakeland office became the operational heart
            of an empire built on that belief. This 3D walkthrough preserves the space as he
            left it: the desk, the mementos, the evidence of sixty years spent building
            something that outlasted him. Every Publix associate today works in the shadow of
            what happened in this room.
          </p>
        </div>
      </div>
    </div>
  );
}
