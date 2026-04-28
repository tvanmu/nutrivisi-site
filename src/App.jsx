import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import NutrivisiSite from './NutrivisiSite';
import LegalPage from './LegalPage';
import { SITE_URL, getLegalPageKey, getLegalSeo } from './legalContent';

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
      <Analytics />
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
