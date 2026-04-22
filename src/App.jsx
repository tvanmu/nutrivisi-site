import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import NutrivisiSite from './NutrivisiSite';

/* =====================================================================
   SEO / <head> metadata per language
   ===================================================================== */
const SITE_URL = 'https://nutrivisi.be';

const SEO_DATA = {
  NL: {
    htmlLang: 'nl-BE',
    ogLocale: 'nl_BE',
    path: '/nl',
    title: 'Nutrivisi — Voedingsadvies, etikettering & certificatie in België',
    description:
      'Nutrivisi begeleidt voedingsbedrijven in bakkerij, vlees, horeca en retail met expertadvies, coaching, certificatie, risicobeheer en correcte etikettering (NL · FR · EN).',
  },
  FR: {
    htmlLang: 'fr-BE',
    ogLocale: 'fr_BE',
    path: '/fr',
    title: 'Nutrivisi — Conseil nutritionnel, étiquetage & certification en Belgique',
    description:
      "Nutrivisi accompagne les entreprises alimentaires (boulangerie, viande, horeca, retail) : conseil expert, coaching, certification, gestion des risques et étiquetage conforme (NL · FR · EN).",
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

function SEO({ lang }) {
  const data = SEO_DATA[lang];
  useEffect(() => {
    document.documentElement.lang = data.htmlLang;
    document.title = data.title;
    setMetaByName('description', data.description);
    setCanonical(`${SITE_URL}${data.path}`);
    setMetaByProp('og:title', data.title);
    setMetaByProp('og:description', data.description);
    setMetaByProp('og:url', `${SITE_URL}${data.path}`);
    setMetaByProp('og:locale', data.ogLocale);
    setMetaByProp('og:type', 'website');
  }, [data]);
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
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

/* =====================================================================
   Main App
   ===================================================================== */
export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LangRedirect />} />
        <Route
          path="/nl"
          element={<><SEO lang="NL" /><NutrivisiSite lang="NL" /></>}
        />
        <Route
          path="/fr"
          element={<><SEO lang="FR" /><NutrivisiSite lang="FR" /></>}
        />
        <Route path="*" element={<Navigate to="/nl" replace />} />
      </Routes>
      <SpeedInsights />
    </BrowserRouter>
  );
}