import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Users,
  Award,
  ShieldAlert,
  Tag,
  Wheat,
  Beef,
  UtensilsCrossed,
  Store,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Lightbulb,
  ClipboardCheck,
  Activity,
  Send,
  Eye
} from 'lucide-react';

// --- 1. Programmatisch SVG Logo ---
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

// --- 2. Interactieve Mechanieken & Esthetiek ---
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updatePosition = (e) => setPosition({ x: e.clientX, y: e.clientY });
    const handleMouseOver = (e) => {
      if (e.target.closest('button, a, input, textarea, .interactive-card, h3, p, span')) setIsHovering(true);
      else setIsHovering(false);
    };
    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <div 
        className="fixed top-0 left-0 w-10 h-10 border border-[#F5A623]/40 rounded-full pointer-events-none z-[9999] transition-all duration-300 ease-out flex items-center justify-center mix-blend-screen hidden sm:flex"
        style={{ transform: `translate(${position.x - 20}px, ${position.y - 20}px) scale(${isHovering ? 1.5 : 1})`, backgroundColor: isHovering ? 'rgba(245,166,35,0.08)' : 'transparent', boxShadow: isHovering ? '0 0 15px rgba(245,166,35,0.15)' : 'none' }}
      />
      <div 
        className="fixed top-0 left-0 w-2 h-2 bg-[#F5A623] rounded-full pointer-events-none z-[10000] transition-transform duration-75 ease-linear hidden sm:block shadow-[0_0_8px_#F5A623]"
        style={{ transform: `translate(${position.x - 4}px, ${position.y - 4}px)` }}
      />
    </>
  );
};

const FadeInSection = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setVisible(true); });
    }, { threshold: 0.1 }); 
    if (domRef.current) observer.observe(domRef.current);
    return () => { if (domRef.current) observer.unobserve(domRef.current); };
  }, []);

  return (
    <div ref={domRef} className={`transition-all duration-1000 ease-out ${className} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

const ScrollRevealText = ({ children, className = "" }) => {
  const [opacity, setOpacity] = useState(0);
  const textRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      if (!textRef.current) return;
      const rect = textRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const center = windowHeight / 2;
      const distanceFromCenter = Math.abs(rect.top + rect.height / 2 - center);
      const newOpacity = Math.max(0, 1 - distanceFromCenter / 350);
      setOpacity(newOpacity);
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

const ParticleField = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
    {[...Array(30)].map((_, i) => (
      <div 
        key={i}
        className="absolute w-[1px] h-[30px] bg-gradient-to-t from-transparent via-[#F5A623] to-transparent opacity-10 animate-float-stream"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDuration: `${15 + Math.random() * 20}s`,
          animationDelay: `${Math.random() * 5}s`
        }}
      />
    ))}
  </div>
);

const HeroKineticCompass = ({ rotation }) => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0 opacity-[0.18]">
    <svg viewBox="0 0 1000 1000" className="w-[150vw] h-[150vw] max-w-[1200px] max-h-[1200px] transition-transform duration-500 ease-out" style={{ transform: `rotate(${rotation * 0.3}deg)` }}>
      <circle cx="500" cy="500" r="480" fill="none" stroke="#ffffff" strokeWidth="1" strokeDasharray="4 12" />
      <circle cx="500" cy="500" r="420" fill="none" stroke="#4BB8D4" strokeWidth="0.5" opacity="0.6" />
      <g style={{ transformOrigin: '500px 500px', transform: `rotate(${-rotation * 0.6}deg)` }}>
        <circle cx="500" cy="500" r="320" fill="none" stroke="#F5A623" strokeWidth="1" strokeDasharray="1 8" />
        <circle cx="500" cy="500" r="280" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
        <line x1="180" y1="500" x2="820" y2="500" stroke="#F5A623" strokeWidth="0.8" opacity="0.5" />
        <line x1="500" y1="180" x2="500" y2="820" stroke="#F5A623" strokeWidth="0.8" opacity="0.5" />
      </g>
      <line x1="0" y1="500" x2="1000" y2="500" stroke="#ffffff" strokeWidth="0.8" opacity="0.5" />
      <line x1="500" y1="0" x2="500" y2="1000" stroke="#ffffff" strokeWidth="0.8" opacity="0.5" />
      <line x1="146" y1="146" x2="854" y2="854" stroke="#4BB8D4" strokeWidth="0.8" opacity="0.5" />
      <line x1="146" y1="854" x2="854" y2="146" stroke="#4BB8D4" strokeWidth="0.8" opacity="0.5" />
      <circle cx="500" cy="20" r="5" fill="#F5A623" />
      <circle cx="500" cy="980" r="5" fill="#F5A623" />
      <circle cx="20" cy="500" r="5" fill="#4BB8D4" />
      <circle cx="980" cy="500" r="5" fill="#4BB8D4" />
    </svg>
  </div>
);

const ClarityLensBackground = ({ rotation }) => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
    <div className="relative w-[800px] h-[800px] flex items-center justify-center transition-transform duration-500 ease-out">
      <div className="absolute inset-0 border border-[#F5A623]/40 rounded-full" style={{ transform: `rotate(${rotation * 0.5}deg)` }}></div>
      <div className="absolute inset-[15%] border border-[#F5A623]/50 rounded-full" style={{ transform: `rotate(${-rotation * 0.8}deg)` }}></div>
      <div className="absolute inset-[30%] border border-[#F5A623]/40 rounded-full animate-[pulse_10s_ease-in-out_infinite]" style={{ transform: `rotate(${rotation * 1.2}deg)` }}></div>
      <div className="absolute h-[1px] w-[200%] bg-gradient-to-r from-transparent via-[#F5A623]/50 to-transparent" style={{ transform: `rotate(${35 + rotation * 0.3}deg)` }}></div>
      <div className="absolute h-[1px] w-[200%] bg-gradient-to-r from-transparent via-[#4BB8D4]/40 to-transparent" style={{ transform: `rotate(${-15 - rotation * 0.4}deg)` }}></div>
      <div className="absolute h-[2px] w-32 bg-gradient-to-r from-transparent via-[#F5A623]/60 to-transparent"></div>
      <div className="absolute w-[2px] h-32 bg-gradient-to-b from-transparent via-[#F5A623]/60 to-transparent"></div>
    </div>
  </div>
);

const PrecisionScanner = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <svg viewBox="0 0 400 400" className="w-full h-full max-w-[300px] opacity-70">
      <defs>
        <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#4BB8D4" strokeWidth="0.5" opacity="0.2"/>
        </pattern>
      </defs>
      <rect width="400" height="400" fill="url(#smallGrid)" />
      <circle cx="200" cy="200" r="180" fill="none" stroke="#4BB8D4" strokeWidth="1" strokeDasharray="4 12" className="animate-[spin_40s_linear_infinite]" />
      <circle cx="200" cy="200" r="140" fill="none" stroke="#F5A623" strokeWidth="0.5" opacity="0.5" />
      <circle cx="200" cy="200" r="90" fill="none" stroke="#4BB8D4" strokeWidth="2" strokeDasharray="20 40" className="animate-[spin_10s_linear_infinite_reverse]" />
      <circle cx="200" cy="200" r="50" fill="none" stroke="#F5A623" strokeWidth="1" />
      <circle cx="200" cy="200" r="15" fill="#F5A623" className="animate-pulse shadow-[0_0_20px_#F5A623]" />
      <g className="animate-[spin_4s_linear_infinite]" style={{ transformOrigin: '200px 200px' }}>
        <path d="M 200 200 L 200 20" stroke="url(#sweepGradient)" strokeWidth="4" opacity="0.8" />
        <path d="M 200 200 A 180 180 0 0 1 380 200 L 200 200 Z" fill="url(#radarGlow)" opacity="0.15" />
      </g>
      <defs>
        <linearGradient id="sweepGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F5A623" stopOpacity="1" />
          <stop offset="100%" stopColor="#F5A623" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4BB8D4" stopOpacity="1" />
          <stop offset="100%" stopColor="#4BB8D4" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  </div>
);

// --- 3. Gebruikers Data ---
const services = [
  {
    id: 'expertadvies',
    title: 'Expertadvies',
    icon: Lightbulb,
    description: 'Gericht advies over voedselveiligheid, kwaliteitssystemen en wettelijke vereisten, afgestemd op uw sector en uw concrete situatie.',
    bullets: ['Praktisch en sectorspecifiek', 'Heldere prioriteiten', 'Snel inzetbaar'],
  },
  {
    id: 'coaching',
    title: 'Coaching en training',
    icon: Users,
    description: 'Wij maken voedselveiligheid begrijpelijk voor management en medewerkers, met visuele hulpmiddelen die op de werkvloer blijven hangen.',
    bullets: ['Food Safety Culture', 'Visuele instructies', 'Draagvlak in het team'],
  },
  {
    id: 'certificatie',
    title: 'Certificatiebegeleiding',
    icon: Award,
    description: 'Begeleiding bij de opbouw, verbetering en borging van kwaliteitssystemen, tot en met auditvoorbereiding en certificatie.',
    bullets: ['Autocontrolegidsen', 'GFSI-trajecten', 'Auditvoorbereiding'],
  },
  {
    id: 'risico',
    title: 'Risicobeheersing',
    icon: ShieldAlert,
    description: 'Ondersteuning bij risicoanalyse, voedselverdediging, voedselfraude, incidenten en corrigerende acties.',
    bullets: ['Preventie en opvolging', 'Interne en externe risico’s', 'Concreet actieplan'],
  },
  {
    id: 'etikettering',
    title: 'Etikettering en specificaties',
    icon: Tag,
    description: 'Opmaak en controle van productlabels en productspecificaties volgens Belgische en Europese wetgeving.',
    bullets: ['Wettelijke controle', 'Vertaling en lay-out', 'Minder risico op fouten'],
  },
];

const sectors = [
  { title: 'Bakkerij', icon: Wheat },
  { title: 'Vleessector', icon: Beef },
  { title: 'Horeca', icon: UtensilsCrossed },
  { title: 'Retail', icon: Store },
];

const methodSteps = [
  {
    title: 'Analyse',
    text: 'We bekijken uw huidige werking, risico’s, documentatie en doelstellingen.',
    icon: ClipboardCheck,
  },
  {
    title: 'Vertaling naar actie',
    text: 'We zetten complexe regelgeving om in duidelijke instructies, tools en prioriteiten.',
    icon: Lightbulb,
  },
  {
    title: 'Begeleiding en borging',
    text: 'We ondersteunen uw team tot de aanpak werkt in de praktijk en auditklaar is.',
    icon: ShieldCheck,
  },
];

const trustPoints = [
  'Praktische begeleiding voor voedingsbedrijven',
  'Visuele tools die medewerkers echt begrijpen',
  'Ondersteuning bij audits, labels en kwaliteitssystemen',
  'Sectorfocus: bakkerij, vlees, horeca en retail',
];

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Diensten', href: '#diensten' },
  { label: 'Werkwijze', href: '#werkwijze' },
  { label: 'Contact', href: '#contact' },
];

function SectionTitle({ eyebrow, title, description, center = false }) {
  return (
    <div className={`mb-16 ${center ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}`}>
      {eyebrow && (
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-sm bg-[#F5A623]/10 text-[#F5A623] text-xs font-bold uppercase tracking-[0.2em] mb-6 border border-[#F5A623]/20`}>
          {eyebrow}
        </div>
      )}
      <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
        {title.split(' ').map((word, i, arr) => 
          i === arr.length - 1 || i === arr.length - 2 ? <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5A623] to-[#FFC35C]">{word} </span> : <span key={i}>{word} </span>
        )}
      </h2>
      {description && (
        <ScrollRevealText className="text-xl md:text-2xl text-teal-400 font-bold leading-relaxed">
          {description}
        </ScrollRevealText>
      )}
    </div>
  );
}

// --- 4. Main App Component ---
export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollRotation, setScrollRotation] = useState(0);
  const [activeServiceId, setActiveServiceId] = useState(services[0].id);
  const [formData, setFormData] = useState({ name: '', company: '', email: '', message: '' });

  const activeService = useMemo(
    () => services.find((service) => service.id === activeServiceId) ?? services[0],
    [activeServiceId]
  );
  const ActiveServiceIcon = activeService.icon;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setScrollRotation(window.scrollY * 0.15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const subject = encodeURIComponent(`Aanvraag via website - ${formData.company || 'Nutrivisi'}`);
    const body = encodeURIComponent(`Naam: ${formData.name}\nBedrijf: ${formData.company}\nE-mail: ${formData.email}\n\nVraag:\n${formData.message}`);
    window.location.href = `mailto:info@nutrivisi.be?subject=${subject}&body=${body}`;
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#012330] font-sans text-slate-200 overflow-x-hidden">
      <CustomCursor />

      {/* --- Navigatie --- */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#023142]/95 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.3)] py-2 border-b border-[#F5A623]/10' : 'bg-transparent py-6'}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#home" className="flex items-center gap-3 group interactive-card" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>
            <NutriLogo className="h-12 w-12 text-[#F5A623]" cutoutColor={scrolled ? "#023142" : "#023A4E"} />
            <div>
              <p className="font-bold text-2xl tracking-tight text-white group-hover:text-[#F5A623] transition-colors">Nutrivisi</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-teal-400">Voedselveiligheid helder gemaakt</p>
            </div>
          </a>

          <div className="hidden items-center space-x-10 md:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={(e) => { e.preventDefault(); scrollToSection(item.href.replace('#', '')); }} className="relative text-sm font-bold tracking-wider text-teal-100/80 hover:text-[#F5A623] transition-colors group py-2 uppercase interactive-card">
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F5A623] transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }} className="inline-flex items-center gap-2 rounded-full bg-[#F5A623] px-6 py-2.5 text-sm font-bold uppercase tracking-widest text-[#012330] transition hover:bg-[#FFC35C] hover:shadow-[0_0_15px_rgba(245,166,35,0.4)] interactive-card">
              Contact
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-teal-800/50 bg-[#011a24] text-white transition hover:border-[#F5A623]/40 hover:text-[#F5A623] md:hidden">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="absolute top-full left-0 w-full border-t border-teal-800/50 bg-[#011a24] p-4 md:hidden backdrop-blur-xl">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} onClick={(e) => { e.preventDefault(); setMobileOpen(false); scrollToSection(item.href.replace('#', '')); }} className="rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wider text-slate-200 transition hover:bg-[#023142] hover:text-[#F5A623]">
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* --- Hero Sectie --- */}
      <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#023A4E]">
        
        <HeroKineticCompass rotation={scrollRotation} />
        <ParticleField />
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[1400px] pointer-events-none z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#F5A623] rounded-full blur-[140px] opacity-[0.15] animate-breathe"></div>
          <div className="absolute top-[40%] left-[30%] w-[600px] h-[600px] bg-[#4BB8D4] rounded-full blur-[180px] opacity-[0.1] animate-drift-slow"></div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 relative z-20">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-16 items-center">
            
            {/* Left Side */}
            <div>
              <FadeInSection delay={200}>
                <h1 className="max-w-4xl text-6xl font-extrabold leading-[1.05] tracking-tighter text-white sm:text-7xl lg:text-8xl">
                  Veiligheid zonder <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5A623] via-[#FFD07A] to-[#F5A623] bg-[length:200%_auto] animate-gradient">
                    complexiteit.
                  </span>
                </h1>
              </FadeInSection>
              
              <FadeInSection delay={300}>
                <p className="mt-8 max-w-2xl text-xl leading-relaxed text-teal-100/80">
                  Nutrivisi vertaalt complexe wetgeving naar heldere visuele acties, zodat uw team begrijpt wat nodig is en sneller auditklaar werkt.
                </p>
              </FadeInSection>

              <FadeInSection delay={400}>
                <div className="mt-10 flex flex-col sm:flex-row gap-5">
                  <button onClick={() => scrollToSection('diensten')} className="inline-flex items-center justify-center gap-3 rounded-full bg-[#F5A623] px-8 py-4 text-lg font-bold text-[#012330] transition-all hover:bg-[#FFC35C] hover:shadow-[0_4px_20px_rgba(245,166,35,0.3)] interactive-card group">
                    Bekijk diensten
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button onClick={() => scrollToSection('contact')} className="inline-flex items-center justify-center rounded-full border border-[#F5A623]/30 bg-[#011a24]/50 px-8 py-4 text-lg font-bold text-white transition-all hover:border-[#F5A623] hover:bg-[#F5A623]/10 interactive-card">
                    Bespreek uw vraag
                  </button>
                </div>
              </FadeInSection>

              <FadeInSection delay={500}>
                <div className="mt-16 grid gap-4 sm:grid-cols-2">
                  {trustPoints.map((point) => (
                    <div key={point} className="flex items-start gap-3 rounded-2xl border border-teal-800/40 bg-[#011a24]/60 p-4 backdrop-blur-sm group hover:border-[#F5A623]/30 transition-colors">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#F5A623] group-hover:scale-110 transition-transform" />
                      <p className="text-sm leading-6 text-teal-100/70">{point}</p>
                    </div>
                  ))}
                </div>
              </FadeInSection>
            </div>

            {/* Right Side: Onze Focus Card */}
            <FadeInSection delay={400} className="relative hidden lg:block">
              <div className="absolute inset-0 bg-[#F5A623]/5 rounded-[3rem] blur-2xl"></div>
              <div className="relative overflow-hidden rounded-[3rem] border border-teal-800/50 bg-[#023142]/40 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.4)]">
                <div className="border-b border-teal-800/40 bg-[#011a24]/80 px-8 py-6 flex items-center justify-between">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F5A623]">Onze focus</p>
                  <Activity className="w-5 h-5 text-teal-500 animate-pulse" />
                </div>
                
                <div className="space-y-6 p-8">
                  <div className="rounded-3xl bg-[#012330]/80 border border-teal-800/30 p-6 group hover:border-[#F5A623]/40 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="rounded-xl bg-[#F5A623]/10 p-3">
                        <ShieldCheck className="h-8 w-8 text-[#F5A623]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">Van wet naar werkvloer</h3>
                        <p className="mt-1 text-sm text-teal-100/60 leading-relaxed">Geen abstracte theorie, maar duidelijke richtlijnen en visuele hulpmiddelen.</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-3xl border border-teal-800/30 bg-[#011a24]/50 p-5 group hover:border-teal-500/40 transition-colors">
                      <Award className="h-6 w-6 text-teal-400 mb-3" />
                      <p className="text-sm font-bold text-white mb-1">Auditvoorbereiding</p>
                      <p className="text-xs text-teal-100/50 leading-relaxed">Richting een beter systeem en rustiger audittraject.</p>
                    </div>
                    <div className="rounded-3xl border border-teal-800/30 bg-[#011a24]/50 p-5 group hover:border-teal-500/40 transition-colors">
                      <Eye className="h-6 w-6 text-teal-400 mb-3" />
                      <p className="text-sm font-bold text-white mb-1">Visuele tools</p>
                      <p className="text-xs text-teal-100/50 leading-relaxed">Begrijpelijk en beter te onthouden voor medewerkers.</p>
                    </div>
                    <div className="rounded-3xl border border-teal-800/30 bg-[#011a24]/50 p-5 group hover:border-teal-500/40 transition-colors">
                      <Tag className="h-6 w-6 text-teal-400 mb-3" />
                      <p className="text-sm font-bold text-white mb-1">Etikettering</p>
                      <p className="text-xs text-teal-100/50 leading-relaxed">Controle van labels volgens de geldende wetgeving.</p>
                    </div>
                    <div className="rounded-3xl border border-teal-800/30 bg-[#011a24]/50 p-5 group hover:border-teal-500/40 transition-colors">
                      <Store className="h-6 w-6 text-teal-400 mb-3" />
                      <p className="text-sm font-bold text-white mb-1">Sectorgericht</p>
                      <p className="text-xs text-teal-100/50 leading-relaxed">Ervaring in bakkerij, vlees, horeca en retail.</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInSection>

          </div>
        </div>
      </section>

      {/* --- Sectoren Bridge --- */}
      <section className="bg-gradient-to-b from-[#023A4E] via-[#012a38] to-[#012330] pt-12 pb-32 relative overflow-visible">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-64 bg-gradient-to-t from-[#F5A623]/5 to-transparent blur-[100px] pointer-events-none z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="flex items-center justify-center mb-20">
            <p className="text-center text-xs font-bold text-teal-400 uppercase tracking-[0.3em]">Verankerde expertise in uw sector</p>
          </div>
          
          <div className="relative py-10">
            {/* Intertwined Aesthetic Wave Animation */}
            <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 h-32 pointer-events-none hidden md:block z-0">
              <svg className="w-full h-full opacity-60" viewBox="0 0 1000 100" preserveAspectRatio="none">
                {/* Wave 1: Teal */}
                <path d="M0,50 C125,150 125,-50 250,50 C375,150 375,-50 500,50 C625,150 625,-50 750,50 C875,150 875,-50 1000,50" fill="none" stroke="#4BB8D4" strokeWidth="1" strokeOpacity="0.2" />
                <path d="M0,50 C125,150 125,-50 250,50 C375,150 375,-50 500,50 C625,150 625,-50 750,50 C875,150 875,-50 1000,50" fill="none" stroke="#4BB8D4" strokeWidth="2" strokeOpacity="0.8" strokeDasharray="40 1000" style={{ animation: 'flowLight 8s linear infinite' }} />
                
                {/* Wave 2: Gold */}
                <path d="M0,50 C125,-50 125,150 250,50 C375,-50 375,150 500,50 C625,-50 625,150 750,50 C875,-50 875,150 1000,50" fill="none" stroke="#F5A623" strokeWidth="1" strokeOpacity="0.2" />
                <path d="M0,50 C125,-50 125,150 250,50 C375,-50 375,150 500,50 C625,-50 625,150 750,50 C875,-50 875,150 1000,50" fill="none" stroke="#F5A623" strokeWidth="2" strokeOpacity="0.8" strokeDasharray="60 1000" style={{ animation: 'flowLight 6s linear infinite reverse' }} />
              </svg>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 md:gap-24 relative z-10 w-full">
              {sectors.map((sector, index) => {
                const Icon = sector.icon;
                return (
                  <FadeInSection key={index} delay={index * 100}>
                    <div className="flex flex-col items-center gap-4 text-teal-200/60 font-medium hover:text-[#F5A623] transition-all duration-500 group interactive-card">
                      <div className="relative p-2">
                        <div className="absolute inset-0 border border-[#F5A623]/0 rounded-full group-hover:border-[#F5A623]/30 group-hover:animate-[spin_4s_linear_infinite] transition-all duration-700"></div>
                        <div className="p-5 rounded-full bg-[#011a24]/80 backdrop-blur-md border border-teal-700/40 group-hover:bg-[#F5A623]/10 group-hover:border-[#F5A623]/50 transition-all duration-500 shadow-lg group-hover:shadow-[0_0_30px_rgba(245,166,35,0.25)] relative z-10">
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

      {/* --- Diensten HUD --- */}
      <section id="diensten" className="py-32 bg-[#012330] relative overflow-hidden border-t border-teal-900/30">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionTitle 
            eyebrow="Diensten" 
            title="Gerichte ondersteuning voor voedselveiligheid"
            center
          />
          
          <div className="mt-20 grid lg:grid-cols-12 gap-0 border border-teal-800/40 rounded-[2.5rem] bg-[#023142]/40 backdrop-blur-2xl shadow-2xl overflow-hidden relative">
            
            {/* Left Menu */}
            <div className="lg:col-span-4 border-r border-teal-800/40 bg-[#012330]/80 relative z-20">
              <div className="flex flex-col h-full max-h-[700px] overflow-y-auto no-scrollbar py-6">
                {services.map((service) => {
                  const isActive = activeService.id === service.id;
                  return (
                    <button key={service.id} onClick={() => setActiveServiceId(service.id)}
                      className={`w-full text-left p-6 md:p-8 flex items-center gap-5 transition-all duration-500 interactive-card relative overflow-hidden group ${isActive ? 'bg-[#034259]/60 text-white' : 'bg-transparent text-teal-100/50 hover:bg-[#034259]/20 hover:text-white'}`}>
                      
                      {/* Active Indicator Line */}
                      {isActive && (
                        <div className="absolute left-0 top-0 w-1 h-full bg-[#F5A623] shadow-[0_0_15px_#F5A623]"></div>
                      )}

                      <div className="relative flex items-center justify-center w-6 h-6 shrink-0">
                        <div className={`absolute w-2 h-2 rounded-full transition-all duration-500 ${isActive ? 'bg-[#F5A623] scale-100 shadow-[0_0_10px_#F5A623]' : 'bg-teal-700 group-hover:bg-teal-500 scale-75'}`}></div>
                        {isActive && <div className="absolute w-full h-full border border-[#F5A623] rounded-full animate-ping opacity-50"></div>}
                      </div>
                      
                      <span className={`font-bold text-lg tracking-wide transition-transform duration-300 ${isActive ? 'translate-x-1' : ''}`}>{service.title}</span>
                      {isActive && <ChevronRight className="ml-auto w-5 h-5 text-[#F5A623]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Display */}
            <div className="lg:col-span-8 relative bg-gradient-to-br from-[#023A4E]/30 to-[#012330]/90 p-12 lg:p-20 flex items-center min-h-[700px] overflow-hidden">
              
              {/* Enhanced Tech Visuals for the Right Panel */}
              <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                 <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#F5A623]/20 to-transparent rounded-full blur-[100px] animate-pulse" style={{animationDuration: '6s'}}></div>
                 <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#4BB8D4]/20 to-transparent rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s', animationDuration: '8s' }}></div>
              </div>
              
              {/* Scanning light beam effect */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-20">
                <div className="w-[200%] h-[1px] bg-gradient-to-r from-transparent via-[#F5A623] to-transparent absolute top-1/2 left-[-50%] animate-[shuttle_6s_ease-in-out_infinite] shadow-[0_0_15px_#F5A623]"></div>
              </div>
              
              <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center" key={activeService.id}>
                <div>
                  <div className="w-16 h-16 bg-[#012330] text-[#F5A623] rounded-2xl flex items-center justify-center mb-8 border border-[#F5A623]/30 shadow-[0_0_30px_rgba(245,166,35,0.15)] animate-[blockReveal_0.5s_ease-out]">
                    <ActiveServiceIcon className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight animate-[blockReveal_0.6s_ease-out]">
                    {activeService.title}
                  </h3>
                  
                  <p className="text-teal-100/70 text-lg font-light leading-relaxed mb-8 animate-[blockReveal_0.7s_ease-out]">
                    {activeService.description}
                  </p>
                  
                  {/* Bullets */}
                  <div className="space-y-3 mb-10 animate-[blockReveal_0.8s_ease-out]">
                    {activeService.bullets.map(bullet => (
                      <div key={bullet} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#F5A623]" />
                        <span className="text-white font-medium">{bullet}</span>
                      </div>
                    ))}
                  </div>

                  <button onClick={() => scrollToSection('contact')} className="inline-flex items-center gap-3 text-[#F5A623] font-bold text-sm uppercase tracking-[0.15em] hover:text-[#FFC35C] transition-colors group interactive-card border-b border-[#F5A623]/30 pb-2 hover:border-[#F5A623] animate-[blockReveal_0.9s_ease-out]">
                    <span>Bespreek deze dienst</span><ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
                
                {/* Right side animated visual */}
                <div className="relative h-[400px] w-full items-center justify-center hidden md:flex pointer-events-none animate-[blockReveal_1s_ease-out]">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#4BB8D4] rounded-full blur-[120px] opacity-10"></div>
                  <PrecisionScanner />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- Werkwijze / Clarity Sectie --- */}
      <section id="werkwijze" className="py-32 bg-[#012330] relative overflow-hidden border-t border-teal-900/30">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-[#F5A623]/10 to-transparent blur-[160px] pointer-events-none z-0"></div>
        <ClarityLensBackground rotation={scrollRotation} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionTitle 
            eyebrow="Werkwijze" 
            title="Een duidelijke methode, van analyse tot borging"
            center
          />

          <div className="mt-20 grid md:grid-cols-3 gap-8">
            {methodSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <FadeInSection key={step.title} delay={index * 150} className="group h-full">
                  <div className="h-full p-10 rounded-[2.5rem] bg-[#023142]/40 backdrop-blur-md border border-teal-800/40 hover:border-[#F5A623]/40 transition-all duration-500 flex flex-col relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-[#F5A623]/5 rounded-full blur-2xl group-hover:bg-[#F5A623]/10 transition-all"></div>
                    
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-14 h-14 rounded-2xl bg-[#011a24] flex items-center justify-center border border-teal-800/50 group-hover:scale-110 group-hover:border-[#F5A623]/50 transition-all">
                        <Icon className="w-6 h-6 text-[#F5A623]" />
                      </div>
                      <span className="text-3xl font-black text-teal-800/40 group-hover:text-[#F5A623]/20 transition-colors">0{index + 1}</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                    <p className="text-teal-100/70 font-light leading-relaxed flex-grow">
                      {step.text}
                    </p>
                  </div>
                </FadeInSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- Contact Sectie --- */}
      <section id="contact" className="py-32 bg-gradient-to-b from-[#012330] to-[#001720] relative overflow-hidden border-t border-teal-900/30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] h-[600px] bg-[#F5A623]/5 rounded-full blur-[160px] pointer-events-none z-0"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(#4BB8D4 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            
            <FadeInSection delay={100} className="space-y-12">
              <div>
                <SectionTitle 
                  title="Klaar voor een heldere aanpak?"
                  description="Start vandaag."
                />
              </div>

              <div className="space-y-8 pt-8 border-t border-teal-800/40">
                <div className="flex items-center gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-[#011a24] border border-teal-800 flex items-center justify-center group-hover:border-[#F5A623]/50 group-hover:bg-[#F5A623]/10 transition-all duration-300">
                    <Mail className="w-6 h-6 text-teal-500 group-hover:text-[#F5A623] transition-colors" />
                  </div>
                  <div>
                    <p className="text-teal-600/80 text-xs font-bold uppercase tracking-widest mb-1">E-mail</p>
                    <p className="text-white text-lg font-medium">info@nutrivisi.be</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-[#011a24] border border-teal-800 flex items-center justify-center group-hover:border-[#F5A623]/50 group-hover:bg-[#F5A623]/10 transition-all duration-300">
                    <Phone className="w-6 h-6 text-teal-500 group-hover:text-[#F5A623] transition-colors" />
                  </div>
                  <div>
                    <p className="text-teal-600/80 text-xs font-bold uppercase tracking-widest mb-1">Telefoon</p>
                    <p className="text-white text-lg font-medium">+32 16 19 69 84</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-[#011a24] border border-teal-800 flex items-center justify-center group-hover:border-[#F5A623]/50 group-hover:bg-[#F5A623]/10 transition-all duration-300">
                    <MapPin className="w-6 h-6 text-teal-500 group-hover:text-[#F5A623] transition-colors" />
                  </div>
                  <div>
                    <p className="text-teal-600/80 text-xs font-bold uppercase tracking-widest mb-1">Adres</p>
                    <p className="text-white text-lg font-medium">Martelarenlaan 69, 3010 Leuven</p>
                  </div>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection delay={300}>
              <div className="bg-gradient-to-br from-[#023A4E]/60 to-[#011a24]/90 backdrop-blur-2xl p-10 md:p-14 rounded-[3rem] border border-teal-700/30 shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative overflow-hidden group/form">
                
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F5A623]/40 to-transparent"></div>
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#F5A623]/5 rounded-full blur-[80px] pointer-events-none"></div>

                <div className="mb-10 relative z-10">
                  <h3 className="text-3xl font-extrabold text-white mb-3 tracking-tight flex items-center gap-3">
                    Neem contact op
                  </h3>
                  <p className="text-teal-100/60 text-sm leading-relaxed">
                    Laat uw gegevens achter. Dan kan Nutrivisi snel en gericht reageren.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="relative bg-[#011a24]/40 border border-teal-800/50 rounded-2xl focus-within:border-[#F5A623]/60 focus-within:bg-[#012330]/60 transition-all duration-300 shadow-inner">
                    <input 
                      type="text" name="name" value={formData.name} onChange={handleInputChange} required
                      className="w-full bg-transparent px-5 pt-6 pb-2 text-white focus:outline-none peer placeholder-transparent"
                      placeholder="Uw naam"
                    />
                    <label className="absolute left-5 top-4 text-teal-600/80 text-sm pointer-events-none transition-all peer-focus:-translate-y-2 peer-focus:text-[#F5A623] peer-focus:text-[10px] peer-focus:font-bold peer-focus:tracking-widest peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:text-[#F5A623] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:tracking-widest">
                      Naam
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative bg-[#011a24]/40 border border-teal-800/50 rounded-2xl focus-within:border-[#F5A623]/60 focus-within:bg-[#012330]/60 transition-all duration-300 shadow-inner">
                      <input 
                        type="text" name="company" value={formData.company} onChange={handleInputChange} required
                        className="w-full bg-transparent px-5 pt-6 pb-2 text-white focus:outline-none peer placeholder-transparent"
                        placeholder="Bedrijf"
                      />
                      <label className="absolute left-5 top-4 text-teal-600/80 text-sm pointer-events-none transition-all peer-focus:-translate-y-2 peer-focus:text-[#F5A623] peer-focus:text-[10px] peer-focus:font-bold peer-focus:tracking-widest peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:text-[#F5A623] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:tracking-widest">
                        Bedrijfsnaam
                      </label>
                    </div>

                    <div className="relative bg-[#011a24]/40 border border-teal-800/50 rounded-2xl focus-within:border-[#F5A623]/60 focus-within:bg-[#012330]/60 transition-all duration-300 shadow-inner">
                      <input 
                        type="email" name="email" value={formData.email} onChange={handleInputChange} required
                        className="w-full bg-transparent px-5 pt-6 pb-2 text-white focus:outline-none peer placeholder-transparent"
                        placeholder="Email"
                      />
                      <label className="absolute left-5 top-4 text-teal-600/80 text-sm pointer-events-none transition-all peer-focus:-translate-y-2 peer-focus:text-[#F5A623] peer-focus:text-[10px] peer-focus:font-bold peer-focus:tracking-widest peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:text-[#F5A623] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:tracking-widest">
                        E-mailadres
                      </label>
                    </div>
                  </div>

                  <div className="relative bg-[#011a24]/40 border border-teal-800/50 rounded-2xl focus-within:border-[#F5A623]/60 focus-within:bg-[#012330]/60 transition-all duration-300 shadow-inner">
                    <textarea 
                      name="message" value={formData.message} onChange={handleInputChange} rows="4" required
                      className="w-full bg-transparent px-5 pt-7 pb-3 text-white focus:outline-none peer placeholder-transparent resize-none"
                      placeholder="Omschrijf kort uw vraag, audit, labeltraject of uitdaging."
                    ></textarea>
                    <label className="absolute left-5 top-4 text-teal-600/80 text-sm pointer-events-none transition-all peer-focus:-translate-y-2 peer-focus:text-[#F5A623] peer-focus:text-[10px] peer-focus:font-bold peer-focus:tracking-widest peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:text-[#F5A623] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:tracking-widest">
                      Vraag of project
                    </label>
                  </div>

                  <button type="submit" className="w-full bg-gradient-to-r from-[#F5A623] to-[#FFC35C] hover:from-[#FFC35C] hover:to-[#F5A623] text-[#012330] px-8 py-5 rounded-2xl text-lg font-bold transition-all duration-300 shadow-[0_4px_20px_rgba(245,166,35,0.25)] hover:shadow-[0_8px_30px_rgba(245,166,35,0.4)] flex items-center justify-center gap-3 mt-8 group interactive-card">
                    <span>Verstuur aanvraag</span>
                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </form>
              </div>
            </FadeInSection>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#001720] py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
          <div className="flex items-center gap-4 interactive-card cursor-pointer" onClick={() => scrollToSection('home')}>
            <NutriLogo className="w-8 h-8 text-[#F5A623]" cutoutColor="#001720" />
            <span className="font-bold text-xl text-white tracking-tight">Nutrivisi</span>
          </div>
          <p className="text-teal-600/80 text-xs font-medium uppercase tracking-widest text-center md:text-right">
            © {new Date().getFullYear()} Nutrivisi. Praktische begeleiding in voedselveiligheid en kwaliteit.
          </p>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{__html: `
        * { cursor: none !important; }
        h1, h2, h3, h4, span, div, svg, path, button, label { user-select: none; }
        p, li, input, textarea { user-select: text; }
        ::selection { background: rgba(245,166,35,0.3); color: white; }
        
        @keyframes shuttle { 0% { left: 35%; opacity: 0.5; } 50% { left: 65%; opacity: 1; } 100% { left: 35%; opacity: 0.5; } }
        @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes breathe { 0%, 100% { opacity: 0.1; transform: scale(1) translate(-50%, -50%); filter: blur(140px); } 50% { opacity: 0.25; transform: scale(1.15) translate(-50%, -50%); filter: blur(100px); } }
        @keyframes drift-slow { 0%, 100% { transform: translate(-50%, -50%) translate(0, 0); } 50% { transform: translate(-50%, -50%) translate(50px, -30px); } }
        @keyframes float-stream { 0% { transform: translateY(100vh); opacity: 0; } 20% { opacity: 0.15; } 80% { opacity: 0.15; } 100% { transform: translateY(-100px); opacity: 0; } }
        @keyframes progress { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { 0% { transform: translateY(-100%); opacity: 0;} 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(1000%); opacity: 0; } }
        @keyframes blockReveal { 0% { opacity: 0; transform: translateY(15px); filter: blur(8px); } 100% { opacity: 1; transform: translateY(0); filter: blur(0px); } }
        @keyframes flowLight { from { stroke-dashoffset: 1040; } to { stroke-dashoffset: 0; } }

        .animate-breathe { animation: breathe 6s ease-in-out infinite; }
        .animate-drift-slow { animation: drift-slow 12s ease-in-out infinite; }
        .animate-float-stream { animation: float-stream linear infinite; }
        .animate-spin-slow { animation: spin-slow 10s linear infinite; }
        .animate-gradient { animation: gradient 6s ease infinite; }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}