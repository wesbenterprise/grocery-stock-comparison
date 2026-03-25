'use client';

import { useState } from 'react';

const PHOTOS = [
  // ── 1930s — Origins ──
  {
    id: 1,
    era: '1930s',
    title: 'First Publix Food Store — Winter Haven, 1930',
    description: 'The original Publix Food Store at 58 4th St. NW, Winter Haven. Opened September 6, 1930, directly across from the Piggly Wiggly where Jenkins had worked. Building still stands and is on the National Register of Historic Places.',
    source: 'https://corporate.publix.com/about-publix/culture/history/photo-timeline',
    sourceLabel: 'Publix Corporate',
    suggestedUse: 'Hero image for Origin Story section, or first entry in the company timeline.',
    imageUrl: null,
    notes: '',
  },
  {
    id: 2,
    era: '1930s',
    title: 'George W. Jenkins — Young Founder Portrait',
    description: 'Classic black-and-white portrait of George Jenkins, likely from the mid-1930s. Archival image held at the Library of Congress. Shows Jenkins as a young man in his 20s-30s, the era when he was building Publix from scratch.',
    source: 'https://pure-represents.com/Photo-Print-George-W-Jenkins-Founder-Of-Publix-Supermarkets-o-955864',
    sourceLabel: 'Library of Congress / Pure Represents',
    suggestedUse: 'Alongside the Atlanta story. The face behind the $1,800 loan.',
    imageUrl: null,
    notes: '',
  },
  {
    id: 3,
    era: '1930s',
    title: 'People Weigher Scales',
    description: 'Large green Toledo scales known as "People Weighers" — free for customers to use. A treat since most homes didn\'t have scales. One of Jenkins\' early customer-first innovations.',
    source: 'https://corporate.publix.com/newsroom/news-stories/publix-through-the-decades',
    sourceLabel: 'Publix Corporate',
    suggestedUse: 'Fun detail for "The Model Store" milestone or a sidebar fact.',
    imageUrl: null,
    notes: '',
  },

  // ── 1940s — The Dream Store ──
  {
    id: 4,
    era: '1940s',
    title: 'First Publix Super Market — Art Deco "Food Palace", 1940',
    description: 'Jenkins\' dream store at 197 W. Central Ave, Winter Haven. Art Deco marble-glass-stucco design. First grocery store with air conditioning, fluorescent lighting, electric-eye doors, frozen food cases, piped-in music, and 8-foot-wide aisles. Now houses St. Matthew Catholic Church\'s Regenerations Resale Shop.',
    source: 'https://www.floridamemory.com/items/show/117763',
    sourceLabel: 'Florida State Archives (N044583)',
    suggestedUse: 'Major visual for "The Model Store" (1935/1940) milestone. Shows the leap from grocery store to supermarket.',
    imageUrl: null,
    notes: '',
  },
  {
    id: 5,
    era: '1940s',
    title: 'Art Deco Interior — Marble & Glass Block Tower',
    description: 'Interior of the 1940 store showing the distinctive glass block tower, marble trim, and wide aisles. A supermarket before the word existed.',
    source: 'https://www.floridamemory.com/items/show/152592',
    sourceLabel: 'Florida State Archives (FR0204)',
    suggestedUse: 'Pair with the exterior shot. Shows what Jenkins actually built inside.',
    imageUrl: null,
    notes: '',
  },
  {
    id: 6,
    era: '1940s',
    title: 'All American Markets Acquisition, 1945',
    description: 'Jenkins acquired 19 All American Markets in 1945, going from 2 stores to 21 overnight. This was the same year he began sharing equity with employees — the seed of what became the ESOP.',
    source: 'https://corporate.publix.com/about-publix/culture/history',
    sourceLabel: 'Publix Corporate',
    suggestedUse: 'ESOP section — the acquisition that scaled the company AND the ownership model.',
    imageUrl: null,
    notes: '',
  },

  // ── 1950s — Expansion & Brand Identity ──
  {
    id: 7,
    era: '1950s',
    title: 'Bill Schroter & "Where Shopping Is a Pleasure", 1954',
    description: 'Bill Schroter, Publix\'s director of advertising (hired 1949), created the slogan in 1954 after hearing customers describe Publix as "a pleasant place to shop." He presented it to Jenkins, who paused, then approved it. It replaced "Florida\'s finest food stores." Jenkins said it wasn\'t a tagline — it was a guiding philosophy.',
    source: 'https://corporate.publix.com/newsroom/news-stories/how-the-publix-slogan-came-to-be',
    sourceLabel: 'Publix Corporate',
    suggestedUse: 'KEY IMAGE — "Where Shopping Is a Pleasure" section. The moment the slogan was born.',
    imageUrl: null,
    notes: '',
  },
  {
    id: 8,
    era: '1950s',
    title: 'Lakeland Headquarters & Warehouse, 1951',
    description: 'New 125,000-square-foot warehouse and office complex in Lakeland, FL. Publix HQ has been in Lakeland ever since. The iconic green marble building.',
    source: 'https://corporate.publix.com/newsroom/news-stories/publix-through-the-decades',
    sourceLabel: 'Publix Corporate',
    suggestedUse: 'Headquarters milestone on the timeline.',
    imageUrl: null,
    notes: '',
  },
  {
    id: 9,
    era: '1950s',
    title: 'Southgate Shopping Center — First Danish Bakery, 1957',
    description: 'The Southgate Shopping Center in Lakeland featured the first Publix Danish Bakery (1957). The iconic midcentury arch was later used as a backdrop in "Edward Scissorhands."',
    source: 'https://corporate.publix.com/newsroom/news-stories/publix-through-the-decades',
    sourceLabel: 'Publix Corporate',
    suggestedUse: 'Cultural moment — the bakery that started it all. Also a Hollywood connection.',
    imageUrl: null,
    notes: '',
  },
  {
    id: 10,
    era: '1950s',
    title: 'Associates in Uniform, 1950s',
    description: 'Women in dresses with aprons, men in white shirts and black pants with ties. For special occasions, uniforms had "P-U-B-L-I-X" spelled vertically. Cashiers operated key-punch registers — every item individually priced.',
    source: 'https://corporate.publix.com/newsroom/news-stories/back-in-time-publix-the-1950s',
    sourceLabel: 'Publix Corporate',
    suggestedUse: 'Employee culture section or ESOP section — these are the people who owned the company.',
    imageUrl: null,
    notes: '',
  },

  // ── 1960s — Growth Era ──
  {
    id: 11,
    era: '1960s',
    title: 'Donovan Dean "Winged" Store Design, 1960s',
    description: 'Famed Florida architect Donovan Dean designed the new Publix stores with a distinctive winged roof. Neon lights in the wings blinked downward — at night, they looked like a flowing waterfall. Publix hit 100 stores, then 150 by decade\'s end.',
    source: 'https://corporate.publix.com/newsroom/news-stories/publix-through-the-decades',
    sourceLabel: 'Publix Corporate',
    suggestedUse: 'Architecture/growth milestone. Visual evolution of the brand.',
    imageUrl: null,
    notes: '',
  },
  {
    id: 12,
    era: '1960s',
    title: 'George Jenkins at Publix Store — Lakeland, 1963',
    description: 'Mr. George visiting a Publix store in Lakeland, 1963. Jenkins was known for walking the aisles and talking to associates and customers.',
    source: 'https://www.reddit.com/r/HistoricalCapsule/comments/1gc7y1p/pictured_george_jenkins_founder_of_the_publix/',
    sourceLabel: 'Historical Capsule / Reddit',
    suggestedUse: 'Perfect for the "Mr. George" personal touch section. Shows the founder in his element.',
    imageUrl: null,
    notes: '',
  },

  // ── 1970s-1980s — Technology & Milestones ──
  {
    id: 13,
    era: '1970s',
    title: 'Squared "P" Logo & First Scanning Registers',
    description: 'The 1970s brought the new squared "P" signage (replacing the winged design) and Publix became the first grocery chain to have scanning at ALL registers, replacing keypunch systems.',
    source: 'https://corporate.publix.com/newsroom/news-stories/publix-logos-throughout-the-years',
    sourceLabel: 'Publix Corporate',
    suggestedUse: 'Technology innovation milestone. Brand evolution.',
    imageUrl: null,
    notes: '',
  },
  {
    id: 14,
    era: '1980s',
    title: 'Food World Format — Blue Uniforms & Giant Globe',
    description: 'Publix experimented with a discount format called "Food World" in the 1970s-80s. 23 stores with a giant rotating globe out front, associates in blue uniforms, different pricing. All converted to Publix by 1985.',
    source: 'https://corporate.publix.com/newsroom/news-stories/publix-through-the-decades',
    sourceLabel: 'Publix Corporate',
    suggestedUse: 'Fun aside — shows Publix experimented but always came back to its core identity.',
    imageUrl: null,
    notes: '',
  },

  // ── 1990s — Expansion Beyond Florida ──
  {
    id: 15,
    era: '1990s',
    title: 'First Store Outside Florida — Savannah, GA, 1991',
    description: 'Publix opens its first store outside Florida in Savannah, Georgia. After 61 years as a Florida-only company, the measured expansion begins. Coral and teal interior era.',
    source: 'https://corporate.publix.com/newsroom/news-stories/publix-through-the-decades',
    sourceLabel: 'Publix Corporate',
    suggestedUse: 'Expansion milestone on the timeline.',
    imageUrl: null,
    notes: '',
  },
  {
    id: 16,
    era: '1990s',
    title: 'George Jenkins — Later Years Portrait',
    description: 'Mr. George in his later years, before his passing in April 1996 at age 88. Left behind 500+ stores, 100,000+ employee-owners.',
    source: 'https://corporate.publix.com/about-publix/culture/history',
    sourceLabel: 'Publix Corporate',
    suggestedUse: 'Legacy section. The man at the end of his story.',
    imageUrl: null,
    notes: '',
  },

  // ── 2000s-Present — Scale ──
  {
    id: 17,
    era: '2000s',
    title: '1,000th Store — St. Augustine, FL, 2005',
    description: 'Publix opens its 1,000th store in St. Augustine, Florida. 75th anniversary. Every one of those stores was built, not bought.',
    source: 'https://corporate.publix.com/newsroom/news-stories/publix-through-the-decades',
    sourceLabel: 'Publix Corporate',
    suggestedUse: 'Scale milestone. "Built, not bought" line.',
    imageUrl: null,
    notes: '',
  },
  {
    id: 18,
    era: '2020s',
    title: 'First Kentucky Store — Louisville, 2024',
    description: 'Publix opens in Louisville, KY — its 8th state. Features drive-thru pharmacy and first out-of-state Publix Liquors.',
    source: 'https://corporate.publix.com/newsroom/news-stories/publix-through-the-decades',
    sourceLabel: 'Publix Corporate',
    suggestedUse: 'Modern era — still growing, still private, still theirs.',
    imageUrl: null,
    notes: '',
  },

  // ── Special / Brand ──
  {
    id: 19,
    era: 'Brand',
    title: 'Publix Logo Evolution',
    description: 'The progression of Publix logos from the original 1930s script through Art Deco, winged design, squared P, and the modern green logomark.',
    source: 'https://corporate.publix.com/newsroom/news-stories/publix-logos-throughout-the-years',
    sourceLabel: 'Publix Corporate',
    suggestedUse: 'Brand section or sidebar — visual evolution of the identity.',
    imageUrl: null,
    notes: '',
  },
  {
    id: 20,
    era: 'Brand',
    title: 'The Pub Sub',
    description: 'The bakery at the first 1940 supermarket is considered the birthplace of the first "Pub Sub." The deli expanded in the 1960s, but the Pub Sub became a cultural institution in the 1990s.',
    source: 'https://corporate.publix.com/about-publix/culture/history',
    sourceLabel: 'Publix Corporate',
    suggestedUse: 'Cultural moment — the product that made Publix a lifestyle, not just a store.',
    imageUrl: null,
    notes: '',
  },
];

const ERAS = ['1930s', '1940s', '1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2020s', 'Brand'];

export default function PhotoLibrary() {
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? PHOTOS : PHOTOS.filter(p => p.era === filter);

  return (
    <main className="main-content">
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f0f0f5', marginBottom: 4 }}>📸 Publix Photo Library</h1>
          <p style={{ fontSize: '0.875rem', color: '#888', marginBottom: 20 }}>
            {PHOTOS.length} photos researched. Review each one — add notes on where it should go, or mark it as not needed.
          </p>

          {/* Era filters */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['All', ...ERAS].map(era => (
              <button
                key={era}
                onClick={() => setFilter(era)}
                style={{
                  padding: '4px 14px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: 999,
                  border: '1px solid',
                  borderColor: filter === era ? '#4caf50' : '#333',
                  background: filter === era ? 'rgba(76,175,80,0.15)' : 'transparent',
                  color: filter === era ? '#4caf50' : '#888',
                  cursor: 'pointer',
                }}
              >
                {era}
              </button>
            ))}
          </div>
        </div>

        {/* Photo cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filtered.map(photo => (
            <div key={photo.id} style={{
              background: '#111118',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              padding: 24,
              position: 'relative',
            }}>
              {/* Era badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                  padding: '2px 10px', borderRadius: 999,
                  background: 'rgba(76,175,80,0.1)', color: '#4caf50', border: '1px solid rgba(76,175,80,0.25)',
                }}>
                  {photo.era}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#555' }}>#{photo.id}</span>
              </div>

              {/* Title */}
              <h2 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#f0f0f5', marginBottom: 8 }}>
                {photo.title}
              </h2>

              {/* Description */}
              <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: '#a0a0b8', marginBottom: 12 }}>
                {photo.description}
              </p>

              {/* Suggested use */}
              <div style={{
                background: 'rgba(76,175,80,0.06)',
                border: '1px solid rgba(76,175,80,0.15)',
                borderRadius: 8,
                padding: '10px 14px',
                marginBottom: 12,
              }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#4caf50' }}>
                  Suggested Placement
                </span>
                <p style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: '#ccc', margin: '4px 0 0' }}>
                  {photo.suggestedUse}
                </p>
              </div>

              {/* Source */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: '0.7rem', color: '#555' }}>Source:</span>
                <a
                  href={photo.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.75rem', color: '#7c9fff', textDecoration: 'none' }}
                >
                  {photo.sourceLabel} ↗
                </a>
              </div>

              {/* Image placeholder or actual image */}
              {photo.imageUrl ? (
                <div style={{ marginTop: 12, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <img src={photo.imageUrl} alt={photo.title} style={{ width: '100%', display: 'block' }} />
                </div>
              ) : (
                <div style={{
                  marginTop: 12, height: 120, borderRadius: 8,
                  border: '2px dashed rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#444', fontSize: '0.8rem',
                }}>
                  📷 Image to be sourced from link above
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
