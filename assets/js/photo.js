// Photo gallery (pages/photos.html): polaroid grid + lightbox, data from data/photos.yml.

const ROTATIONS = [-3, -2, -1.5, -1, 1, 1.5, 2, 3];

let PHOTOS = [];
let currentIndex = 0;

const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lb-image");
const lbCaption = document.getElementById("lb-caption");
const lbMeta = document.getElementById("lb-meta");

Site.loadYaml("/data/photos.yml").then(photos => {
  PHOTOS = photos || [];
  // Rotation is picked once so it doesn't change when switching language.
  PHOTOS.forEach(p => (p._rot = ROTATIONS[Math.floor(Math.random() * ROTATIONS.length)]));
  Site.onRender(renderPhotos);
  setupLightbox();
});

function photoMeta(p) {
  return [p.date, p.camera].filter(Boolean).join(" · ");
}

function renderPhotos() {
  const gallery = document.getElementById("photo-gallery");
  gallery.innerHTML = PHOTOS.map((p, i) => {
    const caption = Site.tr(p.caption);
    return `
      <button class="polaroid" data-index="${i}" style="--rot:${p._rot}deg" aria-label="${esc(caption)}">
        <img src="/${esc(p.file)}" alt="${esc(caption)}" loading="lazy">
        <span class="caption">${esc(caption)}</span>
        <span class="meta">${esc(photoMeta(p))}</span>
      </button>`;
  }).join("");

  if (lightbox.open) showPhoto(currentIndex);
}

function showPhoto(index) {
  currentIndex = (index + PHOTOS.length) % PHOTOS.length;
  const p = PHOTOS[currentIndex];
  lbImg.src = "/" + p.file;
  lbImg.alt = Site.tr(p.caption);
  lbCaption.textContent = Site.tr(p.caption);
  lbMeta.textContent = photoMeta(p);
}

function setupLightbox() {
  document.getElementById("photo-gallery").addEventListener("click", e => {
    const card = e.target.closest(".polaroid");
    if (!card) return;
    showPhoto(Number(card.dataset.index));
    lightbox.showModal();
  });

  lightbox.querySelector(".lb-close").addEventListener("click", () => lightbox.close());
  lightbox.querySelector(".lb-prev").addEventListener("click", () => showPhoto(currentIndex - 1));
  lightbox.querySelector(".lb-next").addEventListener("click", () => showPhoto(currentIndex + 1));

  // Click on the backdrop (outside the polaroid and buttons) closes.
  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) lightbox.close();
  });

  document.addEventListener("keydown", e => {
    if (!lightbox.open) return;
    if (e.key === "ArrowRight") showPhoto(currentIndex + 1);
    if (e.key === "ArrowLeft") showPhoto(currentIndex - 1);
  });

  let touchStartX = 0;
  lightbox.addEventListener("touchstart", e => (touchStartX = e.changedTouches[0].screenX), { passive: true });
  lightbox.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 40) showPhoto(currentIndex + (dx < 0 ? 1 : -1));
  });
}
