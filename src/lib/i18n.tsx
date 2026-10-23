import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export const LANGS = ["es", "en", "fr", "de"] as const;
export type Lang = (typeof LANGS)[number];

const en = {
  auth: { lEyebrow: "Crew access", lTitle: "Welcome back, captain.", user: "User number", pass: "Password", lSubmit: "Sign in", noAcc: "No account yet?", rEyebrow: "Join the crew", rTitle: "Become an Air Spain pilot.", first: "First name", last: "Last name", country: "Country", email: "Email", email2: "Repeat email", pass2: "Repeat password", airport: "Nearest airport (ICAO)", vatsim: "VATSIM ID", ivao: "IVAO ID", simbrief: "SimBrief user", optional: "Optional", rSubmit: "Create account", haveAcc: "Already a member?", emailMismatch: "Emails don't match.", passMismatch: "Passwords don't match.", personal: "Personal details", account: "Account", networks: "Flying" },
  nav: { home: "Home", about: "About us", normative: "Normative", resources: "Resources", staff: "Staff", members: "Members", contact: "Contact", login: "Login", register: "Register" },
  footer: "All rights reserved.",
  home: {
    eyebrow: "Virtual Airline",
    title1: "Spain's skies, ", title2: "your", title3: " cockpit.",
    join: "Join as pilot", about: "About us",
    flights: "Active flights", noFlights: "No Air Spain flights are online right now. Check back soon.",
    flyingWith: "Flying with",
  },
  about: {
    eyebrow: "About us", title: "Your freedom to fly.",
    intro: "Air Spain is a project born to offer the freedom so many of us want in the exciting world of virtual aviation.",
    points: [
      ["Fly your way", "From anywhere to anywhere, with any aircraft — offline, on VATSIM or on IVAO."],
      ["Build a career", "Plan weights and fuel, nail your landings and make every flight profitable. Economics is the heart of an airline."],
      ["Made by you", "This company is shaped by its members' ideas, interests and knowledge, so everyone can enjoy it."],
    ],
    welcome: "Welcome aboard!", join: "Join Air Spain",
  },
  normative: {
    eyebrow: "Normative", title: "How we fly.",
    rules: [
      ["General", [
        "Air Spain is a virtual airline that emulates a hypothetical airline through flight simulation. Every member can create routes or use existing ones with any origin, destination and aircraft.",
        'Our flights use the callsign XSNXXXX "Air Spain" for communications.',
        "Fly IFR or VFR, online or offline — total freedom. When connected to a network, follow its rules of conduct and courtesy.",
        "Members flying on VATSIM can file their flight plan directly from our system.",
      ]],
      ["Requirements to join", ["None."]],
      ["Operations", [
        "Each route is planned for the selected aircraft only, with passenger, cargo and fuel data. To fly it with a different aircraft, create a new route with the matching data.",
        "Flights are tracked and reported with the free ACARS program, available in our downloads area.",
      ]],
      ["Privacy", ["Members' personal data is private, for internal use and communication purposes only, in line with Spanish data protection law."]],
      ["Leaving", ["Any member can leave by contacting an administrator at info@air-spain.es. It takes effect immediately."]],
    ] as [string, string[]][],
  },
  members: {
    eyebrow: "Members", title: "Our pilots.",
    cols: ["Callsign", "Pilot", "IVAO ID", "VATSIM ID", "Rank", "Base"], hours: "hours",
  },
  contact: {
    eyebrow: "Contact", title: "Talk to the tower.",
    emailUs: "Email us", emailText: "Questions, ideas or requests — our admins will get back to you.",
    name: "Your name", subject: "Subject", message: "Message", send: "Send message",
  },
};
type Dict = typeof en;

const es: Dict = {
  auth: { lEyebrow: "Acceso tripulación", lTitle: "Bienvenido de nuevo, comandante.", user: "Número de usuario", pass: "Contraseña", lSubmit: "Entrar", noAcc: "¿Aún no tienes cuenta?", rEyebrow: "Únete a la tripulación", rTitle: "Hazte piloto de Air Spain.", first: "Nombre", last: "Apellidos", country: "País", email: "Correo electrónico", email2: "Repite el correo", pass2: "Repite la contraseña", airport: "Aeropuerto más cercano (ICAO)", vatsim: "ID VATSIM", ivao: "ID IVAO", simbrief: "Usuario SimBrief", optional: "Opcional", rSubmit: "Crear cuenta", haveAcc: "¿Ya eres miembro?", emailMismatch: "Los correos no coinciden.", passMismatch: "Las contraseñas no coinciden.", personal: "Datos personales", account: "Cuenta", networks: "Vuelo" },
  nav: { home: "Inicio", about: "Sobre nosotros", normative: "Normativa", resources: "Recursos", staff: "Staff", members: "Pilotos", contact: "Contacto", login: "Acceder", register: "Registro" },
  footer: "Todos los derechos reservados.",
  home: {
    eyebrow: "Aerolínea Virtual",
    title1: "El cielo de España, ", title2: "tu", title3: " cabina.",
    join: "Únete como piloto", about: "Sobre nosotros",
    flights: "Vuelos activos", noFlights: "Ahora mismo no hay vuelos de Air Spain en línea. Vuelve pronto.",
    flyingWith: "Volamos con",
  },
  about: {
    eyebrow: "Sobre nosotros", title: "Tu libertad para volar.",
    intro: "Air Spain es un proyecto que nace para ofrecer la libertad que muchos deseamos en el apasionante mundo de la aviación virtual.",
    points: [
      ["Vuela a tu manera", "Desde donde quieras a donde quieras, con la aeronave que quieras: fuera de línea, en VATSIM o en IVAO."],
      ["Haz carrera", "Calcula pesos y combustible, haz buenas tomas y rentabiliza cada vuelo. La gestión económica es la base de una aerolínea."],
      ["La creas tú", "Esta compañía crece con las ideas, inquietudes y conocimientos de sus miembros, para que todos disfrutemos."],
    ],
    welcome: "¡Bienvenido a bordo!", join: "Únete a Air Spain",
  },
  normative: {
    eyebrow: "Normativa", title: "Cómo volamos.",
    rules: [
      ["General", [
        "Air Spain es una aerolínea virtual que emula la actividad de una compañía hipotética mediante simulador de vuelo. Cada miembro puede crear rutas o usar las existentes con el origen, destino y aeronave que desee.",
        'Nuestros vuelos usan el indicativo XSNXXXX "Air Spain" en las comunicaciones.',
        "Vuela IFR o VFR, online u offline: libertad absoluta. Si te conectas a una red, respeta sus normas de comportamiento y cortesía.",
        "Los miembros que vuelen en VATSIM pueden enviar el plan de vuelo directamente desde nuestro sistema.",
      ]],
      ["Requisitos para unirse", ["Ninguno."]],
      ["Operaciones", [
        "Cada ruta se planifica solo para la aeronave seleccionada, con datos de pasaje, carga y combustible. Para volarla con otra aeronave, crea una ruta nueva con los datos correspondientes.",
        "El seguimiento y reporte del vuelo se hace con el programa gratuito ACARS, disponible en nuestra zona de descargas.",
      ]],
      ["Confidencialidad", ["Los datos personales de los miembros son privados, de uso interno y solo con fines de comunicación, según la ley española de protección de datos."]],
      ["Bajas", ["Cualquier miembro puede darse de baja contactando con un administrador en info@air-spain.es. Será efectiva de inmediato."]],
    ],
  },
  members: {
    eyebrow: "Pilotos", title: "Nuestros pilotos.",
    cols: ["Indicativo", "Piloto", "ID IVAO", "ID VATSIM", "Rango", "Base"], hours: "horas",
  },
  contact: {
    eyebrow: "Contacto", title: "Habla con la torre.",
    emailUs: "Escríbenos", emailText: "Preguntas, ideas o peticiones: nuestros administradores te responderán.",
    name: "Tu nombre", subject: "Asunto", message: "Mensaje", send: "Enviar mensaje",
  },
};

const fr: Dict = {
  auth: { lEyebrow: "Accès équipage", lTitle: "Bon retour, commandant.", user: "Numéro d'utilisateur", pass: "Mot de passe", lSubmit: "Se connecter", noAcc: "Pas encore de compte ?", rEyebrow: "Rejoignez l'équipage", rTitle: "Devenez pilote Air Spain.", first: "Prénom", last: "Nom", country: "Pays", email: "E-mail", email2: "Répétez l'e-mail", pass2: "Répétez le mot de passe", airport: "Aéroport le plus proche (OACI)", vatsim: "ID VATSIM", ivao: "ID IVAO", simbrief: "Utilisateur SimBrief", optional: "Facultatif", rSubmit: "Créer un compte", haveAcc: "Déjà membre ?", emailMismatch: "Les e-mails ne correspondent pas.", passMismatch: "Les mots de passe ne correspondent pas.", personal: "Informations personnelles", account: "Compte", networks: "Vol" },
  nav: { home: "Accueil", about: "À propos", normative: "Règlement", resources: "Ressources", staff: "Équipe", members: "Pilotes", contact: "Contact", login: "Connexion", register: "Inscription" },
  footer: "Tous droits réservés.",
  home: {
    eyebrow: "Compagnie aérienne virtuelle",
    title1: "Le ciel d'Espagne, ", title2: "votre", title3: " cockpit.",
    join: "Devenir pilote", about: "À propos",
    flights: "Vols en cours", noFlights: "Aucun vol Air Spain en ligne pour le moment. Revenez bientôt.",
    flyingWith: "Nous volons avec",
  },
  about: {
    eyebrow: "À propos", title: "La liberté de voler.",
    intro: "Air Spain est un projet né pour offrir la liberté que beaucoup d'entre nous recherchent dans le monde passionnant de l'aviation virtuelle.",
    points: [
      ["Volez à votre façon", "De n'importe où vers n'importe où, avec l'appareil de votre choix — hors ligne, sur VATSIM ou sur IVAO."],
      ["Faites carrière", "Calculez masses et carburant, réussissez vos atterrissages et rentabilisez chaque vol. La gestion économique est le cœur d'une compagnie."],
      ["Créée par vous", "Cette compagnie se construit avec les idées, envies et connaissances de ses membres, pour le plaisir de tous."],
    ],
    welcome: "Bienvenue à bord !", join: "Rejoindre Air Spain",
  },
  normative: {
    eyebrow: "Règlement", title: "Comment nous volons.",
    rules: [
      ["Général", [
        "Air Spain est une compagnie aérienne virtuelle qui simule l'activité d'une compagnie hypothétique via un simulateur de vol. Chaque membre peut créer des routes ou utiliser celles existantes, avec l'origine, la destination et l'appareil de son choix.",
        'Nos vols utilisent l\'indicatif XSNXXXX "Air Spain" pour les communications.',
        "Volez en IFR ou VFR, en ligne ou hors ligne — liberté totale. Sur un réseau, respectez ses règles de conduite et de courtoisie.",
        "Les membres volant sur VATSIM peuvent déposer leur plan de vol directement depuis notre système.",
      ]],
      ["Conditions d'adhésion", ["Aucune."]],
      ["Opérations", [
        "Chaque route est planifiée uniquement pour l'appareil choisi, avec les données de passagers, fret et carburant. Pour la voler avec un autre appareil, créez une nouvelle route avec les données correspondantes.",
        "Le suivi et le rapport de vol se font avec le logiciel gratuit ACARS, disponible dans notre zone de téléchargements.",
      ]],
      ["Confidentialité", ["Les données personnelles des membres sont privées, à usage interne et uniquement à des fins de communication, conformément à la loi espagnole sur la protection des données."]],
      ["Départ", ["Tout membre peut quitter la compagnie en contactant un administrateur à info@air-spain.es. C'est effectif immédiatement."]],
    ],
  },
  members: {
    eyebrow: "Pilotes", title: "Nos pilotes.",
    cols: ["Indicatif", "Pilote", "ID IVAO", "ID VATSIM", "Grade", "Base"], hours: "heures",
  },
  contact: {
    eyebrow: "Contact", title: "Parlez à la tour.",
    emailUs: "Écrivez-nous", emailText: "Questions, idées ou demandes — nos administrateurs vous répondront.",
    name: "Votre nom", subject: "Objet", message: "Message", send: "Envoyer",
  },
};

const de: Dict = {
  auth: { lEyebrow: "Crew-Zugang", lTitle: "Willkommen zurück, Kapitän.", user: "Benutzernummer", pass: "Passwort", lSubmit: "Anmelden", noAcc: "Noch kein Konto?", rEyebrow: "Werde Teil der Crew", rTitle: "Werde Air-Spain-Pilot.", first: "Vorname", last: "Nachname", country: "Land", email: "E-Mail", email2: "E-Mail wiederholen", pass2: "Passwort wiederholen", airport: "Nächster Flughafen (ICAO)", vatsim: "VATSIM-ID", ivao: "IVAO-ID", simbrief: "SimBrief-Benutzer", optional: "Optional", rSubmit: "Konto erstellen", haveAcc: "Schon Mitglied?", emailMismatch: "E-Mails stimmen nicht überein.", passMismatch: "Passwörter stimmen nicht überein.", personal: "Persönliche Daten", account: "Konto", networks: "Fliegen" },
  nav: { home: "Start", about: "Über uns", normative: "Regeln", resources: "Ressourcen", staff: "Team", members: "Piloten", contact: "Kontakt", login: "Anmelden", register: "Registrieren" },
  footer: "Alle Rechte vorbehalten.",
  home: {
    eyebrow: "Virtuelle Airline",
    title1: "Spaniens Himmel, ", title2: "dein", title3: " Cockpit.",
    join: "Pilot werden", about: "Über uns",
    flights: "Aktive Flüge", noFlights: "Derzeit sind keine Air-Spain-Flüge online. Schau bald wieder vorbei.",
    flyingWith: "Wir fliegen mit",
  },
  about: {
    eyebrow: "Über uns", title: "Deine Freiheit zu fliegen.",
    intro: "Air Spain ist ein Projekt, das die Freiheit bieten will, die sich viele von uns in der spannenden Welt der virtuellen Luftfahrt wünschen.",
    points: [
      ["Flieg wie du willst", "Von überall nach überall, mit jedem Flugzeug — offline, auf VATSIM oder auf IVAO."],
      ["Mach Karriere", "Berechne Gewichte und Treibstoff, lande sauber und mach jeden Flug rentabel. Wirtschaftlichkeit ist das Herz einer Airline."],
      ["Von dir gestaltet", "Diese Airline wächst mit den Ideen, Interessen und dem Wissen ihrer Mitglieder, damit alle Freude daran haben."],
    ],
    welcome: "Willkommen an Bord!", join: "Air Spain beitreten",
  },
  normative: {
    eyebrow: "Regeln", title: "So fliegen wir.",
    rules: [
      ["Allgemein", [
        "Air Spain ist eine virtuelle Airline, die den Betrieb einer fiktiven Fluggesellschaft im Flugsimulator nachbildet. Jedes Mitglied kann Routen erstellen oder bestehende nutzen, mit beliebigem Start, Ziel und Flugzeug.",
        'Unsere Flüge nutzen das Rufzeichen XSNXXXX "Air Spain" für den Funkverkehr.',
        "Flieg IFR oder VFR, online oder offline — volle Freiheit. In einem Netzwerk gelten dessen Verhaltens- und Höflichkeitsregeln.",
        "Mitglieder auf VATSIM können ihren Flugplan direkt aus unserem System aufgeben.",
      ]],
      ["Voraussetzungen", ["Keine."]],
      ["Betrieb", [
        "Jede Route ist nur für das gewählte Flugzeug geplant, mit Passagier-, Fracht- und Treibstoffdaten. Für ein anderes Flugzeug erstellst du eine neue Route mit den passenden Daten.",
        "Flüge werden mit dem kostenlosen Programm ACARS verfolgt und gemeldet, erhältlich in unserem Downloadbereich.",
      ]],
      ["Datenschutz", ["Persönliche Daten der Mitglieder sind privat, nur für den internen Gebrauch und zur Kommunikation bestimmt, gemäß spanischem Datenschutzrecht."]],
      ["Austritt", ["Jedes Mitglied kann austreten, indem es einen Administrator unter info@air-spain.es kontaktiert. Der Austritt gilt sofort."]],
    ],
  },
  members: {
    eyebrow: "Piloten", title: "Unsere Piloten.",
    cols: ["Rufzeichen", "Pilot", "IVAO-ID", "VATSIM-ID", "Rang", "Basis"], hours: "Stunden",
  },
  contact: {
    eyebrow: "Kontakt", title: "Sprich mit dem Tower.",
    emailUs: "Schreib uns", emailText: "Fragen, Ideen oder Wünsche — unsere Admins melden sich bei dir.",
    name: "Dein Name", subject: "Betreff", message: "Nachricht", send: "Nachricht senden",
  },
};

export const DICTS: Record<Lang, Dict> = { en, es, fr, de };

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Dict }>({ lang: "es", setLang: () => {}, t: es });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");
  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved && LANGS.includes(saved)) setLangState(saved);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };
  return <Ctx.Provider value={{ lang, setLang, t: DICTS[lang] }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
