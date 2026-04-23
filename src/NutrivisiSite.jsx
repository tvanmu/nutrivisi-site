import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu, X, ChevronRight, ArrowRight, ShieldCheck, Award, ShieldAlert,
  Tag, Wheat, Beef, UtensilsCrossed, Store, CheckCircle2,
  ClipboardCheck, Send, Eye, BookOpen, AlertTriangle,
  FlaskConical, Recycle, Scale, Layers, Fingerprint, Globe
} from 'lucide-react';
import NutriLogo from './components/NutriLogo';
import { getLegalPath } from './legalContent';

/* =====================================================================
   1. REDUCED-MOTION HOOK
   ===================================================================== */
const useReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener ? mq.addEventListener('change', update) : mq.addListener(update);
    return () => {
      mq.removeEventListener ? mq.removeEventListener('change', update) : mq.removeListener(update);
    };
  }, []);
  return reduced;
};

/* =====================================================================
   2. CUSTOM CURSOR — fixed hover detection + reduced-motion aware
   ===================================================================== */
const CustomCursor = ({ disabled }) => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (disabled) return;
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const handleMouseOver = (e) => {
      // Only mark real interactive elements, not every span/paragraph
      setIsHovering(Boolean(e.target.closest('button, a, input, textarea, [data-cursor="hover"], .interactive-card')));
    };
    const handleLeave = () => setVisible(false);
    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleLeave);
    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleLeave);
    };
  }, [disabled]);

  if (disabled) return null;

  return (
    <>
      <div
        className="fixed top-0 left-0 w-10 h-10 border border-[#F0A018]/40 rounded-full pointer-events-none z-[9999] transition-all duration-300 ease-out items-center justify-center mix-blend-screen hidden sm:flex"
        style={{
          transform: `translate(${position.x - 20}px, ${position.y - 20}px) scale(${isHovering ? 1.6 : 1})`,
          backgroundColor: isHovering ? 'rgba(240,160,24,0.08)' : 'transparent',
          boxShadow: isHovering ? '0 0 18px rgba(240,160,24,0.2)' : 'none',
          opacity: visible ? 1 : 0,
        }}
      />
      <div
        className="fixed top-0 left-0 w-2 h-2 bg-[#F0A018] rounded-full pointer-events-none z-[10000] transition-transform duration-75 ease-linear hidden sm:block shadow-[0_0_8px_#F0A018]"
        style={{
          transform: `translate(${position.x - 4}px, ${position.y - 4}px)`,
          opacity: visible ? 1 : 0,
        }}
      />
    </>
  );
};

/* =====================================================================
   3. REVEAL UTILITIES
   ===================================================================== */
const FadeInSection = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();
  useEffect(() => {
    const node = domRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setVisible(true)),
      { threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.unobserve(node);
  }, []);
  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out ${className} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

/* Replaces the old hard-fade text. Opacity now clamps so body copy never fully disappears. */
const ScrollRevealText = ({ children, className = '' }) => {
  const [opacity, setOpacity] = useState(0.85);
  const textRef = useRef();
  useEffect(() => {
    const handleScroll = () => {
      if (!textRef.current) return;
      const rect = textRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const center = windowHeight / 2;
      const distanceFromCenter = Math.abs(rect.top + rect.height / 2 - center);
      const proximity = Math.max(0, 1 - distanceFromCenter / 400);
      // Clamp so text never drops below 0.8
      setOpacity(0.8 + proximity * 0.2);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <p ref={textRef} className={className} style={{ opacity, transition: 'opacity 0.2s ease-out' }}>
      {children}
    </p>
  );
};

/* =====================================================================
   5. ATMOSPHERIC BACKGROUND LAYERS
   ===================================================================== */
const heroParticles = Array.from({ length: 30 }, (_, i) => ({
  left: `${(i * 37 + 11) % 100}%`,
  top: `${(i * 53 + 7) % 100}%`,
  animationDuration: `${15 + ((i * 11) % 20)}s`,
  animationDelay: `${((i * 17) % 50) / 10}s`,
}));

const ParticleField = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
    {heroParticles.map((particle, i) => (
      <div
        key={i}
        className="absolute w-[1px] h-[30px] bg-gradient-to-t from-transparent via-[#F0A018] to-transparent opacity-10 animate-float-stream"
        style={particle}
      />
    ))}
  </div>
);

const HeroKineticCompass = ({ rotation }) => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0 opacity-[0.18]">
    <svg viewBox="0 0 1000 1000" className="w-[150vw] h-[150vw] max-w-[1200px] max-h-[1200px] transition-transform duration-500 ease-out" style={{ transform: `rotate(${rotation * 0.3}deg)` }}>
      <circle cx="500" cy="500" r="480" fill="none" stroke="#ffffff" strokeWidth="1" strokeDasharray="4 12" />
      <circle cx="500" cy="500" r="420" fill="none" stroke="#56C0D5" strokeWidth="0.5" opacity="0.6" />
      <g style={{ transformOrigin: '500px 500px', transform: `rotate(${-rotation * 0.6}deg)` }}>
        <circle cx="500" cy="500" r="320" fill="none" stroke="#F0A018" strokeWidth="1" strokeDasharray="1 8" />
        <circle cx="500" cy="500" r="280" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
        <line x1="180" y1="500" x2="820" y2="500" stroke="#F0A018" strokeWidth="0.8" opacity="0.5" />
        <line x1="500" y1="180" x2="500" y2="820" stroke="#F0A018" strokeWidth="0.8" opacity="0.5" />
      </g>
      <line x1="0" y1="500" x2="1000" y2="500" stroke="#ffffff" strokeWidth="0.8" opacity="0.5" />
      <line x1="500" y1="0" x2="500" y2="1000" stroke="#ffffff" strokeWidth="0.8" opacity="0.5" />
      <line x1="146" y1="146" x2="854" y2="854" stroke="#56C0D5" strokeWidth="0.8" opacity="0.5" />
      <line x1="146" y1="854" x2="854" y2="146" stroke="#56C0D5" strokeWidth="0.8" opacity="0.5" />
      <circle cx="500" cy="20" r="5" fill="#F0A018" />
      <circle cx="500" cy="980" r="5" fill="#F0A018" />
      <circle cx="20" cy="500" r="5" fill="#56C0D5" />
      <circle cx="980" cy="500" r="5" fill="#56C0D5" />
    </svg>
  </div>
);

/* =====================================================================
   6. PER-SERVICE VISUALS (replaces the generic PrecisionScanner)
   ===================================================================== */

/* 6a — Expertadvies: Layered advisory rings with policy/risk/ops labels */
const AdvisoryLayersVisual = () => (
  <svg viewBox="0 0 400 400" className="w-full h-full max-w-[320px] opacity-85">
    <defs>
      <radialGradient id="adv-core" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#F0A018" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#F0A018" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="adv-sweep" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F0A018" stopOpacity="1" />
        <stop offset="100%" stopColor="#F0A018" stopOpacity="0" />
      </linearGradient>
    </defs>
    <circle cx="200" cy="200" r="180" fill="none" stroke="#56C0D5" strokeWidth="0.8" strokeDasharray="2 8" />
    <circle cx="200" cy="200" r="130" fill="none" stroke="#F0A018" strokeWidth="0.6" opacity="0.5" />
    <circle cx="200" cy="200" r="80" fill="none" stroke="#56C0D5" strokeWidth="1" opacity="0.7" />
    <circle cx="200" cy="200" r="38" fill="url(#adv-core)" />
    <circle cx="200" cy="200" r="12" fill="#F0A018" className="animate-pulse" />
    <g className="animate-[spin_12s_linear_infinite]" style={{ transformOrigin: '200px 200px' }}>
      <path d="M 200 200 L 200 20" stroke="url(#adv-sweep)" strokeWidth="3" opacity="0.9" />
    </g>
    {/* Orbit dots */}
    <circle cx="200" cy="70" r="4" fill="#F0A018" />
    <circle cx="330" cy="200" r="4" fill="#56C0D5" />
    <circle cx="200" cy="330" r="4" fill="#F0A018" />
    <circle cx="70" cy="200" r="4" fill="#56C0D5" />
    {/* Tier labels */}
    <text x="200" y="30" textAnchor="middle" fill="#F0A018" fontSize="9" fontFamily="monospace" letterSpacing="3">POLICY</text>
    <text x="200" y="82" textAnchor="middle" fill="#56C0D5" fontSize="8" fontFamily="monospace" letterSpacing="3" opacity="0.8">RISK</text>
    <text x="200" y="135" textAnchor="middle" fill="#ffffff" fontSize="7" fontFamily="monospace" letterSpacing="3" opacity="0.6">OPS</text>
  </svg>
);

/* 6b — Coaching: Floating workbook card with pictograms */
const WorkbookVisual = () => (
  <svg viewBox="0 0 400 400" className="w-full h-full max-w-[320px] opacity-90">
    <defs>
      <linearGradient id="wb-page" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#023A4E" />
        <stop offset="100%" stopColor="#01506E" />
      </linearGradient>
    </defs>
    {/* Back pages (layered) */}
    <rect x="75" y="55" width="260" height="310" rx="6" fill="#011a24" opacity="0.5" transform="rotate(-4 200 200)" />
    <rect x="70" y="50" width="260" height="310" rx="6" fill="#023142" opacity="0.75" transform="rotate(-2 200 200)" />
    {/* Main card */}
    <rect x="65" y="45" width="270" height="320" rx="8" fill="url(#wb-page)" stroke="#F0A018" strokeWidth="1.5" />
    {/* Header bar */}
    <rect x="65" y="45" width="270" height="34" rx="8" fill="#F0A018" opacity="0.15" />
    <rect x="65" y="75" width="270" height="1" fill="#F0A018" opacity="0.4" />
    <text x="82" y="67" fill="#F0A018" fontSize="9" fontFamily="monospace" letterSpacing="2">HACCP · VISUELE INSTRUCTIE</text>
    {/* Pictogram grid */}
    <g transform="translate(95, 105)">
      {/* Handwash */}
      <rect x="0" y="0" width="60" height="60" rx="6" fill="#011a24" stroke="#56C0D5" strokeWidth="1" opacity="0.9" />
      <circle cx="30" cy="22" r="8" fill="none" stroke="#56C0D5" strokeWidth="1.5" />
      <path d="M 20 36 Q 30 42 40 36 L 40 48 L 20 48 Z" fill="none" stroke="#56C0D5" strokeWidth="1.5" />
      <circle cx="22" cy="44" r="1.5" fill="#56C0D5" />
      <circle cx="38" cy="46" r="1.5" fill="#56C0D5" />
      {/* Temp */}
      <rect x="75" y="0" width="60" height="60" rx="6" fill="#011a24" stroke="#F0A018" strokeWidth="1" opacity="0.9" />
      <rect x="101" y="15" width="8" height="28" rx="2" fill="none" stroke="#F0A018" strokeWidth="1.5" />
      <circle cx="105" cy="45" r="5" fill="#F0A018" />
      <line x1="114" y1="22" x2="120" y2="22" stroke="#F0A018" strokeWidth="1" />
      <line x1="114" y1="30" x2="120" y2="30" stroke="#F0A018" strokeWidth="1" />
      <line x1="114" y1="38" x2="120" y2="38" stroke="#F0A018" strokeWidth="1" />
      {/* Separate */}
      <rect x="150" y="0" width="60" height="60" rx="6" fill="#011a24" stroke="#56C0D5" strokeWidth="1" opacity="0.9" />
      <rect x="162" y="15" width="16" height="12" rx="1" fill="none" stroke="#56C0D5" strokeWidth="1.5" />
      <rect x="182" y="33" width="16" height="12" rx="1" fill="none" stroke="#56C0D5" strokeWidth="1.5" />
      <line x1="170" y1="33" x2="180" y2="22" stroke="#F0A018" strokeWidth="1" strokeDasharray="2 2" />
    </g>
    {/* Caption lines */}
    <rect x="95" y="195" width="210" height="4" rx="2" fill="#F0A018" opacity="0.4" />
    <rect x="95" y="210" width="170" height="3" rx="2" fill="#ffffff" opacity="0.2" />
    <rect x="95" y="222" width="190" height="3" rx="2" fill="#ffffff" opacity="0.2" />
    <rect x="95" y="234" width="140" height="3" rx="2" fill="#ffffff" opacity="0.2" />
    {/* Footer bar */}
    <rect x="95" y="310" width="210" height="32" rx="4" fill="#F0A018" opacity="0.1" stroke="#F0A018" strokeWidth="0.6" />
    <text x="200" y="330" textAnchor="middle" fill="#F0A018" fontSize="8" fontFamily="monospace" letterSpacing="2">FOOD SAFETY CULTURE</text>
    {/* Decorative tags */}
    <circle cx="320" cy="60" r="12" fill="#F0A018" opacity="0.2" />
    <circle cx="320" cy="60" r="5" fill="#F0A018" />
  </svg>
);

/* 6c — Certificatie: Vertical audit checklist flow */
const CertificationFlowVisual = () => {
  const items = [
    { label: 'DOCUMENT REVIEW', status: 'done' },
    { label: 'GAP ANALYSIS', status: 'done' },
    { label: 'AUTOCONTROLE', status: 'done' },
    { label: 'PRE-AUDIT', status: 'active' },
    { label: 'CERTIFICATION', status: 'pending' },
  ];
  return (
    <svg viewBox="0 0 400 400" className="w-full h-full max-w-[320px] opacity-90">
      <defs>
        <linearGradient id="cert-line" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F0A018" />
          <stop offset="60%" stopColor="#F0A018" />
          <stop offset="60%" stopColor="#56C0D5" opacity="0.4" />
          <stop offset="100%" stopColor="#56C0D5" opacity="0.2" />
        </linearGradient>
      </defs>
      <line x1="90" y1="50" x2="90" y2="350" stroke="url(#cert-line)" strokeWidth="2" />
      {items.map((item, i) => {
        const y = 60 + i * 68;
        const isDone = item.status === 'done';
        const isActive = item.status === 'active';
        const color = isDone ? '#F0A018' : isActive ? '#F0A018' : '#56C0D5';
        return (
          <g key={item.label}>
            {isActive && <circle cx="90" cy={y} r="20" fill="none" stroke="#F0A018" strokeWidth="1" opacity="0.4" className="animate-ping" />}
            <circle cx="90" cy={y} r="12" fill={isDone ? '#F0A018' : '#011a24'} stroke={color} strokeWidth="2" />
            {isDone && <path d={`M ${85} ${y} L ${89} ${y + 4} L ${96} ${y - 3}`} stroke="#012330" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />}
            {isActive && <circle cx="90" cy={y} r="4" fill="#F0A018" className="animate-pulse" />}
            <rect x="115" y={y - 14} width="220" height="28" rx="4" fill={isActive ? '#F0A018' : '#011a24'} fillOpacity={isActive ? 0.15 : 0.6} stroke={color} strokeWidth="0.8" strokeOpacity={isActive ? 1 : 0.4} />
            <text x="125" y={y + 4} fill={isActive ? '#F0A018' : isDone ? '#ffffff' : '#56C0D5'} fontSize="10" fontFamily="monospace" letterSpacing="2" opacity={item.status === 'pending' ? 0.6 : 1}>{item.label}</text>
            {isDone && <text x="320" y={y + 4} fill="#F0A018" fontSize="9" fontFamily="monospace" letterSpacing="1" opacity="0.7">OK</text>}
            {isActive && <text x="315" y={y + 4} fill="#F0A018" fontSize="9" fontFamily="monospace" letterSpacing="1">··· 72%</text>}
          </g>
        );
      })}
    </svg>
  );
};

/* 6d — Risicobeheersing: 5x5 Risk heatmap */
const RiskHeatmapVisual = () => {
  const cells = [
    [1, 1, 2, 3, 3],
    [1, 2, 2, 3, 4],
    [2, 2, 3, 4, 4],
    [2, 3, 4, 4, 5],
    [3, 4, 4, 5, 5],
  ];
  const colorFor = (v) => {
    if (v === 1) return '#56C0D5';
    if (v === 2) return '#6BA0C8';
    if (v === 3) return '#F0A018';
    if (v === 4) return '#E87A2E';
    return '#D64545';
  };
  return (
    <svg viewBox="0 0 400 400" className="w-full h-full max-w-[320px] opacity-90">
      {/* Axis labels */}
      <text x="200" y="20" textAnchor="middle" fill="#F0A018" fontSize="9" fontFamily="monospace" letterSpacing="2">RISK MATRIX · 5×5</text>
      <text x="200" y="390" textAnchor="middle" fill="#ffffff" fontSize="8" fontFamily="monospace" letterSpacing="3" opacity="0.6">IMPACT →</text>
      <g transform="translate(25, 200) rotate(-90)">
        <text x="0" y="0" textAnchor="middle" fill="#ffffff" fontSize="8" fontFamily="monospace" letterSpacing="3" opacity="0.6">LIKELIHOOD →</text>
      </g>
      {/* Grid cells */}
      {cells.map((row, i) =>
        row.map((val, j) => {
          const x = 60 + j * 55;
          const y = 55 + (4 - i) * 55;
          const highlighted = i === 3 && j === 3;
          return (
            <g key={`${i}-${j}`}>
              <rect x={x} y={y} width="50" height="50" rx="3" fill={colorFor(val)} fillOpacity={highlighted ? 0.9 : 0.25} stroke={colorFor(val)} strokeWidth={highlighted ? 2 : 0.5} strokeOpacity={highlighted ? 1 : 0.5} />
              {highlighted && (
                <>
                  <rect x={x - 4} y={y - 4} width="58" height="58" rx="5" fill="none" stroke="#F0A018" strokeWidth="1.5" strokeDasharray="3 3" className="animate-pulse" />
                  <text x={x + 25} y={y + 30} textAnchor="middle" fill="#012330" fontSize="14" fontWeight="bold">!</text>
                </>
              )}
            </g>
          );
        })
      )}
      {/* Scanner sweep */}
      <g className="animate-[spin_10s_linear_infinite]" style={{ transformOrigin: '200px 200px' }}>
        <path d="M 200 200 L 200 50" stroke="#F0A018" strokeWidth="1.5" opacity="0.35" />
      </g>
      {/* Pinpoint on critical cell */}
      <circle cx="220" cy="115" r="5" fill="#F0A018" className="animate-pulse" />
      <text x="235" y="119" fill="#F0A018" fontSize="8" fontFamily="monospace" letterSpacing="2">ALLERGEN</text>
    </svg>
  );
};

/* 6e — Etikettering: Label inspector with callouts */
const LabelInspectorVisual = () => (
  <svg viewBox="0 0 400 400" className="w-full h-full max-w-[340px] opacity-95">
    <defs>
      <linearGradient id="label-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.05" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
      </linearGradient>
    </defs>
    {/* Label body */}
    <rect x="70" y="70" width="260" height="260" rx="6" fill="url(#label-bg)" stroke="#F0A018" strokeWidth="1.5" />
    {/* Label header */}
    <rect x="70" y="70" width="260" height="38" rx="6" fill="#F0A018" opacity="0.15" />
    <rect x="82" y="82" width="70" height="14" rx="2" fill="#F0A018" opacity="0.9" />
    <rect x="158" y="82" width="50" height="14" rx="2" fill="#ffffff" opacity="0.3" />
    {/* Product line */}
    <rect x="82" y="120" width="180" height="7" rx="2" fill="#ffffff" opacity="0.5" />
    <rect x="82" y="134" width="140" height="4" rx="2" fill="#ffffff" opacity="0.25" />
    {/* Ingredients block */}
    <text x="82" y="160" fill="#56C0D5" fontSize="7" fontFamily="monospace" letterSpacing="2">INGREDIËNTEN</text>
    <rect x="82" y="167" width="236" height="3" rx="1" fill="#ffffff" opacity="0.2" />
    <rect x="82" y="175" width="220" height="3" rx="1" fill="#ffffff" opacity="0.2" />
    <rect x="82" y="183" width="200" height="3" rx="1" fill="#ffffff" opacity="0.2" />
    {/* Highlighted allergen */}
    <rect x="140" y="192" width="52" height="10" rx="2" fill="#F0A018" opacity="0.3" stroke="#F0A018" strokeWidth="1" />
    <text x="144" y="200" fill="#F0A018" fontSize="7" fontFamily="monospace" fontWeight="bold">GLUTEN</text>
    <rect x="82" y="191" width="54" height="3" rx="1" fill="#ffffff" opacity="0.2" />
    <rect x="198" y="191" width="120" height="3" rx="1" fill="#ffffff" opacity="0.2" />
    {/* Nutritional block */}
    <text x="82" y="220" fill="#56C0D5" fontSize="7" fontFamily="monospace" letterSpacing="2">VOEDINGSWAARDE / 100G</text>
    <line x1="82" y1="227" x2="318" y2="227" stroke="#ffffff" strokeOpacity="0.2" />
    <rect x="82" y="235" width="60" height="3" rx="1" fill="#ffffff" opacity="0.25" />
    <rect x="260" y="235" width="40" height="3" rx="1" fill="#ffffff" opacity="0.25" />
    <rect x="82" y="245" width="80" height="3" rx="1" fill="#ffffff" opacity="0.25" />
    <rect x="260" y="245" width="40" height="3" rx="1" fill="#ffffff" opacity="0.25" />
    <rect x="82" y="255" width="55" height="3" rx="1" fill="#ffffff" opacity="0.25" />
    <rect x="260" y="255" width="40" height="3" rx="1" fill="#ffffff" opacity="0.25" />
    {/* Footer: batch + date */}
    <rect x="82" y="285" width="80" height="20" rx="2" fill="none" stroke="#ffffff" strokeOpacity="0.3" strokeDasharray="2 2" />
    <text x="89" y="298" fill="#ffffff" fontSize="7" fontFamily="monospace" opacity="0.5">L 22.04.26</text>
    <rect x="240" y="285" width="70" height="20" rx="2" fill="none" stroke="#F0A018" strokeOpacity="0.6" />
    <text x="248" y="298" fill="#F0A018" fontSize="7" fontFamily="monospace">TGT 30.07.26</text>
    {/* Callout 1 — Allergen */}
    <line x1="192" y1="197" x2="355" y2="155" stroke="#F0A018" strokeWidth="1" strokeDasharray="2 2" />
    <circle cx="192" cy="197" r="3" fill="#F0A018" />
    <rect x="340" y="140" width="58" height="30" rx="3" fill="#011a24" stroke="#F0A018" strokeWidth="0.8" />
    <text x="346" y="152" fill="#F0A018" fontSize="7" fontFamily="monospace">ALLERGEN</text>
    <text x="346" y="163" fill="#ffffff" fontSize="6" fontFamily="monospace" opacity="0.7">EU 1169/2011</text>
    {/* Callout 2 — TGT */}
    <line x1="310" y1="295" x2="365" y2="320" stroke="#56C0D5" strokeWidth="1" strokeDasharray="2 2" />
    <circle cx="310" cy="295" r="3" fill="#56C0D5" />
    <rect x="340" y="310" width="58" height="28" rx="3" fill="#011a24" stroke="#56C0D5" strokeWidth="0.8" />
    <text x="346" y="322" fill="#56C0D5" fontSize="7" fontFamily="monospace">DATE</text>
    <text x="346" y="333" fill="#ffffff" fontSize="6" fontFamily="monospace" opacity="0.7">FAVV CHECK</text>
    {/* Callout 3 — Batch */}
    <line x1="88" y1="295" x2="22" y2="340" stroke="#56C0D5" strokeWidth="1" strokeDasharray="2 2" />
    <circle cx="88" cy="295" r="3" fill="#56C0D5" />
    <rect x="4" y="330" width="58" height="28" rx="3" fill="#011a24" stroke="#56C0D5" strokeWidth="0.8" />
    <text x="10" y="342" fill="#56C0D5" fontSize="7" fontFamily="monospace">BATCH</text>
    <text x="10" y="353" fill="#ffffff" fontSize="6" fontFamily="monospace" opacity="0.7">TRACEABLE</text>
    {/* Scan line */}
    <line x1="70" y1="230" x2="330" y2="230" stroke="#F0A018" strokeWidth="1" opacity="0.5" className="animate-[labelScan_5s_ease-in-out_infinite]" />
  </svg>
);

const MethodGlyph = ({ index }) => {
  if (index === 0) {
    return (
      <svg viewBox="0 0 72 72" className="h-10 w-10" fill="none" aria-hidden="true">
        <circle cx="36" cy="36" r="25" stroke="currentColor" strokeWidth="1.5" opacity="0.28" />
        <circle cx="36" cy="36" r="13" stroke="#F0A018" strokeWidth="2" />
        <circle cx="36" cy="36" r="4" fill="#F0A018" />
        <path d="M15 36H25M47 36H57M36 15V25M36 47V57" stroke="#56C0D5" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M48 48L59 59" stroke="#F0A018" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    );
  }

  if (index === 1) {
    return (
      <svg viewBox="0 0 72 72" className="h-10 w-10" fill="none" aria-hidden="true">
        <path d="M15 20H36M15 36H42M15 52H31" stroke="#56C0D5" strokeWidth="2" strokeLinecap="round" opacity="0.78" />
        <rect x="11" y="14" width="34" height="12" rx="3" stroke="currentColor" strokeWidth="1.4" opacity="0.32" />
        <rect x="11" y="30" width="40" height="12" rx="3" stroke="currentColor" strokeWidth="1.4" opacity="0.32" />
        <rect x="11" y="46" width="28" height="12" rx="3" stroke="currentColor" strokeWidth="1.4" opacity="0.32" />
        <path d="M42 22C52 25 57 31 57 36C57 43 50 49 39 52" stroke="#F0A018" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M44 45L39 52L48 54" stroke="#F0A018" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 72 72" className="h-10 w-10" fill="none" aria-hidden="true">
      <path d="M36 10L55 18V33C55 47 47 56 36 62C25 56 17 47 17 33V18L36 10Z" stroke="#F0A018" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M29 36L34 41L45 29" stroke="#F0A018" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M25 23H47M25 50H47" stroke="#56C0D5" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
      <circle cx="36" cy="36" r="25" stroke="currentColor" strokeWidth="1.2" opacity="0.18" strokeDasharray="4 8" />
    </svg>
  );
};

const WhyGlyph = ({ index }) => {
  if (index === 0) {
    return (
      <svg viewBox="0 0 72 72" className="h-10 w-10" fill="none" aria-hidden="true">
        <rect x="15" y="12" width="34" height="46" rx="5" stroke="#56C0D5" strokeWidth="1.6" opacity="0.55" />
        <path d="M22 24H39M22 35H35M22 46H43" stroke="#56C0D5" strokeWidth="1.7" strokeLinecap="round" opacity="0.8" />
        <rect x="43" y="20" width="14" height="14" rx="3" stroke="#F0A018" strokeWidth="2" />
        <path d="M47 27L50 30L55 24" stroke="#F0A018" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M49 42C54 42 58 45 60 50C58 55 54 58 49 58C44 58 40 55 38 50C40 45 44 42 49 42Z" stroke="#F0A018" strokeWidth="1.8" />
        <circle cx="49" cy="50" r="3" fill="#F0A018" />
      </svg>
    );
  }

  if (index === 1) {
    return (
      <svg viewBox="0 0 72 72" className="h-10 w-10" fill="none" aria-hidden="true">
        {[
          [14, 14], [42, 14], [14, 42], [42, 42],
        ].map(([x, y], i) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="16" height="16" rx="4" stroke={i === 1 ? '#F0A018' : '#56C0D5'} strokeWidth="1.8" opacity={i === 1 ? 1 : 0.64} />
        ))}
        <path d="M30 22H42M22 30V42M50 30V42M30 50H42" stroke="#F0A018" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="2 4" />
        <circle cx="22" cy="22" r="2.2" fill="#56C0D5" />
        <path d="M47 21L50 24L55 18" stroke="#F0A018" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 50H24M50 47V53" stroke="#56C0D5" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (index === 2) {
    return (
      <svg viewBox="0 0 72 72" className="h-10 w-10" fill="none" aria-hidden="true">
        <path d="M36 13V55M25 21H47M20 55H52" stroke="#F0A018" strokeWidth="2.1" strokeLinecap="round" />
        <path d="M25 25L16 42H34L25 25ZM47 25L38 42H56L47 25Z" stroke="#F0A018" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M18 42C20 47 31 47 33 42M40 42C42 47 53 47 55 42" stroke="#56C0D5" strokeWidth="1.6" strokeLinecap="round" opacity="0.75" />
        <rect x="25" y="50" width="22" height="8" rx="3" stroke="#56C0D5" strokeWidth="1.5" opacity="0.6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 72 72" className="h-10 w-10" fill="none" aria-hidden="true">
      <path d="M36 13C25 13 18 21 18 32M36 13C47 13 54 21 54 32" stroke="#56C0D5" strokeWidth="1.7" strokeLinecap="round" opacity="0.65" />
      <path d="M25 51C21 45 21 37 24 31C27 25 32 22 36 22C44 22 50 28 50 36C50 43 45 49 39 53" stroke="#F0A018" strokeWidth="2.1" strokeLinecap="round" />
      <path d="M31 56C27 49 27 41 30 35C32 31 34 30 36 30C40 30 42 33 42 36C42 41 38 42 38 47" stroke="#F0A018" strokeWidth="2.1" strokeLinecap="round" />
      <path d="M36 38C36 45 44 48 51 48" stroke="#56C0D5" strokeWidth="1.8" strokeLinecap="round" opacity="0.75" />
      <path d="M48 44L52 48L47 52" stroke="#56C0D5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.75" />
    </svg>
  );
};

const KnowledgeGlyph = ({ index }) => {
  if (index === 0) {
    return (
      <svg viewBox="0 0 72 72" className="h-10 w-10" fill="none" aria-hidden="true">
        <path d="M36 13L59 56H13L36 13Z" stroke="#5CC0D5" strokeWidth="1.8" strokeLinejoin="round" opacity="0.72" />
        <path d="M36 27V42" stroke="#F0A018" strokeWidth="2.8" strokeLinecap="round" />
        <circle cx="36" cy="50" r="2.8" fill="#F0A018" />
        <path d="M23 34C29 31 32 36 36 34C40 32 44 27 50 32" stroke="#5CC0D5" strokeWidth="1.7" strokeLinecap="round" opacity="0.65" />
        <circle cx="23" cy="34" r="2" fill="#F0A018" />
        <circle cx="50" cy="32" r="2" fill="#F0A018" opacity="0.75" />
      </svg>
    );
  }

  if (index === 1) {
    return (
      <svg viewBox="0 0 72 72" className="h-10 w-10" fill="none" aria-hidden="true">
        <rect x="14" y="14" width="44" height="44" rx="7" stroke="#5CC0D5" strokeWidth="1.7" opacity="0.62" />
        <path d="M23 26H32M40 26H49M23 36H32M40 36H49M23 46H32M40 46H49" stroke="#5CC0D5" strokeWidth="1.7" strokeLinecap="round" opacity="0.78" />
        <path d="M18 32H54M18 42H54M36 18V54" stroke="#5CC0D5" strokeWidth="1.1" opacity="0.28" />
        <path d="M23 25L27 29L34 21" stroke="#F0A018" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="45" cy="45" r="7" stroke="#F0A018" strokeWidth="2" />
      </svg>
    );
  }

  if (index === 2) {
    return (
      <svg viewBox="0 0 72 72" className="h-10 w-10" fill="none" aria-hidden="true">
        <path d="M21 31C23 22 31 16 41 17C48 18 54 23 56 30" stroke="#5CC0D5" strokeWidth="2" strokeLinecap="round" />
        <path d="M51 23L56 30L48 32" stroke="#5CC0D5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M51 41C48 50 40 56 30 54C23 53 18 48 16 41" stroke="#F0A018" strokeWidth="2" strokeLinecap="round" />
        <path d="M21 48L16 41L24 39" stroke="#F0A018" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="25" y="26" width="22" height="20" rx="4" stroke="#5CC0D5" strokeWidth="1.7" opacity="0.58" />
        <path d="M31 36H41" stroke="#F0A018" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }

  if (index === 3) {
    return (
      <svg viewBox="0 0 72 72" className="h-10 w-10" fill="none" aria-hidden="true">
        <path d="M31 14H41M33 14V29L21 51C19 55 22 59 27 59H45C50 59 53 55 51 51L39 29V14" stroke="#5CC0D5" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M27 47H45" stroke="#F0A018" strokeWidth="2" strokeLinecap="round" />
        <circle cx="32" cy="43" r="2.4" fill="#F0A018" />
        <circle cx="42" cy="52" r="2.1" fill="#5CC0D5" />
        <path d="M29 31C33 28 39 34 43 30" stroke="#F0A018" strokeWidth="1.8" strokeLinecap="round" opacity="0.85" />
      </svg>
    );
  }

  if (index === 4) {
    return (
      <svg viewBox="0 0 72 72" className="h-10 w-10" fill="none" aria-hidden="true">
        <path d="M36 11L56 19V34C56 48 48 57 36 62C24 57 16 48 16 34V19L36 11Z" stroke="#5CC0D5" strokeWidth="1.8" strokeLinejoin="round" opacity="0.7" />
        <rect x="27" y="33" width="18" height="14" rx="4" stroke="#F0A018" strokeWidth="2" />
        <path d="M31 33V28C31 25 33 23 36 23C39 23 41 25 41 28V33" stroke="#F0A018" strokeWidth="2" strokeLinecap="round" />
        <path d="M25 52H47M24 23H48" stroke="#5CC0D5" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
        <circle cx="36" cy="40" r="2.3" fill="#F0A018" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 72 72" className="h-10 w-10" fill="none" aria-hidden="true">
      <path d="M18 17H49C52 17 54 19 54 22V55C54 52 52 50 49 50H18V17Z" stroke="#5CC0D5" strokeWidth="1.8" strokeLinejoin="round" opacity="0.7" />
      <path d="M18 17V55C18 52 20 50 23 50H54" stroke="#5CC0D5" strokeWidth="1.8" strokeLinejoin="round" opacity="0.7" />
      <path d="M27 27H45M27 36H40" stroke="#5CC0D5" strokeWidth="1.7" strokeLinecap="round" opacity="0.82" />
      <path d="M47 30C52 34 52 42 47 46" stroke="#F0A018" strokeWidth="2" strokeLinecap="round" />
      <path d="M49 26L47 30L43 28M45 48L47 46L50 49" stroke="#F0A018" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="45" r="2.2" fill="#F0A018" />
    </svg>
  );
};

const ServiceGlyph = ({ id, className = 'h-10 w-10' }) => {
  if (id === 'expertadvies') {
    return (
      <svg viewBox="0 0 72 72" className={className} fill="none" aria-hidden="true">
        <circle cx="36" cy="36" r="22" stroke="currentColor" strokeWidth="1.4" opacity="0.24" />
        <circle cx="36" cy="36" r="11" stroke="#F0A018" strokeWidth="2" />
        <path d="M36 15V24M36 48V57M15 36H24M48 36H57" stroke="#56C0D5" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="36" cy="36" r="4" fill="#F0A018" />
        <path d="M45 23C51 28 54 35 52 43" stroke="#F0A018" strokeWidth="2" strokeLinecap="round" />
        <path d="M27 50C21 46 18 39 20 31" stroke="#56C0D5" strokeWidth="1.8" strokeLinecap="round" opacity="0.78" />
      </svg>
    );
  }

  if (id === 'coaching') {
    return (
      <svg viewBox="0 0 72 72" className={className} fill="none" aria-hidden="true">
        <circle cx="28" cy="25" r="7" stroke="#56C0D5" strokeWidth="2" />
        <circle cx="47" cy="28" r="5.5" stroke="#56C0D5" strokeWidth="1.8" opacity="0.68" />
        <path d="M16 51C18 41 23 36 31 36C38 36 43 40 45 48" stroke="#F0A018" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M43 39C50 39 54 43 56 50" stroke="#56C0D5" strokeWidth="1.8" strokeLinecap="round" opacity="0.74" />
        <rect x="17" y="14" width="38" height="44" rx="6" stroke="currentColor" strokeWidth="1.2" opacity="0.18" />
        <path d="M22 58H50" stroke="#F0A018" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (id === 'certificatie') {
    return (
      <svg viewBox="0 0 72 72" className={className} fill="none" aria-hidden="true">
        <circle cx="36" cy="28" r="14" stroke="#F0A018" strokeWidth="2.2" />
        <path d="M30 28L34 32L43 23" stroke="#F0A018" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M28 40L24 59L36 53L48 59L44 40" stroke="#56C0D5" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" opacity="0.82" />
        <circle cx="36" cy="28" r="24" stroke="currentColor" strokeWidth="1.2" opacity="0.18" strokeDasharray="4 8" />
      </svg>
    );
  }

  if (id === 'risico') {
    return (
      <svg viewBox="0 0 72 72" className={className} fill="none" aria-hidden="true">
        <path d="M36 11L55 19V33C55 47 47 56 36 62C25 56 17 47 17 33V19L36 11Z" stroke="#56C0D5" strokeWidth="1.9" strokeLinejoin="round" opacity="0.78" />
        <path d="M36 23V38" stroke="#F0A018" strokeWidth="2.8" strokeLinecap="round" />
        <circle cx="36" cy="47" r="2.8" fill="#F0A018" />
        <path d="M25 23H47M25 54H47" stroke="#F0A018" strokeWidth="1.5" strokeLinecap="round" opacity="0.52" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 72 72" className={className} fill="none" aria-hidden="true">
      <path d="M18 18H43L55 30V54C55 57 53 59 50 59H22C19 59 17 57 17 54V21C17 19 18 18 18 18Z" stroke="#56C0D5" strokeWidth="1.8" strokeLinejoin="round" opacity="0.78" />
      <path d="M43 18V30H55" stroke="#56C0D5" strokeWidth="1.8" strokeLinejoin="round" opacity="0.78" />
      <path d="M25 34H45M25 43H38" stroke="#F0A018" strokeWidth="2" strokeLinecap="round" />
      <path d="M26 52L30 56L38 48" stroke="#F0A018" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="23" y="24" width="14" height="5" rx="2" stroke="currentColor" strokeWidth="1.2" opacity="0.22" />
    </svg>
  );
};

const ServiceBulletGlyph = () => (
  <svg viewBox="0 0 28 28" className="h-5 w-5" fill="none" aria-hidden="true">
    <circle cx="14" cy="14" r="10" stroke="#F0A018" strokeWidth="1.8" />
    <path d="M9.5 14.5L12.5 17.5L18.5 10.5" stroke="#F0A018" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 4V7M14 21V24M4 14H7M21 14H24" stroke="#56C0D5" strokeWidth="1.2" strokeLinecap="round" opacity="0.52" />
  </svg>
);

const ContactGlyph = ({ type, className = 'h-6 w-6' }) => {
  if (type === 'mail') {
    return (
      <svg viewBox="0 0 72 72" className={className} fill="none" aria-hidden="true">
        <rect x="14" y="20" width="44" height="32" rx="7" stroke="#5CC0D5" strokeWidth="2" opacity="0.82" />
        <path d="M18 25L36 39L54 25" stroke="#5CC0D5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M24 48H48" stroke="#5CC0D5" strokeWidth="1.6" strokeLinecap="round" opacity="0.38" />
        <path d="M22 24H50" stroke="#F0A018" strokeWidth="1.8" strokeLinecap="round" opacity="0.92" />
        <circle cx="50" cy="24" r="2.4" fill="#F0A018" />
      </svg>
    );
  }

  if (type === 'phone') {
    return (
      <svg viewBox="0 0 72 72" className={className} fill="none" aria-hidden="true">
        <path d="M24 17H31L35 28L29 33C31 38 34 42 39 45L44 39L55 43V50C55 53 53 55 50 55C31 55 17 41 17 22C17 19 19 17 22 17H24Z" stroke="#5CC0D5" strokeWidth="2" strokeLinejoin="round" opacity="0.84" />
        <path d="M41 19C46 20 50 24 51 29" stroke="#F0A018" strokeWidth="2" strokeLinecap="round" />
        <path d="M39 24C42 25 44 27 45 30" stroke="#F0A018" strokeWidth="2" strokeLinecap="round" opacity="0.92" />
        <path d="M46 36L50 40" stroke="#5CC0D5" strokeWidth="1.6" strokeLinecap="round" opacity="0.42" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 72 72" className={className} fill="none" aria-hidden="true">
      <path d="M36 58C46 46 54 38 54 28C54 18 46 12 36 12C26 12 18 18 18 28C18 38 26 46 36 58Z" stroke="#5CC0D5" strokeWidth="2" strokeLinejoin="round" opacity="0.84" />
      <circle cx="36" cy="28" r="7" stroke="#5CC0D5" strokeWidth="2" />
      <circle cx="36" cy="28" r="2.5" fill="#F0A018" />
      <path d="M36 44V49" stroke="#F0A018" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

/* =====================================================================
   7. SECTION TITLE
   ===================================================================== */
function SectionTitle({ eyebrow, title, description, center = false }) {
  return (
    <div className={`mb-16 ${center ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}`}>
      {eyebrow && (
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm bg-[#F0A018]/10 text-[#F0A018] text-xs font-bold uppercase tracking-[0.2em] mb-6 border border-[#F0A018]/20">
          {eyebrow}
        </div>
      )}
      <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
        {title.split(' ').map((word, i, arr) =>
          i === arr.length - 1 || i === arr.length - 2
            ? <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-[#F0A018] to-[#FFC35C]">{word} </span>
            : <span key={i}>{word} </span>
        )}
      </h2>
      {description && (
        <ScrollRevealText className="text-xl md:text-2xl text-teal-300 font-bold leading-relaxed">
          {description}
        </ScrollRevealText>
      )}
    </div>
  );
}

/* =====================================================================
   8. LANGUAGE DICTIONARY (NL / FR)
   ===================================================================== */
const translations = {
  NL: {
    nav: { tag: 'Voedselveiligheid helder gemaakt', home: 'Home', services: 'Diensten', method: 'Werkwijze', insights: 'Kennis', why: 'Waarom wij', contact: 'Contact', cta: 'Contact' },
    hero: {
      title1: 'Veiligheid zonder', title2: 'complexiteit.',
      subtitleParts: {
  before: 'Nutrivisi vertaalt ',
  highlight1: 'complexe wetgeving',
  middle: ' naar heldere visuele acties, zodat uw team begrijpt wat nodig is en ',
  highlight2: 'sneller auditklaar',
  after: ' werkt.',
},
      btn1: 'Bekijk diensten', btn2: 'Neem contact op',
      trust: [
        'Praktische begeleiding voor voedingsbedrijven',
        'Visuele tools die medewerkers echt begrijpen',
        'Ondersteuning bij audits, labels en kwaliteitssystemen',
        'Sectorfocus: bakkerij, vlees, horeca en retail',
      ],
      focusEyebrow: 'Onze focus',
      focus1: { title: 'Van wet naar werkvloer', text: 'Heldere richtlijnen die uw team direct kan toepassen.' },
      focus2: { title: 'Auditvoorbereiding', text: 'Richting een beter systeem en een rustiger audittraject.' },
      focus3: { title: 'Visuele tools', text: 'Begrijpelijk en beter te onthouden voor medewerkers.' },
      focus4: { title: 'Etikettering', text: 'Controle van labels volgens de geldende wetgeving.' },
      focus5: { title: 'Sectorgericht', text: 'Ervaring in bakkerij, vlees, horeca en retail.' },
    },
    sectorsSection: { eyebrow: 'Uw sector, onze praktijk.', items: ['Bakkerij', 'Vleessector', 'Horeca', 'Retail'] },
    metrics: {
      eyebrow: 'Het werkterrein',
      title: 'Concrete parameters van ons werk',
      items: [
        { value: '15+', label: 'Jaar in voedselveiligheid', caption: 'Gericht op Belgische en EU-wetgeving' },
        { value: '4', label: 'Kernsectoren', caption: 'Bakkerij · Vlees · Horeca · Retail' },
        { value: 'NL · FR · EN', label: 'Talen voor labels & specs', caption: 'Vertaling en lay-out in huis' },
        { value: 'FAVV + EU', label: 'Kader', caption: 'Autocontrole, HACCP, GFSI-normen' },
      ],
    },
    servicesSection: {
      eyebrow: 'Diensten', title: 'Gerichte ondersteuning voor voedselveiligheid',
      discuss: 'Bespreek deze dienst',
      items: [
        { id: 'expertadvies', title: 'Expertadvies', description: 'Gericht advies over voedselveiligheid, kwaliteitssystemen en wettelijke vereisten, afgestemd op uw sector en uw concrete situatie.', bullets: ['Praktisch en sectorspecifiek', 'Heldere prioriteiten', 'Snel inzetbaar'], visualCaption: 'Advies geordend in lagen: wet, risico, werkvloer.' },
        { id: 'coaching', title: 'Coaching en training', description: 'Wij maken voedselveiligheid begrijpelijk voor management en medewerkers, met visuele hulpmiddelen die op de werkvloer blijven hangen.', bullets: ['Food Safety Culture', 'Visuele instructies', 'Draagvlak in het team'], visualCaption: 'Voorbeeld van een visuele instructiekaart.' },
        { id: 'certificatie', title: 'Certificatiebegeleiding', description: 'Begeleiding bij de opbouw, verbetering en borging van kwaliteitssystemen, tot en met auditvoorbereiding en certificatie.', bullets: ['Autocontrolegidsen', 'GFSI-trajecten', 'Auditvoorbereiding'], visualCaption: 'Traject van document-review tot certificering.' },
        { id: 'risico', title: 'Risicobeheersing', description: 'Ondersteuning bij risicoanalyse, voedselverdediging, voedselfraude, incidenten en corrigerende acties.', bullets: ['Preventie en opvolging', 'Interne en externe risico\'s', 'Concreet actieplan'], visualCaption: 'Risicomatrix met focus op kritieke punten.' },
        { id: 'etikettering', title: 'Etikettering en specificaties', description: 'Opmaak en controle van productlabels en productspecificaties volgens Belgische en Europese wetgeving.', bullets: ['Wettelijke controle', 'Vertaling en lay-out', 'Minder risico op fouten'], visualCaption: 'Gecontroleerd label met allergen-, batch- en datumcheck.' },
      ],
    },
    methodSection: {
      eyebrow: 'Werkwijze', title: 'Een duidelijke methode, van analyse tot borging',
      items: [
        { title: 'Analyse', text: 'We bekijken uw huidige werking, risico\'s, documentatie en doelstellingen.' },
        { title: 'Vertaling naar actie', text: 'We zetten complexe regelgeving om in duidelijke instructies, tools en prioriteiten.' },
        { title: 'Begeleiding en borging', text: 'We ondersteunen uw team tot de aanpak werkt in de praktijk en auditklaar is.' },
      ],
    },
    whySection: {
      eyebrow: 'Waarom Nutrivisi', title: 'Een aanpak die blijft hangen, niet alleen op papier',
      items: [
        { icon: Eye, title: 'Visueel leermateriaal', text: 'Werkkaarten, pictogrammen en checklists die uw ploeg echt kan gebruiken.' },
        { icon: Layers, title: 'Sectorspecialisatie', text: 'Bakkerij, vlees, horeca en retail vragen elk een andere reflex. We kennen het verschil.' },
        { icon: Scale, title: 'Wetsgetrouw', text: 'Advies afgestemd op FAVV, Belgische gidsen en EU-regels. Wanneer die veranderen, zit u mee.' },
        { icon: Fingerprint, title: 'Praktisch op de werkvloer', text: 'We werken als een externe kwaliteitscollega: meekijken, vereenvoudigen, zorgen dat het blijft werken.' },
      ],
    },
    insightsSection: {
      eyebrow: 'Kennisbank', title: 'Onderwerpen waar wij dagelijks mee werken',
      description: 'Een greep uit de dossiers die vaak terugkomen in ons werk met voedingsbedrijven.',
      readMore: 'Meer info',
      items: [
        { icon: AlertTriangle, title: 'Allergenen & kruisbesmetting', text: 'Beleid, procedures en visuele controle op de werkvloer.' },
        { icon: ClipboardCheck, title: 'HACCP & productclassificatie', text: 'Correcte classificatie en onderbouwing van CCP\'s.' },
        { icon: Recycle, title: 'Recall & crisisbeheer', text: 'Procedures voor terugroepacties en interne communicatie.' },
        { icon: FlaskConical, title: 'Acrylamide', text: 'Voldoen aan EU 2017/2158 met haalbare controlemaatregelen.' },
        { icon: ShieldAlert, title: 'Food defense & fraude', text: 'Kwetsbaarheidsanalyse, TACCP en VACCP in de praktijk.' },
        { icon: BookOpen, title: 'FAVV-updates', text: 'Praktische vertaling van wijzigingen in wetgeving en controle.' },
      ],
    },
    contactSection: {
      title: 'Klaar voor een heldere aanpak?', subtitle: 'Start vandaag.',
      emailText: 'E-mail', phoneText: 'Telefoon', addressText: 'Adres',
      formTitle: 'Neem contact op', formSubtitle: 'Laat uw gegevens achter. Dan kan Nutrivisi snel en gericht reageren.',
      placeholders: { name: 'Uw naam', company: 'Bedrijf', email: 'Email', message: 'Omschrijf kort uw vraag, audit, labeltraject of uitdaging.' },
      labels: { name: 'Naam', company: 'Bedrijfsnaam', email: 'E-mailadres', message: 'Vraag of project' },
      submit: 'Verstuur aanvraag',
      mailSubject: 'Aanvraag via website', mailBodyName: 'Naam', mailBodyCompany: 'Bedrijf', mailBodyEmail: 'E-mail', mailBodyQuestion: 'Vraag',
      privacyNoteLead: 'Door contact op te nemen, verwerkt Nutrivisi uw gegevens om uw vraag te beantwoorden. Lees ons',
      privacyNoteLink: 'privacybeleid',
      privacyNoteTail: 'voor meer informatie.',
    },
    footer: { tagline: 'Praktische begeleiding in voedselveiligheid en kwaliteit.', privacy: 'Privacybeleid', cookies: 'Cookies', legal: 'Juridische info' },
  },
  FR: {
    nav: { tag: 'La sécurité alimentaire simplifiée', home: 'Accueil', services: 'Services', method: 'Méthode', insights: 'Savoir', why: 'Pourquoi nous', contact: 'Contact', cta: 'Contact' },
    hero: {
      title1: 'La sécurité sans', title2: 'complexité.',
      subtitleParts: {
  before: 'Nutrivisi traduit ',
  highlight1: 'la législation complexe',
	  middle: ' en actions visuelles claires, pour que votre équipe comprenne ce qui est nécessaire et soit plus rapidement ',
	  highlight2: 'prête pour l’audit',
  after: '.',
},
      btn1: 'Voir les services', btn2: 'Contactez-nous',
      trust: [
        'Accompagnement pratique pour les entreprises agroalimentaires',
        'Outils visuels vraiment compris par les collaborateurs',
        'Soutien pour les audits, labels et systèmes de qualité',
        'Focus sectoriel : boulangerie, viande, horeca et retail',
      ],
      focusEyebrow: 'Notre objectif',
      focus1: { title: 'De la loi au terrain', text: 'Des consignes claires, prêtes à l\'emploi.' },
      focus2: { title: 'Préparation aux audits', text: 'Vers un meilleur système et un parcours d\'audit plus serein.' },
      focus3: { title: 'Outils visuels', text: 'Compréhensibles et plus faciles à mémoriser pour le personnel.' },
      focus4: { title: 'Étiquetage', text: 'Vérification des étiquettes selon la législation en vigueur.' },
      focus5: { title: 'Secteurs', text: 'Expérience en boulangerie, viande, horeca et retail.' },
    },
    sectorsSection: { eyebrow: 'Votre secteur, notre pratique.', items: ['Boulangerie', 'Secteur de la viande', 'Horeca', 'Retail'] },
    metrics: {
      eyebrow: 'Le terrain',
      title: 'Paramètres concrets de notre travail',
      items: [
        { value: '15+', label: 'Années en sécurité alimentaire', caption: 'Axé sur la législation belge et européenne' },
        { value: '4', label: 'Secteurs de référence', caption: 'Boulangerie · Viande · Horeca · Retail' },
        { value: 'NL · FR · EN', label: 'Langues pour étiquettes & specs', caption: 'Traduction et mise en page en interne' },
        { value: 'AFSCA + UE', label: 'Cadre', caption: 'Autocontrôle, HACCP, normes GFSI' },
      ],
    },
    servicesSection: {
      eyebrow: 'Services', title: 'Un accompagnement ciblé pour la sécurité alimentaire',
      discuss: 'Discuter de ce service',
      items: [
        { id: 'expertadvies', title: 'Conseil d\'expert', description: 'Des conseils ciblés sur la sécurité alimentaire, les systèmes de qualité et les exigences légales, adaptés à votre secteur et à votre situation concrète.', bullets: ['Pratique et spécifique au secteur', 'Priorités claires', 'Rapidement applicable'], visualCaption: 'Un conseil structuré en couches : loi, risque, terrain.' },
        { id: 'coaching', title: 'Coaching et formation', description: 'Nous rendons la sécurité alimentaire compréhensible pour la direction et les employés, avec des outils visuels qui s\'ancrent sur le lieu de travail.', bullets: ['Culture de la sécurité alimentaire', 'Instructions visuelles', 'Adhésion de l\'équipe'], visualCaption: 'Exemple d\'une fiche d\'instruction visuelle.' },
        { id: 'certificatie', title: 'Accompagnement à la certification', description: 'Accompagnement dans la mise en place, l\'amélioration et la garantie des systèmes de qualité, jusqu\'à la préparation de l\'audit et la certification.', bullets: ['Guides d\'autocontrôle', 'Parcours GFSI', 'Préparation aux audits'], visualCaption: 'Parcours de la revue documentaire à la certification.' },
        { id: 'risico', title: 'Gestion des risques', description: 'Soutien dans l\'analyse des risques, la défense alimentaire, la fraude alimentaire, les incidents et les actions correctives.', bullets: ['Prévention et suivi', 'Risques internes et externes', 'Plan d\'action concret'], visualCaption: 'Matrice des risques avec focus sur les points critiques.' },
        { id: 'etikettering', title: 'Étiquetage et spécifications', description: 'Création et vérification des étiquettes et des spécifications de produits conformément à la législation belge et européenne.', bullets: ['Contrôle légal', 'Traduction et mise en page', 'Moins de risques d\'erreurs'], visualCaption: 'Étiquette vérifiée avec contrôle allergène, lot et date.' },
      ],
    },
    methodSection: {
      eyebrow: 'Méthodologie', title: 'Une méthode claire, de l\'analyse à l\'intégration',
      items: [
        { title: 'Analyse', text: 'Nous examinons votre fonctionnement actuel, vos risques, votre documentation et vos objectifs.' },
        { title: 'Traduction en actions', text: 'Nous transformons les réglementations complexes en instructions, outils et priorités claires.' },
        { title: 'Accompagnement et garantie', text: 'Nous soutenons votre équipe jusqu\'à ce que l\'approche fonctionne en pratique et soit prête pour l\'audit.' },
      ],
    },
    whySection: {
      eyebrow: 'Pourquoi Nutrivisi', title: 'Une approche qui s\'ancre, pas seulement sur papier',
      items: [
        { icon: Eye, title: 'Matériel visuel', text: 'Fiches de travail, pictogrammes et checklists que vos équipes utilisent vraiment.' },
        { icon: Layers, title: 'Spécialisation sectorielle', text: 'Boulangerie, viande, horeca et retail demandent chacun une autre approche. Nous connaissons la différence.' },
        { icon: Scale, title: 'Conforme à la loi', text: 'Des conseils alignés sur l\'AFSCA, les guides belges et la réglementation européenne. Quand les règles changent, vous suivez avec nous.' },
        { icon: Fingerprint, title: 'Concret sur le terrain', text: 'Nous travaillons comme un collègue qualité externe : observer, simplifier, faire en sorte que ça tienne dans la durée.' },
      ],
    },
    insightsSection: {
      eyebrow: 'Base de connaissances', title: 'Les sujets sur lesquels nous travaillons au quotidien',
      description: 'Un aperçu des dossiers récurrents dans notre travail avec les entreprises agroalimentaires.',
      readMore: 'En savoir plus',
      items: [
        { icon: AlertTriangle, title: 'Allergènes & contamination croisée', text: 'Politique, procédures et contrôle visuel sur le terrain.' },
        { icon: ClipboardCheck, title: 'HACCP & classification produit', text: 'Classification correcte et justification des CCP.' },
        { icon: Recycle, title: 'Rappel & gestion de crise', text: 'Procédures de rappel et communication interne.' },
        { icon: FlaskConical, title: 'Acrylamide', text: 'Conformité au règlement UE 2017/2158 avec des mesures réalistes.' },
        { icon: ShieldAlert, title: 'Food defense & fraude', text: 'Analyse de vulnérabilité, TACCP et VACCP en pratique.' },
        { icon: BookOpen, title: 'Mises à jour AFSCA', text: 'Traduction pratique des changements de législation et de contrôle.' },
      ],
    },
    contactSection: {
      title: 'Prêt pour une approche claire ?', subtitle: 'Commencez aujourd\'hui.',
      emailText: 'E-mail', phoneText: 'Téléphone', addressText: 'Adresse',
      formTitle: 'Contactez-nous', formSubtitle: 'Laissez vos coordonnées. Nutrivisi réagira rapidement et de manière ciblée.',
      placeholders: { name: 'Votre nom', company: 'Entreprise', email: 'Email', message: 'Décrivez brièvement votre question, audit, projet d\'étiquetage ou défi.' },
      labels: { name: 'Nom', company: 'Nom de l\'entreprise', email: 'Adresse e-mail', message: 'Question ou projet' },
      submit: 'Envoyer la demande',
      mailSubject: 'Demande via le site', mailBodyName: 'Nom', mailBodyCompany: 'Entreprise', mailBodyEmail: 'E-mail', mailBodyQuestion: 'Question',
      privacyNoteLead: 'En prenant contact, Nutrivisi traite vos données afin de répondre à votre demande. Consultez notre',
      privacyNoteLink: 'politique de confidentialité',
      privacyNoteTail: 'pour en savoir plus.',
    },
    footer: { tagline: 'Accompagnement pratique en sécurité et qualité alimentaire.', privacy: 'Politique de confidentialité', cookies: 'Cookies', legal: 'Mentions légales' },
  },
};

/* =====================================================================
   9. MAIN APP
   ===================================================================== */
export default function NutrivisiSite({ lang = 'NL' }) {
  const navigate = useNavigate();
  const t = translations[lang];
  const reducedMotion = useReducedMotion();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollRotation, setScrollRotation] = useState(0);
  const [activeServiceId, setActiveServiceId] = useState('expertadvies');
  const [formData, setFormData] = useState({ name: '', company: '', email: '', message: '' });

  const currentNavItems = [
    { label: t.nav.home, href: '#home' },
    { label: t.nav.services, href: '#diensten' },
    { label: t.nav.method, href: '#werkwijze' },
    { label: t.nav.why, href: '#waarom' },
    { label: t.nav.insights, href: '#kennis' },
    { label: t.nav.contact, href: '#contact' },
  ];

  const serviceVisualMap = useMemo(() => ({
    expertadvies: AdvisoryLayersVisual,
    coaching: WorkbookVisual,
    certificatie: CertificationFlowVisual,
    risico: RiskHeatmapVisual,
    etikettering: LabelInspectorVisual,
  }), []);

  const currentServices = useMemo(() => t.servicesSection.items.map((s) => ({
    ...s,
    Visual: serviceVisualMap[s.id],
  })), [t, serviceVisualMap]);

  const currentSectors = useMemo(() => t.sectorsSection.items.map((title, i) => ({
    title, icon: [Wheat, Beef, UtensilsCrossed, Store][i],
  })), [t]);

  const currentMethodSteps = useMemo(() => t.methodSection.items, [t]);

  const activeService = useMemo(
    () => currentServices.find((service) => service.id === activeServiceId) ?? currentServices[0],
    [activeServiceId, currentServices]
  );
  const activeServiceIndex = Math.max(0, currentServices.findIndex((service) => service.id === activeService.id));
  const ActiveServiceVisual = activeService.Visual;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      if (!reducedMotion) setScrollRotation(window.scrollY * 0.15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [reducedMotion]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const subject = encodeURIComponent(`${t.contactSection.mailSubject} — ${formData.company || 'Nutrivisi'}`);
    const body = encodeURIComponent(
      `${t.contactSection.mailBodyName}: ${formData.name}\n` +
      `${t.contactSection.mailBodyCompany}: ${formData.company}\n` +
      `${t.contactSection.mailBodyEmail}: ${formData.email}\n\n` +
      `${t.contactSection.mailBodyQuestion}:\n${formData.message}`
    );
    window.location.href = `mailto:info@nutrivisi.be?subject=${subject}&body=${body}`;
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  const toggleLang = () => navigate(lang === 'NL' ? '/fr' : '/nl');
  const legalPaths = {
    privacy: getLegalPath(lang, 'privacy'),
    cookies: getLegalPath(lang, 'cookies'),
    legal: getLegalPath(lang, 'legal'),
  };

  return (
    <div className="min-h-screen bg-[#01506E] font-sans text-slate-200 overflow-x-hidden">
      <CustomCursor disabled={reducedMotion} />

      {/* ===== NAV ===== */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#023142]/95 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.3)] py-2 border-b border-[#F0A018]/10' : 'bg-transparent py-6'}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#home" className="flex items-center gap-3 group interactive-card" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>
            <NutriLogo className="h-12 w-12 text-[#F0A018]" cutoutColor={scrolled ? '#023142' : '#023A4E'} />
            <div>
              <p className="font-bold text-2xl tracking-tight text-white group-hover:text-[#F0A018] transition-colors">Nutrivisi</p>
              
            </div>
          </a>

          <div className="hidden items-center space-x-6 lg:flex">
            {currentNavItems.map((item) => (
              <a key={item.href} href={item.href} onClick={(e) => { e.preventDefault(); scrollToSection(item.href.replace('#', '')); }} className="relative text-xs font-bold tracking-wider text-teal-100/80 hover:text-[#F0A018] transition-colors group py-2 uppercase interactive-card">
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F0A018] transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
            <div className="flex items-center gap-4 pl-4 border-l border-teal-800/50">
              <button onClick={toggleLang} className="w-10 h-10 rounded-full border border-[#F0A018] text-[#F0A018] font-bold text-sm hover:bg-[#F0A018] hover:text-[#012330] transition-colors interactive-card flex items-center justify-center" aria-label="Toggle language">
                {lang === 'NL' ? 'FR' : 'NL'}
              </button>
              <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }} className="inline-flex items-center gap-2 rounded-full border border-[#F0A018] bg-transparent px-6 py-2.5 text-sm font-bold uppercase tracking-widest text-[#F0A018] transition hover:bg-[#F0A018] hover:text-[#012330] interactive-card">
                {t.nav.cta}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <button onClick={toggleLang} className="w-10 h-10 rounded-full border border-[#F0A018] text-[#F0A018] font-bold text-sm flex items-center justify-center" aria-label="Toggle language">
              {lang === 'NL' ? 'FR' : 'NL'}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-teal-800/50 bg-[#011a24] text-white transition hover:border-[#F0A018]/40 hover:text-[#F0A018]" aria-label="Toggle menu">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="absolute top-full left-0 w-full border-t border-teal-800/50 bg-[#01506E] p-4 lg:hidden backdrop-blur-xl">
            <div className="flex flex-col gap-2">
              {currentNavItems.map((item) => (
                <a key={item.href} href={item.href} onClick={(e) => { e.preventDefault(); setMobileOpen(false); scrollToSection(item.href.replace('#', '')); }} className="rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wider text-slate-200 transition hover:bg-[#023142] hover:text-[#F0A018]">
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* ===== HERO ===== */}
      <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#023A4E]">
        <HeroKineticCompass rotation={scrollRotation} />
        <ParticleField />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[1400px] pointer-events-none z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#F0A018] rounded-full blur-[140px] opacity-[0.15] animate-breathe"></div>
          <div className="absolute top-[40%] left-[30%] w-[600px] h-[600px] bg-[#56C0D5] rounded-full blur-[180px] opacity-[0.1] animate-drift-slow"></div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-b from-transparent to-[#023A4E]"></div>

        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 relative z-20">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-16 items-center">
            <div>
              <FadeInSection delay={200}>
                <h1 className="max-w-4xl text-6xl font-extrabold leading-[1.05] tracking-tighter text-white sm:text-7xl lg:text-8xl">
                  {t.hero.title1} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F0A018] via-[#FFD07A] to-[#F0A018] bg-[length:200%_auto] animate-gradient">
                    {t.hero.title2}
                  </span>
                </h1>
              </FadeInSection>
              <FadeInSection delay={300}>
                <p className="mt-8 max-w-2xl text-xl leading-relaxed text-white font-semibold">
  {t.hero.subtitleParts.before}
  <span className="font-bold text-[#F0A018]">
  {t.hero.subtitleParts.highlight1}
</span>
  {t.hero.subtitleParts.middle}
  <span className="font-bold text-[#F0A018]">
  {t.hero.subtitleParts.highlight2}
</span>
  {t.hero.subtitleParts.after}
</p>
              </FadeInSection>
              <FadeInSection delay={400}>
                <div className="mt-10 flex flex-col sm:flex-row gap-5">
                  <button onClick={() => scrollToSection('diensten')} className="inline-flex items-center justify-center gap-3 rounded-full bg-[#F0A018] px-8 py-4 text-lg font-bold text-[#012330] transition-all hover:bg-[#FFC35C] hover:shadow-[0_4px_20px_rgba(240,160,24,0.3)] interactive-card group">
                    {t.hero.btn1}
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button onClick={() => scrollToSection('contact')} className="inline-flex items-center justify-center rounded-full border border-[#F0A018]/30 bg-[#011a24]/50 px-8 py-4 text-lg font-bold text-white transition-all hover:border-[#F0A018] hover:bg-[#F0A018]/10 interactive-card">
                    {t.hero.btn2}
                  </button>
                </div>
              </FadeInSection>
              <FadeInSection delay={500}>
                <div className="mt-14 grid gap-4 sm:grid-cols-2">
                  {t.hero.trust.map((point, index) => (
                    <div key={point} className="group interactive-card relative min-h-[104px] overflow-hidden rounded-[1.75rem] border border-[#56C0D5]/18 bg-[#023A4E]/36 p-[1px] backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-[#F0A018]/45 hover:shadow-[0_18px_45px_-24px_rgba(240,160,24,0.35)]" style={{ animationDelay: `${index * 120}ms` }}>
                      <div className="absolute inset-0 bg-gradient-to-br from-[#56C0D5]/12 via-transparent to-[#F0A018]/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                      <div className="relative flex h-full items-start gap-4 rounded-[1.65rem] bg-[#011a24]/32 px-5 py-5">
                        <div className="relative mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center">
                          <div className="absolute inset-0 rounded-full border border-[#F0A018]/35 transition-all duration-500 group-hover:scale-110 group-hover:border-[#F0A018]/70"></div>
                          <div className="absolute inset-2 rounded-full bg-[#F0A018]/0 blur-md transition-all duration-500 group-hover:bg-[#F0A018]/25"></div>
                          <CheckCircle2 className="relative h-5 w-5 text-[#F0A018] transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        <p className="text-base font-semibold leading-7 text-white/90 transition-colors duration-500 group-hover:text-white">{point}</p>
                      </div>
                      <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#F0A018]/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                    </div>
                  ))}
                </div>
              </FadeInSection>
            </div>

            <FadeInSection delay={400} className="relative hidden lg:block">
              <div className="absolute -inset-8 rounded-[3.5rem] bg-[#56C0D5]/10 blur-[90px]"></div>
              <div className="absolute -bottom-10 left-12 h-40 w-40 rounded-full bg-[#F0A018]/10 blur-[80px]"></div>

              <div className="relative overflow-hidden rounded-[3rem] border border-[#56C0D5]/20 bg-[#023A4E]/25 p-6 backdrop-blur-xl shadow-[0_30px_90px_-45px_rgba(0,0,0,0.8)]">
                <div className="relative z-10">
                  <div className="mb-6 flex items-center gap-4 px-2 pt-1">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#F0A018]/50 to-[#56C0D5]/20"></div>
                    <p className="text-sm font-extrabold uppercase tracking-[0.28em] text-[#F0A018] drop-shadow-[0_0_18px_rgba(240,160,24,0.22)]">{t.hero.focusEyebrow}</p>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#F0A018]/50 to-[#56C0D5]/20"></div>
                  </div>

                  <div className="space-y-5">
                    <div className="group relative overflow-hidden rounded-[2rem] border border-teal-800/30 bg-[#011a24]/55 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-[#F0A018]/45 hover:bg-[#023A4E]/70 hover:shadow-[0_20px_55px_-24px_rgba(240,160,24,0.35)]">
                      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#F0A018 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                      <div className="relative z-10 flex items-center gap-5">
                        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
                          <div className="absolute inset-0 rounded-full border border-[#56C0D5]/25 transition-all duration-500 group-hover:scale-110 group-hover:border-[#F0A018]/45"></div>
                          <div className="absolute inset-2 rounded-full bg-[#F0A018]/0 blur-xl transition-all duration-500 group-hover:bg-[#F0A018]/20"></div>
                          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0A018]/10 text-[#F0A018] transition-all duration-500 group-hover:rotate-3 group-hover:bg-[#F0A018]/16">
                            <ShieldCheck className="h-7 w-7" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-2xl font-extrabold tracking-tight text-white">{t.hero.focus1.title}</h3>
                          <p className="mt-2 text-base leading-relaxed text-teal-100/75">{t.hero.focus1.text}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      {[
                        { icon: Award, data: t.hero.focus2 },
                        { icon: Eye, data: t.hero.focus3 },
                        { icon: Tag, data: t.hero.focus4 },
                        { icon: Store, data: t.hero.focus5 },
                      ].map(({ icon, data }, index) => (
                        <div key={data.title} className="sector-node group relative min-h-[178px] overflow-hidden rounded-[1.75rem] border border-teal-800/30 bg-[#011a24]/50 p-5 text-left transition-all duration-500 hover:-translate-y-1 hover:border-[#F0A018]/40 hover:bg-[#023A4E]/68 hover:shadow-[0_18px_45px_-24px_rgba(240,160,24,0.32)]" style={{ animationDelay: `${index * 160}ms` }}>
                          <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#F0A018 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                          <div className="relative z-10">
                            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#011a24]/75 text-teal-200 ring-1 ring-[#56C0D5]/20 transition-all duration-500 group-hover:text-[#F0A018] group-hover:ring-[#F0A018]/45">
                              {React.createElement(icon, { className: 'h-6 w-6 transition-transform duration-500 group-hover:scale-110' })}
                            </div>
                            <p className="mb-2 text-base font-extrabold text-white">{data.title}</p>
                            <p className="text-sm leading-relaxed text-teal-100/70">{data.text}</p>
                          </div>
                          <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#F0A018]/45 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ===== SECTORS BRIDGE ===== */}
      <section className="bg-gradient-to-b from-[#023A4E] via-[#014B68] to-[#01506E] pt-14 pb-28 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#56C0D5]/25 to-transparent"></div>
        <div className="absolute left-1/2 top-24 h-56 w-[720px] -translate-x-1/2 rounded-full bg-[#56C0D5]/10 blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeInSection>
            <div className="flex flex-col items-center justify-center gap-4 mb-12 md:mb-14">
              <div className="flex w-full max-w-3xl items-center gap-5">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#F0A018]/50 to-[#56C0D5]/20"></div>
                <p className="sector-eyebrow-glow text-center text-2xl md:text-4xl font-extrabold text-teal-200 uppercase tracking-[0.22em] leading-tight">
                  {t.sectorsSection.eyebrow}
                </p>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#F0A018]/50 to-[#56C0D5]/20"></div>
              </div>
              <div className="h-[3px] w-24 rounded-full bg-gradient-to-r from-transparent via-[#F0A018] to-transparent opacity-80"></div>
            </div>
          </FadeInSection>

          <div className="relative mx-auto max-w-6xl">
            <svg className="pointer-events-none absolute left-0 top-10 hidden h-40 w-full md:block" viewBox="0 0 1000 160" preserveAspectRatio="none" aria-hidden="true">
              <path d="M80 80 C180 20 250 140 330 80 S480 20 560 80 S710 140 790 80 S900 20 960 80" fill="none" stroke="#56C0D5" strokeWidth="1.5" strokeOpacity="0.25" />
              <path className="sector-trace-line" d="M80 80 C180 20 250 140 330 80 S480 20 560 80 S710 140 790 80 S900 20 960 80" fill="none" stroke="#F0A018" strokeWidth="3" strokeLinecap="round" strokeDasharray="90 1180" />
              {[140, 380, 620, 860].map((cx, index) => (
                <circle key={cx} className="sector-orbit-pulse" cx={cx} cy="80" r="28" fill="none" stroke="#F0A018" strokeOpacity="0.24" strokeWidth="1" style={{ animationDelay: `${index * 350}ms` }} />
              ))}
            </svg>

            <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8 relative z-10">
              {currentSectors.map((sector, index) => {
                const Icon = sector.icon;
                return (
                  <FadeInSection key={index} delay={index * 100} className="h-full">
                    <div className="sector-node group interactive-card flex h-full flex-col items-center justify-start gap-5 rounded-[2rem] border border-teal-800/30 bg-[#023A4E]/45 px-5 py-7 text-center text-teal-100/80 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-[#F0A018]/45 hover:bg-[#023A4E]/70 hover:text-white hover:shadow-[0_18px_50px_-18px_rgba(240,160,24,0.32)]" style={{ animationDelay: `${index * 180}ms` }}>
                      <div className="relative flex h-20 w-20 items-center justify-center">
                        <div className="absolute inset-0 rounded-full bg-[#F0A018]/0 blur-xl transition-all duration-500 group-hover:bg-[#F0A018]/18"></div>
                        <div className="absolute inset-0 rounded-full border border-[#56C0D5]/25 transition-all duration-500 group-hover:scale-110 group-hover:border-[#F0A018]/45"></div>
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#011a24]/80 text-teal-200 shadow-[0_14px_35px_-18px_rgba(0,0,0,0.8)] transition-all duration-500 group-hover:bg-[#F0A018]/12 group-hover:text-[#F0A018]">
                          <Icon className="h-7 w-7 transition-transform duration-500 group-hover:scale-110" />
                        </div>
                      </div>
                      <span className="text-sm md:text-base font-bold uppercase tracking-[0.22em]">{sector.title}</span>
                    </div>
                  </FadeInSection>
                );
              })}
            </div>

            <div className="relative mt-24 md:mt-28">
              <svg className="pointer-events-none absolute left-0 top-12 hidden h-44 w-full md:block opacity-70" viewBox="0 0 1000 170" preserveAspectRatio="none" aria-hidden="true">
                <path d="M70 86 C210 10 270 150 390 86 S590 10 710 86 S880 150 960 72" fill="none" stroke="#56C0D5" strokeWidth="1.4" strokeOpacity="0.18" />
                <path className="sector-trace-line" d="M70 86 C210 10 270 150 390 86 S590 10 710 86 S880 150 960 72" fill="none" stroke="#F0A018" strokeWidth="3" strokeLinecap="round" strokeDasharray="110 1180" />
              </svg>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative z-10">
                {t.metrics.items.map((metric, index) => {
                  const MetricIcon = [ShieldCheck, Layers, Globe, CheckCircle2][index];

                  return (
                    <FadeInSection key={index} delay={index * 100} className="h-full">
                      <div className="sector-node group interactive-card flex h-full min-h-[330px] flex-col items-center justify-start gap-5 rounded-[2rem] border border-teal-800/30 bg-[#023A4E]/45 px-7 py-8 text-center text-teal-100/80 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-[#F0A018]/45 hover:bg-[#023A4E]/70 hover:text-white hover:shadow-[0_18px_50px_-18px_rgba(240,160,24,0.32)] active:scale-[0.98]" style={{ animationDelay: `${(index + 4) * 180}ms` }}>
                        <div className="relative flex h-20 w-20 items-center justify-center">
                          <div className="absolute inset-0 rounded-full bg-[#F0A018]/0 blur-xl transition-all duration-500 group-hover:bg-[#F0A018]/18"></div>
                          <div className="absolute inset-0 rounded-full border border-[#56C0D5]/25 transition-all duration-500 group-hover:scale-110 group-hover:border-[#F0A018]/45"></div>
                          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#011a24]/80 text-teal-200 shadow-[0_14px_35px_-18px_rgba(0,0,0,0.8)] transition-all duration-500 group-hover:bg-[#F0A018]/12 group-hover:text-[#F0A018]">
                            <MetricIcon className="h-7 w-7 transition-transform duration-500 group-hover:scale-110" />
                          </div>
                        </div>

                        <div className="flex flex-1 flex-col items-center">
                          <p className="mb-5 text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-br from-[#F0A018] via-[#FFC35C] to-[#F0A018]">
                            {metric.value}
                          </p>
                          <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-white">{metric.label}</p>
                          <p className="text-sm leading-relaxed text-teal-100/70">{metric.caption}</p>
                        </div>
                      </div>
                    </FadeInSection>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section id="diensten" className="relative overflow-hidden border-t border-teal-900/30 bg-[#01506E] py-24 md:py-32">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,80,110,0)_0%,rgba(2,58,78,0.34)_46%,rgba(1,80,110,0)_100%)]"></div>
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#56C0D5]/24 to-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#56C0D5]/18 to-transparent"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="mb-14 grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-end">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 border-b border-[#F0A018]/35 pb-2 text-xs font-extrabold uppercase tracking-[0.24em] text-[#F0A018]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#F0A018]"></span>
                  {t.servicesSection.eyebrow}
                </div>
                <h2 className="max-w-4xl text-4xl font-extrabold leading-[1.04] tracking-tight text-white md:text-5xl lg:text-6xl">
                  {t.servicesSection.title.split(' ').map((word, i, arr) =>
                    i >= arr.length - 2
                      ? <span key={i} className="text-[#F0A018]">{word} </span>
                      : <span key={i}>{word} </span>
                  )}
                </h2>
              </div>

              <div className="border-t border-[#56C0D5]/18 pt-6 lg:pl-10">
                <p className="max-w-2xl text-lg font-medium leading-relaxed text-teal-100/76">
                  {activeService.description}
                </p>
              </div>
            </div>
          </FadeInSection>

          <div className="grid gap-8 lg:grid-cols-[minmax(260px,0.38fr)_minmax(0,1fr)] lg:gap-12">
            <FadeInSection delay={100}>
              <div className="space-y-2 lg:sticky lg:top-28">
                {currentServices.map((service, index) => {
                  const isActive = activeService.id === service.id;

                  return (
                    <button
                      key={service.id}
                      onClick={() => setActiveServiceId(service.id)}
                      aria-pressed={isActive}
                      className={`group interactive-card w-full rounded-2xl border px-4 py-4 text-left transition-all duration-500 sm:px-5 ${isActive ? 'border-[#F0A018]/38 bg-[#F0A018]/8 text-white shadow-[0_18px_50px_-34px_rgba(240,160,24,0.55)]' : 'border-[#56C0D5]/13 bg-[#023A4E]/18 text-teal-100/60 hover:border-[#56C0D5]/32 hover:bg-[#023A4E]/32 hover:text-white'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-all duration-500 ${isActive ? 'border-[#F0A018]/45 bg-[#F0A018]/8 text-[#F0A018]' : 'border-[#56C0D5]/18 bg-[#011a24]/25 text-teal-200/65 group-hover:border-[#F0A018]/35 group-hover:bg-[#F0A018]/8 group-hover:text-[#F0A018]'}`}>
                          <div className={`absolute inset-1.5 rounded-lg border transition-all duration-500 ${isActive ? 'scale-110 border-[#F0A018]/22' : 'border-[#56C0D5]/8 group-hover:scale-110 group-hover:border-[#F0A018]/20'}`}></div>
                          <div className={`absolute inset-0 rounded-xl blur-lg transition-all duration-500 ${isActive ? 'bg-[#F0A018]/12' : 'bg-transparent group-hover:bg-[#F0A018]/10'}`}></div>
                          <div className="relative transition-transform duration-500 group-hover:scale-110">
                            <ServiceGlyph id={service.id} className="h-7 w-7" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center gap-3">
                            <span className={`font-mono text-[10px] tracking-[0.24em] ${isActive ? 'text-[#F0A018]' : 'text-teal-300/42'}`}>
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <span className="text-base font-extrabold leading-tight">{service.title}</span>
                          </div>
                          <p className={`text-sm leading-relaxed ${isActive ? 'text-teal-100/72' : 'text-teal-100/44 group-hover:text-teal-100/66'}`}>
                            {service.bullets[0]}
                          </p>
                        </div>
                        <ChevronRight className={`h-4 w-4 shrink-0 transition-all duration-500 ${isActive ? 'text-[#F0A018]' : 'text-teal-300/30 group-hover:text-[#F0A018]/70'}`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </FadeInSection>

            <FadeInSection delay={180}>
              <div className="relative overflow-hidden rounded-[2rem] border border-[#56C0D5]/18 bg-[#023A4E]/24 p-5 backdrop-blur-md md:p-7 lg:p-9">
                <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#F0A018]/45 to-transparent"></div>
                <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(340px,0.82fr)] lg:items-center" key={activeService.id}>
                  <div className="service-copy-reveal min-w-0">
                    <div className="mb-8 flex items-center justify-between gap-5">
                      <div className="group/icon relative flex h-18 w-18 items-center justify-center rounded-[1.35rem] border border-[#F0A018]/28 bg-[#011a24]/38 text-[#56C0D5] transition-all duration-500 hover:border-[#F0A018]/55 hover:bg-[#F0A018]/10 hover:text-[#F0A018]">
                        <div className="absolute inset-2 rounded-2xl border border-[#56C0D5]/10 transition-all duration-500 group-hover/icon:scale-110 group-hover/icon:border-[#F0A018]/22"></div>
                        <div className="absolute inset-0 rounded-[1.35rem] bg-[#F0A018]/0 blur-xl transition-all duration-500 group-hover/icon:bg-[#F0A018]/14"></div>
                        <div className="relative transition-transform duration-500 group-hover/icon:scale-110">
                          <ServiceGlyph id={activeService.id} />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-teal-200/55">
                        <span className="text-[#F0A018]">{String(activeServiceIndex + 1).padStart(2, '0')}</span>
                        <span>/</span>
                        <span>{String(currentServices.length).padStart(2, '0')}</span>
                      </div>
                    </div>

                    <h3 className="max-w-full text-3xl font-extrabold leading-tight tracking-tight text-white md:text-4xl lg:text-[2.75rem] break-words" style={{ overflowWrap: 'anywhere' }}>
                      {activeService.title}
                    </h3>
                    <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-teal-100/78 md:text-lg">
                      {activeService.description}
                    </p>

                    <div className="mt-8 grid gap-3 sm:grid-cols-3">
                      {activeService.bullets.map((bullet) => (
                        <div key={bullet} className="group/bullet min-w-0 rounded-2xl border border-[#56C0D5]/14 bg-[#011a24]/24 px-4 py-4 transition-all duration-500 hover:border-[#F0A018]/34 hover:bg-[#011a24]/36">
                          <div className="mb-4 inline-flex rounded-full text-[#F0A018] transition-transform duration-500 group-hover/bullet:scale-110">
                            <ServiceBulletGlyph />
                          </div>
                          <p className="text-sm font-bold leading-relaxed text-white/90 break-words" style={{ overflowWrap: 'anywhere' }}>{bullet}</p>
                        </div>
                      ))}
                    </div>

                    <button onClick={() => scrollToSection('contact')} className="group interactive-card mt-9 inline-flex items-center gap-3 rounded-full border border-[#F0A018]/35 bg-transparent px-6 py-3.5 text-sm font-extrabold uppercase tracking-[0.16em] text-[#F0A018] transition-all duration-500 hover:border-[#F0A018] hover:bg-[#F0A018] hover:text-[#012330]">
                      <span>{t.servicesSection.discuss}</span>
                      <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                    </button>
                  </div>

                  <div className="relative min-h-[360px] min-w-0 overflow-hidden rounded-[1.7rem] border border-[#56C0D5]/14 bg-[#011a24]/18 px-4 py-6 md:min-h-[430px]">
                    <div className="absolute inset-x-6 top-6 h-px bg-gradient-to-r from-transparent via-[#56C0D5]/28 to-transparent"></div>
                    <div className="absolute inset-x-6 bottom-6 h-px bg-gradient-to-r from-transparent via-[#F0A018]/28 to-transparent"></div>
                    <div className="relative z-10 flex h-full min-h-[320px] flex-col items-center justify-center md:min-h-[390px]">
                      <div className="flex h-[280px] w-full items-center justify-center md:h-[330px] service-visual-reveal">
                        <ActiveServiceVisual />
                      </div>
                      <p className="mt-3 max-w-sm text-center text-sm font-medium italic leading-relaxed text-teal-100/62">
                        {activeService.visualCaption}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ===== METHOD ===== */}
      <section id="werkwijze" className="relative overflow-hidden border-t border-teal-900/30 bg-[#01506E] py-24 md:py-32">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,80,110,0)_0%,rgba(2,58,78,0.32)_44%,rgba(1,80,110,0)_100%)]"></div>
          <div className="absolute left-1/2 top-10 h-[620px] w-[1180px] -translate-x-1/2 opacity-45 transition-transform duration-500 ease-out" style={{ transform: `translateX(-50%) translateY(${Math.sin(scrollRotation / 38) * 18}px) rotate(${scrollRotation * 0.025}deg)` }}>
            <svg viewBox="0 0 1180 620" className="h-full w-full" aria-hidden="true">
              <defs>
                <linearGradient id="method-map" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#56C0D5" stopOpacity="0" />
                  <stop offset="45%" stopColor="#56C0D5" stopOpacity="0.26" />
                  <stop offset="100%" stopColor="#F0A018" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M90 355 C260 230 366 420 530 284 S808 130 1088 238" fill="none" stroke="url(#method-map)" strokeWidth="1.2" />
              <path d="M152 120 C310 178 382 72 548 146 S826 298 1028 112" fill="none" stroke="#56C0D5" strokeWidth="0.8" strokeOpacity="0.12" />
              <path d="M64 502 C320 420 488 542 704 418 S914 304 1110 420" fill="none" stroke="#F0A018" strokeWidth="0.8" strokeOpacity="0.1" />
              <circle cx="590" cy="310" r="220" fill="none" stroke="#56C0D5" strokeOpacity="0.08" />
              <circle cx="590" cy="310" r="128" fill="none" stroke="#F0A018" strokeOpacity="0.08" strokeDasharray="6 18" />
            </svg>
          </div>
          <div className="absolute left-1/2 top-24 h-64 w-[760px] -translate-x-1/2 rounded-full bg-[#56C0D5]/7 blur-[110px]" style={{ transform: `translateX(-50%) translateY(${Math.cos(scrollRotation / 45) * -14}px)` }}></div>
          <div className="absolute right-[10%] bottom-16 h-56 w-56 rounded-full bg-[#F0A018]/7 blur-[90px]" style={{ transform: `translateY(${Math.sin(scrollRotation / 34) * 16}px)` }}></div>
        </div>

        <div className="relative z-10 mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 border-b border-[#F0A018]/35 pb-2 text-xs font-extrabold uppercase tracking-[0.24em] text-[#F0A018]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#F0A018]"></span>
                  {t.methodSection.eyebrow}
                </div>
                <h2 className="max-w-4xl text-4xl font-extrabold leading-[1.04] tracking-tight text-white md:text-5xl lg:text-6xl">
                  {t.methodSection.title.split(' ').map((word, i) =>
                    i === 1 || i === 2
                      ? <span key={i} className="text-[#F0A018]">{word} </span>
                      : <span key={i}>{word} </span>
                  )}
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-3 border-t border-[#56C0D5]/18 pt-6">
                {currentMethodSteps.map((step, index) => (
                  <div key={step.title} className="group relative overflow-hidden rounded-2xl border border-[#56C0D5]/14 bg-[#023A4E]/22 px-4 py-4 text-center transition-all duration-500 hover:-translate-y-1 hover:border-[#F0A018]/42 hover:bg-[#023A4E]/42 hover:shadow-[0_18px_48px_-30px_rgba(240,160,24,0.6)]">
                    <div className="method-chip-radiate absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F0A018]/0 blur-2xl transition-all duration-500 group-hover:bg-[#F0A018]/18"></div>
                    <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[#F0A018]/0 to-transparent transition-all duration-500 group-hover:via-[#F0A018]/55"></div>
                    <div className="relative">
                      <p className="mb-2 font-mono text-[10px] font-bold tracking-[0.24em] text-[#F0A018]/80">STAP 0{index + 1}</p>
                      <p className="truncate text-xs font-extrabold uppercase tracking-[0.12em] text-teal-100/70 transition-colors duration-500 group-hover:text-white">{step.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeInSection>

          <div className="relative mt-16">
            <div className="pointer-events-none absolute inset-x-0 bottom-12 z-0 hidden h-24 opacity-70 lg:block">
              <svg viewBox="0 0 1000 110" className="h-full w-full" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <filter id="method-arrow-glow" x="-20%" y="-80%" width="140%" height="260%">
                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <path id="method-order-path" d="M72 56 C198 34 275 78 356 56 S534 34 616 56 S802 78 928 56" />
                </defs>
                <use href="#method-order-path" fill="none" stroke="#56C0D5" strokeWidth="1.2" strokeOpacity="0.1" />
                <use href="#method-order-path" className="method-order-dash" fill="none" stroke="#F0A018" strokeWidth="1.7" strokeOpacity="0.42" strokeLinecap="round" strokeDasharray="105 995" />
                <g filter="url(#method-arrow-glow)" className="method-arrow-head" opacity="0.58">
                  <animateMotion dur="6.4s" repeatCount="indefinite" rotate="auto">
                    <mpath href="#method-order-path" />
                  </animateMotion>
                  <path d="M0 -6 L15 0 L0 6 L4 0 Z" fill="#F0A018" />
                  <circle cx="-5" cy="0" r="2.8" fill="#F0A018" opacity="0.34" />
                </g>
              </svg>
            </div>

            <div className="relative z-10 grid gap-5 lg:grid-cols-3 lg:gap-7">
              {currentMethodSteps.map((step, index) => {
                return (
                  <FadeInSection key={step.title} delay={index * 140} className="group relative h-full">
                    <div className="relative h-full min-h-[350px] overflow-hidden rounded-[2rem] border border-[#56C0D5]/16 bg-[#023A4E]/26 p-7 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-[#F0A018]/34 hover:bg-[#023A4E]/38 hover:shadow-[0_24px_70px_-48px_rgba(240,160,24,0.58)] md:p-8">
                      <div className="absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-[#F0A018]/36 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#56C0D5]/0 blur-[70px] transition-all duration-500 group-hover:bg-[#56C0D5]/10"></div>
                      <div className="absolute -left-12 bottom-8 h-36 w-36 rounded-full bg-[#F0A018]/0 blur-[80px] transition-all duration-500 group-hover:bg-[#F0A018]/8"></div>
                      <div className="relative z-10 flex h-full flex-col">
                        <div className="mb-10 flex items-start justify-between gap-5">
                          <div className="relative flex h-18 w-18 items-center justify-center rounded-[1.35rem] border border-[#F0A018]/28 bg-[#011a24]/36 text-[#56C0D5] transition-all duration-500 group-hover:border-[#F0A018]/55 group-hover:bg-[#F0A018]/10 group-hover:text-[#F0A018]">
                            <div className="absolute inset-2 rounded-2xl border border-[#56C0D5]/10 transition-all duration-500 group-hover:scale-110 group-hover:border-[#F0A018]/22"></div>
                            <MethodGlyph index={index} />
                          </div>
                          <div className="mt-8 h-px flex-1 bg-gradient-to-r from-[#56C0D5]/18 to-transparent"></div>
                        </div>

                        <h3 className="text-2xl font-extrabold leading-tight tracking-tight text-white md:text-3xl">{step.title}</h3>
                        <p className="mt-5 text-base font-medium leading-relaxed text-teal-100/76">{step.text}</p>

                        <div className="mt-auto pt-14"></div>
                      </div>
                    </div>
                  </FadeInSection>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===== WAAROM NUTRIVISI ===== */}
      <section id="waarom" className="relative overflow-hidden border-t border-teal-900/30 bg-[#01506E] py-24 md:py-32">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,80,110,0)_0%,rgba(1,26,36,0.24)_48%,rgba(1,80,110,0)_100%)]"></div>
          <div className="absolute left-0 top-20 h-px w-full bg-gradient-to-r from-transparent via-[#56C0D5]/18 to-transparent"></div>
          <div className="absolute bottom-20 left-1/2 h-64 w-[820px] -translate-x-1/2 rounded-full bg-[#56C0D5]/6 blur-[110px]"></div>
          <div className="why-ambient-grid absolute left-[-12%] top-12 hidden h-[520px] w-[720px] opacity-55 lg:block">
            <svg viewBox="0 0 720 520" className="h-full w-full" fill="none" aria-hidden="true">
              <path className="why-current-line" d="M38 330 C160 210 254 370 370 236 S560 92 688 176" stroke="#5CC0D5" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="92 780" />
              <path d="M38 330 C160 210 254 370 370 236 S560 92 688 176" stroke="#56C0D5" strokeOpacity="0.16" strokeWidth="1.2" />
              <path d="M76 118 C208 188 308 60 438 126 S596 284 698 230" stroke="#56C0D5" strokeOpacity="0.13" strokeWidth="1" />
              <circle className="why-orbit-a" cx="260" cy="250" r="176" stroke="#56C0D5" strokeOpacity="0.11" strokeWidth="1" />
              <circle className="why-orbit-b" cx="260" cy="250" r="96" stroke="#F0A018" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="6 16" />
              <circle cx="470" cy="174" r="5" fill="#F0A018" opacity="0.72" />
            </svg>
          </div>
          <svg className="absolute right-0 top-12 hidden h-[520px] w-[760px] opacity-35 lg:block" viewBox="0 0 760 520" fill="none" aria-hidden="true">
            <path d="M90 396 C212 260 284 360 390 214 S594 94 712 188" stroke="#56C0D5" strokeOpacity="0.18" strokeWidth="1" />
            <path d="M36 128 C188 194 276 68 424 132 S604 284 742 218" stroke="#F0A018" strokeOpacity="0.1" strokeWidth="1" />
            <circle cx="536" cy="190" r="170" stroke="#56C0D5" strokeOpacity="0.08" />
            <circle cx="536" cy="190" r="92" stroke="#F0A018" strokeOpacity="0.08" strokeDasharray="5 14" />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <FadeInSection>
              <div className="lg:sticky lg:top-28">
                <div className="mb-5 inline-flex items-center gap-2 border-b border-[#F0A018]/35 pb-2 text-xs font-extrabold uppercase tracking-[0.24em] text-[#F0A018]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#F0A018]"></span>
                  {t.whySection.eyebrow}
                </div>
                <h2 className="max-w-4xl text-4xl font-extrabold leading-[1.04] tracking-tight text-white md:text-5xl lg:text-6xl">
                  {t.whySection.title.split(' ').map((word, i) =>
                    i === 3 || i === 4
                      ? <span key={i} className="text-[#F0A018]">{word} </span>
                      : <span key={i}>{word} </span>
                  )}
                </h2>

                <div className="mt-10 grid grid-cols-3 gap-3 max-w-xl">
                  {['FAVV', 'EU', 'HACCP'].map((label, index) => (
                    <div key={label} className="why-proof-chip group/chip relative overflow-hidden rounded-2xl border border-[#5CC0D5]/35 bg-[#023A4E]/42 px-4 py-3 text-center shadow-[0_18px_55px_-34px_rgba(92,192,213,0.72)] transition-all duration-500 hover:-translate-y-1 hover:border-[#5CC0D5]/75 hover:bg-[#023A4E]/60">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#5CC0D5]/12 to-transparent opacity-0 transition-opacity duration-500 group-hover/chip:opacity-100"></div>
                      <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5CC0D5]/12 blur-2xl transition-all duration-500 group-hover/chip:bg-[#5CC0D5]/24"></div>
                      <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-[#5CC0D5]/70 to-transparent"></div>
                      <p className="relative font-mono text-xs font-extrabold tracking-[0.28em] text-white drop-shadow-[0_0_12px_rgba(92,192,213,0.42)] transition-colors duration-500 group-hover/chip:text-[#5CC0D5]" style={{ animationDelay: `${index * 220}ms` }}>{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeInSection>

            <div className="space-y-4">
              {t.whySection.items.map((item, index) => {
                return (
                  <FadeInSection key={item.title} delay={index * 110}>
                    <div className="group interactive-card relative overflow-hidden rounded-[2rem] border border-[#56C0D5]/14 bg-[#023A4E]/22 p-5 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-[#F0A018]/34 hover:bg-[#023A4E]/34 hover:shadow-[0_24px_70px_-46px_rgba(240,160,24,0.5)] active:scale-[0.99] md:p-6">
                      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#F0A018]/0 to-transparent transition-all duration-500 group-hover:via-[#F0A018]/45"></div>
                      <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#56C0D5]/0 blur-[70px] transition-all duration-500 group-hover:bg-[#56C0D5]/9"></div>
                      <div className="absolute -left-10 bottom-4 h-32 w-32 rounded-full bg-[#F0A018]/0 blur-[70px] transition-all duration-500 group-hover:bg-[#F0A018]/7"></div>

                      <div className="relative grid gap-5 md:grid-cols-[92px_minmax(0,1fr)] md:items-center">
                        <div className="flex items-center gap-4 md:block">
                          <div className="relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-[1.35rem] border border-[#F0A018]/24 bg-[#011a24]/34 text-[#56C0D5] transition-all duration-500 group-hover:border-[#F0A018]/55 group-hover:bg-[#F0A018]/10 group-hover:text-[#F0A018]">
                            <div className="absolute inset-2 rounded-2xl border border-[#56C0D5]/10 transition-all duration-500 group-hover:scale-110 group-hover:border-[#F0A018]/22"></div>
                            <div className="absolute inset-0 rounded-[1.35rem] bg-[#F0A018]/0 blur-xl transition-all duration-500 group-hover:bg-[#F0A018]/14"></div>
                            <div className="relative transition-transform duration-500 group-hover:scale-110">
                              <WhyGlyph index={index} />
                            </div>
                          </div>
                          <span className="font-mono text-xs font-bold tracking-[0.24em] text-[#F0A018]/70 md:mt-5 md:block">0{index + 1}</span>
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-2xl font-extrabold leading-tight tracking-tight text-white">{item.title}</h3>
                          <p className="mt-3 max-w-3xl text-base font-medium leading-relaxed text-teal-100/74">{item.text}</p>
                        </div>
                      </div>
                    </div>
                  </FadeInSection>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===== KENNISBANK / INSIGHTS ===== */}
      <section id="kennis" className="relative overflow-hidden border-t border-teal-900/30 bg-[#01506E] py-24 md:py-32">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(92,192,213,0.11),transparent_31%),radial-gradient(circle_at_82%_34%,rgba(240,160,24,0.06),transparent_30%),linear-gradient(180deg,rgba(1,80,110,0)_0%,rgba(1,26,36,0.18)_50%,rgba(1,80,110,0)_100%)]"></div>
          <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'linear-gradient(rgba(92,192,213,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(92,192,213,0.35) 1px, transparent 1px)', backgroundSize: '72px 72px' }}></div>
          <div className="absolute left-1/2 top-24 h-72 w-[980px] -translate-x-1/2 rounded-full bg-[#5CC0D5]/7 blur-[130px]"></div>
          <svg className="absolute inset-x-0 top-10 hidden h-[620px] w-full opacity-70 lg:block" viewBox="0 0 1440 620" fill="none" aria-hidden="true">
            <path d="M-40 420 C160 280 250 405 420 272 S725 114 936 225 S1190 398 1480 230" stroke="#5CC0D5" strokeOpacity="0.12" strokeWidth="1.2" />
            <path className="knowledge-trace-line" d="M-40 420 C160 280 250 405 420 272 S725 114 936 225 S1190 398 1480 230" stroke="#5CC0D5" strokeWidth="2" strokeLinecap="round" strokeDasharray="120 1320" />
            <path d="M56 172 C250 92 390 210 550 150 S780 42 956 128 S1212 276 1402 166" stroke="#F0A018" strokeOpacity="0.08" strokeWidth="1" />
            <circle className="knowledge-orbit-a" cx="1080" cy="210" r="142" stroke="#5CC0D5" strokeOpacity="0.1" />
            <circle className="knowledge-orbit-b" cx="1080" cy="210" r="76" stroke="#F0A018" strokeOpacity="0.1" strokeDasharray="5 14" />
            <circle className="knowledge-node" cx="936" cy="225" r="5" fill="#5CC0D5" opacity="0.78" />
            <circle className="knowledge-node" cx="550" cy="150" r="4" fill="#F0A018" opacity="0.58" style={{ animationDelay: '1.1s' }} />
            <circle className="knowledge-node" cx="1080" cy="210" r="4" fill="#5CC0D5" opacity="0.72" style={{ animationDelay: '2.2s' }} />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="mx-auto max-w-5xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 border-b border-[#F0A018]/35 pb-2 text-xs font-extrabold uppercase tracking-[0.24em] text-[#F0A018]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F0A018]"></span>
                {t.insightsSection.eyebrow}
              </div>
              <h2 className="text-4xl font-extrabold leading-[1.03] tracking-tight text-white md:text-6xl lg:text-7xl">
                {t.insightsSection.title.split(' ').map((word, i, arr) =>
                  i >= arr.length - 2
                    ? <span key={i} className="text-[#F0A018]">{word} </span>
                    : <span key={i}>{word} </span>
                )}
              </h2>
              <p className="mx-auto mt-7 max-w-3xl text-lg font-bold leading-relaxed text-[#5CC0D5] md:text-2xl">
                {t.insightsSection.description}
              </p>
            </div>
          </FadeInSection>

          <div className="mt-16 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {t.insightsSection.items.map((item, index) => (
              <FadeInSection key={item.title} delay={(index % 3) * 100}>
                <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }} className="group block h-full interactive-card">
                  <div className="relative flex h-full min-h-[19rem] flex-col overflow-hidden rounded-[2rem] border border-[#5CC0D5]/15 bg-[#011a24]/38 p-7 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-[#5CC0D5]/42 hover:bg-[#023A4E]/36 hover:shadow-[0_28px_80px_-52px_rgba(92,192,213,0.85)] active:scale-[0.985] md:p-8">
                    <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#5CC0D5]/0 to-transparent transition-all duration-500 group-hover:via-[#5CC0D5]/65"></div>
                    <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#5CC0D5]/0 blur-[80px] transition-all duration-500 group-hover:bg-[#5CC0D5]/14"></div>
                    <div className="absolute -bottom-20 left-8 h-44 w-44 rounded-full bg-[#F0A018]/0 blur-[90px] transition-all duration-500 group-hover:bg-[#F0A018]/7"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(92,192,213,0.08),transparent_36%,rgba(240,160,24,0.04)_100%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

                    <div className="relative mb-8 flex items-center justify-between gap-5">
                      <div className="relative flex h-[4.75rem] w-[4.75rem] items-center justify-center rounded-[1.35rem] border border-[#5CC0D5]/24 bg-[#023A4E]/34 text-[#5CC0D5] transition-all duration-500 group-hover:border-[#5CC0D5]/72 group-hover:bg-[#5CC0D5]/9 group-hover:text-[#5CC0D5] group-active:scale-95">
                        <div className="absolute inset-2 rounded-2xl border border-[#F0A018]/10 transition-all duration-500 group-hover:scale-110 group-hover:border-[#5CC0D5]/28"></div>
                        <div className="absolute inset-0 rounded-[1.35rem] bg-[#5CC0D5]/0 blur-xl transition-all duration-500 group-hover:bg-[#5CC0D5]/18"></div>
                        <div className="relative transition-transform duration-500 group-hover:scale-110">
                          <KnowledgeGlyph index={index} />
                        </div>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-[#F0A018]/70 shadow-[0_0_18px_rgba(240,160,24,0.45)] transition-all duration-500 group-hover:bg-[#5CC0D5] group-hover:shadow-[0_0_24px_rgba(92,192,213,0.72)]"></div>
                    </div>

                    <div className="relative flex flex-1 flex-col">
                      <h3 className="text-2xl font-extrabold leading-tight tracking-tight text-white transition-colors duration-500 group-hover:text-white">
                        {item.title}
                      </h3>
                      <p className="mt-4 max-w-md text-base font-medium leading-relaxed text-teal-100/74">{item.text}</p>
                      <div className="mt-auto pt-8">
                        <div className="flex items-center justify-between border-t border-[#5CC0D5]/14 pt-5 text-xs font-extrabold uppercase tracking-[0.18em] text-[#F0A018]/90 transition-colors duration-500 group-hover:text-[#5CC0D5]">
                          <span>{t.insightsSection.readMore}</span>
                          <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="relative overflow-hidden border-t border-teal-900/30 bg-[#01506E] pt-24 md:pt-32">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,80,110,0)_0%,rgba(1,58,78,0.18)_36%,rgba(1,26,36,0.2)_78%,rgba(1,80,110,0)_100%)]"></div>
          <div className="absolute left-1/2 top-24 h-[520px] w-[980px] -translate-x-1/2 rounded-full bg-[#5CC0D5]/8 blur-[150px]"></div>
          <div className="absolute right-[-10%] top-36 h-[420px] w-[620px] rounded-full bg-[#F0A018]/6 blur-[130px]"></div>
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(92,192,213,0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(92,192,213,0.45) 1px, transparent 1px)', backgroundSize: '72px 72px' }}></div>
          <svg className="absolute inset-x-0 top-0 hidden h-[760px] w-full opacity-80 lg:block" viewBox="0 0 1440 760" fill="none" aria-hidden="true">
            <path d="M18 444 C204 392 340 468 520 396 S818 218 1012 248 S1258 406 1448 352" stroke="#5CC0D5" strokeOpacity="0.12" strokeWidth="1.2" />
            <path className="contact-flow-line" d="M18 444 C204 392 340 468 520 396 S818 218 1012 248 S1258 406 1448 352" stroke="#5CC0D5" strokeWidth="1.9" strokeLinecap="round" strokeDasharray="120 1320" />
            <path d="M40 210 C264 130 382 278 562 224 S866 82 1074 152 S1302 330 1470 250" stroke="#F0A018" strokeOpacity="0.08" strokeWidth="1" />
            <circle className="contact-flow-ring-a" cx="1040" cy="260" r="142" stroke="#5CC0D5" strokeOpacity="0.1" />
            <circle className="contact-flow-ring-b" cx="1040" cy="260" r="78" stroke="#F0A018" strokeOpacity="0.1" strokeDasharray="6 16" />
            <circle className="contact-flow-node" cx="520" cy="396" r="5" fill="#5CC0D5" opacity="0.8" />
            <circle className="contact-flow-node" cx="1012" cy="248" r="5" fill="#F0A018" opacity="0.74" style={{ animationDelay: '1.4s' }} />
            <circle className="contact-flow-node" cx="1216" cy="382" r="4" fill="#5CC0D5" opacity="0.72" style={{ animationDelay: '2.1s' }} />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.04fr] lg:items-start">
            <FadeInSection delay={100}>
              <div className="max-w-2xl">
                <div className="mb-5 inline-flex items-center gap-2 border-b border-[#F0A018]/35 pb-2 text-xs font-extrabold uppercase tracking-[0.24em] text-[#F0A018]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#F0A018]"></span>
                  {t.nav.contact}
                </div>
                <h2 className="max-w-3xl text-4xl font-extrabold leading-[1.04] tracking-tight text-white md:text-6xl lg:text-[4.25rem]">
                  {t.contactSection.title.split(' ').map((word, i, arr) =>
                    i >= arr.length - 2
                      ? <span key={i} className="text-[#F0A018]">{word} </span>
                      : <span key={i}>{word} </span>
                  )}
                </h2>
                <p className="mt-6 text-2xl font-bold leading-relaxed text-[#5CC0D5]">
                  {t.contactSection.subtitle}
                </p>

                <div className="mt-12 space-y-4 border-t border-[#5CC0D5]/16 pt-8">
                  <a href="mailto:info@nutrivisi.be" className="group interactive-card selectable block">
                    <div className="relative overflow-hidden rounded-[1.75rem] border border-[#5CC0D5]/16 bg-[#023A4E]/22 p-5 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-[#5CC0D5]/42 hover:bg-[#023A4E]/34 hover:shadow-[0_24px_70px_-44px_rgba(92,192,213,0.8)]">
                      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#5CC0D5]/0 to-transparent transition-all duration-500 group-hover:via-[#5CC0D5]/62"></div>
                      <div className="absolute -right-10 top-0 h-28 w-28 rounded-full bg-[#5CC0D5]/0 blur-[70px] transition-all duration-500 group-hover:bg-[#5CC0D5]/12"></div>
                      <div className="relative flex items-center gap-5">
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-[1.2rem] border border-[#5CC0D5]/24 bg-[#011a24]/24 text-[#5CC0D5] transition-all duration-500 group-hover:border-[#5CC0D5]/52 group-hover:bg-[#5CC0D5]/10 group-hover:text-[#5CC0D5]">
                          <div className="absolute inset-2 rounded-2xl border border-[#F0A018]/10 transition-all duration-500 group-hover:scale-110 group-hover:border-[#5CC0D5]/22"></div>
                          <div className="absolute inset-0 rounded-[1.2rem] bg-[#5CC0D5]/0 blur-xl transition-all duration-500 group-hover:bg-[#5CC0D5]/18"></div>
                          <div className="relative transition-transform duration-500 group-hover:scale-110">
                            <ContactGlyph type="mail" className="h-6 w-6" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="mb-1 text-xs font-bold uppercase tracking-[0.22em] text-[#5CC0D5]/78">{t.contactSection.emailText}</p>
                          <p className="text-xl font-bold tracking-tight text-white">info@nutrivisi.be</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-[#F0A018]/75 transition-transform duration-500 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </a>

                  <a href="tel:+3216196984" className="group interactive-card selectable block">
                    <div className="relative overflow-hidden rounded-[1.75rem] border border-[#5CC0D5]/16 bg-[#023A4E]/22 p-5 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-[#5CC0D5]/42 hover:bg-[#023A4E]/34 hover:shadow-[0_24px_70px_-44px_rgba(92,192,213,0.8)]">
                      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#5CC0D5]/0 to-transparent transition-all duration-500 group-hover:via-[#5CC0D5]/62"></div>
                      <div className="absolute -right-10 top-0 h-28 w-28 rounded-full bg-[#F0A018]/0 blur-[70px] transition-all duration-500 group-hover:bg-[#F0A018]/8"></div>
                      <div className="relative flex items-center gap-5">
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-[1.2rem] border border-[#5CC0D5]/24 bg-[#011a24]/24 text-[#5CC0D5] transition-all duration-500 group-hover:border-[#5CC0D5]/52 group-hover:bg-[#5CC0D5]/10 group-hover:text-[#5CC0D5]">
                          <div className="absolute inset-2 rounded-2xl border border-[#F0A018]/10 transition-all duration-500 group-hover:scale-110 group-hover:border-[#5CC0D5]/22"></div>
                          <div className="absolute inset-0 rounded-[1.2rem] bg-[#5CC0D5]/0 blur-xl transition-all duration-500 group-hover:bg-[#5CC0D5]/18"></div>
                          <div className="relative transition-transform duration-500 group-hover:scale-110">
                            <ContactGlyph type="phone" className="h-6 w-6" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="mb-1 text-xs font-bold uppercase tracking-[0.22em] text-[#5CC0D5]/78">{t.contactSection.phoneText}</p>
                          <p className="text-xl font-bold tracking-tight text-white">+32 16 19 69 84</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-[#F0A018]/75 transition-transform duration-500 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </a>

                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=Martelarenlaan+69,+3010+Leuven,+Belgium"
                    target="_blank"
                    rel="noreferrer"
                    className="group interactive-card selectable block"
                  >
                    <div className="relative overflow-hidden rounded-[1.75rem] border border-[#5CC0D5]/16 bg-[#023A4E]/22 p-5 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-[#5CC0D5]/42 hover:bg-[#023A4E]/34 hover:shadow-[0_24px_70px_-44px_rgba(92,192,213,0.8)]">
                      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#5CC0D5]/0 to-transparent transition-all duration-500 group-hover:via-[#5CC0D5]/62"></div>
                      <div className="absolute -right-10 top-0 h-28 w-28 rounded-full bg-[#5CC0D5]/0 blur-[70px] transition-all duration-500 group-hover:bg-[#5CC0D5]/12"></div>
                      <div className="relative flex items-center gap-5">
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-[1.2rem] border border-[#5CC0D5]/24 bg-[#011a24]/24 text-[#5CC0D5] transition-all duration-500 group-hover:border-[#5CC0D5]/52 group-hover:bg-[#5CC0D5]/10 group-hover:text-[#5CC0D5]">
                          <div className="absolute inset-2 rounded-2xl border border-[#F0A018]/10 transition-all duration-500 group-hover:scale-110 group-hover:border-[#5CC0D5]/22"></div>
                          <div className="absolute inset-0 rounded-[1.2rem] bg-[#5CC0D5]/0 blur-xl transition-all duration-500 group-hover:bg-[#5CC0D5]/18"></div>
                          <div className="relative transition-transform duration-500 group-hover:scale-110">
                            <ContactGlyph type="pin" className="h-6 w-6" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="mb-1 text-xs font-bold uppercase tracking-[0.22em] text-[#5CC0D5]/78">{t.contactSection.addressText}</p>
                          <p className="text-xl font-bold tracking-tight text-white">Martelarenlaan 69, 3010 Leuven</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-[#F0A018]/75 transition-transform duration-500 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection delay={300}>
              <div className="relative overflow-hidden rounded-[2.5rem] border border-[#5CC0D5]/26 bg-[linear-gradient(145deg,rgba(2,58,78,0.38),rgba(1,80,110,0.18)_55%,rgba(2,58,78,0.28))] p-8 shadow-[0_34px_110px_-58px_rgba(92,192,213,0.95)] backdrop-blur-[24px] md:p-10 lg:p-11">
                <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#5CC0D5]/62 to-transparent"></div>
                <div className="absolute -right-16 -top-14 h-44 w-44 rounded-full bg-[#5CC0D5]/13 blur-[90px]"></div>
                <div className="absolute -left-16 bottom-8 h-36 w-36 rounded-full bg-[#F0A018]/7 blur-[90px]"></div>
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(92,192,213,0.08),transparent_38%,rgba(240,160,24,0.05)_100%)]"></div>
                <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 720 620" fill="none" aria-hidden="true">
                  <path d="M32 408 C138 332 214 394 302 328 S466 210 598 244" stroke="#5CC0D5" strokeOpacity="0.18" strokeWidth="1.1" />
                  <path className="contact-panel-line" d="M32 408 C138 332 214 394 302 328 S466 210 598 244" stroke="#5CC0D5" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="94 720" />
                  <circle cx="598" cy="244" r="66" stroke="#5CC0D5" strokeOpacity="0.08" />
                  <circle cx="598" cy="244" r="32" stroke="#F0A018" strokeOpacity="0.09" strokeDasharray="5 12" />
                </svg>

                <div className="relative z-10 mb-10">
                  <h3 className="text-3xl font-extrabold tracking-tight text-white md:text-[2.15rem]">
                    {t.contactSection.formTitle}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm font-medium leading-relaxed text-teal-100/78">
                    {t.contactSection.formSubtitle}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
                  <div className="group/field relative overflow-hidden rounded-[1.35rem] border border-[#5CC0D5]/20 bg-[#023A4E]/34 shadow-[inset_0_1px_0_rgba(92,192,213,0.08)] transition-all duration-300 focus-within:border-[#5CC0D5]/58 focus-within:bg-[#023A4E]/48 focus-within:shadow-[0_0_0_1px_rgba(92,192,213,0.18),0_22px_55px_-36px_rgba(92,192,213,0.9)]">
                    <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[#5CC0D5]/0 to-transparent transition-all duration-300 group-focus-within/field:via-[#5CC0D5]/70"></div>
                    <input
                      type="text" name="name" value={formData.name} onChange={handleInputChange} required
                      className="w-full bg-transparent px-5 pt-7 pb-3 text-white focus:outline-none peer placeholder-transparent"
                      placeholder={t.contactSection.placeholders.name}
                    />
                    <label className="absolute left-5 top-4 text-sm text-teal-200/58 pointer-events-none transition-all peer-focus:-translate-y-2 peer-focus:text-[#5CC0D5] peer-focus:text-[10px] peer-focus:font-bold peer-focus:tracking-[0.2em] peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:text-[#5CC0D5] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:tracking-[0.2em]">
                      {t.contactSection.labels.name}
                    </label>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="group/field relative overflow-hidden rounded-[1.35rem] border border-[#5CC0D5]/20 bg-[#023A4E]/34 shadow-[inset_0_1px_0_rgba(92,192,213,0.08)] transition-all duration-300 focus-within:border-[#5CC0D5]/58 focus-within:bg-[#023A4E]/48 focus-within:shadow-[0_0_0_1px_rgba(92,192,213,0.18),0_22px_55px_-36px_rgba(92,192,213,0.9)]">
                      <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[#5CC0D5]/0 to-transparent transition-all duration-300 group-focus-within/field:via-[#5CC0D5]/70"></div>
                      <input
                        type="text" name="company" value={formData.company} onChange={handleInputChange} required
                        className="w-full bg-transparent px-5 pt-7 pb-3 text-white focus:outline-none peer placeholder-transparent"
                        placeholder={t.contactSection.placeholders.company}
                      />
                      <label className="absolute left-5 top-4 text-sm text-teal-200/58 pointer-events-none transition-all peer-focus:-translate-y-2 peer-focus:text-[#5CC0D5] peer-focus:text-[10px] peer-focus:font-bold peer-focus:tracking-[0.2em] peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:text-[#5CC0D5] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:tracking-[0.2em]">
                        {t.contactSection.labels.company}
                      </label>
                    </div>

                    <div className="group/field relative overflow-hidden rounded-[1.35rem] border border-[#5CC0D5]/20 bg-[#023A4E]/34 shadow-[inset_0_1px_0_rgba(92,192,213,0.08)] transition-all duration-300 focus-within:border-[#5CC0D5]/58 focus-within:bg-[#023A4E]/48 focus-within:shadow-[0_0_0_1px_rgba(92,192,213,0.18),0_22px_55px_-36px_rgba(92,192,213,0.9)]">
                      <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[#5CC0D5]/0 to-transparent transition-all duration-300 group-focus-within/field:via-[#5CC0D5]/70"></div>
                      <input
                        type="email" name="email" value={formData.email} onChange={handleInputChange} required
                        className="w-full bg-transparent px-5 pt-7 pb-3 text-white focus:outline-none peer placeholder-transparent"
                        placeholder={t.contactSection.placeholders.email}
                      />
                      <label className="absolute left-5 top-4 text-sm text-teal-200/58 pointer-events-none transition-all peer-focus:-translate-y-2 peer-focus:text-[#5CC0D5] peer-focus:text-[10px] peer-focus:font-bold peer-focus:tracking-[0.2em] peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:text-[#5CC0D5] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:tracking-[0.2em]">
                        {t.contactSection.labels.email}
                      </label>
                    </div>
                  </div>

                  <div className="group/field relative overflow-hidden rounded-[1.35rem] border border-[#5CC0D5]/20 bg-[#023A4E]/34 shadow-[inset_0_1px_0_rgba(92,192,213,0.08)] transition-all duration-300 focus-within:border-[#5CC0D5]/58 focus-within:bg-[#023A4E]/48 focus-within:shadow-[0_0_0_1px_rgba(92,192,213,0.18),0_22px_55px_-36px_rgba(92,192,213,0.9)]">
                    <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[#5CC0D5]/0 to-transparent transition-all duration-300 group-focus-within/field:via-[#5CC0D5]/70"></div>
                    <textarea
                      name="message" value={formData.message} onChange={handleInputChange} rows="5" required
                      className="w-full resize-none bg-transparent px-5 pt-7 pb-3 text-white focus:outline-none peer placeholder-transparent"
                      placeholder={t.contactSection.placeholders.message}
                    ></textarea>
                    <label className="absolute left-5 top-4 text-sm text-teal-200/58 pointer-events-none transition-all peer-focus:-translate-y-2 peer-focus:text-[#5CC0D5] peer-focus:text-[10px] peer-focus:font-bold peer-focus:tracking-[0.2em] peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:text-[#5CC0D5] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:tracking-[0.2em]">
                      {t.contactSection.labels.message}
                    </label>
                  </div>

                  <button type="submit" className="group interactive-card mt-3 flex w-full items-center justify-center gap-3 rounded-[1.35rem] border border-[#F0A018]/46 bg-gradient-to-r from-[#F0A018] via-[#FFB53A] to-[#FFC35C] px-8 py-5 text-lg font-bold text-[#012330] shadow-[0_16px_42px_-18px_rgba(240,160,24,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_55px_-18px_rgba(240,160,24,0.72)]">
                    <span>{t.contactSection.submit}</span>
                    <Send className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </button>
                  <p className="px-1 text-sm leading-7 text-teal-100/64">
                    {t.contactSection.privacyNoteLead}{' '}
                    <Link
                      to={legalPaths.privacy}
                      className="font-semibold text-[#F0A018] transition-colors hover:text-[#FFC35C]"
                    >
                      {t.contactSection.privacyNoteLink}
                    </Link>{' '}
                    {t.contactSection.privacyNoteTail}
                  </p>
                </form>
              </div>
            </FadeInSection>
          </div>
        </div>

        {/* ===== FOOTER ===== */}
        <footer className="relative z-10 mt-20 overflow-hidden pb-14 pt-12">
          <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
            <div className="relative">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#5CC0D5]/42 to-transparent"></div>
              <div className="pt-10">
                <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
                  <div className="flex cursor-pointer items-center gap-4 interactive-card" onClick={() => scrollToSection('home')}>
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-[#5CC0D5]/24 bg-[#023A4E]/18 text-[#F0A018] backdrop-blur-sm">
                      <div className="absolute inset-2 rounded-xl border border-[#5CC0D5]/10"></div>
                      <NutriLogo className="relative h-7 w-7 text-[#F0A018]" cutoutColor="#01506E" />
                    </div>
                    <div>
                      <span className="block text-xl font-bold tracking-tight text-white">Nutrivisi</span>
                      <span className="block text-[10px] uppercase tracking-[0.22em] text-[#5CC0D5]">{t.nav.tag}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-bold uppercase tracking-[0.18em]">
                    <a href="#waarom" onClick={(e) => { e.preventDefault(); scrollToSection('waarom'); }} className="text-teal-100/64 transition-colors hover:text-[#5CC0D5]">{t.nav.why}</a>
                    <Link to={legalPaths.privacy} className="text-teal-100/64 transition-colors hover:text-[#5CC0D5]">{t.footer.privacy}</Link>
                    <Link to={legalPaths.cookies} className="text-teal-100/64 transition-colors hover:text-[#5CC0D5]">{t.footer.cookies}</Link>
                    <Link to={legalPaths.legal} className="text-teal-100/64 transition-colors hover:text-[#5CC0D5]">{t.footer.legal}</Link>
                  </div>
                </div>

                <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[#5CC0D5]/14 pt-6 md:flex-row">
                  <p className="text-center text-xs font-medium uppercase tracking-[0.16em] text-teal-100/48 md:text-left">
                    © {new Date().getFullYear()} Nutrivisi · {t.footer.tagline}
                  </p>
                  <p className="font-mono text-[10px] tracking-[0.28em] text-[#5CC0D5]/48">
                    LEUVEN · BELGIUM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </section>

      {/* ===== GLOBAL STYLES ===== */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Custom cursor active for all users, except when reduced-motion is preferred */
        * { cursor: none; }
        input, textarea, select { cursor: text; }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            cursor: auto !important;
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
          }
          input, textarea, select { cursor: text !important; }
        }

        /* Text selection rules: allow on copy + form fields, disable on decorative/heading elements */
        h1, h2, h4, svg, path { user-select: none; }
        h3, p, span, li, input, textarea, label, a, .selectable, .selectable * { user-select: text; }
        ::selection { background: rgba(240,160,24,0.35); color: white; }

        @keyframes shuttle { 0% { left: 35%; opacity: 0.5; } 50% { left: 65%; opacity: 1; } 100% { left: 35%; opacity: 0.5; } }
        @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes breathe { 0%, 100% { opacity: 0.1; transform: scale(1) translate(-50%, -50%); filter: blur(140px); } 50% { opacity: 0.25; transform: scale(1.15) translate(-50%, -50%); filter: blur(100px); } }
        @keyframes drift-slow { 0%, 100% { transform: translate(-50%, -50%) translate(0, 0); } 50% { transform: translate(-50%, -50%) translate(50px, -30px); } }
        @keyframes float-stream { 0% { transform: translateY(100vh); opacity: 0; } 20% { opacity: 0.15; } 80% { opacity: 0.15; } 100% { transform: translateY(-100px); opacity: 0; } }
        @keyframes blockReveal { 0% { opacity: 0; transform: translateY(15px); filter: blur(8px); } 100% { opacity: 1; transform: translateY(0); filter: blur(0px); } }
        @keyframes flowLight { from { stroke-dashoffset: 1040; } to { stroke-dashoffset: 0; } }
        @keyframes sectorGlow { 0% { opacity: 0; transform: translateY(10px); text-shadow: 0 0 0 rgba(86,192,213,0); } 55% { opacity: 1; text-shadow: 0 0 28px rgba(86,192,213,0.4), 0 0 42px rgba(240,160,24,0.18); } 100% { opacity: 1; transform: translateY(0); text-shadow: 0 0 16px rgba(86,192,213,0.24); } }
        @keyframes sectorTrace { from { stroke-dashoffset: 1270; } to { stroke-dashoffset: 0; } }
        @keyframes sectorPulse { 0%, 100% { opacity: 0.15; transform: scale(0.75); transform-origin: center; } 50% { opacity: 0.55; transform: scale(1.25); transform-origin: center; } }
        @keyframes sectorFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes serviceCopyReveal { 0% { opacity: 0; transform: translateY(16px); filter: blur(10px); } 100% { opacity: 1; transform: translateY(0); filter: blur(0); } }
        @keyframes serviceVisualReveal { 0% { opacity: 0; transform: scale(0.94) translateY(10px); filter: blur(10px); } 100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); } }
        @keyframes methodOrderDash { from { stroke-dashoffset: 1100; } to { stroke-dashoffset: 0; } }
        @keyframes methodArrowPulse { 0%, 100% { opacity: 0.46; } 50% { opacity: 0.7; } }
        @keyframes methodChipRadiate { 0%, 100% { transform: translate(-50%, -50%) scale(0.82); opacity: 0.55; } 50% { transform: translate(-50%, -50%) scale(1.18); opacity: 1; } }
        @keyframes whyCurrent { from { stroke-dashoffset: 872; } to { stroke-dashoffset: 0; } }
        @keyframes whyOrbitA { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes whyOrbitB { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        @keyframes whyProofGlow { 0%, 100% { box-shadow: 0 18px 55px -34px rgba(92,192,213,0.72), inset 0 0 0 rgba(92,192,213,0); } 50% { box-shadow: 0 20px 60px -26px rgba(92,192,213,0.98), inset 0 0 24px rgba(92,192,213,0.07); } }
        @keyframes knowledgeTrace { from { stroke-dashoffset: 1440; } to { stroke-dashoffset: 0; } }
        @keyframes knowledgeOrbitA { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes knowledgeOrbitB { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        @keyframes knowledgeNodePulse { 0%, 100% { transform: scale(0.82); opacity: 0.42; } 50% { transform: scale(1.22); opacity: 0.9; } }
        @keyframes contactFlowTrace { from { stroke-dashoffset: 1440; } to { stroke-dashoffset: 0; } }
        @keyframes contactRingA { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes contactRingB { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        @keyframes contactNodePulse { 0%, 100% { transform: scale(0.82); opacity: 0.42; } 50% { transform: scale(1.24); opacity: 0.96; } }
        @keyframes contactPanelTrace { from { stroke-dashoffset: 820; } to { stroke-dashoffset: 0; } }
        @keyframes labelScan { 0%, 100% { transform: translateY(-80px); opacity: 0; } 10% { opacity: 0.8; } 50% { opacity: 0.8; } 90% { opacity: 0; } }

        .animate-breathe { animation: breathe 6s ease-in-out infinite; }
        .animate-drift-slow { animation: drift-slow 12s ease-in-out infinite; }
        .animate-float-stream { animation: float-stream linear infinite; }
        .animate-gradient { animation: gradient 6s ease infinite; }
        .sector-eyebrow-glow { animation: sectorGlow 1.2s ease-out both; }
        .sector-trace-line { animation: sectorTrace 7s linear infinite; }
        .sector-orbit-pulse { animation: sectorPulse 2.8s ease-in-out infinite; }
        .sector-node { animation: sectorFloat 6s ease-in-out infinite; }
        .service-copy-reveal { animation: serviceCopyReveal 0.72s ease-out both; }
        .service-visual-reveal { animation: serviceVisualReveal 0.85s ease-out both; }
        .method-order-dash { animation: methodOrderDash 6.4s linear infinite; }
        .method-arrow-head { animation: methodArrowPulse 1.8s ease-in-out infinite; }
        .method-chip-radiate { animation: methodChipRadiate 3.4s ease-in-out infinite; }
        .why-current-line { animation: whyCurrent 8.5s linear infinite; opacity: 0.34; }
        .why-orbit-a { animation: whyOrbitA 26s linear infinite; transform-origin: 260px 250px; }
        .why-orbit-b { animation: whyOrbitB 18s linear infinite; transform-origin: 260px 250px; }
        .why-proof-chip { animation: whyProofGlow 4.2s ease-in-out infinite; }
        .knowledge-trace-line { animation: knowledgeTrace 10s linear infinite; opacity: 0.34; }
        .knowledge-orbit-a { animation: knowledgeOrbitA 28s linear infinite; transform-origin: 1080px 210px; }
        .knowledge-orbit-b { animation: knowledgeOrbitB 20s linear infinite; transform-origin: 1080px 210px; }
        .knowledge-node { animation: knowledgeNodePulse 3.4s ease-in-out infinite; transform-origin: center; }
        .contact-flow-line { animation: contactFlowTrace 10.5s linear infinite; opacity: 0.32; }
        .contact-flow-ring-a { animation: contactRingA 30s linear infinite; transform-origin: 1040px 260px; }
        .contact-flow-ring-b { animation: contactRingB 21s linear infinite; transform-origin: 1040px 260px; }
        .contact-flow-node { animation: contactNodePulse 3.6s ease-in-out infinite; transform-origin: center; }
        .contact-panel-line { animation: contactPanelTrace 7.5s linear infinite; opacity: 0.3; }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
