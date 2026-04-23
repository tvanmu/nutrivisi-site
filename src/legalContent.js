export const SITE_URL = 'https://nutrivisi.be';

export const HOME_PATHS = {
  NL: '/nl',
  FR: '/fr',
};

export const LEGAL_SLUGS = {
  NL: {
    privacy: 'privacybeleid',
    cookies: 'cookies',
    legal: 'juridische-info',
  },
  FR: {
    privacy: 'politique-de-confidentialite',
    cookies: 'cookies',
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
  secondaryEmail: 'marc@nutrivisi.be',
  emailDisplay: 'info@nutrivisi.be · marc@nutrivisi.be',
  phone: '+32 16 19 69 84',
  domainProvider: 'Combell nv, Skaldenstraat 121, 9042 Gent, Belgium',
  websiteHost: 'Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, United States',
  updatedNl: '23 april 2026',
  updatedFr: '23 avril 2026',
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
            `Voor vragen over dit beleid of over de verwerking van uw persoonsgegevens kunt u contact opnemen via ${companyFacts.email} of ${companyFacts.secondaryEmail}.`,
          ],
        },
        {
          title: '2. Welke gegevens kunnen wij verwerken?',
          bullets: [
            'Identificatie- en contactgegevens die u zelf meedeelt, zoals naam, bedrijfsnaam, e-mailadres, telefoonnummer en de inhoud van uw bericht.',
            'Gegevens die verband houden met een mogelijke samenwerking, offerteaanvraag of dossieropvolging.',
            'Technische gegevens die nodig zijn om de website veilig en stabiel te laten werken, zoals serverlogs, IP-adres, browserinformatie en foutmeldingen.',
          ],
        },
        {
          title: '3. Waarom verwerken wij die gegevens en op welke rechtsgrond?',
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
            'Wij bewaren persoonsgegevens niet langer dan nodig. Contactaanvragen en bijhorende correspondentie worden in beginsel uiterlijk 24 maanden na het laatste zinvolle contact verwijderd of herbekeken, tenzij een langere bewaartermijn wettelijk vereist is of nodig is voor de instelling, uitoefening of verdediging van rechtsvorderingen.',
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
            'De huidige contactmodule op deze website helpt u om via uw eigen e-mailtoepassing een bericht aan Nutrivisi te sturen. De eigenlijke verzending van uw bericht verloopt dus via uw e-mailprovider en onze e-mailinfrastructuur.',
            'De website laadt geen externe marketing-, analyse- of fontdiensten in de publieke front-end. Eventuele technische verzoekgegevens blijven beperkt tot wat nodig is voor hosting, aflevering en beveiliging van de site.',
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
        'Deze pagina beschrijft hoe Nutrivisi omgaat met cookies, technische opslag en vergelijkbare online technologieën. De website is momenteel bewust eenvoudig gehouden: geen marketingstack, geen advertentiecookies en geen klassieke analyticsimplementatie.',
      seoTitle: 'Cookies | Nutrivisi',
      seoDescription:
        'Bekijk hoe Nutrivisi omgaat met cookies, technische opslag en externe bronnen op nutrivisi.be.',
      updatedAt: companyFacts.updatedNl,
      summary: [
        { label: 'Huidige status', value: 'Geen opzettelijke marketing- of analysecookies geactiveerd' },
        { label: 'Cookiebanner', value: 'Momenteel niet voorzien zolang geen niet-essentiële cookies actief zijn' },
        { label: 'Externe bronnen', value: 'Geen externe font- of trackingdiensten in de publieke front-end' },
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
            'Op basis van de huidige configuratie gebruikt nutrivisi.be geen opzettelijke analysecookies, advertentiecookies of trackingcookies voor marketingdoeleinden.',
            'Daarom tonen wij op dit moment geen uitgebreide cookiebanner. Als later niet-essentiële cookies of vergelijkbare trackingtechnologieën worden toegevoegd, passen wij dit beleid aan en voorzien wij voorafgaand een passend toestemmingsmechanisme.',
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
            'De publieke website laadt momenteel geen externe font-, analytics- of advertentiediensten in de browser.',
            'Als dat later verandert, wordt dit beleid aangepast en wordt waar nodig vooraf een passend toestemmingsmechanisme voorzien.',
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
            `E-mail: ${companyFacts.secondaryEmail}`,
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
            `Pour toute question relative à cette politique ou au traitement de vos données, vous pouvez écrire à ${companyFacts.email} ou à ${companyFacts.secondaryEmail}.`,
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
            'Le module de contact actuel du site vous aide à ouvrir votre propre application e-mail afin d’envoyer un message à Nutrivisi. L’envoi effectif du message transite donc par votre fournisseur e-mail et par notre infrastructure e-mail.',
            'Le site public ne charge pas de services externes de marketing, d’analytics ou de polices web dans le front-end. Les éventuelles données techniques de requête restent limitées à ce qui est nécessaire pour l’hébergement, la diffusion et la sécurité du site.',
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
        'Cette page décrit l’approche de Nutrivisi concernant les cookies, le stockage technique et les technologies voisines. Le site est actuellement volontairement simple : pas de pile marketing, pas de cookies publicitaires et pas d’implémentation classique d’analytics.',
      seoTitle: 'Cookies | Nutrivisi',
      seoDescription:
        'Consultez la politique de Nutrivisi concernant les cookies, le stockage technique et les ressources externes sur nutrivisi.be.',
      updatedAt: companyFacts.updatedFr,
      summary: [
        { label: 'Statut actuel', value: 'Pas de cookies analytiques ou marketing volontairement activés' },
        { label: 'Bannière de consentement', value: 'Non déployée tant qu’aucun cookie non essentiel n’est activé' },
        { label: 'Services externes', value: 'Pas de service externe de police ou de suivi dans le front-end public' },
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
            'D’après la configuration actuelle, nutrivisi.be n’utilise pas intentionnellement de cookies d’analyse, de publicité ou de suivi à des fins marketing.',
            'C’est pourquoi nous n’affichons pas actuellement de bannière de consentement détaillée. Si des cookies non essentiels ou des technologies de suivi comparables sont ajoutés ultérieurement, cette politique sera adaptée et un mécanisme de consentement approprié sera mis en place au préalable.',
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
            'Le site public ne charge actuellement aucun service externe de police, d’analytics ou de publicité dans le navigateur.',
            'Si cela devait évoluer ultérieurement, cette politique serait mise à jour et, lorsque nécessaire, un mécanisme de consentement approprié serait mis en place au préalable.',
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
            `E-mail : ${companyFacts.secondaryEmail}`,
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
