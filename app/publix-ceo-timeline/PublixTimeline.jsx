'use client';

import { useState, useEffect, useRef } from "react";

const CEO_PORTRAITS = {
  "George W. Jenkins":    "/images/ceo-portraits/george-w-jenkins.jpg",
  "Howard M. Jenkins":    "/images/ceo-portraits/howard-jenkins.jpg",
  "Charles H. Jenkins Jr.": "/images/ceo-portraits/charles-jenkins-jr.jpg",
  "Ed Crenshaw":          "/images/ceo-portraits/ed-crenshaw.jpg",
  "Todd Jones":           "/images/ceo-portraits/todd-jones.jpg",
  "Kevin Murphy":         "/images/ceo-portraits/kevin-murphy.jpg",
};

const CEO_THUMBNAILS = {
  "George W. Jenkins":    "/images/ceo-thumbnails/george-w-jenkins-thumb.png",
  "Howard M. Jenkins":    "/images/ceo-thumbnails/howard-jenkins-thumb.png",
  "Charles H. Jenkins Jr.": "/images/ceo-thumbnails/charles-jenkins-jr-thumb.png",
  "Ed Crenshaw":          "/images/ceo-thumbnails/ed-crenshaw-thumb.png",
  "Todd Jones":           "/images/ceo-thumbnails/todd-jones-thumb.png",
  "Kevin Murphy":         "/images/ceo-thumbnails/kevin-murphy-thumb.png",
};

function HoverPortrait({ name, size = 44 }) {
  const [hovered, setHovered] = useState(false);
  const thumb = CEO_THUMBNAILS[name];
  const full = CEO_PORTRAITS[name];
  if (!thumb && !full) return null;
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: "relative", width: size, height: size, flexShrink: 0 }}
    >
      {/* Illustrated — default */}
      <img src={thumb || full} alt={name} style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        borderRadius: "50%", objectFit: "cover", objectPosition: "top center",
        border: "2px solid #3B7C3B", overflow: "hidden",
        opacity: hovered ? 0 : 1, transition: "opacity 0.35s ease",
      }} />
      {/* Watercolor — reveals on hover */}
      <img src={full} alt={name} style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        borderRadius: "50%", objectFit: "cover", objectPosition: "top center",
        border: "2px solid #3B7C3B",
        opacity: hovered ? 1 : 0, transition: "opacity 0.35s ease",
      }} />
    </div>
  );
}

function HoverFullPortrait({ name, width, height, style = {} }) {
  const [hovered, setHovered] = useState(false);
  const thumb = CEO_THUMBNAILS[name];
  const full = CEO_PORTRAITS[name];
  if (!full) return null;
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: "relative", width, height, flexShrink: 0, ...style }}
    >
      {/* Watercolor — default */}
      <img src={full} alt={name} style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        objectFit: "cover", objectPosition: "top",
        borderRadius: style.borderRadius || 8,
        boxShadow: style.boxShadow || "0 4px 20px rgba(0,0,0,0.15)",
        border: "3px solid #3B7C3B",
        opacity: hovered ? 0 : 1, transition: "opacity 0.35s ease",
      }} />
      {/* Illustrated — reveals on hover */}
      {thumb && (
        <img src={thumb} alt={name} style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "top",
          borderRadius: style.borderRadius || 8,
          boxShadow: style.boxShadow || "0 4px 20px rgba(0,0,0,0.15)",
          border: "3px solid #3B7C3B",
          opacity: hovered ? 1 : 0, transition: "opacity 0.35s ease",
        }} />
      )}
    </div>
  );
}

const ceos = [
  {
    name: "George W. Jenkins", note: "Founder · \u201cMr. George\u201d", tenure: "1930 – 1990", years: 60,
    beginRev: "$500", endRev: "$5.4B", totalGrowth: "∞", cagr: "~28.5%", isFounder: true,
    summary: `George Washington Jenkins Jr. — known throughout Publix as "Mr. George" — opened the first Publix Food Store on September 6, 1930 in Winter Haven, Florida, right next door to the Piggly Wiggly he'd quit managing. He was 22 years old with $1,300 in savings and $1,200 raised from selling stock at $100/share to friends and co-workers.\n\nIn 1940, he mortgaged an orange grove to build Florida's first true supermarket — an 11,000-square-foot "food palace" with air conditioning, electric-eye doors, fluorescent lighting, and frozen food cases, all unheard of at the time. He acquired the 19-store All American chain in 1945 and moved headquarters to Lakeland, where it remains today.\n\nJenkins pioneered employee ownership from day one, established the S&H Green Stamps program that made Publix the largest stamp vendor in America, and introduced in-store bakeries (1950s), delis (1960s), UPC scanning (1970s), and ATMs via the Presto! network (1980s). He founded the George W. Jenkins Foundation in 1966 for community giving. His belief that "we're not only in the grocery business — we're in the people business" defined the company's culture for generations.\n\nBy the time he stepped down after a stroke in 1989, Publix had 370 stores, 60,000 employees, and $5.4 billion in sales — all in Florida. He received the Horatio Alger Award, the Food Marketing Institute's Sydney Rabb Award, and four honorary doctorates. He continued visiting stores from his wheelchair until days before his death on April 8, 1996, at age 88.\n\nHis legacy lives on in the George W. Jenkins Award — Publix's highest associate honor — and in George W. Jenkins High School in Lakeland, Florida, the city he made home.`
  },
  {
    name: "Howard M. Jenkins", note: "Son of Founder · Jenkins Family", tenure: "1990 – 2001", years: 11,
    beginRev: "$5.4B", endRev: "$15.3B", totalGrowth: "▲ 184%", cagr: "9.9%", isFounder: false,
    summary: `Howard Jenkins, George's son, took the reins in January 1990 at age 38 after his father's stroke. He inherited a purely Florida-based chain ranked 21st among U.S. retailers with 370 stores and $5.4 billion in sales — and transformed it into a multi-state powerhouse.\n\nHis defining move was breaking Publix out of Florida for the first time in its history. The first out-of-state store opened in Savannah, Georgia in 1991. By 1998, Publix operated 70 stores in metro Atlanta alone, capturing 22% of the grocery market there. Expansion continued into South Carolina (1993) and Alabama (1996).\n\nHoward oversaw construction of a massive 3-million-square-foot distribution and dairy processing facility near Atlanta in 1994 to support the southeastern push. In 1995, Publix opened its 500th store and earned Fortune 500 status. By 2001, sales had reached $15.3 billion with over 700 stores and profit margins at a record 3.6%.\n\nHoward was inducted into the Florida Business Hall of Fame in 2003 and received the Horatio Alger Award in 2004. His tenure tripled revenue and established Publix as a dominant regional force across the entire Southeast.`
  },
  {
    name: "Charles H. Jenkins Jr.", note: "Nephew of Founder · Jenkins Family", tenure: "2001 – 2008", years: 7,
    beginRev: "$15.3B", endRev: "$23.9B", totalGrowth: "▲ 56%", cagr: "6.6%", isFounder: false,
    summary: `Charlie Jenkins Jr., nephew of the founder, earned a PhD in real estate from Harvard (1969) and wrote his thesis on shopping center development. He joined Publix as assistant to the VP of real estate, became VP of real estate and board member in 1974, executive VP in 1988, COO in 2000, and CEO in 2001.\n\nKnown for meticulous planning and methodical growth, he continued the multi-state expansion — entering Tennessee in 2002 with Publix's sixth state. Under his leadership, Publix launched PIX convenience stores and gas stations, the PublixDirect online grocery delivery service (2001), and the first Aprons cooking schools.\n\nEnterprise Florida recognized Publix in 2003 for diversifying the state economy. Fortune named it one of America's Most Admired Companies that same year. By the time he handed the CEO title to Ed Crenshaw in March 2008, Publix had grown to over 1,000 stores with $23.9 billion in annual sales.\n\nCharlie remained on the board for decades and transitioned to Chairman, serving 47 total years as a director before retiring from the board in 2024.`
  },
  {
    name: "Ed Crenshaw", note: "Grandson of Mr. George · Jenkins Family", tenure: "2008 – 2016", years: 8,
    beginRev: "$23.9B", endRev: "$34.0B", totalGrowth: "▲ 42%", cagr: "4.5%", isFounder: false,
    summary: `Ed Crenshaw is the grandson of founder George W. Jenkins — his mother, Delores, is Mr. George's adopted daughter. To those who knew the family, the distinction between adopted and blood never entered the conversation. He started as a front-service clerk in Lake Wales, Florida in 1974 and spent 42 years at Publix, rising through retail operations to become VP of the Lakeland Division in 1990. He moved to Atlanta in 1991 to launch Publix's first Georgia division, was promoted to EVP of retail in 1994, and became president in 1996.\n\nHe succeeded his cousin Charles Jenkins Jr. as CEO in March 2008 — just months before the Great Recession hit. Despite the worst economic downturn since the Depression, Publix navigated it without layoffs, maintaining its culture of employment security. In February 2009, Publix opened its 1,000th store in St. Augustine, Florida, becoming one of only five U.S. grocers to reach that milestone.\n\nCrenshaw oversaw Publix's entry into North Carolina in 2014 (the company's seventh state), starting with the Charlotte metro area. He also expanded the GreenWise Market concept and acquired 49 Albertsons stores in Florida in 2008.\n\nBy the end of his tenure, Publix had grown to 1,129 stores across six states with $34 billion in sales and 186,000 associates. He served 34 years on the board of directors before retiring in 2024.`
  },
  {
    name: "Todd Jones", note: "First Non-Jenkins CEO · Now Exec. Chairman", tenure: "2016 – 2023", years: 7,
    beginRev: "$34.0B", endRev: "$57.1B", totalGrowth: "▲ 68%", cagr: "7.7%", isFounder: false,
    summary: `Todd Jones started as a bagger in New Smyrna Beach in 1980 and became the first person outside the Jenkins family to lead Publix. He worked his way through store management (1988), district manager (1997), regional director (1999), VP of Jacksonville Division (2003), SVP of product business development (2005), president (2008), and finally CEO in May 2016.\n\nHis tenure saw dramatic revenue acceleration — much of it driven by the COVID-19 pandemic, which sent grocery demand surging 17.5% in 2020 alone. Jones guided Publix through the pandemic response, partnering with the CDC on vaccine distribution starting in early 2021 and becoming one of the largest pharmacy vaccination sites in the Southeast.\n\nUnder Jones, Publix expanded into Virginia (2017), its seventh retail state. He oversaw the launch of Publix's telehealth collaboration with BayCare Health System (2017) and significant investments in curbside pickup and delivery to compete with online grocery. Revenue grew from $34B to $57.1B — adding $23 billion in absolute revenue in just seven years.\n\nJones transitioned to Executive Chairman in January 2024, remaining deeply involved in the company's strategic direction.`
  },
  {
    name: "Kevin Murphy", note: "Current CEO", tenure: "2024 – Present", years: 2,
    beginRev: "$59.7B", endRev: "$62.7B", totalGrowth: "▲ 5%", cagr: "2.5%", isFounder: false, active: true,
    summary: `Kevin Murphy started as a front-service clerk in Margate, Florida in 1984 — continuing the tradition of CEOs who began bagging groceries. He became store manager in 1995, district manager in 2003, regional director in 2009, VP of the Miami Division in 2014, SVP of retail operations in 2016, and president in 2019.\n\nMurphy is a recipient of both the George W. Jenkins Award (2000) and the President's Award (2007), Publix's two most prestigious internal honors. He became CEO and was elected to the board of directors in January 2024.\n\nIn his first two full fiscal years, Publix posted $59.7 billion (2024) and $62.7 billion (2025) in sales, with net earnings of $4.6B and $4.7B respectively. He led the company's entry into Kentucky in January 2024 (the eighth state), opening the first store in Louisville. As of 2025, Publix operates 1,432 stores with over 260,000 associates, ranking as the largest employee-owned company in the United States.`
  },
];

const stats = [
  { value: "1930", label: "Year Founded" },
  { value: "$62.7B", label: "Annual Revenue (2025)" },
  { value: "1,432", label: "Stores Today" },
  { value: "95", label: "Years & Counting" },
];

const logos = [
  {
    era: "1930 – 1945",
    label: "Original Wordmark",
    img: "https://1000logos.net/wp-content/uploads/2019/08/Publix-Logo-1948.png",
  },
  {
    era: "1945 – 1955",
    label: "Building Logo",
    img: "https://1000logos.net/wp-content/uploads/2019/08/Publix-Logo-1952.png",
  },
  {
    era: "1955 – 1958",
    label: "Building & Circle",
    img: "https://1000logos.net/wp-content/uploads/2019/08/Publix-Logo-1955.png",
  },
  {
    era: "1958 – 1972",
    label: "Circle Wordmark",
    img: "https://1000logos.net/wp-content/uploads/2019/08/Publix-Logo-1958.png",
  },
  {
    era: "1972 – 2012",
    label: "Square P Logo",
    img: "https://1000logos.net/wp-content/uploads/2019/08/Publix-Logo-1972.png",
  },
  {
    era: "2012 – Present",
    label: "Circle P Logo",
    img: "https://1000logos.net/wp-content/uploads/2021/12/Publix-logo.jpg",
    current: true,
  },
];

export default function PublixTimeline() {
  const containerRef = useRef(null);
  const [isWide, setIsWide] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const check = () => setIsWide(el.offsetWidth >= 700);
    check();
    const ro = new ResizeObserver(() => check());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: "#faf8f4", minHeight: "100vh", padding: isWide ? "40px 24px" : "20px 12px", color: "#2c2c2c", width: "100%", boxSizing: "border-box", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 1060, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        <Header isWide={isWide} />
        {isWide ? <DesktopTable /> : <MobileCards />}
        <Footer isWide={isWide} />
        <LogoHistory isWide={isWide} />
        <Slogan isWide={isWide} />
        <div style={{ textAlign: "center", marginTop: 24, fontSize: 11, color: "#6b6b6b", paddingBottom: 20 }}>
          Sources: SEC filings, Publix corporate reports, FundingUniverse, Wikipedia · Compiled March 2026
        </div>
      </div>
    </div>
  );
}

function SchroterPhoto({ isWide }) {
  const [hovered, setHovered] = useState(false);
  const w = isWide ? 420 : "100%";
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ position: "relative", width: w, aspectRatio: "3/2", borderRadius: 8, overflow: "hidden", border: "2px solid rgba(201,168,76,0.3)" }}
      >
        {/* Illustrated — default */}
        <img src="/images/schroter-illustrated.png" alt="Bill Schroter and George Jenkins illustrated" style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center",
          opacity: hovered ? 0 : 1, transition: "opacity 0.35s ease",
        }} />
        {/* B&W photo — reveals on hover */}
        <img src="/images/schroter-photo.jpg" alt="Bill Schroter and George Jenkins" style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center",
          opacity: hovered ? 1 : 0, transition: "opacity 0.35s ease",
        }} />
      </div>
    </div>
  );
}

function SloganPhoto({ isWide }) {
  const [hovered, setHovered] = useState(false);
  const w = isWide ? 200 : "100%";
  const h = isWide ? 134 : 200;
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: "relative", width: w, height: h, flexShrink: 0, borderRadius: 8, overflow: "hidden", border: "2px solid rgba(201,168,76,0.4)" }}
    >
      <img src="/images/schroter-watercolor.png" alt="Bill Schroter and George Jenkins" style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        objectFit: "cover", objectPosition: "top center",
        opacity: hovered ? 0 : 1, transition: "opacity 0.35s ease",
      }} />
      <img src="/images/schroter-illustrated.png" alt="Bill Schroter and George Jenkins illustrated" style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        objectFit: "cover", objectPosition: "top center",
        opacity: hovered ? 1 : 0, transition: "opacity 0.35s ease",
      }} />
    </div>
  );
}

function Slogan({ isWide }) {
  return (
    <div style={{
      background: "#1a3a1a",
      borderRadius: 16,
      marginTop: 24,
      padding: isWide ? "48px 40px" : "36px 24px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.12)",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Eyebrow */}
      <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "rgba(201,168,76,0.7)", fontWeight: 700, marginBottom: 20 }}>
        The Publix Promise · Since 1954
      </div>

      {/* Main slogan — rendered as display typography */}
      <div style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: isWide ? 52 : 32,
        fontWeight: 400,
        fontStyle: "italic",
        color: "#fff",
        lineHeight: 1.2,
        letterSpacing: "-0.01em",
        marginBottom: 8,
      }}>
        Where Shopping
      </div>
      <div style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: isWide ? 52 : 32,
        fontWeight: 900,
        fontStyle: "italic",
        color: "#c9a84c",
        lineHeight: 1.2,
        letterSpacing: "-0.01em",
        marginBottom: isWide ? 32 : 24,
      }}>
        Is a Pleasure.
      </div>

      {/* Decorative bottom rule */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: isWide ? 28 : 20 }}>
        <div style={{ flex: 1, maxWidth: 120, height: 1, background: "rgba(201,168,76,0.4)" }} />
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#c9a84c" }} />
        <div style={{ flex: 1, maxWidth: 120, height: 1, background: "rgba(201,168,76,0.4)" }} />
      </div>

      {/* Origin story */}
      <div style={{
        maxWidth: 580,
        margin: "0 auto",
        fontSize: isWide ? 14 : 13,
        lineHeight: 1.75,
        color: "rgba(255,255,255,0.65)",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}>
        In 1954, advertising director <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>Bill Schroter</span> listened to customers saying
        "Publix is such a pleasant place to shop" and brought a new slogan to founder George Jenkins.
        After a long, silent pause, Jenkins said: <span style={{ color: "#c9a84c", fontStyle: "italic" }}>"I like it. I like the promise. I like the meaning. Let's adopt it."</span>
      </div>

      {/* Rule */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, margin: isWide ? "28px auto" : "20px auto" }}>
        <div style={{ flex: 1, maxWidth: 120, height: 1, background: "rgba(201,168,76,0.4)" }} />
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#c9a84c" }} />
        <div style={{ flex: 1, maxWidth: 120, height: 1, background: "rgba(201,168,76,0.4)" }} />
      </div>

      {/* Schroter illustrated / photo hover */}
      <SchroterPhoto isWide={isWide} />

      {/* Rule */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, margin: isWide ? "28px auto" : "20px auto" }}>
        <div style={{ flex: 1, maxWidth: 120, height: 1, background: "rgba(201,168,76,0.4)" }} />
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#c9a84c" }} />
        <div style={{ flex: 1, maxWidth: 120, height: 1, background: "rgba(201,168,76,0.4)" }} />
      </div>

      {/* Jenkins quote */}
      <div style={{
        maxWidth: 560,
        margin: isWide ? "24px auto 0" : "20px auto 0",
        padding: "16px 20px",
        borderLeft: "3px solid rgba(201,168,76,0.5)",
        textAlign: "left",
      }}>
        <div style={{ fontSize: isWide ? 13 : 12, lineHeight: 1.7, color: "rgba(255,255,255,0.5)", fontStyle: "italic" }}>
          "This isn't something we dreamed up out of blue sky and white Florida sand. It's a philosophy that has guided all our decisions and policies ever since we opened our first food store."
        </div>
        <div style={{ fontSize: 11, color: "rgba(201,168,76,0.7)", fontWeight: 600, marginTop: 8, letterSpacing: 1 }}>
          — George W. Jenkins, Founder
        </div>
      </div>
    </div>
  );
}

function Header({ isWide }) {
  return (
    <div style={{ textAlign: "center", marginBottom: isWide ? 40 : 24 }}>
      <div style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: "#3B7C3B", fontWeight: 700, marginBottom: 12 }}>Where Shopping Is a Pleasure</div>
      <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: isWide ? 44 : 28, fontWeight: 900, color: "#1a3a1a", lineHeight: 1.15, margin: "0 0 8px 0" }}>Publix Super Markets</h1>
      <div style={{ fontSize: 15, color: "#6b6b6b" }}>CEO Timeline & Revenue · <span style={{ color: "#3B7C3B", fontWeight: 600 }}>1930 – Present</span></div>
    </div>
  );
}

function Footer({ isWide }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: isWide ? 32 : 16, padding: isWide ? "32px 20px" : "24px 16px",
      background: "#1a3a1a", color: "#fff", borderRadius: isWide ? "0 0 16px 16px" : 14,
      flexWrap: "wrap", marginTop: isWide ? 0 : 14,
    }}>
      {stats.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: isWide ? 32 : 0 }}>
          <div style={{ textAlign: "center", flex: isWide ? undefined : "1 1 40%", minWidth: isWide ? undefined : 110 }}>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: isWide ? 28 : 22, fontWeight: 900, color: "#c9a84c", lineHeight: 1.2 }}>{s.value}</div>
            <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginTop: 4 }}>{s.label}</div>
          </div>
          {isWide && i < stats.length - 1 && <div style={{ width: 1, height: 40, background: "rgba(255,255,255,0.15)" }} />}
        </div>
      ))}
    </div>
  );
}

function LogoHistory({ isWide }) {
  return (
    <div style={{
      background: "#f0f7f0", borderRadius: 16, marginTop: 24, padding: isWide ? "36px 40px" : "28px 20px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)",
    }}>
      <div style={{ textAlign: "center", marginBottom: isWide ? 28 : 20 }}>
        <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#3B7C3B", fontWeight: 700, marginBottom: 8 }}>Brand Evolution</div>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: isWide ? 24 : 20, fontWeight: 900, color: "#1a3a1a" }}>Logo History</div>
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: isWide ? "repeat(6, 1fr)" : "repeat(2, 1fr)",
        gap: isWide ? 16 : 12,
      }}>
        {logos.map((l, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{
              width: "100%", aspectRatio: "1", background: "#fff", borderRadius: 12,
              display: "flex", alignItems: "center", justifyContent: "center", padding: (i === 3 || i === 5) ? 4 : 10,
              border: l.current ? "3px solid #3B7C3B" : "2px solid #d0ccc6",
              position: "relative", overflow: "hidden",
            }}>
              <img
                src={l.img}
                alt={`Publix logo ${l.era}`}
                style={{ maxWidth: (i === 3 || i === 5) ? "98%" : "90%", maxHeight: (i === 3 || i === 5) ? "98%" : "90%", objectFit: "contain" }}
              />
              {l.current && (
                <div style={{
                  position: "absolute", top: 6, right: 6, fontSize: 8, letterSpacing: 1,
                  textTransform: "uppercase", background: "#3B7C3B", color: "#fff",
                  padding: "2px 6px", borderRadius: 3, fontWeight: 700,
                }}>Current</div>
              )}
            </div>
            <div style={{ fontWeight: 700, fontSize: 12, color: "#1a3a1a", marginTop: 10 }}>{l.era}</div>
            <div style={{ fontSize: 11, color: "#6b6b6b", marginTop: 2 }}>{l.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════ DESKTOP TABLE ═══════════ */
function DesktopTable() {
  const [expanded, setExpanded] = useState(null);
  const th = { fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", fontWeight: 700, color: "#fff", background: "#1a3a1a", padding: "16px 18px", textAlign: "left", borderBottom: "none" };
  const thR = { ...th, textAlign: "right" };

  return (
    <div style={{ background: "#fff", borderRadius: "16px 16px 0 0", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead><tr>
          <th style={th}>CEO</th><th style={th}>Tenure</th><th style={thR}>Beginning Rev</th>
          <th style={thR}>Ending Rev</th><th style={thR}>Total Growth</th><th style={thR}>CAGR</th>
        </tr></thead>
        <tbody>
          {ceos.map((c, i) => (
            <DesktopRow key={i} ceo={c} isLast={i === ceos.length - 1} isExpanded={expanded === i} onToggle={() => setExpanded(expanded === i ? null : i)} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DesktopRow({ ceo, isLast, isExpanded, onToggle }) {
  const [hovered, setHovered] = useState(false);
  const bg = isExpanded ? "#f4f9f4" : hovered ? "#e8f2e8" : "transparent";
  const td = { padding: "16px 18px", borderBottom: isExpanded ? "none" : isLast ? "none" : "1px solid #f0ede8", fontSize: 14, verticalAlign: "middle", background: bg, transition: "background 0.2s", cursor: "pointer" };
  const tdR = { ...td, textAlign: "right", fontVariantNumeric: "tabular-nums" };
  const badge = {
    display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700,
    background: ceo.isFounder ? "linear-gradient(135deg, #f7f0da, #f2e8c4)" : "#e6f4e6",
    color: ceo.isFounder ? "#8a6d1b" : "#3B7C3B",
  };

  return (
    <>
      <tr onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={onToggle}>
        <td style={td}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {!isExpanded && <HoverPortrait name={ceo.name} size={44} />}
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 16, color: "#1a3a1a", display: "flex", alignItems: "center", gap: 8 }}>
                {ceo.name}
                <span style={{ fontSize: 12, color: "#3B7C3B", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", display: "inline-block" }}>▼</span>
              </span>
              <span style={{ fontSize: 11, color: "#6b6b6b" }}>
                {ceo.note}
                {ceo.active && <ActiveTag />}
              </span>
            </div>
          </div>
        </td>
        <td style={td}><span style={{ fontWeight: 600, fontSize: 13 }}>{ceo.tenure}<span style={{ display: "block", fontSize: 11, color: "#6b6b6b", fontWeight: 400, marginTop: 2 }}>{ceo.years} year{ceo.years !== 1 ? "s" : ""}</span></span></td>
        <td style={{ ...tdR, fontWeight: 700, fontSize: 15 }}>{ceo.beginRev}</td>
        <td style={{ ...tdR, fontWeight: 700, fontSize: 15 }}>{ceo.endRev}</td>
        <td style={tdR}><span style={badge}>{ceo.totalGrowth}</span></td>
        <td style={{ ...tdR, fontWeight: 700, fontSize: 14, color: ceo.isFounder ? "#8a6d1b" : "#3B7C3B" }}>{ceo.cagr}</td>
      </tr>
      {isExpanded && (
        <tr><td colSpan={6} style={{ padding: "0 18px 24px 18px", background: "#f4f9f4", borderBottom: isLast ? "none" : "1px solid #f0ede8" }}>
          <div style={{ display: "flex", gap: 28, alignItems: "flex-start", marginTop: 8 }}>
            {CEO_PORTRAITS[ceo.name] && (
              <HoverFullPortrait name={ceo.name} width={180} height={240} style={{ borderRadius: 8, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }} />
            )}
            <div style={{ fontSize: 13, lineHeight: 1.7, color: "#3a3a3a", whiteSpace: "pre-line", borderLeft: "3px solid #3B7C3B", paddingLeft: 16 }}>{ceo.summary}</div>
          </div>
        </td></tr>
      )}
    </>
  );
}

/* ═══════════ MOBILE CARDS ═══════════ */
function MobileCards() {
  const [expanded, setExpanded] = useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {ceos.map((c, i) => <MobileCard key={i} ceo={c} isExpanded={expanded === i} onToggle={() => setExpanded(expanded === i ? null : i)} />)}
    </div>
  );
}

function MobileCard({ ceo, isExpanded, onToggle }) {
  const green = ceo.isFounder ? "#8a6d1b" : "#3B7C3B";
  const growthBg = ceo.isFounder ? "linear-gradient(135deg, #f7f0da, #f2e8c4)" : "#e8f2e8";

  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)" }}>
      <div onClick={onToggle} style={{ cursor: "pointer" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
            {!isExpanded && <HoverPortrait name={ceo.name} size={40} />}
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 17, color: "#1a3a1a", display: "flex", alignItems: "center", gap: 8 }}>
                {ceo.name}
                <span style={{ fontSize: 12, color: "#3B7C3B", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", display: "inline-block" }}>▼</span>
              </div>
              <div style={{ fontSize: 11, color: "#6b6b6b", marginTop: 2 }}>
                {ceo.note}{ceo.active && <ActiveTag />}
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>{ceo.tenure}</div>
            <div style={{ fontSize: 11, color: "#6b6b6b", marginTop: 2 }}>{ceo.years} year{ceo.years !== 1 ? "s" : ""}</div>
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <MetricBox label="Beginning Rev" value={ceo.beginRev} />
        <MetricBox label="Ending Rev" value={ceo.endRev} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
        <GrowthBox label="Total Growth" value={ceo.totalGrowth} bg={growthBg} color={green} />
        <GrowthBox label="CAGR" value={ceo.cagr} bg={growthBg} color={green} />
      </div>
      {isExpanded && (
        <div style={{ marginTop: 16 }}>
          {CEO_PORTRAITS[ceo.name] && (
            <HoverFullPortrait name={ceo.name} width="100%" height={280} style={{ borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.12)", marginBottom: 16 }} />
          )}
          <div style={{ fontSize: 13, lineHeight: 1.7, color: "#3a3a3a", whiteSpace: "pre-line", borderLeft: "3px solid #3B7C3B", paddingLeft: 14 }}>{ceo.summary}</div>
        </div>
      )}
      {!isExpanded && (
        <div onClick={onToggle} style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: "#3B7C3B", fontWeight: 600, cursor: "pointer" }}>Tap to read full summary ▾</div>
      )}
    </div>
  );
}

function ActiveTag() {
  return <span style={{ display: "inline-block", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", background: "#3B7C3B", color: "#fff", padding: "3px 8px", borderRadius: 4, fontWeight: 700, marginLeft: 6, verticalAlign: "middle" }}>Active</span>;
}

function MetricBox({ label, value }) {
  return (
    <div style={{ background: "#faf8f4", borderRadius: 10, padding: "12px 14px" }}>
      <div style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "#6b6b6b", fontWeight: 600, marginBottom: 4 }}>{label}</div>
      <div style={{ fontWeight: 800, fontSize: 18, color: "#2c2c2c", fontVariantNumeric: "tabular-nums" }}>{value}</div>
    </div>
  );
}

function GrowthBox({ label, value, bg, color }) {
  return (
    <div style={{ background: bg, borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
      <div style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "#6b6b6b", fontWeight: 600, marginBottom: 4 }}>{label}</div>
      <div style={{ fontWeight: 800, fontSize: 18, color, fontVariantNumeric: "tabular-nums" }}>{value}</div>
    </div>
  );
}
