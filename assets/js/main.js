document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();
  setupThemeToggle();
  setupLangDropdown();
});

function renderCV() {
  const container = document.getElementById("cv-sections");
  if (!CV || !CV.sections) return;

  container.innerHTML = "";
  CV.sections.forEach(section => {
    const sectionEl = document.createElement("section");
    sectionEl.className = "mb-5";
    sectionEl.innerHTML = `<h2>${translate(section.title)}</h2>`;

    section.items.forEach(item => {
      const logo = item.logo ? `<img src="${item.logo}" alt="Logo ${item.organization}" class="me-3" width="48" height="48" loading="lazy">` : "";
      const bullets = item.description ? `<ul>${item.description.map(d => `<li>${translate(d)}</li>`).join('')}</ul>` : "";

      sectionEl.innerHTML += `
        <div class="d-flex align-items-start mb-3">
          ${logo}
          <div>
            <h5 class="mb-1">${translate(item.title)}</h5>
            <p class="mb-0"><strong>${translate(item.organization)}</strong> | <em>${item.period}</em></p>
            ${bullets}
          </div>
        </div>
      `;
    });

    container.appendChild(sectionEl);
    container.appendChild(document.createElement("hr"));
  });
}

function setupThemeToggle() {
  console.log("[ThemeToggle] init");

  const toggles = document.querySelectorAll("#themeToggle, #footer-themeToggle");
  console.log("[ThemeToggle] trovati", toggles.length, "bottoni");

  toggles.forEach(btn => {
    console.log("[ThemeToggle] aggiungo listener a:", btn.id);
    btn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-bs-theme");
      console.log("[ThemeToggle] click su", btn.id, "tema attuale:", current);

      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-bs-theme", next);
      localStorage.setItem("theme", next);

      console.log("[ThemeToggle] nuovo tema:", next);
    });
  });

  // debug: mostra cosa legge all'avvio
  console.log("[ThemeToggle] data-bs-theme iniziale:", 
              document.documentElement.getAttribute("data-bs-theme"));
  console.log("[ThemeToggle] localStorage.theme:", localStorage.getItem("theme"));
}

function setupLangDropdown() {
  const dropdown = document.getElementById("langDropdown");
  if (!dropdown) return;
  dropdown.value = SITE.lang;
  dropdown.addEventListener("change", e => {
    switchLang(e.target.value);
  });
}

function translate(text) {
  const translations = {
    en: {
        // Navbar
        "Home": "Home",
        "Photos": "Photos",
        "Projects": "Projects",

        // Hero / Intro
        "Ricercatore & Sviluppatore": "Researcher & Developer",
        "Researcher & Developer": "Researcher & Developer",
        "Sono uno sviluppatore specializzato in Computer Graphics e AI, laureato magistrale in Informatica all'Università degli studi di Cagliari.":
          "I am a developer specialized in Computer Graphics and AI, with a Master's degree in Computer Science from the University of Cagliari.",
        "Email": "Email",
        "Download CV": "Download CV",

        // Sezioni CV
        "Esperienza": "Experience",
        "Formazione": "Education",
        "Competenze": "Skills",
        "Sistemi Operativi": "Operating Systems",
        "Linguaggi di Programmazione": "Programming Languages",
        "Lingue": "Languages",

        // Esperienza specifica
        "Ricerca in Computer Graphics e Geometry Processing":
          "Research in Computer Graphics and Geometry Processing",
        "Analisi di configurazioni di mesh coding per contenuti immersivi in VR":
          "Analysis of mesh coding configurations for immersive VR content",
        "Supporto ai laboratori per l'insegnamento di SQL":
          "Support for SQL lab teaching",
        "Supporto al corso di Calcolo Scientifico e Metodi Numerici con Matlab":
          "Support for the Scientific Computing and Numerical Methods course with Matlab",

        // Formazione
        "Master Degree in Computer Science (Graphics and Vision)":
          "Master's Degree in Computer Science (Graphics and Vision)",
        "Bachelor Degree in Computer Science":
          "Bachelor's Degree in Computer Science",
        "Tesi: Classification and Robust Management of Triangle Intersections Using Alternative Numerical Representations":
          "Thesis: Classification and Robust Management of Triangle Intersections Using Alternative Numerical Representations",
        "Tesi: An AI Approach to EEG-based Emotion Recognition using a Consumer Device":
          "Thesis: An AI Approach to EEG-based Emotion Recognition using a Consumer Device",
        "Voto: 100/100 cum laude": "Grade: 100/100 cum laude",
        "Voto: 110/110 cum laude": "Grade: 110/110 cum laude",
        "Supervisor: Dott. Gianmarco Cherchi": "Supervisor: Dr. Gianmarco Cherchi",
        "Supervisor: Prof. Daniele Riboni": "Supervisor: Prof. Daniele Riboni",
        "Samsung Electronics Italia SPA": "Samsung Electronics Italia S.p.A.",
        "EG PhD School": "EG PhD School",

        // Periodi / date
        "Presente": "Present",
        "2025 – Presente": "2025 – Present",
        "2024 – Presente": "2024 – Present",
        "2023 – Presente": "2023 – Present",

        // Profilo / Bio / Luogo
        "Specialista in Computer Graphics, AI e Geometry Processing. Ricercatore presso l'Università di Cagliari.":
          "Specialist in Computer Graphics, AI and Geometry Processing. Researcher at the University of Cagliari.",
        "Cagliari, Italia": "Cagliari, Italy",

        // Sezione pubblicazioni
        "Pubblicazioni": "Publications",

        // Footer
        "Toggle tema": "Toggle theme",

        // Modale citazioni
        "Genera citazione": "Generate citation",
        "Chiudi": "Close",
        "Copia": "Copy",
        "APA": "APA",
        "MLA": "MLA",
        "Chicago": "Chicago",
        "BibTeX": "BibTeX",

        // Didascalie foto
        "Vista del Big Ben a Londra all'uscita della stazione della metro Westminster.":
          "View of Big Ben in London from the exit of Westminster underground station.",
        "Panoramica del fiume Moldava a Praga. Al centro il ponte Carlo.":
          "Panoramic view of the Vltava river in Prague. In the center, Charles Bridge.",
        "Foto area del mare sotto la Sella del Diavolo a Cagliari.":
          "Aerial photo of the sea below the Sella del Diavolo in Cagliari.",
        "Case tipiche Bretoni. Foto scattata a Saint-Malo in Francia.":
          "Typical Breton houses. Photo taken in Saint-Malo, France.",

        // Accessibilità / alt
        "Foto profilo Luca Garau": "Profile photo of Luca Garau"
      }
  };

  const lang = SITE.lang;
  return translations[lang]?.[text] || text;
}
