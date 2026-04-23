import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Building2, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import NutriLogo from './components/NutriLogo';
import {
  HOME_PATHS,
  LEGAL_LABELS,
  LEGAL_PAGE_CONTENT,
  LEGAL_SLUGS,
  getAlternateLang,
  getLegalPath,
} from './legalContent';

function SectionCard({ index, section }) {
  const sectionId = `section-${index + 1}`;

  return (
    <section
      id={sectionId}
      className="relative overflow-hidden rounded-[2rem] border border-[#5CC0D5]/18 bg-[linear-gradient(155deg,rgba(2,58,78,0.44),rgba(1,26,36,0.52))] p-6 backdrop-blur-xl shadow-[0_26px_70px_-50px_rgba(0,0,0,0.9)] md:p-8"
    >
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#5CC0D5]/50 to-transparent"></div>
      <div className="absolute -right-16 top-10 h-32 w-32 rounded-full bg-[#5CC0D5]/10 blur-[90px]"></div>
      <div className="absolute -left-10 bottom-6 h-28 w-28 rounded-full bg-[#F0A018]/8 blur-[70px]"></div>

      <div className="relative z-10">
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#F0A018]/30 bg-[#011a24]/45 text-[#F0A018]">
            <span className="font-mono text-[11px] font-bold tracking-[0.22em]">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white md:text-[1.85rem]">
            {section.title}
          </h2>
        </div>

        {section.paragraphs?.map((paragraph) => (
          <p key={paragraph} className="mt-4 max-w-3xl text-[15px] leading-8 text-teal-50/80 md:text-base">
            {paragraph}
          </p>
        ))}

        {section.bullets?.length ? (
          <ul className="mt-6 space-y-3">
            {section.bullets.map((bullet) => (
              <li
                key={bullet}
                className="flex gap-3 rounded-[1.4rem] border border-[#5CC0D5]/14 bg-[#011a24]/30 px-4 py-4 text-[15px] leading-7 text-teal-50/78"
              >
                <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-[#F0A018]" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

export default function LegalPage({ lang = 'NL', pageKey }) {
  const page = LEGAL_PAGE_CONTENT[lang][pageKey];
  const labels = LEGAL_LABELS[lang];
  const alternateLang = getAlternateLang(lang);
  const homePath = HOME_PATHS[lang];
  const alternatePath = getLegalPath(alternateLang, pageKey);
  const pageLinks = Object.keys(LEGAL_SLUGS[lang]).map((key) => ({
    key,
    label: LEGAL_PAGE_CONTENT[lang][key].navLabel,
    href: getLegalPath(lang, key),
    active: key === pageKey,
  }));

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#01506E] text-slate-100">
      <div className="fixed inset-x-0 top-0 z-40 border-b border-[#5CC0D5]/14 bg-[#023142]/78 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to={homePath} className="group flex min-w-0 items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-[#5CC0D5]/24 bg-[#011a24]/45 text-[#F0A018]">
              <div className="absolute inset-2 rounded-xl border border-[#5CC0D5]/10"></div>
              <NutriLogo className="relative h-7 w-7 text-[#F0A018]" cutoutColor="#023142" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xl font-bold tracking-tight text-white transition-colors group-hover:text-[#F0A018]">
                Nutrivisi
              </p>
              <p className="truncate text-[10px] uppercase tracking-[0.22em] text-[#5CC0D5]">
                {labels.legalNav}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to={alternatePath}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#F0A018]/55 text-sm font-bold text-[#F0A018] transition hover:bg-[#F0A018] hover:text-[#012330]"
              aria-label="Switch language"
            >
              {labels.languageSwitch}
            </Link>
            <Link
              to={homePath}
              className="hidden items-center gap-2 rounded-full border border-[#5CC0D5]/24 bg-[#011a24]/42 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-teal-50/80 transition hover:border-[#F0A018]/48 hover:text-[#F0A018] md:inline-flex"
            >
              <ArrowLeft className="h-4 w-4" />
              {labels.home}
            </Link>
          </div>
        </div>
      </div>

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-24 h-[480px] w-[980px] -translate-x-1/2 rounded-full bg-[#5CC0D5]/8 blur-[140px]"></div>
        <div className="absolute right-[-10%] top-48 h-[340px] w-[520px] rounded-full bg-[#F0A018]/8 blur-[120px]"></div>
        <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'linear-gradient(rgba(92,192,213,0.44) 1px, transparent 1px), linear-gradient(90deg, rgba(92,192,213,0.44) 1px, transparent 1px)', backgroundSize: '70px 70px' }}></div>
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:pt-36">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(260px,0.42fr)] lg:items-start">
          <div className="relative overflow-hidden rounded-[2.3rem] border border-[#5CC0D5]/18 bg-[linear-gradient(145deg,rgba(2,58,78,0.54),rgba(1,26,36,0.5))] p-7 shadow-[0_30px_90px_-55px_rgba(0,0,0,0.95)] backdrop-blur-2xl md:p-10">
            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#F0A018]/52 to-transparent"></div>
            <div className="absolute -right-20 top-4 h-44 w-44 rounded-full bg-[#5CC0D5]/10 blur-[110px]"></div>
            <div className="absolute -left-12 bottom-6 h-36 w-36 rounded-full bg-[#F0A018]/9 blur-[85px]"></div>

            <div className="relative z-10">
              <div className="mb-5 inline-flex items-center gap-2 border-b border-[#F0A018]/35 pb-2 text-xs font-extrabold uppercase tracking-[0.24em] text-[#F0A018]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F0A018]"></span>
                {page.eyebrow}
              </div>
              <h1 className="max-w-4xl text-4xl font-extrabold leading-[1.02] tracking-tight text-white md:text-6xl lg:text-[4.15rem]">
                {page.title}
              </h1>
              <p className="mt-6 max-w-3xl text-base font-medium leading-8 text-teal-50/76 md:text-lg">
                {page.intro}
              </p>

              <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#5CC0D5]/20 bg-[#011a24]/34 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#5CC0D5]">
                <span className="h-2 w-2 rounded-full bg-[#5CC0D5]"></span>
                {labels.updated}: {page.updatedAt}
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {page.summary.map((item) => (
                  <div
                    key={`${item.label}-${item.value}`}
                    className="rounded-[1.6rem] border border-[#5CC0D5]/14 bg-[#011a24]/32 px-5 py-5"
                  >
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#5CC0D5]/72">
                      {item.label}
                    </p>
                    <p className="mt-2 text-base font-semibold leading-7 text-white/90">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-28">
            <div className="rounded-[2rem] border border-[#5CC0D5]/18 bg-[linear-gradient(160deg,rgba(2,58,78,0.46),rgba(1,26,36,0.5))] p-5 backdrop-blur-xl">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#5CC0D5]/78">
                {labels.contents}
              </p>
              <div className="space-y-2">
                {page.sections.map((section, index) => (
                  <a
                    key={section.title}
                    href={`#section-${index + 1}`}
                    className="group flex items-center justify-between rounded-2xl border border-transparent bg-[#011a24]/24 px-4 py-3 text-sm font-semibold text-teal-50/78 transition hover:border-[#F0A018]/28 hover:bg-[#011a24]/42 hover:text-white"
                  >
                    <span>{section.title}</span>
                    <ArrowUpRight className="h-4 w-4 text-[#F0A018]/60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#F0A018]" />
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#5CC0D5]/18 bg-[linear-gradient(160deg,rgba(2,58,78,0.46),rgba(1,26,36,0.5))] p-5 backdrop-blur-xl">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#5CC0D5]/78">
                {labels.legalNav}
              </p>
              <div className="space-y-2">
                {pageLinks.map((item) => (
                  <Link
                    key={item.key}
                    to={item.href}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      item.active
                        ? 'border border-[#F0A018]/35 bg-[#F0A018]/10 text-white'
                        : 'border border-transparent bg-[#011a24]/24 text-teal-50/76 hover:border-[#5CC0D5]/24 hover:bg-[#011a24]/42 hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className={`h-4 w-4 ${item.active ? 'text-[#F0A018]' : 'text-[#F0A018]/55'}`} />
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-10 grid gap-6">
          {page.sections.map((section, index) => (
            <SectionCard key={section.title} index={index} section={section} />
          ))}
        </section>

        <section className="mt-10 rounded-[2.2rem] border border-[#5CC0D5]/18 bg-[linear-gradient(145deg,rgba(2,58,78,0.5),rgba(1,26,36,0.55))] p-7 backdrop-blur-2xl md:p-9">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(260px,0.48fr)] lg:items-center">
            <div>
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#5CC0D5]/78">
                {labels.contactTitle}
              </p>
              <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-[2.3rem]">
                {labels.keyFacts}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-teal-50/76">
                {labels.contactBody}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={`mailto:${companyFacts.email}`}
                  className="inline-flex items-center gap-2 rounded-full border border-[#F0A018]/48 bg-[#F0A018] px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[#012330] transition hover:bg-[#FFC35C]"
                >
                  <Mail className="h-4 w-4" />
                  {labels.emailLabel}
                </a>
                <a
                  href="tel:+3216196984"
                  className="inline-flex items-center gap-2 rounded-full border border-[#5CC0D5]/26 bg-[#011a24]/34 px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-teal-50/80 transition hover:border-[#F0A018]/44 hover:text-[#F0A018]"
                >
                  <Phone className="h-4 w-4" />
                  {labels.phoneLabel}
                </a>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="rounded-[1.5rem] border border-[#5CC0D5]/16 bg-[#011a24]/30 px-4 py-4">
                <div className="mb-2 flex items-center gap-2 text-[#5CC0D5]">
                  <Building2 className="h-4 w-4" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em]">{labels.companyLabel}</p>
                </div>
                <p className="text-sm font-semibold leading-7 text-white/88">
                  {companyFacts.brand} · {companyFacts.company}
                </p>
                <p className="text-sm font-semibold leading-7 text-white/72">{companyFacts.vat}</p>
              </div>
              <div className="rounded-[1.5rem] border border-[#5CC0D5]/16 bg-[#011a24]/30 px-4 py-4">
                <div className="mb-2 flex items-center gap-2 text-[#5CC0D5]">
                  <MapPin className="h-4 w-4" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em]">{labels.addressLabel}</p>
                </div>
                <p className="text-sm font-semibold leading-7 text-white/88">{companyFacts.address}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

const companyFacts = {
  brand: 'Nutrivisi',
  company: 'K.M.V. nv',
  vat: 'BE 0434 099 744',
  address: 'Martelarenlaan 69/1, 3010 Leuven, Belgium',
  email: 'info@nutrivisi.be',
};
