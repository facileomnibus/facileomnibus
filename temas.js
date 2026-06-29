/* ===================================
   SISTEMA DE TEMAS DINÁMICOS FACILE
=================================== */
const THEMES = {
  sol: {
    name: "Tema Sol (Predeterminado)",
    colors: {
      primary: "#5290fa",
      secondary: "#009c03",
      background: "linear-gradient(180deg, #62b8ff, #109110)",
      headerBg: "linear-gradient(90deg, #03b7ff, #4ed4fc)",
      textColor: "rgba(255,255,255,0.9)",
      textDark: "#333",
      glass: "rgba(255,255,255,0.15)"
    },
    backgroundImage: "none"
  },
  luna: {
    name: "Tema Luna",
    colors: {
      primary: "#1e88e5",
      secondary: "#26c6da",
      background: "linear-gradient(180deg, #1a1a2e, #16213e)",
      headerBg: "linear-gradient(90deg, #0f3460, #16213e)",
      textColor: "rgba(255,255,255,0.9)",
      textDark: "#e0e0e0",
      glass: "rgba(0,0,0,0.4)"
    },
    backgroundImage: "none"
  },
  forest: {
    name: "Tema Bosque",
    colors: {
      primary: "#2d6a4f",
      secondary: "#40916c",
      background: "linear-gradient(180deg, #1b4332, #2d6a4f)",
      headerBg: "linear-gradient(90deg, #1b4332, #40916c)",
      textColor: "rgba(255,255,255,0.95)",
      textDark: "#d1e7dd",
      glass: "rgba(45,106,79,0.3)"
    },
    backgroundImage: "none"
  },
  sunset: {
    name: "Tema Atardecer",
    colors: {
      primary: "#ff6b35",
      secondary: "#f7931e",
      background: "linear-gradient(180deg, #ffe66d, #ff6b35, #4d243d)",
      headerBg: "linear-gradient(90deg, #f7931e, #ff6b35)",
      textColor: "white",
      textDark: "#333",
      glass: "rgba(255,107,53,0.2)"
    },
    backgroundImage: "none"
  },
  ocean: {
    name: "Tema Océano",
    colors: {
      primary: "#0077be",
      secondary: "#00d4ff",
      background: "linear-gradient(180deg, #001d3d, #0a2a4e, #0077be)",
      headerBg: "linear-gradient(90deg, #0009b5, #0282fa)",
      textColor: "rgba(255,255,255,0.95)",
      textDark: "#b8d4e8",
      glass: "rgba(0,119,190,0.3)"
    },
    backgroundImage: "none"
  },
  aurora: {
    name: "Tema Aurora",
    colors: {
      primary: "#8a5cff",
      secondary: "#10c9a7",
      background: "linear-gradient(180deg, #18204f, #114b58)",
      headerBg: "linear-gradient(90deg, #7b61ff, #13c9aa)",
      textColor: "rgba(255,255,255,0.95)",
      textDark: "#deeff7",
      glass: "rgba(255,255,255,0.14)"
    },
    backgroundImage: "none"
  }
};

const FACILE_THEME_KEY = "selectedTheme";
const FACILE_CUSTOM_BG_KEY = "customBackground";

function syncThemeButtons(themeName) {
  document.querySelectorAll(".theme-btn").forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.theme === themeName);
  });
}

function normalizeBackgroundUrl(value) {
  const url = (value || "").toString().trim();
  if (!url) return "";

  try {
    const parsed = new URL(url, window.location.href);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return "";
    return parsed.href;
  } catch (_) {
    return "";
  }
}

function cssUrl(value) {
  return "url(\"" + value.replace(/\\/g, "\\\\").replace(/\"/g, '\\"') + "\")";
}

function setCustomBackground(backgroundUrl) {
  const root = document.documentElement;
  const normalizedUrl = normalizeBackgroundUrl(backgroundUrl);

  if (normalizedUrl) {
    root.style.setProperty("--custom-background", cssUrl(normalizedUrl));
    localStorage.setItem(FACILE_CUSTOM_BG_KEY, normalizedUrl);
    return normalizedUrl;
  }

  root.style.setProperty("--custom-background", "none");
  localStorage.removeItem(FACILE_CUSTOM_BG_KEY);
  return "";
}

function applyTheme(themeName, backgroundUrl) {
  const themeKey = THEMES[themeName] ? themeName : "sol";
  const theme = THEMES[themeKey];
  const root = document.documentElement;

  root.style.setProperty("--primary-color", theme.colors.primary);
  root.style.setProperty("--secondary-color", theme.colors.secondary);
  root.style.setProperty("--background-gradient", theme.colors.background);
  root.style.setProperty("--header-bg", theme.colors.headerBg);
  root.style.setProperty("--text-color", theme.colors.textColor);
  root.style.setProperty("--text-dark", theme.colors.textDark);
  root.style.setProperty("--glass-bg", theme.colors.glass);

  localStorage.setItem(FACILE_THEME_KEY, themeKey);
  syncThemeButtons(themeKey);

  /*
    Importante:
    - Si backgroundUrl es undefined, NO se toca el fondo personalizado guardado.
    - Si backgroundUrl trae una URL, se guarda y se aplica.
    - Si backgroundUrl es null, se limpia expresamente.
  */
  if (typeof backgroundUrl !== "undefined") {
    if (backgroundUrl === null) {
      setCustomBackground("");
    } else {
      setCustomBackground(backgroundUrl);
    }
    return;
  }

  const savedBackground = localStorage.getItem(FACILE_CUSTOM_BG_KEY);
  if (savedBackground) {
    setCustomBackground(savedBackground);
  } else {
    root.style.setProperty("--custom-background", "none");
  }
}

function applyCustomBackground() {
  const input = document.getElementById("bg-url");
  const url = normalizeBackgroundUrl(input ? input.value : "");

  if (!url) {
    alert("Por favor, pega una URL de imagen válida que empiece por http:// o https://");
    return;
  }

  const currentTheme = localStorage.getItem(FACILE_THEME_KEY) || "sol";
  applyTheme(currentTheme, url);

  if (input) input.value = url;
  alert("✅ Fondo aplicado y guardado");
}

function clearCustomBackground() {
  const currentTheme = localStorage.getItem(FACILE_THEME_KEY) || "sol";
  applyTheme(currentTheme, null);

  const input = document.getElementById("bg-url");
  if (input) input.value = "";

  alert("✅ Fondo limpiado");
}

function loadSavedTheme() {
  const savedTheme = localStorage.getItem(FACILE_THEME_KEY) || "sol";
  const savedBackground = localStorage.getItem(FACILE_CUSTOM_BG_KEY) || undefined;

  applyTheme(savedTheme, savedBackground);

  const input = document.getElementById("bg-url");
  if (input && savedBackground) input.value = savedBackground;
}

document.addEventListener("DOMContentLoaded", () => {
  loadSavedTheme();
});
