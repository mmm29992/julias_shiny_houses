// src/app/components/i18n/strings.ts

export type Lang = "en" | "es";

// 👇 The SHAPE of all strings (values are `string`, not string literals)
export type Strings = {
  topbar: string;
  brand: string;
  subbrand: string;
  nav: { services: string; why: string; gallery: string; contact: string };
  auth: { login: string };
  ctaQuote: string;
  heroH1: string;
  heroP: string;
  heroExplore: string;
  heroRequest: string;
  bullets: string[];
  servicesH2: string;
  servicesP: string;
  svc: {
    deep: { title: string; desc: string };
    recur: { title: string; desc: string };
    move: { title: string; desc: string };
    windows: { title: string; desc: string };
    eco: { title: string; desc: string };
    glass: { title: string; desc: string };
  };
  whyH2: string;
  why: string[];
  ctaBannerH3: string;
  ctaBannerP: string;
  ctaBannerBtn: string;
  contactH2: string;
  contactP: string;
  form: {
    name: string;
    phone: string;
    email: string;
    notes: string;
    send: string;
  };
  preferCall: string;
  areaH3: string;
  areaP: string;
  areaBullets: string[];
  hours: string;
  hoursVal: string;
  contact: string;
  follow: string;
  rights: string;
  langLabel: string;

  // Login modal block
  login: {
    title: string;
    subtitle: string;
    email: string;
    password: string;
    signin: string;
    create: string;
    noAccount: string;
  };
};

// 👇 Concrete values, checked against the shape, but NOT narrowed to literals
export const ui = {
  en: {
    topbar: "Friendly • Trustworthy • Fully Insured",
    brand: "Julia's Shiny Houses",
    subbrand: "Residential & small office cleaning",
    nav: {
      services: "Services",
      why: "Why Us",
      gallery: "Gallery",
      contact: "Contact",
    },
    auth: { login: "Log in" },
    ctaQuote: "Get a Free Quote",
    heroH1: "Sparkling homes, happy families.",
    heroP:
      "Let us handle the mess so you can enjoy the rest. One-time deep cleans, recurring maintenance, and move-in/move-out—tailored to your space and budget.",
    heroExplore: "Explore Services",
    heroRequest: "Request a Quote",
    bullets: [
      "• Eco-friendly options",
      "• Flexible scheduling",
      "• Satisfaction guaranteed",
    ],
    servicesH2: "Our Services",
    servicesP:
      "Choose a one-time reset or keep the shine with weekly, bi-weekly, or monthly visits.",
    svc: {
      deep: {
        title: "Deep Clean",
        desc: "Top-to-bottom detail for kitchens, baths, baseboards, and hard-to-reach areas.",
      },
      recur: {
        title: "Recurring Cleaning",
        desc: "Weekly or bi-weekly upkeep to keep your home fresh and stress-free.",
      },
      move: {
        title: "Move-In / Move-Out",
        desc: "Landlord-ready cleans so moving day is all smiles.",
      },
      windows: {
        title: "Interior & Exterior Windows",
        desc: "Crystal-clear views with streak-free window cleaning add-ons.",
      },
      eco: {
        title: "Eco-Friendly Options",
        desc: "Gentle products available—great for kids, pets, and sensitive surfaces.",
      },
      glass: {
        title: "Glass & Surfaces",
        desc: "Fingerprints gone. Shimmering mirrors, glass, and fixtures.",
      },
    },
    whyH2: "Why families choose Julia",
    why: [
      "Careful, consistent quality each visit",
      "Clear, upfront pricing—no surprises",
      "Local, family-owned, easy booking",
    ],
    ctaBannerH3: "Ready for a spotless home?",
    ctaBannerP:
      "Tell us about your space and schedule—we'll send a fast, friendly estimate.",
    ctaBannerBtn: "Request a Free Quote",
    contactH2: "Get a quote",
    contactP:
      "Share a few details and we’ll reach out with pricing and availability.",
    form: {
      name: "Full name",
      phone: "Phone",
      email: "Email",
      notes: "Tell us about your home (beds/baths, pets, special requests)…",
      send: "Send Request",
    },
    preferCall: "Prefer to text or call?",
    areaH3: "Service Area",
    areaP: "We proudly serve homes in your local area and nearby communities.",
    areaBullets: [
      "• Weekly, bi-weekly, or monthly",
      "• One-time deep cleans",
      "• Move-in / Move-out",
      "• Window & glass add-ons",
    ],
    hours: "Hours",
    hoursVal: "Mon–Sat • 8:00am – 6:00pm",
    contact: "Contact",
    follow: "Follow",
    rights: "All rights reserved.",
    langLabel: "EN",
    login: {
      title: "Welcome back",
      subtitle: "Sign in to Julia’s Shiny Houses",
      email: "Email address",
      password: "Password",
      signin: "Sign in",
      create: "Create one",
      noAccount: "Don’t have an account?",
    },
  },
  es: {
    topbar: "Amables • Confiables • Totalmente asegurados",
    brand: "Casas Brillantes de Julia",
    subbrand: "Limpieza residencial y de oficinas pequeñas",
    nav: {
      services: "Servicios",
      why: "Por qué nosotros",
      gallery: "Galería",
      contact: "Contacto",
    },
    auth: { login: "Iniciar sesión" },
    ctaQuote: "Pide una cotización",
    heroH1: "Hogares relucientes, familias felices.",
    heroP:
      "Déjanos la limpieza para que disfrutes tu tiempo. Limpiezas profundas, mantenimiento recurrente y mudanzas—adaptado a tu espacio y presupuesto.",
    heroExplore: "Ver servicios",
    heroRequest: "Solicitar cotización",
    bullets: [
      "• Opciones ecológicas",
      "• Horarios flexibles",
      "• Satisfacción garantizada",
    ],
    servicesH2: "Nuestros servicios",
    servicesP:
      "Elige una limpieza única o mantén el brillo con visitas semanales, quincenales o mensuales.",
    svc: {
      deep: {
        title: "Limpieza profunda",
        desc: "Detalle total: cocina, baños, zócalos y zonas difíciles de alcanzar.",
      },
      recur: {
        title: "Limpieza recurrente",
        desc: "Mantenimiento semanal o quincenal para un hogar fresco y sin estrés.",
      },
      move: {
        title: "Mudanza (entrada/salida)",
        desc: "Limpieza lista para entregar; día de mudanza sin preocupaciones.",
      },
      windows: {
        title: "Ventanas interiores y exteriores",
        desc: "Vistas cristalinas con limpieza sin rayas.",
      },
      eco: {
        title: "Opciones ecológicas",
        desc: "Productos suaves—ideales para niños, mascotas y superficies delicadas.",
      },
      glass: {
        title: "Vidrios y superficies",
        desc: "Adiós huellas. Espejos, vidrios y grifería brillantes.",
      },
    },
    whyH2: "Por qué las familias eligen a Julia",
    why: [
      "Calidad constante y cuidadosa en cada visita",
      "Precios claros por adelantado—sin sorpresas",
      "Negocio local y familiar con reserva sencilla",
    ],
    ctaBannerH3: "¿Listo para un hogar impecable?",
    ctaBannerP:
      "Cuéntanos sobre tu espacio y horario—te enviaremos una cotización rápida y amable.",
    ctaBannerBtn: "Pedir cotización",
    contactH2: "Pide una cotización",
    contactP:
      "Comparte unos datos y te contactaremos con precios y disponibilidad.",
    form: {
      name: "Nombre completo",
      phone: "Teléfono",
      email: "Correo",
      notes:
        "Cuéntanos de tu hogar (recámaras/baños, mascotas, pedidos especiales)…",
      send: "Enviar",
    },
    preferCall: "¿Prefieres enviar mensaje o llamar?",
    areaH3: "Área de servicio",
    areaP: "Atendemos hogares en tu zona y comunidades cercanas.",
    areaBullets: [
      "• Semanal, quincenal o mensual",
      "• Limpiezas únicas",
      "• Entrada / Salida",
      "• Extras de ventanas y vidrios",
    ],
    hours: "Horario",
    hoursVal: "Lun–Sáb • 8:00am – 6:00pm",
    contact: "Contacto",
    follow: "Síguenos",
    rights: "Todos los derechos reservados.",
    langLabel: "ES",
    login: {
      title: "Bienvenido de nuevo",
      subtitle: "Inicia sesión en Julia’s Shiny Houses",
      email: "Correo electrónico",
      password: "Contraseña",
      signin: "Iniciar sesión",
      create: "Crear una",
      noAccount: "¿No tienes cuenta?",
    },
  },
} satisfies Record<Lang, Strings>;
