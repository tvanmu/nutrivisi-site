import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu, X, ChevronRight, ArrowRight, ShieldCheck, Users, Award, ShieldAlert,
  Tag, Wheat, Beef, UtensilsCrossed, Store, CheckCircle2, Mail, Phone, MapPin,
  Lightbulb, ClipboardCheck, Activity, Send, Eye, BookOpen, AlertTriangle,
  FlaskConical, Recycle, Scale, Layers, Fingerprint
} from 'lucide-react';

/* =====================================================================
   1. LOGO
   ===================================================================== */
const NutriLogo = ({ className = 'w-10 h-10', cutoutColor = '#012330' }) => (
  <svg viewBox="0 0 100 80" className={className} fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="25" y1="30" x2="12" y2="18" />
    <line x1="50" y1="25" x2="50" y2="8" />
    <line x1="75" y1="30" x2="88" y2="18" />
    <path d="M 5 55 Q 50 20 95 55 Q 50 90 5 55 Z" />
    <circle cx="50" cy="55" r="22" fill="currentColor" stroke="none" />
    <path d="M 40 55 L 48 64 L 62 45" stroke={cutoutColor} strokeWidth="6" fill="none" />
  </svg>
);

/* =====================================================================
   2. REDUCED-MOTION HOOK
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
   3. CUSTOM CURSOR — fixed hover detection + reduced-motion aware
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
   4. REVEAL UTILITIES
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
const ParticleField = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
    {[...Array(30)].map((_, i) => (
      <div
        key={i}
        className="absolute w-[1px] h-[30px] bg-gradient-to-t from-transparent via-[#F0A018] to-transparent opacity-10 animate-float-stream"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDuration: `${15 + Math.random() * 20}s`,
          animationDelay: `${Math.random() * 5}s`,
        }}
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

const ClarityLensBackground = ({ rotation }) => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
    <div className="relative w-[800px] h-[800px] flex items-center justify-center transition-transform duration-500 ease-out">
      <div className="absolute inset-0 border border-[#F0A018]/40 rounded-full" style={{ transform: `rotate(${rotation * 0.5}deg)` }}></div>
      <div className="absolute inset-[15%] border border-[#F0A018]/50 rounded-full" style={{ transform: `rotate(${-rotation * 0.8}deg)` }}></div>
      <div className="absolute inset-[30%] border border-[#F0A018]/40 rounded-full animate-[pulse_10s_ease-in-out_infinite]" style={{ transform: `rotate(${rotation * 1.2}deg)` }}></div>
      <div className="absolute h-[1px] w-[200%] bg-gradient-to-r from-transparent via-[#F0A018]/50 to-transparent" style={{ transform: `rotate(${35 + rotation * 0.3}deg)` }}></div>
      <div className="absolute h-[1px] w-[200%] bg-gradient-to-r from-transparent via-[#56C0D5]/40 to-transparent" style={{ transform: `rotate(${-15 - rotation * 0.4}deg)` }}></div>
      <div className="absolute h-[2px] w-32 bg-gradient-to-r from-transparent via-[#F0A018]/60 to-transparent"></div>
      <div className="absolute w-[2px] h-32 bg-gradient-to-b from-transparent via-[#F0A018]/60 to-transparent"></div>
    </div>
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
    sectorsSection: { eyebrow: 'Verankerde expertise in uw sector', items: ['Bakkerij', 'Vleessector', 'Horeca', 'Retail'] },
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
      visualEyebrow: 'VISUELE OUTPUT',
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
      description: 'Compliance werkt pas als ze begrepen wordt. Onze differentiatie zit in vier concrete pijlers.',
      items: [
        { icon: Eye, title: 'Visueel leermateriaal', text: 'Workbooks en pictogrammen die medewerkers op de werkvloer echt gebruiken, niet wegzetten in een map.' },
        { icon: Layers, title: 'Sectorspecialisatie', text: 'Geen generiek advies: de aanpak is afgestemd op bakkerij, vlees, horeca of retail.' },
        { icon: Scale, title: 'Wetsgetrouw', text: 'Elke stap beantwoordt aan FAVV en relevante EU-wetgeving, ook bij updates en herzieningen.' },
        { icon: Fingerprint, title: 'Praktisch op de werkvloer', text: 'Geen glanzende theory maar procedures die resultaat geven bij een audit of inspectie.' },
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
    sectorsSection: { eyebrow: 'Une expertise ancrée dans votre secteur', items: ['Boulangerie', 'Secteur de la viande', 'Horeca', 'Retail'] },
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
      visualEyebrow: 'SORTIE VISUELLE',
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
      description: 'La conformité ne fonctionne que lorsqu\'elle est comprise. Notre différenciation repose sur quatre piliers concrets.',
      items: [
        { icon: Eye, title: 'Matériel visuel', text: 'Des workbooks et pictogrammes que les collaborateurs utilisent vraiment, pas rangés dans un classeur.' },
        { icon: Layers, title: 'Spécialisation sectorielle', text: 'Pas de conseil générique : l\'approche est adaptée à la boulangerie, la viande, l\'horeca ou le retail.' },
        { icon: Scale, title: 'Conforme à la loi', text: 'Chaque étape respecte l\'AFSCA et la législation UE en vigueur, y compris les mises à jour.' },
        { icon: Fingerprint, title: 'Concret sur le terrain', text: 'Pas de théorie brillante mais des procédures qui donnent des résultats en audit ou inspection.' },
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

  const serviceVisualMap = {
    expertadvies: AdvisoryLayersVisual,
    coaching: WorkbookVisual,
    certificatie: CertificationFlowVisual,
    risico: RiskHeatmapVisual,
    etikettering: LabelInspectorVisual,
  };

  const currentServices = useMemo(() => t.servicesSection.items.map((s) => ({
    ...s,
    icon: { expertadvies: Lightbulb, coaching: Users, certificatie: Award, risico: ShieldAlert, etikettering: Tag }[s.id],
    Visual: serviceVisualMap[s.id],
  })), [t]);

  const currentSectors = useMemo(() => t.sectorsSection.items.map((title, i) => ({
    title, icon: [Wheat, Beef, UtensilsCrossed, Store][i],
  })), [t]);

  const currentMethodSteps = useMemo(() => t.methodSection.items.map((step, i) => ({
    ...step, icon: [ClipboardCheck, Lightbulb, ShieldCheck][i],
  })), [t]);

  const activeService = useMemo(
    () => currentServices.find((service) => service.id === activeServiceId) ?? currentServices[0],
    [activeServiceId, currentServices]
  );
  const ActiveServiceIcon = activeService.icon;
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
                <div className="mt-16 grid gap-4 sm:grid-cols-2">
                  {t.hero.trust.map((point) => (
                    <div key={point} className="flex items-start gap-3 rounded-2xl border border-teal-800/40 bg-[#023A4E] p-4 backdrop-blur-sm group hover:border-[#F0A018]/30 transition-colors">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#F0A018] group-hover:scale-110 transition-transform" />
                      <p className="text-sm leading-6 text-white/90">{point}</p>
                    </div>
                  ))}
                </div>
              </FadeInSection>
            </div>

            <FadeInSection delay={400} className="relative hidden lg:block">
              <div className="absolute inset-0 bg-[#F0A018]/5 rounded-[3rem] blur-2xl"></div>
              <div className="relative overflow-hidden rounded-[3rem] border border-teal-800/50 bg-[#023142]/40 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.4)]">
                <div className="border-b border-teal-800/40 bg-[#011a24]/80 px-8 py-6 flex items-center justify-between">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F0A018]">{t.hero.focusEyebrow}</p>
                  <Activity className="w-5 h-5 text-teal-400 animate-pulse" />
                </div>
                <div className="space-y-6 p-8">
                  <div className="rounded-3xl bg-[#011a24]/50 border border-teal-800/30 p-6 group hover:border-[#F0A018]/40 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="rounded-xl bg-[#F0A018]/10 p-3">
                        <ShieldCheck className="h-8 w-8 text-[#F0A018]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{t.hero.focus1.title}</h3>
                        <p className="mt-1 text-sm text-teal-100/75 leading-relaxed">{t.hero.focus1.text}</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { Icon: Award, data: t.hero.focus2 },
                      { Icon: Eye, data: t.hero.focus3 },
                      { Icon: Tag, data: t.hero.focus4 },
                      { Icon: Store, data: t.hero.focus5 },
                    ].map(({ Icon, data }) => (
                      <div key={data.title} className="rounded-3xl border border-teal-800/30 bg-[#011a24]/50 p-5 group hover:border-teal-400/40 transition-colors">
                        <Icon className="h-6 w-6 text-teal-300 mb-3" />
                        <p className="text-sm font-bold text-white mb-1">{data.title}</p>
                        <p className="text-xs text-teal-100/70 leading-relaxed">{data.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ===== SECTORS BRIDGE ===== */}
      <section className="bg-gradient-to-b from-[#023A4E] via-[#012a38] to-[#01506E] pt-12 pb-32 relative overflow-visible">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-64 bg-gradient-to-t from-[#F0A018]/5 to-transparent blur-[100px] pointer-events-none z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-center mb-20">
            <p className="text-center text-xs font-bold text-teal-300 uppercase tracking-[0.3em]">{t.sectorsSection.eyebrow}</p>
          </div>
          <div className="relative py-10">
            <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 h-32 pointer-events-none hidden md:block z-0">
              <svg className="w-full h-full opacity-60" viewBox="0 0 1000 100" preserveAspectRatio="none">
                <path d="M0,50 C125,150 125,-50 250,50 C375,150 375,-50 500,50 C625,150 625,-50 750,50 C875,150 875,-50 1000,50" fill="none" stroke="#56C0D5" strokeWidth="1" strokeOpacity="0.2" />
                <path d="M0,50 C125,150 125,-50 250,50 C375,150 375,-50 500,50 C625,150 625,-50 750,50 C875,150 875,-50 1000,50" fill="none" stroke="#56C0D5" strokeWidth="2" strokeOpacity="0.8" strokeDasharray="40 1000" style={{ animation: 'flowLight 8s linear infinite' }} />
                <path d="M0,50 C125,-50 125,150 250,50 C375,-50 375,150 500,50 C625,-50 625,150 750,50 C875,-50 875,150 1000,50" fill="none" stroke="#F0A018" strokeWidth="1" strokeOpacity="0.2" />
                <path d="M0,50 C125,-50 125,150 250,50 C375,-50 375,150 500,50 C625,-50 625,150 750,50 C875,-50 875,150 1000,50" fill="none" stroke="#F0A018" strokeWidth="2" strokeOpacity="0.8" strokeDasharray="60 1000" style={{ animation: 'flowLight 6s linear infinite reverse' }} />
              </svg>
            </div>
            <div className="flex flex-wrap justify-center gap-8 md:gap-24 relative z-10 w-full">
              {currentSectors.map((sector, index) => {
                const Icon = sector.icon;
                return (
                  <FadeInSection key={index} delay={index * 100}>
                    <div className="flex flex-col items-center gap-4 text-teal-200/70 font-medium hover:text-[#F0A018] transition-all duration-500 group interactive-card">
                      <div className="relative p-2">
                        <div className="absolute inset-0 border border-[#F0A018]/0 rounded-full group-hover:border-[#F0A018]/30 group-hover:animate-[spin_4s_linear_infinite] transition-all duration-700"></div>
                        <div className="p-5 rounded-full bg-[#011a24]/80 backdrop-blur-md border border-teal-700/40 group-hover:bg-[#F0A018]/10 group-hover:border-[#F0A018]/50 transition-all duration-500 shadow-lg group-hover:shadow-[0_0_30px_rgba(240,160,24,0.25)] relative z-10">
                          <Icon className="w-6 h-6 group-hover:scale-110 transition-transform duration-500" />
                        </div>
                      </div>
                      <span className="text-sm tracking-widest uppercase mt-2">{sector.title}</span>
                    </div>
                  </FadeInSection>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===== METRICS BAND ===== */}
      <section className="relative py-24 bg-[#01506E] border-t border-teal-900/40 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'linear-gradient(#F0A018 1px, transparent 1px), linear-gradient(90deg, #F0A018 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#F0A018]/8 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#56C0D5]/8 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeInSection>
            <div className="flex items-center gap-4 justify-center mb-12">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#F0A018]/60"></div>
              <p className="text-xs font-bold text-[#F0A018] uppercase tracking-[0.35em]">{t.metrics.eyebrow}</p>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#F0A018]/60"></div>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 relative">
            {t.metrics.items.map((metric, index) => (
              <FadeInSection key={index} delay={index * 100}>
                <div className={`relative p-8 md:p-10 text-center group ${index > 0 ? 'md:border-l md:border-teal-800/40' : ''}`}>
                  <div className="absolute top-4 right-4 flex gap-1 opacity-30">
                    <div className="w-1 h-1 rounded-full bg-[#F0A018]"></div>
                    <div className="w-1 h-1 rounded-full bg-[#F0A018]"></div>
                    <div className="w-1 h-1 rounded-full bg-[#F0A018]"></div>
                  </div>
                  <p className="text-4xl md:text-6xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-[#F0A018] via-[#FFC35C] to-[#F0A018] mb-3 transition-all group-hover:scale-105">
                    {metric.value}
                  </p>
                  <p className="text-sm font-bold text-white uppercase tracking-wider mb-2">{metric.label}</p>
                  <p className="text-xs text-teal-200/70 leading-relaxed">{metric.caption}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES HUD ===== */}
      <section id="diensten" className="py-32 bg-[#01506E] relative overflow-hidden border-t border-teal-900/30">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionTitle eyebrow={t.servicesSection.eyebrow} title={t.servicesSection.title} center />

          <div className="mt-20 grid lg:grid-cols-12 gap-0 border border-teal-800/40 rounded-[2.5rem] bg-[#023142]/40 backdrop-blur-2xl shadow-2xl overflow-hidden relative">
            {/* Left menu */}
            <div className="lg:col-span-4 border-r border-teal-800/40 bg-[#01506E]/80 relative z-20">
              <div className="flex flex-col h-full max-h-[700px] overflow-y-auto no-scrollbar py-6">
                {currentServices.map((service) => {
                  const isActive = activeService.id === service.id;
                  return (
                    <button key={service.id} onClick={() => setActiveServiceId(service.id)}
                      className={`w-full text-left p-6 md:p-8 flex items-center gap-5 transition-all duration-500 interactive-card relative overflow-hidden group ${isActive ? 'bg-[#034259]/60 text-white' : 'bg-transparent text-teal-100/60 hover:bg-[#034259]/20 hover:text-white'}`}>
                      {isActive && <div className="absolute left-0 top-0 w-1 h-full bg-[#F0A018] shadow-[0_0_15px_#F0A018]"></div>}
                      <div className="relative flex items-center justify-center w-6 h-6 shrink-0">
                        <div className={`absolute w-2 h-2 rounded-full transition-all duration-500 ${isActive ? 'bg-[#F0A018] scale-100 shadow-[0_0_10px_#F0A018]' : 'bg-teal-700 group-hover:bg-teal-400 scale-75'}`}></div>
                        {isActive && <div className="absolute w-full h-full border border-[#F0A018] rounded-full animate-ping opacity-50"></div>}
                      </div>
                      <span className={`font-bold text-lg tracking-wide transition-transform duration-300 ${isActive ? 'translate-x-1' : ''}`}>{service.title}</span>
                      {isActive && <ChevronRight className="ml-auto w-5 h-5 text-[#F0A018]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right display */}
            <div className="lg:col-span-8 relative bg-gradient-to-br from-[#023A4E]/30 to-[#01506E]/90 p-10 lg:p-16 flex items-center min-h-[700px] overflow-hidden">
              <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#F0A018]/20 to-transparent rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '6s' }}></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#56C0D5]/20 to-transparent rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s', animationDuration: '8s' }}></div>
              </div>
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-20">
                <div className="w-[200%] h-[1px] bg-gradient-to-r from-transparent via-[#F0A018] to-transparent absolute top-1/2 left-[-50%] animate-[shuttle_6s_ease-in-out_infinite] shadow-[0_0_15px_#F0A018]"></div>
              </div>

              <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-10 items-center" key={activeService.id}>
                <div>
                  <div className="w-16 h-16 bg-[#01506E] text-[#F0A018] rounded-2xl flex items-center justify-center mb-8 border border-[#F0A018]/30 shadow-[0_0_30px_rgba(240,160,24,0.15)] animate-[blockReveal_0.5s_ease-out]">
                    <ActiveServiceIcon className="w-8 h-8" />
                  </div>
                  <h3 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight animate-[blockReveal_0.6s_ease-out]">
                    {activeService.title}
                  </h3>
                  <p className="text-teal-100/85 text-lg font-light leading-relaxed mb-8 animate-[blockReveal_0.7s_ease-out]">
                    {activeService.description}
                  </p>
                  <div className="space-y-3 mb-10 animate-[blockReveal_0.8s_ease-out]">
                    {activeService.bullets.map((bullet) => (
                      <div key={bullet} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#F0A018] shrink-0" />
                        <span className="text-white font-medium">{bullet}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => scrollToSection('contact')} className="inline-flex items-center gap-3 text-[#F0A018] font-bold text-sm uppercase tracking-[0.15em] hover:text-[#FFC35C] transition-colors group interactive-card border-b border-[#F0A018]/30 pb-2 hover:border-[#F0A018] animate-[blockReveal_0.9s_ease-out]">
                    <span>{t.servicesSection.discuss}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>

                <div className="relative hidden md:flex flex-col items-center justify-center pointer-events-none animate-[blockReveal_1s_ease-out]">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#56C0D5] rounded-full blur-[120px] opacity-10"></div>
                  <div className="text-xs font-bold uppercase tracking-[0.3em] text-[#F0A018]/70 mb-4 flex items-center gap-2">
                    <span className="h-px w-8 bg-[#F0A018]/40"></span>
                    {t.servicesSection.visualEyebrow}
                    <span className="h-px w-8 bg-[#F0A018]/40"></span>
                  </div>
                  <div className="relative w-full h-[360px] flex items-center justify-center">
                    <ActiveServiceVisual />
                  </div>
                  <p className="text-xs text-teal-200/70 italic text-center max-w-xs mt-4 leading-relaxed">
                    {activeService.visualCaption}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== METHOD ===== */}
      <section id="werkwijze" className="py-32 bg-[#01506E] relative overflow-hidden border-t border-teal-900/30">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-[#F0A018]/10 to-transparent blur-[160px] pointer-events-none z-0"></div>
        <ClarityLensBackground rotation={scrollRotation} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionTitle eyebrow={t.methodSection.eyebrow} title={t.methodSection.title} center />
          <div className="mt-20 grid md:grid-cols-3 gap-8">
            {currentMethodSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <FadeInSection key={step.title} delay={index * 150} className="group h-full">
                  <div className="h-full p-10 rounded-[2.5rem] bg-[#023142]/40 backdrop-blur-md border border-teal-800/40 hover:border-[#F0A018]/40 transition-all duration-500 flex flex-col relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-[#F0A018]/5 rounded-full blur-2xl group-hover:bg-[#F0A018]/10 transition-all"></div>
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-14 h-14 rounded-2xl bg-[#011a24] flex items-center justify-center border border-teal-800/50 group-hover:scale-110 group-hover:border-[#F0A018]/50 transition-all">
                        <Icon className="w-6 h-6 text-[#F0A018]" />
                      </div>
                      <span className="text-3xl font-black text-teal-800/40 group-hover:text-[#F0A018]/20 transition-colors">0{index + 1}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                    <p className="text-teal-100/80 font-light leading-relaxed flex-grow">{step.text}</p>
                  </div>
                </FadeInSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== WAAROM NUTRIVISI ===== */}
      <section id="waarom" className="py-32 bg-gradient-to-b from-[#01506E] via-[#011b26] to-[#01506E] relative overflow-hidden border-t border-teal-900/30">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[800px] h-[800px] bg-[#F0A018]/5 rounded-full blur-[180px] pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#56C0D5]/5 rounded-full blur-[180px] pointer-events-none"></div>
        {/* Decorative tech border */}
        <svg className="absolute top-10 right-10 w-40 h-40 opacity-20 pointer-events-none hidden lg:block" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="none" stroke="#F0A018" strokeWidth="0.5" strokeDasharray="2 8" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="#56C0D5" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="30" fill="none" stroke="#F0A018" strokeWidth="0.5" />
          <circle cx="100" cy="10" r="3" fill="#F0A018" />
        </svg>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-16 items-start">
            <FadeInSection>
              <SectionTitle eyebrow={t.whySection.eyebrow} title={t.whySection.title} description={t.whySection.description} />
            </FadeInSection>

            <div className="grid sm:grid-cols-2 gap-5">
              {t.whySection.items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <FadeInSection key={item.title} delay={index * 120}>
                    <div className="relative h-full p-7 rounded-[1.75rem] bg-[#023142]/50 backdrop-blur-lg border border-teal-800/40 hover:border-[#F0A018]/50 transition-all duration-500 group overflow-hidden">
                      {/* Corner notation */}
                      <div className="absolute top-4 right-4 font-mono text-[10px] text-[#F0A018]/50 tracking-widest">0{index + 1}</div>
                      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#F0A018]/0 group-hover:bg-[#F0A018]/8 rounded-full blur-2xl transition-all duration-500"></div>

                      <div className="relative">
                        <div className="w-12 h-12 rounded-xl bg-[#011a24] flex items-center justify-center border border-teal-700/40 mb-5 group-hover:border-[#F0A018]/50 group-hover:bg-[#F0A018]/10 transition-all">
                          <Icon className="w-5 h-5 text-[#F0A018]" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 leading-tight">{item.title}</h3>
                        <p className="text-teal-100/80 leading-relaxed text-sm">{item.text}</p>
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
      <section id="kennis" className="py-32 bg-[#01506E] relative overflow-hidden border-t border-teal-900/30">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-64 bg-gradient-to-b from-[#56C0D5]/5 to-transparent blur-[100px] pointer-events-none"></div>
        {/* Dots backdrop */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#F0A018 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionTitle eyebrow={t.insightsSection.eyebrow} title={t.insightsSection.title} description={t.insightsSection.description} center />

          <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.insightsSection.items.map((item, index) => {
              const Icon = item.icon;
              return (
                <FadeInSection key={item.title} delay={(index % 3) * 100}>
                  <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }} className="block h-full group interactive-card">
                    <div className="relative h-full p-8 rounded-2xl bg-[#011a24]/60 backdrop-blur-md border border-teal-800/40 hover:border-[#F0A018]/50 transition-all duration-500 overflow-hidden">
                      {/* Top bar accent */}
                      <div className="absolute top-0 left-0 h-1 w-0 bg-[#F0A018] group-hover:w-full transition-all duration-700"></div>
                      {/* Corner mono index */}
                      <div className="absolute top-4 right-4 font-mono text-[10px] text-teal-500/50 tracking-widest group-hover:text-[#F0A018]/70 transition-colors">
                        K.{String(index + 1).padStart(2, '0')}
                      </div>

                      <div className="flex items-center gap-4 mb-5">
                        <div className="w-11 h-11 rounded-xl bg-[#023142] flex items-center justify-center border border-teal-700/40 group-hover:border-[#F0A018]/60 group-hover:bg-[#F0A018]/10 transition-all">
                          <Icon className="w-5 h-5 text-[#F0A018]" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-[#F0A018] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-teal-100/75 text-sm leading-relaxed mb-6">{item.text}</p>
                      <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#F0A018]/80 group-hover:text-[#F0A018]">
                        {t.insightsSection.readMore}
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </a>
                </FadeInSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="py-32 bg-gradient-to-b from-[#01506E] to-[#001720] relative overflow-hidden border-t border-teal-900/30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] h-[600px] bg-[#F0A018]/5 rounded-full blur-[160px] pointer-events-none z-0"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(#56C0D5 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <FadeInSection delay={100} className="space-y-12">
              <SectionTitle title={t.contactSection.title} description={t.contactSection.subtitle} />
              <div className="space-y-8 pt-8 border-t border-teal-800/40">
                <a href="mailto:info@nutrivisi.be" className="flex items-center gap-6 group selectable">
                  <div className="w-14 h-14 rounded-2xl bg-[#011a24] border border-teal-800 flex items-center justify-center group-hover:border-[#F0A018]/50 group-hover:bg-[#F0A018]/10 transition-all duration-300">
                    <Mail className="w-6 h-6 text-teal-400 group-hover:text-[#F0A018] transition-colors" />
                  </div>
                  <div>
                    <p className="text-teal-500/80 text-xs font-bold uppercase tracking-widest mb-1">{t.contactSection.emailText}</p>
                    <p className="text-white text-lg font-medium">info@nutrivisi.be</p>
                  </div>
                </a>
                <a href="tel:+3216196984" className="flex items-center gap-6 group selectable">
                  <div className="w-14 h-14 rounded-2xl bg-[#011a24] border border-teal-800 flex items-center justify-center group-hover:border-[#F0A018]/50 group-hover:bg-[#F0A018]/10 transition-all duration-300">
                    <Phone className="w-6 h-6 text-teal-400 group-hover:text-[#F0A018] transition-colors" />
                  </div>
                  <div>
                    <p className="text-teal-500/80 text-xs font-bold uppercase tracking-widest mb-1">{t.contactSection.phoneText}</p>
                    <p className="text-white text-lg font-medium">+32 16 19 69 84</p>
                  </div>
                </a>
                <div className="flex items-center gap-6 group selectable">
                  <div className="w-14 h-14 rounded-2xl bg-[#011a24] border border-teal-800 flex items-center justify-center group-hover:border-[#F0A018]/50 group-hover:bg-[#F0A018]/10 transition-all duration-300">
                    <MapPin className="w-6 h-6 text-teal-400 group-hover:text-[#F0A018] transition-colors" />
                  </div>
                  <div>
                    <p className="text-teal-500/80 text-xs font-bold uppercase tracking-widest mb-1">{t.contactSection.addressText}</p>
                    <p className="text-white text-lg font-medium">Martelarenlaan 69, 3010 Leuven</p>
                  </div>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection delay={300}>
              <div className="bg-gradient-to-br from-[#023A4E]/60 to-[#011a24]/90 backdrop-blur-2xl p-10 md:p-14 rounded-[3rem] border border-teal-700/30 shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F0A018]/40 to-transparent"></div>
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#F0A018]/5 rounded-full blur-[80px] pointer-events-none"></div>

                <div className="mb-10 relative z-10">
                  <h3 className="text-3xl font-extrabold text-white mb-3 tracking-tight flex items-center gap-3">
                    {t.contactSection.formTitle}
                  </h3>
                  <p className="text-teal-100/75 text-sm leading-relaxed">{t.contactSection.formSubtitle}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="relative bg-[#011a24]/40 border border-teal-800/50 rounded-2xl focus-within:border-[#F0A018]/60 focus-within:bg-[#01506E]/60 transition-all duration-300 shadow-inner">
                    <input
                      type="text" name="name" value={formData.name} onChange={handleInputChange} required
                      className="w-full bg-transparent px-5 pt-6 pb-2 text-white focus:outline-none peer placeholder-transparent"
                      placeholder={t.contactSection.placeholders.name}
                    />
                    <label className="absolute left-5 top-4 text-teal-500/90 text-sm pointer-events-none transition-all peer-focus:-translate-y-2 peer-focus:text-[#F0A018] peer-focus:text-[10px] peer-focus:font-bold peer-focus:tracking-widest peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:text-[#F0A018] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:tracking-widest">
                      {t.contactSection.labels.name}
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative bg-[#011a24]/40 border border-teal-800/50 rounded-2xl focus-within:border-[#F0A018]/60 focus-within:bg-[#01506E]/60 transition-all duration-300 shadow-inner">
                      <input
                        type="text" name="company" value={formData.company} onChange={handleInputChange} required
                        className="w-full bg-transparent px-5 pt-6 pb-2 text-white focus:outline-none peer placeholder-transparent"
                        placeholder={t.contactSection.placeholders.company}
                      />
                      <label className="absolute left-5 top-4 text-teal-500/90 text-sm pointer-events-none transition-all peer-focus:-translate-y-2 peer-focus:text-[#F0A018] peer-focus:text-[10px] peer-focus:font-bold peer-focus:tracking-widest peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:text-[#F0A018] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:tracking-widest">
                        {t.contactSection.labels.company}
                      </label>
                    </div>
                    <div className="relative bg-[#011a24]/40 border border-teal-800/50 rounded-2xl focus-within:border-[#F0A018]/60 focus-within:bg-[#01506E]/60 transition-all duration-300 shadow-inner">
                      <input
                        type="email" name="email" value={formData.email} onChange={handleInputChange} required
                        className="w-full bg-transparent px-5 pt-6 pb-2 text-white focus:outline-none peer placeholder-transparent"
                        placeholder={t.contactSection.placeholders.email}
                      />
                      <label className="absolute left-5 top-4 text-teal-500/90 text-sm pointer-events-none transition-all peer-focus:-translate-y-2 peer-focus:text-[#F0A018] peer-focus:text-[10px] peer-focus:font-bold peer-focus:tracking-widest peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:text-[#F0A018] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:tracking-widest">
                        {t.contactSection.labels.email}
                      </label>
                    </div>
                  </div>

                  <div className="relative bg-[#011a24]/40 border border-teal-800/50 rounded-2xl focus-within:border-[#F0A018]/60 focus-within:bg-[#01506E]/60 transition-all duration-300 shadow-inner">
                    <textarea
                      name="message" value={formData.message} onChange={handleInputChange} rows="4" required
                      className="w-full bg-transparent px-5 pt-7 pb-3 text-white focus:outline-none peer placeholder-transparent resize-none"
                      placeholder={t.contactSection.placeholders.message}
                    ></textarea>
                    <label className="absolute left-5 top-4 text-teal-500/90 text-sm pointer-events-none transition-all peer-focus:-translate-y-2 peer-focus:text-[#F0A018] peer-focus:text-[10px] peer-focus:font-bold peer-focus:tracking-widest peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:text-[#F0A018] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:tracking-widest">
                      {t.contactSection.labels.message}
                    </label>
                  </div>

                  <button type="submit" className="w-full bg-gradient-to-r from-[#F0A018] to-[#FFC35C] hover:from-[#FFC35C] hover:to-[#F0A018] text-[#012330] px-8 py-5 rounded-2xl text-lg font-bold transition-all duration-300 shadow-[0_4px_20px_rgba(240,160,24,0.25)] hover:shadow-[0_8px_30px_rgba(240,160,24,0.4)] flex items-center justify-center gap-3 mt-8 group interactive-card">
                    <span>{t.contactSection.submit}</span>
                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </form>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#001720] py-14 relative overflow-hidden border-t border-teal-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
            <div className="flex items-center gap-4 interactive-card cursor-pointer" onClick={() => scrollToSection('home')}>
              <NutriLogo className="w-9 h-9 text-[#F0A018]" cutoutColor="#001720" />
              <div>
                <span className="block font-bold text-xl text-white tracking-tight">Nutrivisi</span>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-teal-400">{t.nav.tag}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-bold uppercase tracking-widest">
              <a href="#waarom" onClick={(e) => { e.preventDefault(); scrollToSection('waarom'); }} className="text-teal-300/70 hover:text-[#F0A018] transition-colors">{t.nav.why}</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-teal-300/70 hover:text-[#F0A018] transition-colors">{t.footer.privacy}</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-teal-300/70 hover:text-[#F0A018] transition-colors">{t.footer.cookies}</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-teal-300/70 hover:text-[#F0A018] transition-colors">{t.footer.legal}</a>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-teal-900/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-teal-500/70 text-xs font-medium uppercase tracking-widest text-center md:text-left">
              © {new Date().getFullYear()} Nutrivisi · {t.footer.tagline}
            </p>
            <p className="text-teal-500/50 text-[10px] font-mono tracking-widest">
              LEUVEN · BELGIUM
            </p>
          </div>
        </div>
      </footer>

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
        @keyframes labelScan { 0%, 100% { transform: translateY(-80px); opacity: 0; } 10% { opacity: 0.8; } 50% { opacity: 0.8; } 90% { opacity: 0; } }

        .animate-breathe { animation: breathe 6s ease-in-out infinite; }
        .animate-drift-slow { animation: drift-slow 12s ease-in-out infinite; }
        .animate-float-stream { animation: float-stream linear infinite; }
        .animate-gradient { animation: gradient 6s ease infinite; }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
