# lucagarau.github.io

Sito personale statico (HTML/CSS/JS, nessun framework), pubblicato con GitHub Pages.

## Aggiornare il CV

Tutto il CV vive in **un solo file: [`data/cv.yml`](data/cv.yml)**. Da lì derivano:

- la home del sito (`index.html`)
- il CV web stampabile (`cv.html`)
- i PDF scaricabili `assets/cv/LucaGarau-CV.pdf` (EN) e `LucaGarau-CV-it.pdf` (IT)

Procedura:

1. Modifica `data/cv.yml` (anche direttamente dall'editor web di GitHub: tasto ✏️ sul file).
2. Fai commit su `main`.
3. La GitHub Action **Build CV PDF** rigenera i due PDF e li committa da sola (circa 1 minuto).
   Puoi anche lanciarla a mano da *Actions → Build CV PDF → Run workflow*.

Esempio di nuova esperienza (va in cima alla lista `experience:`):

```yaml
  - title: PhD Student
    org: { it: Università di Cagliari, en: University of Cagliari }
    logo: assets/img/logos/unica.png
    start: 2026
    end: present
    summary:
      it: Dottorato in Computer Graphics.
      en: PhD in Computer Graphics.
```

Note sul formato:

- Testi bilingue: `{ it: "...", en: "..." }`. Se il testo contiene una virgola o i due punti, mettilo tra virgolette.
- `end: present` → "Presente"/"Present". Senza `end` viene mostrato solo l'anno di `start`.
- Campi opzionali per le pubblicazioni: `pdf`, `code` (link), `pages`, `publisher`, `note`.
- `phone` e `birthdate` compaiono solo nel CV stampabile/PDF; lasciali vuoti per nasconderli.

## Aggiungere foto

Copia l'immagine in `assets/img/photos/` e aggiungi una voce in [`data/photos.yml`](data/photos.yml).

## Lavorare in locale

```bash
python -m http.server 8000
```

Poi apri <http://localhost:8000>. (Aprire i file con doppio clic non funziona: i dati YAML vanno caricati via HTTP.)

Per rigenerare i PDF in locale senza aspettare la Action:

```bash
npm install
npm run cv
```

## Struttura

| Percorso | Contenuto |
| --- | --- |
| `data/cv.yml`, `data/photos.yml` | Contenuti |
| `assets/js/core.js` | Lingua, tema, testi dell'interfaccia (IT/EN) |
| `assets/js/home.js`, `cv.js`, `photo.js` | Rendering delle singole pagine |
| `assets/css/style.css` | Stile del sito (colori in `:root`, modifica `--accent` per cambiare tema) |
| `assets/css/cv.css` | Layout del CV stampabile / PDF |
| `scripts/build-cv-pdf.mjs` | Genera i PDF con Puppeteer |
| `.github/workflows/cv-pdf.yml` | Action che rigenera i PDF a ogni modifica del CV |
