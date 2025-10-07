"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";

type Lang = "en" | "es";

const copy = {
  en: {
    topbar: "Friendly • Trustworthy • Fully Insured",
    brand: "Julia's Shiny Houses",
    subbrand: "Residential & small office cleaning",
    nav: { services: "Services", why: "Why Us", gallery: "Gallery", contact: "Contact" },
    ctaQuote: "Get a Free Quote",
    heroH1: "Sparkling homes, happy families.",
    heroP:
      "Let us handle the mess so you can enjoy the rest. One-time deep cleans, recurring maintenance, and move-in/move-out—tailored to your space and budget.",
    heroExplore: "Explore Services",
    heroRequest: "Request a Quote",
    bullets: ["• Eco-friendly options", "• Flexible scheduling", "• Satisfaction guaranteed"],
    servicesH2: "Our Services",
    servicesP: "Choose a one-time reset or keep the shine with weekly, bi-weekly, or monthly visits.",
    svc: {
      deep: { title: "Deep Clean", desc: "Top-to-bottom detail for kitchens, baths, baseboards, and hard-to-reach areas." },
      recur: { title: "Recurring Cleaning", desc: "Weekly or bi-weekly upkeep to keep your home fresh and stress-free." },
      move: { title: "Move-In / Move-Out", desc: "Landlord-ready cleans so moving day is all smiles." },
      windows: { title: "Interior & Exterior Windows", desc: "Crystal-clear views with streak-free window cleaning add-ons." },
      eco: { title: "Eco-Friendly Options", desc: "Gentle products available—great for kids, pets, and sensitive surfaces." },
      glass: { title: "Glass & Surfaces", desc: "Fingerprints gone. Shimmering mirrors, glass, and fixtures." },
    },
    whyH2: "Why families choose Julia",
    why: [
      "Careful, consistent quality each visit",
      "Clear, upfront pricing—no surprises",
      "Local, family-owned, easy booking",
    ],
    ctaBannerH3: "Ready for a spotless home?",
    ctaBannerP: "Tell us about your space and schedule—we'll send a fast, friendly estimate.",
    ctaBannerBtn: "Request a Free Quote",
    contactH2: "Get a quote",
    contactP: "Share a few details and we’ll reach out with pricing and availability.",
    form: { name: "Full name", phone: "Phone", email: "Email", notes: "Tell us about your home (beds/baths, pets, special requests)…", send: "Send Request" },
    preferCall: "Prefer to text or call?",
    areaH3: "Service Area",
    areaP: "We proudly serve homes in your local area and nearby communities.",
    areaBullets: ["• Weekly, bi-weekly, or monthly", "• One-time deep cleans", "• Move-in / Move-out", "• Window & glass add-ons"],
    hours: "Hours",
    hoursVal: "Mon–Sat • 8:00am – 6:00pm",
    contact: "Contact",
    follow: "Follow",
    rights: "All rights reserved.",
    langLabel: "EN",
  },
  es: {
    topbar: "Amables • Confiables • Totalmente asegurados",
    brand: "Casas Brillantes de Julia",
    subbrand: "Limpieza residencial y de oficinas pequeñas",
    nav: { services: "Servicios", why: "Por qué nosotros", gallery: "Galería", contact: "Contacto" },
    ctaQuote: "Pide una cotización",
    heroH1: "Hogares relucientes, familias felices.",
    heroP:
      "Déjanos la limpieza para que disfrutes tu tiempo. Limpiezas profundas, mantenimiento recurrente y mudanzas—adaptado a tu espacio y presupuesto.",
    heroExplore: "Ver servicios",
    heroRequest: "Solicitar cotización",
    bullets: ["• Opciones ecológicas", "• Horarios flexibles", "• Satisfacción garantizada"],
    servicesH2: "Nuestros servicios",
    servicesP: "Elige una limpieza única o mantén el brillo con visitas semanales, quincenales o mensuales.",
    svc: {
      deep: { title: "Limpieza profunda", desc: "Detalle total: cocina, baños, zócalos y zonas difíciles de alcanzar." },
      recur: { title: "Limpieza recurrente", desc: "Mantenimiento semanal o quincenal para un hogar fresco y sin estrés." },
      move: { title: "Mudanza (entrada/salida)", desc: "Limpieza lista para entregar; día de mudanza sin preocupaciones." },
      windows: { title: "Ventanas interiores y exteriores", desc: "Vistas cristalinas con limpieza sin rayas." },
      eco: { title: "Opciones ecológicas", desc: "Productos suaves—ideales para niños, mascotas y superficies delicadas." },
      glass: { title: "Vidrios y superficies", desc: "Adiós huellas. Espejos, vidrios y grifería brillantes." },
    },
    whyH2: "Por qué las familias eligen a Julia",
    why: [
      "Calidad constante y cuidadosa en cada visita",
      "Precios claros por adelantado—sin sorpresas",
      "Negocio local y familiar con reserva sencilla",
    ],
    ctaBannerH3: "¿Listo para un hogar impecable?",
    ctaBannerP: "Cuéntanos sobre tu espacio y horario—te enviaremos una cotización rápida y amable.",
    ctaBannerBtn: "Pedir cotización",
    contactH2: "Pide una cotización",
    contactP: "Comparte unos datos y te contactaremos con precios y disponibilidad.",
    form: { name: "Nombre completo", phone: "Teléfono", email: "Correo", notes: "Cuéntanos de tu hogar (recámaras/baños, mascotas, pedidos especiales)…", send: "Enviar" },
    preferCall: "¿Prefieres enviar mensaje o llamar?",
    areaH3: "Área de servicio",
    areaP: "Atendemos hogares en tu zona y comunidades cercanas.",
    areaBullets: ["• Semanal, quincenal o mensual", "• Limpiezas únicas", "• Entrada / Salida", "• Extras de ventanas y vidrios"],
    hours: "Horario",
    hoursVal: "Lun–Sáb • 8:00am – 6:00pm",
    contact: "Contacto",
    follow: "Síguenos",
    rights: "Todos los derechos reservados.",
    langLabel: "ES",
  },
} as const;

export default function HomePage() {
  const [lang, setLang] = useState<Lang>("en");

  // Persist preference
  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved) setLang(saved);
  }, []);
  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const t = copy[lang];

  return (
    <main className="min-h-screen bg-white text-slate-800">
      {/* Top bar */}
      <div className="w-full bg-emerald-50 border-b border-emerald-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2 text-center text-xs sm:text-sm text-emerald-700">
          {t.topbar}
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 font-bold">
              JSH
            </span>
            <div>
              <p className="font-semibold leading-tight">{t.brand}</p>
              <p className="text-xs text-slate-500 leading-none">{t.subbrand}</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#services" className="hover:text-emerald-700">{t.nav.services}</a>
            <a href="#why" className="hover:text-emerald-700">{t.nav.why}</a>
            <a href="#gallery" className="hover:text-emerald-700">{t.nav.gallery}</a>
            <a href="#contact" className="hover:text-emerald-700">{t.nav.contact}</a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === "en" ? "es" : "en")}
              className="mr-2 rounded-xl border px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
              aria-label="Toggle language"
              title="Toggle language"
            >
              {t.langLabel}
            </button>
            <a
              href="#contact"
              className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
            >
              {t.ctaQuote}
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 grid md:grid-cols-2 gap-8 items-center py-14 md:py-20">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-900">
              {t.heroH1}
            </h1>
            <p className="mt-4 text-slate-600 text-base md:text-lg">{t.heroP}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#services" className="rounded-xl px-4 py-2 bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 shadow">
                {t.heroExplore}
              </a>
              <a href="#contact" className="rounded-xl px-4 py-2 border text-sm font-medium hover:bg-slate-50">
                {t.heroRequest}
              </a>
            </div>
            <ul className="mt-6 text-sm text-slate-600 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {t.bullets.map((b) => <li key={b}>{b}</li>)}
            </ul>
          </div>
          <div className="relative aspect-[4/3] md:aspect-auto md:h-[420px] rounded-3xl overflow-hidden shadow-lg">
            <Image
              src="/oldlady.jpg"
              alt="Professional cleaner wiping a window"
              fill
              className="object-cover"
              priority
              sizes="(min-width:768px) 50vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-16 md:py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">{t.servicesH2}</h2>
            <p className="mt-2 text-slate-600">{t.servicesP}</p>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard title={t.svc.deep.title} img="/sweeper.jpg" alt="Mop on hardwood floor">
              {t.svc.deep.desc}
            </ServiceCard>
            <ServiceCard title={t.svc.recur.title} img="/broompan.jpg" alt="Broom and dustpan">
              {t.svc.recur.desc}
            </ServiceCard>
            <ServiceCard title={t.svc.move.title} img="/duster.jpg" alt="Duster near mirror">
              {t.svc.move.desc}
            </ServiceCard>
            <ServiceCard title={t.svc.windows.title} img="/outsideglasscleaner.jpg" alt="Squeegee on patio glass">
              {t.svc.windows.desc}
            </ServiceCard>
            <ServiceCard title={t.svc.eco.title} img="/greengloves.jpg" alt="Green gloves">
              {t.svc.eco.desc}
            </ServiceCard>
            <ServiceCard title={t.svc.glass.title} img="/glasscleaner.jpg" alt="Cleaning mirror">
              {t.svc.glass.desc}
            </ServiceCard>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section id="why" className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-10 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-2xl sm:text-3xl font-semibold">{t.whyH2}</h2>
            <ul className="mt-6 space-y-3 text-slate-700">
              {t.why.map((w) => (
                <li key={w} className="flex gap-3">
                  <span className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 inline-flex items-center justify-center">✓</span>
                  {w}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <a href="#contact" className="inline-flex items-center rounded-xl px-5 py-2.5 bg-emerald-600 text-white font-medium hover:bg-emerald-700 shadow">
                {t.ctaQuote}
              </a>
            </div>
          </div>
          <div className="order-1 lg:order-2 rounded-3xl overflow-hidden shadow-lg relative h-64 sm:h-80 lg:h-full">
            <Image
              src="/broompan.jpg"
              alt="Broom sweeping a tidy floor"
              fill
              className="object-cover"
              sizes="(min-width:1024px) 50vw, 100vw"
            />
          </div>
        </div>
      </section>

      {/* Gallery strip */}
      <section id="gallery" className="py-10 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {["/oldlady.jpg","/duster.jpg","/glasscleaner.jpg","/greengloves.jpg","/outsideglasscleaner.jpg","/sweeper.jpg"].map((src) => (
              <div key={src} className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image src={src} alt="Cleaning gallery" fill className="object-cover" sizes="(min-width:1024px) 16vw, (min-width:640px) 33vw, 50vw" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mt-10 rounded-3xl overflow-hidden shadow bg-gradient-to-r from-emerald-600 to-emerald-500 text-white">
            <div className="px-6 py-10 md:px-10 md:py-12 grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h3 className="text-2xl font-semibold">{t.ctaBannerH3}</h3>
                <p className="mt-2 text-emerald-50">{t.ctaBannerP}</p>
              </div>
              <div className="md:text-right">
                <a href="#contact" className="inline-flex items-center rounded-xl bg-white text-emerald-700 px-5 py-3 font-medium hover:bg-emerald-50">
                  {t.ctaBannerBtn}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold">{t.contactH2}</h2>
            <p className="mt-2 text-slate-600">{t.contactP}</p>
            <form className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input className="rounded-xl border px-4 py-3" placeholder={t.form.name} />
              <input className="rounded-xl border px-4 py-3" placeholder={t.form.phone} />
              <input className="rounded-xl border px-4 py-3 sm:col-span-2" placeholder={t.form.email} type="email" />
              <textarea className="rounded-xl border px-4 py-3 sm:col-span-2" placeholder={t.form.notes} rows={4} />
              <button className="rounded-xl bg-emerald-600 text-white px-5 py-3 font-medium hover:bg-emerald-700 shadow sm:col-span-2">
                {t.form.send}
              </button>
            </form>
            <p className="mt-4 text-sm text-slate-500">
              {t.preferCall} <span className="font-medium text-slate-700">(###) ###-####</span>
            </p>
          </div>
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">{t.areaH3}</h3>
            <p className="mt-2 text-slate-600">{t.areaP}</p>
            <ul className="mt-4 space-y-2 text-slate-700">
              {t.areaBullets.map((b) => <li key={b}>{b}</li>)}
            </ul>
            <div className="mt-6 rounded-2xl overflow-hidden relative h-60">
              <Image src="/outsideglasscleaner.jpg" alt="Cleaner squeegeeing patio glass" fill className="object-cover" sizes="(min-width:1024px) 33vw, 100vw" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
          <div>
            <p className="font-semibold">{t.brand}</p>
            <p className="mt-2 text-slate-600">
              {lang === "en" ? "Making homes sparkle with care and consistency." : "Hacemos brillar tu hogar con cuidado y consistencia."}
            </p>
          </div>
          <div>
            <p className="font-semibold">{t.hours}</p>
            <p className="mt-2 text-slate-600">{t.hoursVal}</p>
          </div>
          <div>
            <p className="font-semibold">{t.contact}</p>
            <p className="mt-2 text-slate-600">Email: hello@juliashinyhouses.com</p>
            <p className="text-slate-600">Phone: (###) ###-####</p>
          </div>
          <div>
            <p className="font-semibold">{t.follow}</p>
            <p className="mt-2 text-slate-600">Instagram • Facebook</p>
          </div>
        </div>
        <div className="text-center text-xs text-slate-500 pb-8">
          © {new Date().getFullYear()} {t.brand}. {t.rights}
        </div>
      </footer>
    </main>
  );
}

/* ---------- Components ---------- */

type ServiceCardProps = {
  title: string;
  img: string;
  alt: string;
  children: ReactNode;
};

function ServiceCard({ title, img, alt, children }: ServiceCardProps) {
  return (
    <div className="group rounded-3xl overflow-hidden bg-white border shadow-sm hover:shadow-md transition-shadow">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={img}
          alt={alt}
          fill
          className="object-cover group-hover:scale-[1.02] transition-transform"
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
        />
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-600">{children}</p>
      </div>
    </div>
  );
}
