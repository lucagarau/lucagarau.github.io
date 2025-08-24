document.getElementById("year").textContent = new Date().getFullYear();
    setupThemeToggle();
    setupLangDropdown();

    fetch('../data/photos.json')
      .then(res => res.json())
      .then(photos => renderPhotos(photos));

    function renderPhotos(photos) {
      const container = document.getElementById("photo-gallery");
      photos.forEach(photo => {
        const col = document.createElement("div");
        col.className = "col-12 col-sm-6 col-md-4 col-lg-3";

        col.innerHTML = `
          <div class="polaroid">
            <img src="../${photo.url}" alt="${photo.description}" loading="lazy">
            <div class="caption">${photo.description}</div>
            <div class="date-label">${photo.date}</div>
          </div>
        `;
        container.appendChild(col);
      });
    }