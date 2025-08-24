function renderPublications() {
  const container = document.getElementById("publications");
  if (!PUBLICATIONS) return;

  PUBLICATIONS.forEach((pub, index) => {
    const pubEl = document.createElement("div");
    pubEl.className = "mb-4";
    pubEl.innerHTML = `
      <p><strong>${pub.title}</strong><br>
      ${pub.authors.join(", ")} (${pub.year})<br>
      <em>${pub.venue}</em></p>
      <a href="${pub.urlPdf}" target="_blank" class="btn btn-outline-primary btn-sm me-2">
        <i class="bi bi-file-earmark-pdf"></i> Visualizza PDF
      </a>
      <button class="btn btn-outline-secondary btn-sm" data-index="${index}" onclick="openCitation(${index})">
        <i class="bi bi-quote"></i> Genera citazione
      </button>
    `;
    container.appendChild(pubEl);
  });
}

function openCitation(index) {
  const pub = PUBLICATIONS[index];
  const authors = pub.authors.join(", ");

  const apa = `${authors} (${pub.year}). ${pub.title}. ${pub.venue}. https://doi.org/${pub.doi}`;
  const mla = `${authors}. "${pub.title}." ${pub.venue}, ${pub.year}.`;
  const chicago = `${authors}. "${pub.title}." ${pub.venue} (${pub.year}).`;
  const bibtex = `@article{${pub.authors[0].split(" ").pop().toLowerCase()}${pub.year},\n  title={${pub.title}},\n  author={${pub.authors.join(" and ")}},\n  journal={${pub.venue}},\n  year={${pub.year}},\n  doi={${pub.doi}}\n}`;

  document.getElementById("apa").textContent = apa;
  document.getElementById("mla").textContent = mla;
  document.getElementById("chicago").textContent = chicago;
  document.getElementById("bibtex").textContent = bibtex;

  new bootstrap.Modal(document.getElementById("citationModal")).show();
}

// Copia citazione
const copyBtn = document.getElementById("copyCitation");
copyBtn.addEventListener("click", () => {
  const activeTab = document.querySelector(".tab-pane.active");
  navigator.clipboard.writeText(activeTab.textContent.trim()).then(() => {
    const toast = document.createElement("div");
    toast.className = "toast align-items-center text-bg-success border-0 show position-fixed bottom-0 end-0 m-3";
    toast.role = "alert";
    toast.innerHTML = `<div class='d-flex'><div class='toast-body'>Citazione copiata!</div><button type='button' class='btn-close btn-close-white me-2 m-auto' data-bs-dismiss='toast'></button></div>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  });
});
