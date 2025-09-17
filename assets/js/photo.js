document.getElementById("year").textContent = new Date().getFullYear();

let PHOTOS = [];
let currentIndex = 0;

// Crea il lightbox una sola volta
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.setAttribute('aria-hidden', 'true');
lightbox.innerHTML = `
    <div class="lb-backdrop" data-close="true"></div>
    <div class="lb-layer" role="dialog" aria-modal="true" aria-label="Foto a schermo intero">
      <button class="lb-close" aria-label="Torna alla galleria">×</button>
      <figure class="polaroid polaroid-large" tabindex="-1">
        <img id="lb-image" alt="">
        <figcaption class="caption" id="lb-caption"></figcaption>
        <div class="date-label" id="lb-date"></div>
      </figure>
      <button class="lb-nav lb-prev" aria-label="Foto precedente">‹</button>
      <button class="lb-nav lb-next" aria-label="Foto successiva">›</button>
    </div>
  `;
document.body.appendChild(lightbox);

const lbImg = lightbox.querySelector('#lb-image');
const lbCaption = lightbox.querySelector('#lb-caption');
const lbDate = lightbox.querySelector('#lb-date');

fetch('../data/photos.json')
  .then(res => res.json())
  .then(photos => {
    PHOTOS = photos;
    renderPhotos(photos);
    attachGalleryHandlers();
  });

function renderPhotos(photos) {
  const container = document.getElementById("photo-gallery");
  container.innerHTML = '';

  // rotazioni e spostamenti leggeri per "sparpagliare"
  const ROTATIONS = [-4, -3, -2, -1.5, -1, 1, 1.5, 2, 3, 4]; // gradi
  const STAGGERS = ["stagger-1", "stagger-2", "stagger-3", "stagger-4"];

  photos.forEach((photo, i) => {
    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-md-4 col-lg-3";
    col.dataset.index = i;

    // scegli rotazione/shift casuali e una classe di stagger per rompere la regolarità
    const rot = ROTATIONS[Math.floor(Math.random() * ROTATIONS.length)];
    const shift = Math.floor(Math.random() * 10) - 5; // da -5px a +4px
    col.classList.add(STAGGERS[Math.floor(Math.random() * STAGGERS.length)]);

    col.innerHTML = `
      <div class="polaroid" role="button" tabindex="0" aria-label="Apri foto: ${photo.description}">
        <img src="../${photo.url}" alt="${photo.description}" loading="lazy">
        <div class="caption">${photo.description}</div>
        <div class="date-label">${photo.date}</div>
      </div>
    `;

    // applica variabili CSS alla singola polaroid
    const card = col.querySelector('.polaroid');
    card.style.setProperty('--rot', rot + 'deg');
    card.style.setProperty('--shift', shift + 'px');
  

    container.appendChild(col);
  });
}

function attachGalleryHandlers() {
  const container = document.getElementById("photo-gallery");

  // Click o Enter/Space su una polaroid => apri lightbox
  container.addEventListener('click', (e) => {
    const card = e.target.closest('.polaroid');
    if (!card) return;
    const idx = Number(card.parentElement.dataset.index);
    openLightbox(idx);
  });

  container.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('polaroid')) {
      e.preventDefault();
      const idx = Number(e.target.parentElement.dataset.index);
      openLightbox(idx);
    }
  });

  // Pulsanti lightbox
  lightbox.querySelector('.lb-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lb-prev').addEventListener('click', prevPhoto);
  lightbox.querySelector('.lb-next').addEventListener('click', nextPhoto);

  lightbox.addEventListener('click', (e) => {
    const clickedBackdrop = e.target.classList.contains('lb-backdrop');
    const clickedOutsideFigure = !e.target.closest('.polaroid-large') && !!e.target.closest('.lb-layer');
    if (clickedBackdrop || clickedOutsideFigure) closeLightbox();
  });

  ['.lb-close', '.lb-prev', '.lb-next', '.polaroid-large'].forEach(sel => {
    lightbox.querySelector(sel).addEventListener('click', (e) => e.stopPropagation());
  });

  // Tastiera
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextPhoto();
    if (e.key === 'ArrowLeft') prevPhoto();
  });

  // Swipe su mobile
  let touchStartX = 0, touchEndX = 0;
  lightbox.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    const dx = touchEndX - touchStartX;
    if (Math.abs(dx) > 40) dx < 0 ? nextPhoto() : prevPhoto();
  });
}

function openLightbox(index) {
  currentIndex = index;
  renderLightbox();
  document.body.classList.add('no-scroll');
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  // focus for a11y
  lightbox.querySelector('.polaroid-large').focus();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
}

function renderLightbox() {
  const p = PHOTOS[currentIndex];
  lbImg.src = `../${p.url}`;
  lbImg.alt = p.description || '';
  lbCaption.textContent = p.description || '';
  lbDate.textContent = p.date || '';
}

function nextPhoto() {
  currentIndex = (currentIndex + 1) % PHOTOS.length;
  renderLightbox();
}

function prevPhoto() {
  currentIndex = (currentIndex - 1 + PHOTOS.length) % PHOTOS.length;
  renderLightbox();
}

lightbox.querySelector('.lb-close').addEventListener('click', (e) => {
  e.stopPropagation();
  closeLightbox();
});