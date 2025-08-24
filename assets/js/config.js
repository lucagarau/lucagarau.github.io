const SITE = {
  name: "Luca Garau",
  baseUrl: "https://username.github.io/",
  primaryColor: "#6C63FF",
  accentColor: "#00D1B2",
  email: "lucagarau147@gmail.com",
  defaultLang: "it"
};

document.documentElement.style.setProperty('--accent', SITE.accentColor);

// Dark mode
const userPref = localStorage.getItem("theme");
const systemPref = window.matchMedia("(prefers-color-scheme: dark)").matches;
const currentTheme = userPref || (systemPref ? "dark" : "light");
document.documentElement.setAttribute("data-bs-theme", currentTheme);

// Lingua
const supportedLangs = ["it", "en"];
const savedLang = localStorage.getItem("lang") || navigator.language.slice(0, 2);
SITE.lang = supportedLangs.includes(savedLang) ? savedLang : SITE.defaultLang;

function switchLang(lang) {
  if (!supportedLangs.includes(lang)) return;
  localStorage.setItem("lang", lang);
  location.reload();
}
