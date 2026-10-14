// Home page: renders profile, timeline, publications, conferences and skills from data/cv.yml.

const SOCIAL_ICONS = {
  email: "bi-envelope",
  github: "bi-github",
  linkedin: "bi-linkedin",
  instagram: "bi-instagram",
  scholar: "bi-mortarboard",
  orcid: "bi-person-badge",
};

const CV_PDF = { it: "/assets/cv/LucaGarau-CV-it.pdf", en: "/assets/cv/LucaGarau-CV.pdf" };

Site.loadYaml("/data/cv.yml").then(cv => {
  Site.onRender(() => renderHome(cv));
  setupCitations(cv.publications || []);
}).catch(err => {
  console.error(err);
  document.getElementById("experience-list").innerHTML = `<li class="error">${esc(err.message)}</li>`;
});

function renderHome(cv) {
  const p = cv.profile;
  document.getElementById("hero-name").textContent = p.name;
  document.getElementById("hero-role").textContent = Site.tr(p.role);
  document.getElementById("hero-bio").textContent = Site.tr(p.bio);
  document.getElementById("hero-location").textContent = Site.tr(p.location);
  if (p.photo) document.getElementById("hero-photo").src = "/" + p.photo;
  document.getElementById("cv-download").href = CV_PDF[Site.lang];

  const links = p.links || {};
  document.getElementById("socials").innerHTML = Object.entries(links).map(([kind, url]) => {
    const href = kind === "email" ? `mailto:${url}` : url;
    const icon = SOCIAL_ICONS[kind] || "bi-link-45deg";
    return `<a class="icon-btn" href="${esc(href)}" target="_blank" rel="noopener" aria-label="${esc(kind)}" title="${esc(kind)}"><i class="bi ${icon}"></i></a>`;
  }).join("");
  document.getElementById("footer-email").innerHTML = links.email
    ? `<a href="mailto:${esc(links.email)}">${esc(links.email)}</a>` : "";

  document.getElementById("experience-list").innerHTML = (cv.experience || []).map(timelineItem).join("");
  document.getElementById("education-list").innerHTML = (cv.education || []).map(timelineItem).join("");
  document.getElementById("publication-list").innerHTML = (cv.publications || []).map(publicationItem).join("");
  document.getElementById("conference-list").innerHTML = (cv.conferences || []).map(conferenceItem).join("");
  document.getElementById("skill-list").innerHTML = (cv.skills || []).map(skillGroup).join("");
}

function timelineItem(item) {
  const extra = [];
  if (item.thesis) extra.push(`<span class="label">${Site.t("thesis")}</span> <em>${esc(Site.tr(item.thesis))}</em>`);
  if (item.grade) extra.push(`<span class="label">${Site.t("grade")}</span> ${esc(Site.tr(item.grade))}`);
  if (item.supervisor) extra.push(`<span class="label">${Site.t("supervisor")}</span> ${esc(Site.tr(item.supervisor))}`);
  const summary = item.summary || item.details;
  const current = item.end === "present";

  return `
    <li class="tl-item${current ? " is-current" : ""}">
      <div class="tl-logo">${item.logo ? `<img src="/${esc(item.logo)}" alt="" loading="lazy">` : `<i class="bi bi-dot"></i>`}</div>
      <div class="tl-body">
        <div class="tl-head">
          <h3>${esc(Site.tr(item.title))}</h3>
          <span class="tl-period">${esc(Site.period(item.start, item.end))}</span>
        </div>
        <p class="tl-org">${esc(Site.tr(item.org))}</p>
        ${summary ? `<p class="tl-text">${esc(Site.tr(summary))}</p>` : ""}
        ${extra.length ? `<ul class="tl-meta">${extra.map(e => `<li>${e}</li>`).join("")}</ul>` : ""}
      </div>
    </li>`;
}

function publicationItem(pub, index) {
  const doiUrl = pub.doi ? `https://doi.org/${pub.doi}` : "";
  const authors = (pub.authors || []).map(a =>
    a === "Luca Garau" ? `<strong>${esc(a)}</strong>` : esc(a)).join(", ");
  return `
    <article class="card pub">
      <div class="pub-year">${esc(pub.year)}</div>
      <div>
        <h3 class="pub-title">${esc(pub.title)}</h3>
        <p class="pub-authors">${authors}</p>
        <p class="pub-venue">${esc(pub.venue)}${pub.pages ? `, pp. ${esc(pub.pages)}` : ""}</p>
        ${pub.note ? `<p class="pub-note">${esc(Site.tr(pub.note))}</p>` : ""}
        <div class="pub-actions">
          ${doiUrl ? `<a class="chip-btn" href="${esc(doiUrl)}" target="_blank" rel="noopener"><i class="bi bi-box-arrow-up-right"></i> DOI</a>` : ""}
          ${pub.pdf ? `<a class="chip-btn" href="${esc(pub.pdf)}" target="_blank" rel="noopener"><i class="bi bi-file-earmark-pdf"></i> PDF</a>` : ""}
          ${pub.code ? `<a class="chip-btn" href="${esc(pub.code)}" target="_blank" rel="noopener"><i class="bi bi-code-slash"></i> Code</a>` : ""}
          <button class="chip-btn" data-cite="${index}"><i class="bi bi-quote"></i> ${Site.t("cite")}</button>
        </div>
      </div>
    </article>`;
}

function conferenceItem(c) {
  return `
    <li>
      <div class="conf-head"><strong>${esc(c.name)}</strong> <span class="muted">${esc(c.year)}</span></div>
      <div class="muted small">${esc(Site.tr(c.full))}</div>
      <div class="muted small">${esc([Site.tr(c.when), Site.tr(c.where)].filter(Boolean).join(" · "))}</div>
      ${c.presented ? `<div class="small conf-presented"><i class="bi bi-mic"></i> ${Site.t("presented")}: <em>${esc(Site.tr(c.presented))}</em></div>` : ""}
    </li>`;
}

function skillGroup(g) {
  return `
    <div class="skill-group">
      <h3>${esc(Site.tr(g.group))}</h3>
      <div class="chips">${(g.items || []).map(s => `<span class="chip">${esc(Site.tr(s))}</span>`).join("")}</div>
    </div>`;
}

// ---- Citations ------------------------------------------------------------

function citationFormats(pub) {
  const authors = pub.authors || [];
  const joined = authors.join(", ");
  const doi = pub.doi ? ` https://doi.org/${pub.doi}` : "";
  const key = (authors[0] || "anon").split(" ").pop().toLowerCase() + pub.year +
    (pub.title || "").split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, "");
  const container = pub.type === "article" ? "journal" : "booktitle";
  const bib = [
    `@${pub.type || "inproceedings"}{${key},`,
    `  title     = {${pub.title}},`,
    `  author    = {${authors.join(" and ")}},`,
    `  ${container.padEnd(9)} = {${pub.venue}},`,
    `  year      = {${pub.year}},`,
    pub.pages ? `  pages     = {${String(pub.pages).replace("–", "--")}},` : null,
    pub.publisher ? `  publisher = {${pub.publisher}},` : null,
    pub.doi ? `  doi       = {${pub.doi}}` : null,
    "}",
  ].filter(Boolean).join("\n");

  return {
    BibTeX: bib,
    APA: `${joined} (${pub.year}). ${pub.title}. In ${pub.venue}${pub.pages ? ` (pp. ${pub.pages})` : ""}.${doi}`,
    MLA: `${joined}. "${pub.title}." ${pub.venue}, ${pub.year}${pub.pages ? `, pp. ${pub.pages}` : ""}.`,
    Chicago: `${joined}. "${pub.title}." In ${pub.venue}${pub.pages ? `, ${pub.pages}` : ""}. ${pub.year}.${doi}`,
  };
}

function setupCitations(publications) {
  const dialog = document.getElementById("cite-dialog");
  const tabs = document.getElementById("cite-tabs");
  const output = document.getElementById("cite-output");
  const copyBtn = document.getElementById("cite-copy");
  let formats = {};

  function show(name) {
    output.textContent = formats[name];
    tabs.querySelectorAll("button").forEach(b => b.setAttribute("aria-selected", String(b.dataset.fmt === name)));
  }

  document.addEventListener("click", e => {
    const btn = e.target.closest("[data-cite]");
    if (!btn) return;
    formats = citationFormats(publications[Number(btn.dataset.cite)]);
    tabs.innerHTML = Object.keys(formats).map(f =>
      `<button type="button" role="tab" data-fmt="${f}">${f}</button>`).join("");
    show("BibTeX");
    dialog.showModal();
  });

  tabs.addEventListener("click", e => {
    const b = e.target.closest("[data-fmt]");
    if (b) show(b.dataset.fmt);
  });

  dialog.addEventListener("click", e => {
    if (e.target === dialog) dialog.close();
  });

  copyBtn.addEventListener("click", async () => {
    await navigator.clipboard.writeText(output.textContent);
    const label = copyBtn.querySelector("span");
    label.textContent = Site.t("copied");
    setTimeout(() => (label.textContent = Site.t("copy")), 1500);
  });
}
