// Shared site logic: language, theme, UI strings, data loading.
// Requires js-yaml (window.jsyaml) to be loaded first.

const SUPPORTED_LANGS = ["it", "en"];

const UI = {
  it: {
    "nav.about": "Chi sono",
    "nav.experience": "Esperienza",
    "nav.education": "Formazione",
    "nav.publications": "Pubblicazioni",
    "nav.photos": "Foto",
    "nav.cv": "CV",
    "hero.cv": "Scarica CV",
    "hero.cvView": "Versione web",
    "hero.contact": "Contattami",
    "sec.experience": "Esperienza",
    "sec.education": "Formazione",
    "sec.publications": "Pubblicazioni",
    "sec.conferences": "Conferenze",
    "sec.skills": "Competenze",
    "present": "Presente",
    "thesis": "Tesi",
    "grade": "Voto",
    "supervisor": "Relatore",
    "presented": "Presentato",
    "cite": "Cita",
    "cite.title": "Cita questo lavoro",
    "copy": "Copia",
    "copied": "Copiato!",
    "close": "Chiudi",
    "theme": "Cambia tema",
    "lang": "Switch to English",
    "photos.title": "Galleria fotografica",
    "photos.lead": "Uno dei miei hobby principali è la fotografia. Qui conservo una selezione di momenti e luoghi che ho voluto immortalare: ogni foto racconta una piccola storia.",
    "photos.prev": "Foto precedente",
    "photos.next": "Foto successiva",
    "cv.title": "Curriculum Vitae",
    "cv.personal": "Informazioni personali",
    "cv.print": "Stampa / Salva PDF",
    "cv.back": "Torna al sito",
    "updated": "Aggiornato",
    "404.title": "Pagina non trovata",
    "404.text": "La pagina che cerchi non esiste o è stata spostata.",
    "404.home": "Torna alla home",
  },
  en: {
    "nav.about": "About",
    "nav.experience": "Experience",
    "nav.education": "Education",
    "nav.publications": "Publications",
    "nav.photos": "Photos",
    "nav.cv": "CV",
    "hero.cv": "Download CV",
    "hero.cvView": "Web version",
    "hero.contact": "Get in touch",
    "sec.experience": "Experience",
    "sec.education": "Education",
    "sec.publications": "Publications",
    "sec.conferences": "Conferences",
    "sec.skills": "Skills",
    "present": "Present",
    "thesis": "Thesis",
    "grade": "Grade",
    "supervisor": "Supervisor",
    "presented": "Presented",
    "cite": "Cite",
    "cite.title": "Cite this work",
    "copy": "Copy",
    "copied": "Copied!",
    "close": "Close",
    "theme": "Toggle theme",
    "lang": "Passa all'italiano",
    "photos.title": "Photo gallery",
    "photos.lead": "Photography is one of my main hobbies. Here I keep a selection of moments and places I wanted to capture: every photo tells a small story.",
    "photos.prev": "Previous photo",
    "photos.next": "Next photo",
    "cv.title": "Curriculum Vitae",
    "cv.personal": "Personal information",
    "cv.print": "Print / Save PDF",
    "cv.back": "Back to site",
    "updated": "Updated",
    "404.title": "Page not found",
    "404.text": "The page you are looking for does not exist or has been moved.",
    "404.home": "Back to home",
  },
};

function safeStorage(op, key, value) {
  try {
    return op === "get" ? localStorage.getItem(key) : localStorage.setItem(key, value);
  } catch {
    return null;
  }
}

// ?lang=en in the URL wins (used by the PDF build), then saved choice, then browser.
function detectLang() {
  const fromUrl = new URLSearchParams(location.search).get("lang");
  const saved = safeStorage("get", "lang");
  const browser = (navigator.language || "it").slice(0, 2);
  return [fromUrl, saved, browser].find(l => SUPPORTED_LANGS.includes(l)) || "it";
}

const Site = {
  lang: detectLang(),
  renderers: [],

  t(key) {
    return UI[this.lang][key] ?? key;
  },

  // Resolves a bilingual value: "text" or { it: "...", en: "..." }.
  tr(value) {
    if (value == null) return "";
    if (typeof value === "object" && !Array.isArray(value)) {
      return value[this.lang] ?? value.it ?? value.en ?? "";
    }
    return String(value);
  },

  period(start, end) {
    if (!start) return "";
    if (!end) return String(start);
    const e = end === "present" ? this.t("present") : end;
    return `${start} – ${e}`;
  },

  async loadYaml(path) {
    const res = await fetch(path, { cache: "no-cache" });
    if (!res.ok) throw new Error(`Impossibile caricare ${path}: ${res.status}`);
    return jsyaml.load(await res.text());
  },

  // Register a function that (re)draws dynamic content; it re-runs on language change.
  onRender(fn) {
    this.renderers.push(fn);
    fn();
  },

  applyStaticStrings() {
    document.documentElement.lang = this.lang;
    document.querySelectorAll("[data-i18n]").forEach(el => {
      el.textContent = this.t(el.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-label]").forEach(el => {
      const label = this.t(el.dataset.i18nLabel);
      el.setAttribute("aria-label", label);
      el.setAttribute("title", label);
    });
    document.querySelectorAll("[data-lang-label]").forEach(el => {
      el.textContent = this.lang === "it" ? "EN" : "IT";
    });
  },

  setLang(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) return;
    this.lang = lang;
    safeStorage("set", "lang", lang);
    this.applyStaticStrings();
    this.renderers.forEach(fn => fn());
  },

  toggleTheme() {
    const root = document.documentElement;
    const current = root.dataset.theme ||
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    safeStorage("set", "theme", next);
  },

  init() {
    this.applyStaticStrings();
    document.querySelectorAll("[data-action=theme]").forEach(btn =>
      btn.addEventListener("click", () => this.toggleTheme()));
    document.querySelectorAll("[data-action=lang]").forEach(btn =>
      btn.addEventListener("click", () => this.setLang(this.lang === "it" ? "en" : "it")));

    const menuBtn = document.querySelector("[data-action=menu]");
    const header = document.querySelector(".site-header");
    if (menuBtn && header) {
      menuBtn.addEventListener("click", () => {
        const open = header.classList.toggle("menu-open");
        menuBtn.setAttribute("aria-expanded", String(open));
      });
      header.querySelectorAll(".nav a").forEach(a => a.addEventListener("click", () => {
        header.classList.remove("menu-open");
        menuBtn.setAttribute("aria-expanded", "false");
      }));
    }

    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
  },
};

// Minimal HTML escaping for values interpolated into templates.
function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

document.addEventListener("DOMContentLoaded", () => Site.init());
