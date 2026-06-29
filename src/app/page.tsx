'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import ElectricBorder from '@/components/ui/ElectricBorder';
import BorderGlow from '@/components/ui/Borderglow';
import FuzzyText from '@/components/ui/Fuzzytext';
import DecryptedText from '@/components/ui/Decryptedtext';
import ScrollFloat from '@/components/ui/Scrollfloat';
import Beams from '@/components/ui/Beams';
import TiltedCard from '@/components/ui/Tiltedcard';
import LaserFlow from '@/components/ui/LaserFlow';
import PROJECTS from '@/data/projects.json';

/* ══════════════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════════════ */
const TECH = [
  'Apache Kafka','Spring Boot','FastAPI','Redis','PostgreSQL',
  'PyTorch','Hugging Face','Docker','React','TypeScript',
  'Prometheus','Grafana','ROS','OpenCV','Vector DB',
  'Electron','Java','Python','C++','GitHub Actions',
];

const SKILLS: Record<string,string[]> = {
  'Languages':    ['Java','Python','TypeScript','C++','SQL'],
  'Frameworks':   ['Spring Boot','FastAPI','Next.js','React','Electron'],
  'Data & AI':    ['Apache Kafka','Redis','PostgreSQL','Vector DB','PyTorch','HuggingFace'],
  'DevOps':       ['Docker','GitHub Actions','Prometheus','Grafana','ROS'],
};

/* ══════════════════════════════════════════════════════════════════
   MAGNETIC BUTTON
══════════════════════════════════════════════════════════════════ */
function MagBtn({href,children,primary=false,style={}}:{
  href:string;children:React.ReactNode;primary?:boolean;style?:React.CSSProperties;
}) {
  const wrap=useRef<HTMLDivElement>(null);
  const onMove=useCallback((e:React.MouseEvent)=>{
    const el=wrap.current!; const r=el.getBoundingClientRect();
    el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*0.25}px,${(e.clientY-r.top-r.height/2)*0.25}px)`;
  },[]);
  const onLeave=useCallback(()=>{
    const el=wrap.current!;
    el.style.transition='transform 0.45s cubic-bezier(0.175,0.885,0.32,1.275)';
    el.style.transform='translate(0,0)';
    setTimeout(()=>{if(el)el.style.transition='';},450);
  },[]);
  const base:React.CSSProperties={display:'inline-flex',alignItems:'center',gap:8,padding:'11px 26px',
    borderRadius:9,fontFamily:'var(--font-sans)',fontWeight:600,fontSize:'0.9rem',
    cursor:'pointer',textDecoration:'none',border:'none',transition:'box-shadow 0.25s ease',};
  const s:React.CSSProperties=primary
    ? {...base,background:'var(--accent)',color:'#06080D',...style}
    : {...base,background:'transparent',color:'var(--text-2)',border:'1px solid var(--border)',...style};
  return (
    <div ref={wrap} style={{display:'inline-block',transition:'transform 0.1s ease'}}
      onMouseMove={onMove} onMouseLeave={onLeave}>
      <a href={href} target={href.startsWith('http')?'_blank':undefined} rel="noopener noreferrer" style={s}
        onMouseEnter={e=>{if(primary)(e.currentTarget as HTMLElement).style.boxShadow='0 0 36px var(--accent-glow)';
          else{(e.currentTarget as HTMLElement).style.borderColor='var(--border-light)';
               (e.currentTarget as HTMLElement).style.color='var(--text-1)';}}}
        onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow='';
          (e.currentTarget as HTMLElement).style.borderColor='';
          (e.currentTarget as HTMLElement).style.color='';}}>
        {children}
      </a>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════════════════════════ */
function Reveal({children,delay=0,style={}}:{children:React.ReactNode;delay?:number;style?:React.CSSProperties}) {
  const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const el=ref.current!;
    const ob=new IntersectionObserver(([e])=>{if(e.isIntersecting){el.classList.add('visible');ob.disconnect();}},{threshold:0.1});
    ob.observe(el); return()=>ob.disconnect();
  },[]);
  return <div ref={ref} className="reveal" style={{transitionDelay:`${delay}ms`,...style}}>{children}</div>;
}

/* ══════════════════════════════════════════════════════════════════
   SPOTLIGHT CARD
══════════════════════════════════════════════════════════════════ */
function SpotCard({children,style={}}:{children:React.ReactNode;style?:React.CSSProperties}) {
  const ref=useRef<HTMLDivElement>(null);
  const onMove=(e:React.MouseEvent)=>{
    const el=ref.current!; const r=el.getBoundingClientRect();
    el.style.setProperty('--mx',`${((e.clientX-r.left)/r.width)*100}%`);
    el.style.setProperty('--my',`${((e.clientY-r.top)/r.height)*100}%`);
  };
  return (
    <div ref={ref} className="bento-card" style={style} onMouseMove={onMove}>
      <div className="spotlight" />
      <div className="bento-card-inner">{children}</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   COUNTER
══════════════════════════════════════════════════════════════════ */
function Counter({to,suffix=''}:{to:number;suffix?:string}) {
  const [v,setV]=useState(0); const ref=useRef<HTMLSpanElement>(null); const done=useRef(false);
  useEffect(()=>{
    const ob=new IntersectionObserver(([e])=>{
      if(e.isIntersecting&&!done.current){done.current=true;
        const s=performance.now();
        const tick=(n:number)=>{const t=Math.min((n-s)/1100,1);setV(Math.floor((1-Math.pow(1-t,3))*to));if(t<1)requestAnimationFrame(tick);else setV(to);};
        requestAnimationFrame(tick);}
    },{threshold:0.5});
    ob.observe(ref.current!); return()=>ob.disconnect();
  },[to]);
  return <span ref={ref}>{v}<span style={{color:'var(--accent)'}}>{suffix}</span></span>;
}

/* ══════════════════════════════════════════════════════════════════
   NAV
══════════════════════════════════════════════════════════════════ */
function Nav() {
  const [solid,setSolid]=useState(false);
  const [open,setOpen]=useState(false);
  useEffect(()=>{
    const fn=()=>setSolid(window.scrollY>20);
    window.addEventListener('scroll',fn,{passive:true}); return()=>window.removeEventListener('scroll',fn);
  },[]);
  const links=[['#about','About'],['#projects','Projects'],['#contact','Contact']];
  return (
    <>
      <nav className={`nav${solid?' solid':''}`}>
        <a href="#home" className="nav-logo" style={{fontStyle:'italic'}}>
          <DecryptedText text="Jenson." animateOn="hover" speed={50} maxIterations={8}
            characters="JensoTRaj!@#." className="" encryptedClassName=""
            style={{fontFamily:'var(--font-serif)',fontSize:'1.3rem',color:'var(--text-1)'}}/>
          <span style={{color:'var(--accent)',marginLeft:1,fontStyle:'normal'}}></span>
        </a>
        <ul className="nav-links">
          {links.map(([h,l])=><li key={h}><a href={h} className="nav-link">{l}</a></li>)}
        </ul>
        <a href="mailto:jensonrajan321@gmail.com" className="nav-cta">Get in touch</a>
        <button className="hamburger" onClick={()=>setOpen(!open)} aria-label="Menu">
          <span style={open?{transform:'rotate(45deg) translate(4.5px,4.5px)'}:{}}/>
          <span style={open?{opacity:0}:{}}/>
          <span style={open?{transform:'rotate(-45deg) translate(4.5px,-4.5px)'}:{}}/>
        </button>
      </nav>
      <div className={`mobile-menu${open?' open':''}`}>
        {links.map(([h,l])=><a key={h} href={h} onClick={()=>setOpen(false)}>{l}</a>)}
        <a href="mailto:jensonrajan321@gmail.com" onClick={()=>setOpen(false)}>jensonrajan321@gmail.com</a>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════════════════════════ */
const Ico={
  Github:()=><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>,
  LinkedIn:()=><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  Mail:()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  Medium:()=><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/></svg>,
  Arrow:()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  Ext:()=><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
};

/* ══════════════════════════════════════════════════════════════════
   PROJECT CARD
══════════════════════════════════════════════════════════════════ */
function PCard({p,delay}:{p: any; delay:number}) {
  const colSpan = p.size==='feat'?'span 4':p.size==='half'?'span 3':'span 2';

  const inner = (
    <>
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:10}}>
        <div className="project-icon">{p.icon}</div>
        {p.githubUrl&&<a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="project-link"><Ico.Github/></a>}
      </div>
      <div>
        <div className="project-title">{p.title}</div>
        <div className="project-subtitle">{p.sub}</div>
      </div>
      <p className="project-desc">{p.description}</p>
      <div className="project-tags">
        {p.tags.map((t: string)=><span key={t} className="pill">{t}</span>)}
      </div>
      {p.githubUrl&&(
        <div className="project-footer">
          <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="project-link">
            <Ico.Github/> View source <Ico.Ext/>
          </a>
        </div>
      )}
    </>
  );

  return (
    <Reveal delay={delay} style={{gridColumn:colSpan}}>
      {p.electric ? (
        <ElectricBorder color="#38BDF8" speed={0.9} chaos={0.10} borderRadius={18}
          style={{height:'100%',display:'block'}}>
          <div className="bento-card-inner" style={{minHeight:260}}>{inner}</div>
        </ElectricBorder>
      ) : (
        <SpotCard style={{height:'100%'}}>{inner}</SpotCard>
      )}
    </Reveal>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      <Navbar/>
      
      <Particles
        className="absolute inset-0"
        quantity={50} 
        ease={80} 
        color="#bfa5a5" 
        refresh 

      />
      <section id="home" className="relative z-10 pt-40 pb-24 min-h-screen flex items-center">
        <div className="max-w-6xl mx-auto px-8 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-start justify-center">
              <h2 className="text-2xl text-zinc-400 mb-2 font-medium tracking-wide">
                Hey there, I am
              </h2>
              <Text3DFlip
                className="mb-6"
                textClassName="text-6xl md:text-8xl font-bold text-white tracking-tighter"
                flipTextClassName="text-6xl md:text-8xl font-bold text-zinc-500 tracking-tighter"
                rotateDirection="top"
              >
                Jenson.
              </Text3DFlip>
              
              <TypingAnimation
                blinkCursor={true}
                pauseDelay={2000}
                loop
                typeSpeed={140}
                deleteSpeed={200}
                className="text-zinc-400 text-lg md:text-xl max-w-lg leading-relaxed"
              >
                A Software Engineer building high-performance backends, AI architectures, and interactive web experiences.
              </TypingAnimation>
            </div>

          {/* Tagline */}
          <p className="hero-tagline" style={{animation:'fadeUp 0.6s 0.18s ease both',opacity:0,animationFillMode:'forwards'}}>
            Building <strong>distributed systems</strong>, <strong>AI tooling</strong>, and full-stack
            products that handle real-world load. Currently working at the intersection of
            stream processing and machine learning.
          </p>

          {/* CTAs */}
          <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:44,
            animation:'fadeUp 0.6s 0.28s ease both',opacity:0,animationFillMode:'forwards'}}>
            <MagBtn href="#projects" primary>See my work <Ico.Arrow/></MagBtn>
            <MagBtn href="mailto:jensonrajan321@gmail.com"><Ico.Mail/> Get in touch</MagBtn>
          </div>

          {/* Socials */}
          <div className="socials" style={{marginBottom:52,
            animation:'fadeUp 0.6s 0.36s ease both',opacity:0,animationFillMode:'forwards'}}>
            {[
              {href:'https://github.com/JensonCode007',Icon:Ico.Github,label:'GitHub'},
              {href:'https://www.linkedin.com/in/jenson-t-rajan/',Icon:Ico.LinkedIn,label:'LinkedIn'},
              {href:'https://medium.com/@jensonrajan321',Icon:Ico.Medium,label:'Medium'},
              {href:'mailto:jensonrajan321@gmail.com',Icon:Ico.Mail,label:'Email'},
            ].map(({href,Icon,label})=>(
              <a key={href} href={href} target={href.startsWith('http')?'_blank':undefined}
                rel="noopener noreferrer" className="social-btn" aria-label={label}><Icon/></a>
            ))}
          </div>

          {/* Stats */}
          {/* <div className="stats-row" style={{animation:'fadeUp 0.6s 0.44s ease both',opacity:0,animationFillMode:'forwards'}}>
            {[{to:6,suffix:'+',label:'projects shipped'},{to:10,suffix:'ms',label:'fraud detection latency'},{to:4,suffix:'+',label:'languages'}].map(({to,suffix,label})=>(
              <div key={label} className="stat">
                <div className="stat-value"><Counter to={to} suffix={suffix}/></div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* ── TECH MARQUEE ─────────────────────────────────────────── */}
      <div style={{padding:'28px 0',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)'}}>
        <div className="marquee-wrap">
          <div className="marquee-track">
            {[...TECH,...TECH].map((t,i)=><div key={i} className="marquee-item">{t}</div>)}
          </div>
        </div>
      </div>

      {/* ── PROJECTS ─────────────────────────────────────────────── */}
      <section id="projects">
        <div className="container">
          <Reveal>
            <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',
              marginBottom:40,flexWrap:'wrap',gap:14}}>
              <div>
                {/* Section eyebrow — DecryptedText on view */}
                <div className="eyebrow">
                  <DecryptedText text="Selected work" animateOn="view" sequential
                    revealDirection="start" speed={45} characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#@!_"
                    encryptedClassName="" className=""
                    style={{fontFamily:'var(--font-mono)',fontSize:'0.75rem',letterSpacing:'0.15em',
                      textTransform:'uppercase',color:'var(--accent)'}}/>
                </div>
                {/* Heading — ScrollFloat stagger */}
                <ScrollFloat containerClassName="" textClassName=""
                  animationDuration={0.85} stagger={0.028} as="h2">
                  Things I&apos;ve built
                </ScrollFloat>
              </div>
              <a href="https://github.com/JensonCode007" target="_blank" rel="noopener noreferrer"
                style={{display:'inline-flex',alignItems:'center',gap:7,padding:'9px 20px',
                  borderRadius:8,border:'1px solid var(--border)',color:'var(--text-2)',
                  fontSize:'0.875rem',fontWeight:500,flexShrink:0,transition:'all 0.2s ease',
                  textDecoration:'none'}}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='var(--border-light)';
                  (e.currentTarget as HTMLElement).style.color='var(--text-1)';}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='';
                  (e.currentTarget as HTMLElement).style.color='';}}>
                <Ico.Github/> All repos
              </a>
            </div>
          </Reveal>

          {/* Bento grid using JSON mapped data */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:14}}>
            {PROJECTS.map((p,i)=><PCard key={p.id} p={p} delay={i*55}/>)}
          </div>
        </div>
      </section>

      <div className="divider"/>

      {/* ── ABOUT ────────────────────────────────────────────────── */}
      <section id="about">
        <div className="container">
          <Reveal>
            <div className="eyebrow">
              <DecryptedText text="About" animateOn="view" sequential revealDirection="start"
                speed={45} characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#@!_"
                encryptedClassName="" className=""
                style={{fontFamily:'var(--font-mono)',fontSize:'0.75rem',letterSpacing:'0.15em',
                  textTransform:'uppercase',color:'var(--accent)'}}/>
            </div>
            {/* ScrollFloat heading */}
            <ScrollFloat containerClassName="" textClassName="" animationDuration={0.85} stagger={0.03} as="h2">
              I build systems that scale — and hold
            </ScrollFloat>
          </Reveal>

          <div className="about-grid" style={{marginTop:48}}>
            {/* Left: text + terminal */}
            <div>
              <Reveal delay={80}>
                <div className="about-text">
                  <p>I&apos;m a software engineer who gravitates toward the <b>hard infrastructure
                    problems</b> — where high concurrency, machine learning, and systems design collide.</p>
                  <p>Recent work spans a <b>sub-10ms fraud detection engine</b> on Apache Kafka,
                    a <b>multi-tenant RAG platform</b> with strict data isolation, and a{' '}
                    <b>collaborative desktop IDE</b> powered by Yjs + Monaco.</p>
                  <p>Outside code: finalist at <b>IIT Madras AUV Competition</b>, built an OCR
                    pipeline digitising 19th-century Malayalam manuscripts, and write on{' '}
                    <a href="https://medium.com/@jensonrajan321" target="_blank" rel="noopener noreferrer"
                      style={{color:'var(--accent)',borderBottom:'1px solid rgba(56,189,248,0.3)'}}>Medium</a>.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={160}>
                <div className="terminal" style={{marginTop:24}}>
                  <div className="terminal-bar">
                    <div className="t-dot" style={{background:'#FF5F56'}}/><div className="t-dot" style={{background:'#FFBD2E'}}/><div className="t-dot" style={{background:'#27C93F'}}/>
                    <span style={{marginLeft:8,fontSize:'0.72rem',color:'var(--text-3)'}}>~/jenson — zsh</span>
                  </div>
                  <div className="terminal-body">
                    <div><span className="t-green">❯</span> <span className="t-accent">cat</span><span className="t-white"> stack.json</span></div>
                    <div style={{paddingLeft:16,marginTop:4}}>
                      {'{'}<br/>
                      &nbsp;&nbsp;<span className="t-blue">"primary"</span>: <span className="t-green">"backend + distributed-systems"</span>,<br/>
                      &nbsp;&nbsp;<span className="t-blue">"ai_focus"</span>: <span className="t-green">"stream-processing + RAG"</span>,<br/>
                      &nbsp;&nbsp;<span className="t-blue">"open_to"</span>: <span className="t-green">"full-time roles"</span><br/>
                      {'}'}
                    </div>
                    <div style={{marginTop:10}}>
                      <span className="t-green">❯</span>
                      <span style={{display:'inline-block',width:2,height:'0.9em',background:'var(--accent)',
                        verticalAlign:'middle',marginLeft:4,animation:'blink 1.1s step-end infinite'}}/>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right: TiltedCard photo + skills */}
            <div>
              <Reveal delay={60}>
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: 36 }}>
                  {/* Replaced ProfileCard with completely bounded TiltedCard */}
                  <TiltedCard
                    imageSrc="/ascii_output_my_image.png"
                    altText="Jenson T Rajan"
                    containerHeight="350px"
                    containerWidth="280px"
                    imageHeight="350px"
                    imageWidth="280px"
                    rotateAmplitude={12}
                    scaleOnHover={1.05}
                    showTooltip={false}
                    displayOverlayContent={false}
                  />
                </div>
              </Reveal>

              <Reveal delay={120}>
                <div className="eyebrow" style={{marginBottom:18}}>Tech stack</div>
                <div className="skill-grid">
                  {Object.entries(SKILLS).map(([cat,items])=>(
                    <div key={cat} className="skill-category">
                      <h4>{cat}</h4>
                      <div className="skill-chips">
                        {items.map(s=><span key={s} className="skill-chip">{s}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={200}>
                <div style={{marginTop:20,background:'var(--bg-2)',border:'1px solid var(--border)',
                  borderRadius:'var(--radius)',padding:'18px 20px'}}>
                  <div className="eyebrow" style={{marginBottom:12}}>Recognition</div>
                  {[
                    {icon:'🏆',text:'Finalist — IIT Madras AUV Competition'},
                    {icon:'✍️',text:'Published on Medium'},
                    {icon:'🔬',text:'ML research: OCR for 19th-century Malayalam scripts'},
                  ].map(({icon,text})=>(
                    <div key={text} style={{display:'flex',gap:10,marginBottom:10,alignItems:'flex-start'}}>
                      <span style={{fontSize:'1rem',flexShrink:0}}>{icon}</span>
                      <span style={{fontSize:'0.875rem',color:'var(--text-2)',lineHeight:1.5}}>{text}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <div className="divider"/>

      {/* ── CONTACT — BorderGlow wraps the CTA box ───────────────── */}
      <section id="contact">
        <div className="container">
          <Reveal>
            <BorderGlow
              edgeSensitivity={25}
              glowColor="56 189 248"
              backgroundColor="var(--bg-1)"
              borderRadius={24}
              glowRadius={50}
              glowIntensity={1.1}
              coneSpread={28}
              colors={['#38BDF8','#7DD3FC','#BAE6FD']}
              fillOpacity={0.25}
              style={{width:'100%'}}
            >
              <div style={{padding:'clamp(48px,7vw,80px)',textAlign:'center',position:'relative', overflow:'hidden'}}>
                
                {/* Background Beams Effect */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.6 }}>
                  <Beams
                    beamWidth={3}
                    beamHeight={30}
                    beamNumber={20}
                    lightColor="#7DD3FC"
                    speed={1.5}
                    noiseIntensity={1.5}
                  />
                </div>

                {/* Spinning rings */}
                <div className="spin-ring" style={{ borderColor: 'rgba(56, 189, 248, 0.15)' }}/>
                <div className="spin-ring spin-ring-2" style={{ borderColor: 'rgba(56, 189, 248, 0.08)' }}/>
                
                <div style={{position:'relative',zIndex:1}}>
                  <div className="eyebrow" style={{marginBottom:18,justifyContent:'center',display:'flex'}}>
                    <DecryptedText text="Contact" animateOn="view" sequential revealDirection="start"
                      speed={55} encryptedClassName="" className=""
                      style={{fontFamily:'var(--font-mono)',fontSize:'0.75rem',letterSpacing:'0.15em',
                        textTransform:'uppercase',color:'var(--accent)'}}/>
                  </div>
                  <h2 style={{fontFamily:'var(--font-serif)',fontSize:'clamp(2rem,5vw,3.2rem)',
                    fontWeight:400,lineHeight:1.2,marginBottom:16}}>
                    Let&apos;s build something<br/>
                    <em style={{fontStyle:'italic',color:'var(--accent)'}}>worth shipping.</em>
                  </h2>
                  <p style={{color:'var(--text-2)',maxWidth:420,margin:'0 auto 36px',fontSize:'1rem'}}>
                    Open to full-time engineering roles and interesting collaborations. Drop me a line.
                  </p>
                  <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
                    <MagBtn href="mailto:jensonrajan321@gmail.com" primary>
                      <Ico.Mail/> jensonrajan321@gmail.com
                    </MagBtn>
                    <MagBtn href="https://www.linkedin.com/in/jenson-t-rajan/">
                      <Ico.LinkedIn/> LinkedIn
                    </MagBtn>
                  </div>
                </div>
              </div>
            </BorderGlow>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer>
        <div className="container">
          <div className="footer-inner">
            <span className="footer-text">© {new Date().getFullYear()} Jenson T Rajan</span>
            <div className="footer-links">
              {[
                ['https://github.com/JensonCode007','GitHub'],
                ['https://www.linkedin.com/in/jenson-t-rajan/','LinkedIn'],
                ['https://medium.com/@jensonrajan321','Medium'],
                ['mailto:jensonrajan321@gmail.com','Email'],
              ].map(([h,l])=>(
                <a key={h} href={h} target={h.startsWith('http')?'_blank':undefined}
                  rel="noopener noreferrer" className="footer-link">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}