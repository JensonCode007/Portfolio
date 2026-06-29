'use client';
import FuzzyText from "./Fuzzytext";

export default function NotFound() {
  return (
    <div style={{
      minHeight:'100vh', display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      background:'var(--bg)', gap:24, padding:24,
    }}>
      {/* FuzzyText 404 */}
      <FuzzyText
        fontSize="clamp(5rem,20vw,14rem)"
        fontWeight={400}
        fontFamily="'Instrument Serif', Georgia, serif"
        color="#FAFAF9"
        baseIntensity={0.2}
        hoverIntensity={0.55}
        enableHover
        glitchMode
        glitchInterval={2500}
        glitchDuration={220}
        fuzzRange={36}
        fps={60}
      >
        404
      </FuzzyText>

      <p style={{
        fontFamily:'var(--font-mono)', fontSize:'0.85rem',
        color:'var(--text-3)', letterSpacing:'0.1em', textTransform:'uppercase',
      }}>
        Page not found
      </p>

      <a href="/"
        style={{
          display:'inline-flex', alignItems:'center', gap:8,
          padding:'10px 24px', borderRadius:9,
          background:'var(--amber)', color:'#0C0A09',
          fontFamily:'var(--font-sans)', fontWeight:600, fontSize:'0.9rem',
          textDecoration:'none', marginTop:8,
          transition:'box-shadow 0.25s ease',
        }}
        onMouseEnter={e=>(e.currentTarget as HTMLElement).style.boxShadow='0 0 32px var(--amber-glow)'}
        onMouseLeave={e=>(e.currentTarget as HTMLElement).style.boxShadow=''}
      >
        ← Back home
      </a>
    </div>
  );
}