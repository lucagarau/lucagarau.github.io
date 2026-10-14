// Printable CV (cv.html). Same data as the home page, laid out like the classic LaTeX CV.
// The GitHub Action waits for body[data-ready] before printing the PDF.

Site.loadYaml("/data/cv.yml").then(cv => {
  Site.onRender(() => {
    renderCV(cv);
    document.body.dataset.ready = "1";
  });
}).catch(err => {
  document.getElementById("cv").textContent = err.message;
});

const CV_LABELS = {
  it: { personal: "Informazioni personali", education: "Formazione", experience: "Esperienza",
        publications: "Pubblicazioni", conferences: "Conferenze", skills: "Competenze" },
  en: { personal: "Personal Information", education: "Education", experience: "Experience",
        publications: "Publications", conferences: "Conferences Attended", skills: "Skills" },
};

function renderCV(cv) {
  const L = CV_LABELS[Site.lang];
  const p = cv.profile;
  const links = p.links || {};
  document.title = `Curriculum Vitae — ${p.name}`;

  const contacts = [
    p.birthdate && `<div>${esc(p.birthdate)}</div>`,
    p.location && `<div>${esc(Site.tr(p.location))}</div>`,
    p.phone && `<div><i class="bi bi-telephone-fill"></i> ${esc(p.phone)}</div>`,
    links.email && `<div><i class="bi bi-envelope-fill"></i> <a href="mailto:${esc(links.email)}">${esc(links.email)}</a></div>`,
    links.linkedin && `<div><i class="bi bi-linkedin"></i> <a href="${esc(links.linkedin)}">${esc(links.linkedin.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""))}</a></div>`,
    links.github && `<div><i class="bi bi-github"></i> <a href="${esc(links.github)}">${esc(links.github.replace(/^https?:\/\//, ""))}</a></div>`,
  ].filter(Boolean).join("");

  const section = (label, body) => body ? `
    <section class="cv-section">
      <h2 class="cv-label">${label}</h2>
      <div class="cv-body">${body}</div>
    </section>` : "";

  const entry = (head, ...lines) => `
    <div class="cv-entry">
      <h3>${head}</h3>
      ${lines.filter(Boolean).map(l => `<p>${l}</p>`).join("")}
    </div>`;

  const sep = ` <span class="sep">|</span> `;

  const education = (cv.education || []).map(e => entry(
    [esc(Site.tr(e.title)), esc(Site.tr(e.org)), esc(Site.period(e.start, e.end))].join(sep),
    e.grade && `${Site.t("grade")}: ${esc(Site.tr(e.grade))}`,
    e.thesis && `${Site.t("thesis")}: <em>“${esc(Site.tr(e.thesis))}”</em>`,
    esc(Site.tr(e.details || e.summary)),
    e.supervisor && `${Site.t("supervisor")}: ${esc(Site.tr(e.supervisor))}`,
  )).join("");

  const experience = (cv.experience || []).map(e => entry(
    [esc(Site.tr(e.title)), esc(Site.tr(e.org)), esc(Site.period(e.start, e.end))].join(sep),
    esc(Site.tr(e.details || e.summary)),
  )).join("");

  const publications = (cv.publications || []).map(pub => entry(
    `${esc((pub.authors || []).join(", "))}. ${esc(pub.title)}. <span class="venue">${esc(pub.venue)}${pub.pages ? `, pp. ${esc(pub.pages)}` : ""}</span>${sep}${esc(pub.year)}`,
    esc(Site.tr(pub.note)),
    pub.doi && `DOI: <a href="https://doi.org/${esc(pub.doi)}">${esc(pub.doi)}</a>`,
  )).join("");

  const conferences = (cv.conferences || []).map(c => entry(
    `${esc(c.name)}${sep}${esc(c.year)}`,
    esc([Site.tr(c.full), Site.tr(c.when), Site.tr(c.where)].filter(Boolean).join(", ")),
    c.presented && `${Site.t("presented")}: <em>${esc(Site.tr(c.presented))}</em>`,
  )).join("");

  const skills = (cv.skills || []).map(g =>
    `<p><strong>${esc(Site.tr(g.group))}:</strong> ${(g.items || []).map(s => esc(Site.tr(s))).join(", ")}.</p>`
  ).join("");

  document.getElementById("cv").innerHTML = `
    <header class="cv-title">Curriculum Vitae – ${esc(p.name)}</header>
    <section class="cv-section">
      <h2 class="cv-label">${L.personal}</h2>
      <div class="cv-body cv-personal">
        <div>
          <div class="cv-name">${esc(p.name)}</div>
          <div class="cv-role">${esc(Site.tr(p.role))}</div>
          ${contacts}
        </div>
        ${p.photo ? `<img src="/${esc(p.photo)}" alt="" class="cv-photo">` : ""}
        <p class="cv-bio">${esc(Site.tr(p.bio))}</p>
      </div>
    </section>
    ${section(L.education, education)}
    ${section(L.experience, experience)}
    ${section(L.publications, publications)}
    ${section(L.conferences, conferences)}
    ${section(L.skills, skills)}
  `;
}
