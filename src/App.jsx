import { BrowserRouter, Routes, Route, Navigate, Link, useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import NutrivisiSite from './NutrivisiSite';
import LegalPage from './LegalPage';
import { SITE_URL, getLegalPageKey, getLegalPath, getLegalSeo } from './legalContent';

const COOKIE_CONSENT_KEY = 'nutrivisi-cookie-consent-v1';

const COOKIE_BANNER_COPY = {
  NL: {
    title: 'Cookievoorkeuren',
    body: 'Nutrivisi gebruikt alleen noodzakelijke technische opslag om de website te laten werken. Met uw toestemming laden we ook Vercel Web Analytics voor geaggregeerde, cookieloze statistieken.',
    accept: 'Analytics toestaan',
    decline: 'Alleen noodzakelijk',
    policy: 'Cookiebeleid',
    settings: 'Cookie-instellingen',
  },
  FR: {
    title: 'Préférences cookies',
    body: 'Nutrivisi utilise uniquement le stockage technique nécessaire au fonctionnement du site. Avec votre accord, nous chargeons aussi Vercel Web Analytics pour des statistiques agrégées sans cookies.',
    accept: 'Autoriser les analytics',
    decline: 'Nécessaires uniquement',
    policy: 'Politique cookies',
    settings: 'Paramètres cookies',
  },
};

/* =====================================================================
   SEO / <head> metadata per language
   ===================================================================== */
const HOME_SEO_DATA = {
  NL: {
    htmlLang: 'nl-BE',
    ogLocale: 'nl_BE',
    path: '/nl',
    title: 'Nutrivisi — Voedingsadvies, etikettering & certificatie in België',
    description:
      'Nutrivisi begeleidt voedingsbedrijven in de bakkerijsector en vleessector met expertadvies, coaching, certificatie, risicobeheer en correcte etikettering (NL · FR · EN).',
    alternates: {
      'nl-BE': `${SITE_URL}/nl`,
      'fr-BE': `${SITE_URL}/fr`,
      'x-default': `${SITE_URL}/nl`,
    },
  },
  FR: {
    htmlLang: 'fr-BE',
    ogLocale: 'fr_BE',
    path: '/fr',
    title: 'Nutrivisi — Conseil nutritionnel, étiquetage & certification en Belgique',
    description:
      "Nutrivisi accompagne les entreprises alimentaires du secteur de la boulangerie et du secteur de la viande : conseil expert, coaching, certification, gestion des risques et étiquetage conforme (NL · FR · EN).",
    alternates: {
      'nl-BE': `${SITE_URL}/nl`,
      'fr-BE': `${SITE_URL}/fr`,
      'x-default': `${SITE_URL}/nl`,
    },
  },
};

function setMetaByName(name, content) {
  let el = document.head.querySelector(`meta[name="${name}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); document.head.appendChild(el); }
  el.setAttribute('content', content);
}
function setMetaByProp(prop, content) {
  let el = document.head.querySelector(`meta[property="${prop}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute('property', prop); document.head.appendChild(el); }
  el.setAttribute('content', content);
}
function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) { el = document.createElement('link'); el.setAttribute('rel', 'canonical'); document.head.appendChild(el); }
  el.setAttribute('href', href);
}

function setAlternateLink(hreflang, href) {
  let el = document.head.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'alternate');
    el.setAttribute('hreflang', hreflang);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function SEO({ meta }) {
  useEffect(() => {
    document.documentElement.lang = meta.htmlLang;
    document.title = meta.title;
    setMetaByName('description', meta.description);
    setCanonical(`${SITE_URL}${meta.path}`);
    setMetaByProp('og:title', meta.title);
    setMetaByProp('og:description', meta.description);
    setMetaByProp('og:url', `${SITE_URL}${meta.path}`);
    setMetaByProp('og:locale', meta.ogLocale);
    setMetaByProp('og:type', 'website');
    Object.entries(meta.alternates ?? {}).forEach(([hreflang, href]) => {
      setAlternateLink(hreflang, href);
    });
  }, [meta]);
  return null;
}

/* =====================================================================
   Route helpers
   ===================================================================== */

// Default route: detect browser language, redirect to /nl or /fr.
function LangRedirect() {
  const prefer =
    typeof navigator !== 'undefined' &&
    (navigator.language || navigator.userLanguage || '').toLowerCase().startsWith('fr')
      ? '/fr'
      : '/nl';
  return <Navigate to={prefer} replace />;
}

// Scroll to top on route change
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    const id = decodeURIComponent(hash.slice(1));
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ block: 'start' });
    });
  }, [pathname, hash]);

  return null;
}

function ConsentAndAnalytics() {
  const { pathname } = useLocation();
  const lang = pathname.startsWith('/fr') ? 'FR' : 'NL';
  const copy = COOKIE_BANNER_COPY[lang];
  const [choice, setChoice] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const savedChoice = window.localStorage.getItem(COOKIE_CONSENT_KEY);
      return savedChoice === 'accepted' || savedChoice === 'declined' ? savedChoice : null;
    } catch {
      return 'declined';
    }
  });
  const [settingsOpen, setSettingsOpen] = useState(false);

  const saveChoice = (nextChoice) => {
    try {
      window.localStorage.setItem(COOKIE_CONSENT_KEY, nextChoice);
    } catch {
      // If storage is blocked, keep analytics disabled for this session.
    }
    setChoice(nextChoice);
    setSettingsOpen(false);
  };

  const showBanner = settingsOpen || choice === null;

  return (
    <>
      {choice === 'accepted' ? <Analytics /> : null}

      {choice !== null && !showBanner ? (
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          className="fixed bottom-4 left-4 z-[80] rounded-full border border-[#5CC0D5]/28 bg-[#073B4C]/92 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-teal-50/78 shadow-[0_18px_50px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl transition hover:border-[#F0A018]/50 hover:text-[#F0A018]"
        >
          {copy.settings}
        </button>
      ) : null}

      {showBanner ? (
        <section
          className="fixed inset-x-3 bottom-3 z-[90] mx-auto max-w-5xl rounded-[1.4rem] border border-[#5CC0D5]/24 bg-[#073B4C]/96 p-4 text-teal-50 shadow-[0_28px_90px_-38px_rgba(0,0,0,0.95)] backdrop-blur-2xl sm:bottom-5 sm:p-5"
          role="dialog"
          aria-live="polite"
          aria-label={copy.title}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-base font-extrabold tracking-tight text-white">{copy.title}</h2>
              <p className="mt-2 text-sm leading-6 text-teal-50/76">{copy.body}</p>
              <Link
                to={getLegalPath(lang, 'cookies')}
                className="mt-2 inline-flex text-sm font-semibold text-[#5CC0D5] transition hover:text-[#F0A018]"
              >
                {copy.policy}
              </Link>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row md:flex-col lg:flex-row">
              <button
                type="button"
                onClick={() => saveChoice('declined')}
                className="rounded-full border border-[#5CC0D5]/26 bg-[#0A465D]/72 px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-teal-50/84 transition hover:border-[#F0A018]/45 hover:text-[#F0A018]"
              >
                {copy.decline}
              </button>
              <button
                type="button"
                onClick={() => saveChoice('accepted')}
                className="rounded-full border border-[#F0A018]/55 bg-[#F0A018] px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[#073B4C] transition hover:bg-[#FFC35C]"
              >
                {copy.accept}
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

function LegalRoute({ lang }) {
  const { slug } = useParams();
  const pageKey = getLegalPageKey(lang, slug);

  if (!pageKey) {
    return <Navigate to={lang === 'NL' ? '/nl' : '/fr'} replace />;
  }

  const meta = getLegalSeo(lang, pageKey);

  return (
    <>
      <SEO meta={meta} />
      <LegalPage lang={lang} pageKey={pageKey} />
    </>
  );
}

/* =====================================================================
   Main App
   ===================================================================== */
export default function App() {
  return (
    <BrowserRouter>
      <ConsentAndAnalytics />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LangRedirect />} />
        <Route
          path="/nl"
          element={<><SEO meta={HOME_SEO_DATA.NL} /><NutrivisiSite lang="NL" /></>}
        />
        <Route
          path="/fr"
          element={<><SEO meta={HOME_SEO_DATA.FR} /><NutrivisiSite lang="FR" /></>}
        />
        <Route path="/nl/:slug" element={<LegalRoute lang="NL" />} />
        <Route path="/fr/:slug" element={<LegalRoute lang="FR" />} />
        <Route path="*" element={<Navigate to="/nl" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
