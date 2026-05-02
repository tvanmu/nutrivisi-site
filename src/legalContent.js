export const SITE_URL = 'https://nutrivisi.be';

export const HOME_PATHS = {
  NL: '/nl',
  FR: '/fr',
};

export const LEGAL_SLUGS = {
  NL: {
    privacy: 'privacybeleid',
    cookies: 'cookies',
    terms: 'algemene-voorwaarden',
    legal: 'juridische-info',
  },
  FR: {
    privacy: 'politique-de-confidentialite',
    cookies: 'cookies',
    terms: 'conditions-generales',
    legal: 'mentions-legales',
  },
};

export function getAlternateLang(lang) {
  return lang === 'NL' ? 'FR' : 'NL';
}

export function getLegalPath(lang, pageKey) {
  return `${HOME_PATHS[lang]}/${LEGAL_SLUGS[lang][pageKey]}`;
}

export function getLegalPageKey(lang, slug) {
  const match = Object.entries(LEGAL_SLUGS[lang]).find(([, value]) => value === slug);
  return match ? match[0] : null;
}

export function getLegalSeo(lang, pageKey) {
  const page = LEGAL_PAGE_CONTENT[lang][pageKey];

  return {
    htmlLang: lang === 'NL' ? 'nl-BE' : 'fr-BE',
    ogLocale: lang === 'NL' ? 'nl_BE' : 'fr_BE',
    path: getLegalPath(lang, pageKey),
    title: page.seoTitle,
    description: page.seoDescription,
    alternates: {
      'nl-BE': `${SITE_URL}${getLegalPath('NL', pageKey)}`,
      'fr-BE': `${SITE_URL}${getLegalPath('FR', pageKey)}`,
      'x-default': `${SITE_URL}${getLegalPath('NL', pageKey)}`,
    },
  };
}

const companyFacts = {
  brand: 'Nutrivisi',
  company: 'Marc Van Mulders',
  vat: 'BE 0638 418 663',
  address: 'Martelarenlaan 69/1, 3010 Leuven, Belgium',
  email: 'info@nutrivisi.be',
  emailDisplay: 'info@nutrivisi.be',
  phone: '+32 492 72 97 29',
  domainProvider: 'Combell nv, Skaldenstraat 121, 9042 Gent, Belgium',
  websiteHost: 'Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, United States',
  updatedNl: '2 mei 2026',
  updatedFr: '2 mai 2026',
};

export const LEGAL_LABELS = {
  NL: {
    home: 'Terug naar de site',
    homeShort: 'Site',
    legalNav: 'Juridische pagina’s',
    languageSwitch: 'FR',
    updated: 'Laatst bijgewerkt',
    keyFacts: 'Kerngegevens',
    contents: 'Op deze pagina',
    contactTitle: 'Nog een vraag?',
    contactBody: 'Voor privacy- of juridische vragen mag u rechtstreeks contact opnemen met Nutrivisi.',
    emailLabel: 'E-mail',
    phoneLabel: 'Telefoon',
    companyLabel: 'Onderneming',
    addressLabel: 'Adres',
    vatLabel: 'BTW / KBO',
  },
  FR: {
    home: 'Retour au site',
    homeShort: 'Site',
    legalNav: 'Pages juridiques',
    languageSwitch: 'NL',
    updated: 'Dernière mise à jour',
    keyFacts: 'Informations clés',
    contents: 'Sur cette page',
    contactTitle: 'Une question ?',
    contactBody: 'Pour toute question relative à la vie privée ou aux mentions légales, vous pouvez contacter Nutrivisi directement.',
    emailLabel: 'E-mail',
    phoneLabel: 'Téléphone',
    companyLabel: 'Entreprise',
    addressLabel: 'Adresse',
    vatLabel: 'TVA / BCE',
  },
};

export const LEGAL_PAGE_CONTENT = {
  NL: {
    privacy: {
      navLabel: 'Privacybeleid',
      eyebrow: 'Privacybeleid',
      title: 'Hoe Nutrivisi met persoonsgegevens omgaat',
      intro:
        'Dit privacybeleid legt uit welke persoonsgegevens Nutrivisi verwerkt wanneer u contact opneemt, de website gebruikt of een samenwerking voorbereidt. Het doel is helder en proportioneel: correct communiceren, uw vraag opvolgen en de site veilig laten functioneren.',
      seoTitle: 'Privacybeleid | Nutrivisi',
      seoDescription:
        'Lees hoe Nutrivisi, merk van Marc Van Mulders, persoonsgegevens verwerkt voor contactaanvragen, websitegebruik en dienstverlening in België.',
      updatedAt: companyFacts.updatedNl,
      summary: [
        { label: 'Verwerkingsverantwoordelijke', value: `${companyFacts.company} (${companyFacts.brand})` },
        { label: 'Adres', value: companyFacts.address },
        { label: 'BTW / KBO', value: companyFacts.vat },
        { label: 'Contact', value: companyFacts.emailDisplay },
      ],
      sections: [
        {
          title: '1. Wie verwerkt uw gegevens?',
          paragraphs: [
            `${companyFacts.brand} is de merknaam van ${companyFacts.company}, met maatschappelijke zetel te ${companyFacts.address}.`,
            `Voor vragen over dit beleid of over de verwerking van uw persoonsgegevens kunt u contact opnemen via ${companyFacts.email}.`,
          ],
        },
        {
          title: '2. Welke gegevens kunnen we verwerken?',
          bullets: [
            'Identificatie- en contactgegevens die u zelf meedeelt, zoals naam, bedrijfsnaam, e-mailadres, telefoonnummer en de inhoud van uw bericht.',
            'Gegevens die verband houden met een mogelijke samenwerking, offerteaanvraag of dossieropvolging.',
            'Technische gegevens die nodig zijn om de website veilig en stabiel te laten werken, zoals serverlogs, IP-adres, browserinformatie en foutmeldingen.',
          ],
        },
        {
          title: '3. Waarom verwerken we die gegevens en op welke rechtsgrond?',
          bullets: [
            'Om uw vraag te beantwoorden, een kennismaking voor te bereiden of stappen te zetten op uw verzoek voorafgaand aan een mogelijke overeenkomst.',
            'Om zakelijke communicatie en dossieropvolging correct te organiseren op basis van ons gerechtvaardigd belang om aanvragen professioneel te beheren.',
            'Om de website te beveiligen, beschikbaar te houden en technische problemen op te sporen op basis van ons gerechtvaardigd belang in de veilige werking van onze online aanwezigheid.',
          ],
        },
        {
          title: '4. Met wie kunnen uw gegevens worden gedeeld?',
          bullets: [
            'Met intern bevoegde personen binnen Nutrivisi of Marc Van Mulders, voor zover dat nodig is om uw vraag te behandelen.',
            `Met technische dienstverleners zoals ${companyFacts.domainProvider} voor domein- en e-mailinfrastructuur en ${companyFacts.websiteHost} voor websitehosting en levering.`,
            'Met professionele adviseurs of bevoegde autoriteiten wanneer dat wettelijk vereist is of noodzakelijk is voor de bescherming van onze rechten.',
            'Wanneer externe dienstverleners buiten de Europese Economische Ruimte betrokken zijn, gebeurt dat enkel met passende waarborgen zoals contractuele beschermingsmaatregelen of een toepasselijk adequaatheidsmechanisme.',
          ],
        },
        {
          title: '5. Bewaartermijnen',
          paragraphs: [
            'We bewaren persoonsgegevens niet langer dan nodig. Contactaanvragen en bijhorende correspondentie worden in beginsel uiterlijk 24 maanden na het laatste zinvolle contact verwijderd of herbekeken, tenzij een langere bewaartermijn wettelijk vereist is of nodig is voor de instelling, uitoefening of verdediging van rechtsvorderingen.',
            'Technische logs en beveiligingsinformatie worden enkel bewaard zolang dat nodig is voor veiligheid, foutopsporing en infrastructuurbeheer, rekening houdend met de standaardinstellingen van de betrokken hostingproviders.',
          ],
        },
        {
          title: '6. Uw rechten',
          paragraphs: [
            'U kunt, binnen de grenzen van de toepasselijke wetgeving, vragen om inzage in uw persoonsgegevens, verbetering of verwijdering ervan, beperking van de verwerking, overdraagbaarheid van gegevens of bezwaar tegen bepaalde verwerkingen. Wanneer verwerking op toestemming zou steunen, kunt u die toestemming ook intrekken.',
            'Bent u van oordeel dat uw rechten niet werden gerespecteerd, dan kunt u een klacht indienen bij de Belgische Gegevensbeschermingsautoriteit, Drukpersstraat 35, 1000 Brussel, via www.gegevensbeschermingsautoriteit.be.',
          ],
        },
        {
          title: '7. Websitegebruik, e-mail en externe bronnen',
          paragraphs: [
            'De contactmodule op deze website verstuurt uw bericht rechtstreeks naar Nutrivisi via de beveiligde serveromgeving van de website. Uw browser hoeft daarvoor geen eigen e-mailtoepassing te openen.',
            'Na uw toestemming kan de website Vercel Web Analytics laden om geaggregeerde, privacyvriendelijke statistieken over websitegebruik te bekijken. Deze analytics werken zonder cookies en zijn bedoeld om de site technisch en inhoudelijk te verbeteren.',
          ],
        },
        {
          title: '8. Wijzigingen',
          paragraphs: [
            'Dit beleid kan worden aangepast wanneer de website, de gebruikte tools of de wettelijke context veranderen. De meest recente versie is steeds op deze pagina beschikbaar.',
          ],
        },
      ],
    },
    cookies: {
      navLabel: 'Cookies',
      eyebrow: 'Cookiebeleid',
      title: 'Duidelijkheid over cookies en vergelijkbare technologieën',
      intro:
        'Deze pagina beschrijft hoe Nutrivisi omgaat met cookies, technische opslag en vergelijkbare online technologieën. De website is bewust eenvoudig gehouden: geen marketingstack en geen advertentiecookies. Voor basisstatistieken gebruikt de site Vercel Web Analytics zonder cookies.',
      seoTitle: 'Cookies | Nutrivisi',
      seoDescription:
        'Bekijk hoe Nutrivisi omgaat met cookies, technische opslag en externe bronnen op nutrivisi.be.',
      updatedAt: companyFacts.updatedNl,
      summary: [
        { label: 'Huidige status', value: 'Noodzakelijke opslag actief; analytics alleen na toestemming' },
        { label: 'Cookiebanner', value: 'Aanwezig voor de keuze rond Vercel Web Analytics' },
        { label: 'Externe bronnen', value: 'Geen externe font- of advertentiediensten in de publieke front-end' },
        { label: 'Contact', value: companyFacts.emailDisplay },
      ],
      sections: [
        {
          title: '1. Wat zijn cookies en trackers?',
          paragraphs: [
            'Cookies zijn kleine gegevensbestanden die via uw browser op een toestel kunnen worden opgeslagen. Vergelijkbare technologieën kunnen ook via lokale opslag, scripts of infrastructuurcomponenten werken. Ze kunnen strikt noodzakelijk zijn voor de werking van een site of gebruikt worden voor voorkeuren, statistiek of marketing.',
          ],
        },
        {
          title: '2. Wat gebruikt deze website vandaag?',
          paragraphs: [
            'Op basis van de huidige configuratie gebruikt nutrivisi.be geen advertentiecookies of trackingcookies voor marketingdoeleinden.',
            'De site kan Vercel Web Analytics gebruiken voor geaggregeerde statistieken over paginaweergaven, verwijzers, apparaten, browsers en algemene locatiegegevens. Deze analytics gebruiken geen cookies en worden pas geladen nadat u analytics toestaat in de banner.',
            'Uw keuze wordt lokaal in uw browser bewaard als noodzakelijke voorkeur, zodat de website uw keuze kan respecteren. U kunt die voorkeur aanpassen via de cookie-instellingen op de website of verwijderen via uw browserinstellingen.',
          ],
        },
        {
          title: '3. Strikt noodzakelijke technische verwerking',
          bullets: [
            'Browser- en netwerkmechanismen die nodig zijn om pagina’s op te vragen en veilig af te leveren.',
            'Technische verwerking door hosting- en infrastructuurleveranciers voor beveiliging, performantie, load balancing, caching of foutdetectie, voor zover dat strikt nodig is om de gevraagde dienst te leveren.',
          ],
        },
        {
          title: '4. Externe diensten',
          paragraphs: [
            'De publieke website laadt momenteel geen externe font- of advertentiediensten in de browser. Vercel Web Analytics wordt via de Vercel-hostingomgeving geladen voor geaggregeerde gebruiksstatistieken wanneer u daarvoor toestemming geeft.',
            'Als later andere niet-noodzakelijke cookies of vergelijkbare technologieën worden toegevoegd, wordt dit beleid aangepast en wordt vooraf een passend toestemmingsmechanisme voorzien.',
          ],
        },
        {
          title: '5. Uw browserinstellingen',
          paragraphs: [
            'U kunt cookies en lokale opslag doorgaans beheren, blokkeren of verwijderen via de instellingen van uw browser. Houd er wel rekening mee dat het uitschakelen van strikt noodzakelijke technische mechanismen de goede werking van een website kan beïnvloeden.',
          ],
        },
      ],
    },
    terms: {
      navLabel: 'Algemene voorwaarden',
      eyebrow: 'Algemene voorwaarden',
      title: 'Algemene voorwaarden voor het gebruik van de website',
      intro:
        'Deze voorwaarden leggen de basisregels vast voor het gebruik van deze website en de informatie die Nutrivisi online publiceert. Concrete opdrachten worden afzonderlijk geregeld via offerte, overeenkomst of schriftelijke bevestiging.',
      seoTitle: 'Algemene voorwaarden | Nutrivisi',
      seoDescription:
        'Lees de algemene voorwaarden voor het gebruik van de Nutrivisi-website en de online informatie.',
      updatedAt: companyFacts.updatedNl,
      summary: [
        { label: 'Toepassing', value: 'Gebruik van nutrivisi.be en online informatie' },
        { label: 'Uitgever', value: `${companyFacts.company} (${companyFacts.brand})` },
        { label: 'Recht', value: 'Belgisch recht' },
        { label: 'Contact', value: companyFacts.emailDisplay },
      ],
      sections: [
        {
          title: '1. Toepassingsgebied',
          paragraphs: [
            'Door deze website te gebruiken, aanvaardt u deze algemene voorwaarden voor zover ze betrekking hebben op het gebruik van de website en de online inhoud.',
            'Voor adviesopdrachten, begeleiding, audits, opleidingen of andere professionele diensten gelden de voorwaarden die in de offerte, overeenkomst of schriftelijke bevestiging van de opdracht zijn opgenomen. Bij tegenstrijdigheid heeft die specifieke afspraak voorrang.',
          ],
        },
        {
          title: '2. Informatie op de website',
          paragraphs: [
            'De informatie op deze website wordt met zorg opgesteld, maar is algemeen van aard. Ze vormt geen bindend advies, geen contractueel aanbod en geen vervanging voor een analyse van een concrete situatie.',
            'Nutrivisi kan de inhoud van de website aanpassen, aanvullen of verwijderen wanneer dat nodig is.',
          ],
        },
        {
          title: '3. Correct gebruik',
          bullets: [
            'U gebruikt de website op een normale, rechtmatige manier en onderneemt geen acties die de beschikbaarheid, beveiliging of integriteit van de website kunnen verstoren.',
            'U probeert geen ongeoorloofde toegang te krijgen tot formulieren, systemen, code, infrastructuur of gegevens die niet publiek voor u bestemd zijn.',
          ],
        },
        {
          title: '4. Intellectuele eigendom',
          paragraphs: [
            'De teksten, beelden, logo’s, vormgeving en andere elementen op deze website zijn beschermd voor zover de wet dat voorziet. Zonder voorafgaande schriftelijke toestemming mag u de inhoud niet integraal of substantieel kopiëren, publiceren of commercieel hergebruiken.',
          ],
        },
        {
          title: '5. Aansprakelijkheid',
          paragraphs: [
            'Nutrivisi streeft naar een veilige en correcte website, maar garandeert niet dat de site altijd foutloos of ononderbroken beschikbaar is.',
            'Voor zover wettelijk toegestaan, is Nutrivisi niet aansprakelijk voor indirecte schade, verlies van gegevens, winstderving of schade die voortvloeit uit het gebruik van algemene informatie op deze website.',
          ],
        },
        {
          title: '6. Toepasselijk recht en contact',
          paragraphs: [
            `Op deze voorwaarden is Belgisch recht van toepassing. Voor vragen over deze voorwaarden kunt u contact opnemen via ${companyFacts.email}.`,
          ],
        },
      ],
    },
    legal: {
      navLabel: 'Juridische info',
      eyebrow: 'Juridische info',
      title: 'Identiteit van de uitgever en gebruik van de website',
      intro:
        'Deze juridische informatie maakt duidelijk wie achter de website staat, hoe u de onderneming kunt contacteren en onder welke basisvoorwaarden de site en de inhoud worden aangeboden.',
      seoTitle: 'Juridische info | Nutrivisi',
      seoDescription:
        'De juridische informatie van Nutrivisi met ondernemingsgegevens, contactgegevens en hostinginformatie.',
      updatedAt: companyFacts.updatedNl,
      summary: [
        { label: 'Merk', value: companyFacts.brand },
        { label: 'Vennootschap', value: companyFacts.company },
        { label: 'BTW / KBO', value: companyFacts.vat },
        { label: 'Adres', value: companyFacts.address },
      ],
      sections: [
        {
          title: '1. Uitgever van de website',
          paragraphs: [
            `${companyFacts.brand} is de merknaam waaronder Marc Van Mulders zijn activiteiten voert.`,
            `${companyFacts.company} is gevestigd te ${companyFacts.address} en is ingeschreven onder ondernemings- en btw-nummer ${companyFacts.vat}.`,
          ],
        },
        {
          title: '2. Contact',
          bullets: [
            `E-mail: ${companyFacts.email}`,
            `Telefoon: ${companyFacts.phone}`,
            `Adres: ${companyFacts.address}`,
          ],
        },
        {
          title: '3. Hosting en technische leveranciers',
          bullets: [
            `Domeinnaam- en e-mailinfrastructuur: ${companyFacts.domainProvider}.`,
            `Websitehosting en deployment: ${companyFacts.websiteHost}.`,
          ],
        },
        {
          title: '4. Intellectuele eigendom',
          paragraphs: [
            'De teksten, visuals, merkuitingen en algemene vormgeving van deze website zijn beschermd door intellectuele eigendomsrechten voor zover van toepassing. Zonder voorafgaande schriftelijke toestemming mag de inhoud niet integraal of substantieel worden gereproduceerd, verspreid of commercieel hergebruikt, behalve wanneer de wet dit uitdrukkelijk toelaat.',
          ],
        },
        {
          title: '5. Aansprakelijkheid',
          paragraphs: [
            'Nutrivisi besteedt redelijke zorg aan de inhoud van deze website. Toch wordt de informatie uitsluitend ter algemene informatie aangeboden en kan ze geen juridisch, contractueel of bindend advies vervangen.',
            'Nutrivisi is niet aansprakelijk voor schade die voortvloeit uit tijdelijke onbeschikbaarheid van de site, technische storingen of het gebruik van informatie op externe websites waarnaar wordt verwezen.',
          ],
        },
        {
          title: '6. Toepasselijk recht',
          paragraphs: [
            'Op deze website en deze juridische informatie is Belgisch recht van toepassing, onverminderd dwingende wettelijke bepalingen die anders zouden voorschrijven.',
          ],
        },
      ],
    },
  },
  FR: {
    privacy: {
      navLabel: 'Politique de confidentialité',
      eyebrow: 'Confidentialité',
      title: 'Comment Nutrivisi traite les données personnelles',
      intro:
        'Cette politique explique quelles données personnelles Nutrivisi peut traiter lorsque vous prenez contact, utilisez le site web ou préparez une collaboration. L’objectif reste sobre et proportionné : communiquer correctement, répondre à votre demande et faire fonctionner le site en toute sécurité.',
      seoTitle: 'Politique de confidentialité | Nutrivisi',
      seoDescription:
        'Découvrez comment Nutrivisi, marque de Marc Van Mulders, traite les données personnelles liées aux demandes de contact, au site web et aux services en Belgique.',
      updatedAt: companyFacts.updatedFr,
      summary: [
        { label: 'Responsable du traitement', value: `${companyFacts.company} (${companyFacts.brand})` },
        { label: 'Adresse', value: companyFacts.address },
        { label: 'TVA / BCE', value: companyFacts.vat },
        { label: 'Contact', value: companyFacts.emailDisplay },
      ],
      sections: [
        {
          title: '1. Qui traite vos données ?',
          paragraphs: [
            `${companyFacts.brand} est la marque commerciale de ${companyFacts.company}, dont le siège est établi à ${companyFacts.address}.`,
            `Pour toute question relative à cette politique ou au traitement de vos données, vous pouvez écrire à ${companyFacts.email}.`,
          ],
        },
        {
          title: '2. Quelles données pouvons-nous traiter ?',
          bullets: [
            'Les données d’identification et de contact que vous fournissez vous-même, comme votre nom, le nom de votre société, votre adresse e-mail, votre numéro de téléphone et le contenu de votre message.',
            'Les informations liées à une éventuelle mission, à une demande d’offre ou au suivi d’un dossier.',
            'Les données techniques nécessaires au bon fonctionnement du site, comme les logs serveur, l’adresse IP, les informations de navigateur et les messages d’erreur.',
          ],
        },
        {
          title: '3. Pourquoi traitons-nous ces données et sur quelle base ?',
          bullets: [
            'Pour répondre à votre demande, préparer une prise de contact ou prendre des mesures à votre demande avant la conclusion éventuelle d’un contrat.',
            'Pour gérer correctement les communications professionnelles et le suivi administratif sur la base de notre intérêt légitime à traiter les demandes de manière professionnelle.',
            'Pour sécuriser le site, garantir sa disponibilité et détecter les problèmes techniques sur la base de notre intérêt légitime à assurer le fonctionnement sûr de notre présence en ligne.',
          ],
        },
        {
          title: '4. Avec qui vos données peuvent-elles être partagées ?',
          bullets: [
            'Avec les personnes habilitées au sein de Nutrivisi ou de Marc Van Mulders, dans la mesure nécessaire au traitement de votre demande.',
            `Avec des prestataires techniques tels que ${companyFacts.domainProvider} pour le domaine et l’infrastructure e-mail, et ${companyFacts.websiteHost} pour l’hébergement et la diffusion du site.`,
            'Avec des conseillers professionnels ou des autorités compétentes lorsque la loi l’impose ou lorsque cela est nécessaire à la protection de nos droits.',
            'Lorsque des prestataires situés hors de l’Espace économique européen interviennent, cela se fait uniquement avec des garanties appropriées, telles que des clauses contractuelles adaptées ou un mécanisme d’adéquation applicable.',
          ],
        },
        {
          title: '5. Durées de conservation',
          paragraphs: [
            'Nous ne conservons pas les données personnelles plus longtemps que nécessaire. En principe, les demandes de contact et la correspondance associée sont supprimées ou réexaminées au plus tard 24 mois après le dernier contact utile, sauf obligation légale de conservation plus longue ou nécessité liée à la constatation, l’exercice ou la défense de droits en justice.',
            'Les logs techniques et les informations de sécurité sont conservés uniquement pendant la durée nécessaire à la sécurité, au diagnostic et à la gestion de l’infrastructure, compte tenu des paramètres standard des prestataires concernés.',
          ],
        },
        {
          title: '6. Vos droits',
          paragraphs: [
            'Dans les limites prévues par la législation applicable, vous pouvez demander l’accès à vos données, leur rectification ou leur effacement, la limitation du traitement, la portabilité des données ou vous opposer à certains traitements. Lorsque le traitement repose sur le consentement, vous pouvez également retirer ce consentement.',
            'Si vous estimez que vos droits n’ont pas été respectés, vous pouvez introduire une plainte auprès de l’Autorité de protection des données, Rue de la Presse 35, 1000 Bruxelles, via www.autoriteprotectiondonnees.be.',
          ],
        },
        {
          title: '7. Utilisation du site, e-mail et ressources externes',
          paragraphs: [
            'Le module de contact du site envoie votre message directement à Nutrivisi via l’environnement serveur sécurisé du site. Votre navigateur n’a donc pas besoin d’ouvrir votre propre application e-mail.',
            'Après votre accord, le site peut charger Vercel Web Analytics afin de consulter des statistiques agrégées et respectueuses de la vie privée sur l’utilisation du site. Ces analytics fonctionnent sans cookies et servent à améliorer le site sur les plans technique et éditorial.',
          ],
        },
        {
          title: '8. Modifications',
          paragraphs: [
            'Cette politique peut être adaptée si le site, les outils utilisés ou le cadre légal évoluent. La version la plus récente reste toujours disponible sur cette page.',
          ],
        },
      ],
    },
    cookies: {
      navLabel: 'Cookies',
      eyebrow: 'Cookies',
      title: 'Comprendre l’usage des cookies et technologies similaires',
      intro:
        'Cette page décrit l’approche de Nutrivisi concernant les cookies, le stockage technique et les technologies voisines. Le site reste volontairement simple : pas de pile marketing ni de cookies publicitaires. Pour les statistiques de base, le site utilise Vercel Web Analytics sans cookies.',
      seoTitle: 'Cookies | Nutrivisi',
      seoDescription:
        'Consultez la politique de Nutrivisi concernant les cookies, le stockage technique et les ressources externes sur nutrivisi.be.',
      updatedAt: companyFacts.updatedFr,
      summary: [
        { label: 'Statut actuel', value: 'Stockage nécessaire actif ; analytics uniquement après accord' },
        { label: 'Bannière de consentement', value: 'Présente pour le choix relatif à Vercel Web Analytics' },
        { label: 'Services externes', value: 'Pas de service externe de police ou de publicité dans le front-end public' },
        { label: 'Contact', value: companyFacts.emailDisplay },
      ],
      sections: [
        {
          title: '1. Que sont les cookies et traceurs ?',
          paragraphs: [
            'Les cookies sont de petits fichiers de données pouvant être stockés sur votre appareil via votre navigateur. Des technologies comparables peuvent aussi fonctionner via le stockage local, des scripts ou des composants d’infrastructure. Elles peuvent être strictement nécessaires au fonctionnement d’un site ou utilisées pour des préférences, des statistiques ou du marketing.',
          ],
        },
        {
          title: '2. Que fait actuellement ce site ?',
          paragraphs: [
            'D’après la configuration actuelle, nutrivisi.be n’utilise pas de cookies publicitaires ou de suivi à des fins marketing.',
            'Le site peut utiliser Vercel Web Analytics pour des statistiques agrégées sur les pages vues, les référents, les appareils, les navigateurs et les données générales de localisation. Ces analytics n’utilisent pas de cookies et ne sont chargés qu’après votre accord dans la bannière.',
            'Votre choix est conservé localement dans votre navigateur en tant que préférence nécessaire, afin que le site puisse le respecter. Vous pouvez modifier cette préférence via les paramètres cookies du site ou la supprimer dans les paramètres de votre navigateur.',
          ],
        },
        {
          title: '3. Traitements techniques strictement nécessaires',
          bullets: [
            'Les mécanismes du navigateur et du réseau nécessaires pour demander et délivrer les pages en toute sécurité.',
            'Les traitements techniques par les prestataires d’hébergement et d’infrastructure pour la sécurité, la performance, l’équilibrage de charge, le cache ou la détection d’erreurs, dans la mesure où ils sont strictement nécessaires à la fourniture du service demandé.',
          ],
        },
        {
          title: '4. Services externes',
          paragraphs: [
            'Le site public ne charge actuellement aucun service externe de police ou de publicité dans le navigateur. Vercel Web Analytics est chargé via l’environnement d’hébergement Vercel pour des statistiques d’utilisation agrégées lorsque vous donnez votre accord.',
            'Si d’autres cookies non essentiels ou technologies comparables devaient être ajoutés ultérieurement, cette politique serait mise à jour et un mécanisme de consentement approprié serait mis en place au préalable.',
          ],
        },
        {
          title: '5. Paramètres de votre navigateur',
          paragraphs: [
            'Vous pouvez généralement gérer, bloquer ou supprimer les cookies et le stockage local via les paramètres de votre navigateur. Gardez toutefois à l’esprit que la désactivation de mécanismes strictement nécessaires peut perturber le bon fonctionnement d’un site web.',
          ],
        },
      ],
    },
    terms: {
      navLabel: 'Conditions générales',
      eyebrow: 'Conditions générales',
      title: 'Conditions générales d’utilisation du site',
      intro:
        'Ces conditions fixent les règles de base applicables à l’utilisation du site et des informations publiées en ligne par Nutrivisi. Les missions concrètes sont réglées séparément par offre, contrat ou confirmation écrite.',
      seoTitle: 'Conditions générales | Nutrivisi',
      seoDescription:
        'Consultez les conditions générales d’utilisation du site Nutrivisi et des informations publiées en ligne.',
      updatedAt: companyFacts.updatedFr,
      summary: [
        { label: 'Application', value: 'Utilisation de nutrivisi.be et des informations en ligne' },
        { label: 'Éditeur', value: `${companyFacts.company} (${companyFacts.brand})` },
        { label: 'Droit', value: 'Droit belge' },
        { label: 'Contact', value: companyFacts.emailDisplay },
      ],
      sections: [
        {
          title: '1. Champ d’application',
          paragraphs: [
            'En utilisant ce site, vous acceptez les présentes conditions générales dans la mesure où elles concernent l’utilisation du site et de son contenu en ligne.',
            'Pour les missions de conseil, d’accompagnement, d’audit, de formation ou d’autres services professionnels, les conditions reprises dans l’offre, le contrat ou la confirmation écrite de mission s’appliquent. En cas de contradiction, cet accord spécifique prévaut.',
          ],
        },
        {
          title: '2. Informations publiées sur le site',
          paragraphs: [
            'Les informations publiées sur ce site sont préparées avec soin, mais restent générales. Elles ne constituent ni un conseil contraignant, ni une offre contractuelle, ni un remplacement d’une analyse d’une situation concrète.',
            'Nutrivisi peut modifier, compléter ou retirer le contenu du site lorsque cela s’avère nécessaire.',
          ],
        },
        {
          title: '3. Utilisation correcte',
          bullets: [
            'Vous utilisez le site de manière normale et licite, sans action susceptible de perturber sa disponibilité, sa sécurité ou son intégrité.',
            'Vous ne tentez pas d’obtenir un accès non autorisé aux formulaires, systèmes, codes, infrastructures ou données qui ne vous sont pas destinés publiquement.',
          ],
        },
        {
          title: '4. Propriété intellectuelle',
          paragraphs: [
            'Les textes, images, logos, éléments graphiques et autres contenus du site sont protégés dans la mesure prévue par la loi. Sans autorisation écrite préalable, vous ne pouvez pas copier, publier ou réutiliser commercialement tout ou partie substantielle du contenu.',
          ],
        },
        {
          title: '5. Responsabilité',
          paragraphs: [
            'Nutrivisi s’efforce de proposer un site sûr et correct, mais ne garantit pas que le site sera toujours disponible sans erreur ni interruption.',
            'Dans la mesure autorisée par la loi, Nutrivisi n’est pas responsable des dommages indirects, pertes de données, pertes de profit ou dommages résultant de l’utilisation d’informations générales publiées sur ce site.',
          ],
        },
        {
          title: '6. Droit applicable et contact',
          paragraphs: [
            `Les présentes conditions sont régies par le droit belge. Pour toute question, vous pouvez écrire à ${companyFacts.email}.`,
          ],
        },
      ],
    },
    legal: {
      navLabel: 'Mentions légales',
      eyebrow: 'Mentions légales',
      title: 'Identité de l’éditeur et conditions d’usage du site',
      intro:
        'Ces mentions légales indiquent clairement qui édite le site, comment joindre l’entreprise et selon quelles conditions de base le site et son contenu sont mis à disposition.',
      seoTitle: 'Mentions légales | Nutrivisi',
      seoDescription:
        'Les mentions légales de Nutrivisi avec les informations d’entreprise, les coordonnées et les prestataires techniques du site.',
      updatedAt: companyFacts.updatedFr,
      summary: [
        { label: 'Marque', value: companyFacts.brand },
        { label: 'Société', value: companyFacts.company },
        { label: 'TVA / BCE', value: companyFacts.vat },
        { label: 'Adresse', value: companyFacts.address },
      ],
      sections: [
        {
          title: '1. Éditeur du site',
          paragraphs: [
            `${companyFacts.brand} est la marque commerciale utilisée par Marc Van Mulders pour ses activités.`,
            `${companyFacts.company} est établie à ${companyFacts.address} et inscrite sous le numéro d’entreprise et de TVA ${companyFacts.vat}.`,
          ],
        },
        {
          title: '2. Contact',
          bullets: [
            `E-mail : ${companyFacts.email}`,
            `Téléphone : ${companyFacts.phone}`,
            `Adresse : ${companyFacts.address}`,
          ],
        },
        {
          title: '3. Hébergement et prestataires techniques',
          bullets: [
            `Nom de domaine et infrastructure e-mail : ${companyFacts.domainProvider}.`,
            `Hébergement et déploiement du site : ${companyFacts.websiteHost}.`,
          ],
        },
        {
          title: '4. Propriété intellectuelle',
          paragraphs: [
            'Les textes, visuels, éléments de marque et la conception générale du site sont protégés par les droits de propriété intellectuelle applicables. Sauf autorisation écrite préalable, le contenu ne peut pas être reproduit, diffusé ou réutilisé à des fins commerciales, sauf dans les cas expressément permis par la loi.',
          ],
        },
        {
          title: '5. Responsabilité',
          paragraphs: [
            'Nutrivisi apporte un soin raisonnable au contenu du site. Les informations sont toutefois fournies à titre général et ne remplacent ni un conseil juridique, ni un engagement contractuel, ni une analyse spécifique.',
            'Nutrivisi ne peut être tenue responsable des dommages résultant d’une indisponibilité temporaire du site, de perturbations techniques ou de l’usage d’informations publiées sur des sites externes vers lesquels le site renvoie.',
          ],
        },
        {
          title: '6. Droit applicable',
          paragraphs: [
            'Le droit belge s’applique au présent site et aux présentes mentions légales, sans préjudice des dispositions impératives qui imposeraient une autre solution.',
          ],
        },
      ],
    },
  },
};
