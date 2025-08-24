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
  const toggles = document.querySelectorAll("#themeToggle, #footer-themeToggle");
  toggles.forEach(btn => {
    btn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-bs-theme");
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-bs-theme", next);
      localStorage.setItem("theme", next);
    });
  });
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
      "Esperienza": "Experience",
      "Formazione": "Education",
      "Competenze": "Skills",
      "Sistemi Operativi": "Operating Systems",
      "Linguaggi di Programmazione": "Programming Languages",
      "Lingue": "Languages",
      "Research Fellow": "Research Fellow",
      "Teaching Assistant (Database)": "Teaching Assistant (Database)",
      "Teaching Assistant (Numerical Methods)": "Teaching Assistant (Numerical Methods)",
      "University of Cagliari": "University of Cagliari",
      "Supporto ai laboratori per l'insegnamento di SQL": "Support for SQL lab teaching",
      "Supporto al corso di Calcolo Scientifico e Metodi Numerici con Matlab": "Support for Scientific Computing course with Matlab"
    }
  };

  const lang = SITE.lang;
  return translations[lang]?.[text] || text;
}
