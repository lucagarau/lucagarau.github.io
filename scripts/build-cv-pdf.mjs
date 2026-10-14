// Generates assets/cv/LucaGarau-CV.pdf (EN) and LucaGarau-CV-it.pdf (IT) from cv.html.
// Usage: npm install && npm run cv
// Also used by .github/workflows/cv-pdf.yml.

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const ROOT = resolve(fileURLToPath(import.meta.url), "../..");
const OUTPUTS = [
  { lang: "en", file: "assets/cv/LucaGarau-CV.pdf" },
  { lang: "it", file: "assets/cv/LucaGarau-CV-it.pdf" },
];

const TYPES = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".yml": "text/yaml",
  ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml",
};

// Minimal static server so cv.html can fetch data/cv.yml exactly like on GitHub Pages.
const server = createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^([/\\])+/, "");
  const file = join(ROOT, path || "index.html");
  if (!file.startsWith(ROOT)) return res.writeHead(403).end();
  try {
    const body = await readFile(file);
    res.writeHead(200, { "Content-Type": TYPES[extname(file)] || "application/octet-stream" }).end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise(r => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
try {
  for (const { lang, file } of OUTPUTS) {
    const page = await browser.newPage();
    await page.emulateMediaType("print");
    await page.goto(`${base}/cv.html?lang=${lang}`, { waitUntil: "networkidle0" });
    await page.waitForSelector("body[data-ready]", { timeout: 20000 });
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({ path: join(ROOT, file), format: "A4", printBackground: true, preferCSSPageSize: true });
    console.log(`✓ ${file}`);
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}
