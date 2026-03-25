/* ===================================
   SISTEMA DE TEMAS DINÁMICOS FACILE
================================== */

const THEMES = {
  sol: {
    name: "Tema Sol (Predeterminado)",
    colors: {
      primary: "#035fff",
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
  }
};

// Función para aplicar tema
function applyTheme(themeName, backgroundUrl = null) {
  const theme = THEMES[themeName] || THEMES.light;
  const root = document.documentElement;
  
  // Aplicar variables CSS
  root.style.setProperty("--primary-color", theme.colors.primary);
  root.style.setProperty("--secondary-color", theme.colors.secondary);
  root.style.setProperty("--background-gradient", theme.colors.background);
  root.style.setProperty("--header-bg", theme.colors.headerBg);
  root.style.setProperty("--text-color", theme.colors.textColor);
  root.style.setProperty("--text-dark", theme.colors.textDark);
  root.style.setProperty("--glass-bg", theme.colors.glass);
  
  // Aplicar fondo personalizado si existe
  if (backgroundUrl) {
    root.style.setProperty("--custom-background", `url('${backgroundUrl}')`);
  } else {
    root.style.setProperty("--custom-background", "none");
  }
  
  // Guardar en localStorage
  localStorage.setItem("selectedTheme", themeName);
  if (backgroundUrl) {
    localStorage.setItem("customBackground", backgroundUrl);
  }
}

// Cargar tema guardado al iniciar
function loadSavedTheme() {
  const savedTheme = localStorage.getItem("selectedTheme") || "light";
  const savedBackground = localStorage.getItem("customBackground");
  applyTheme(savedTheme, savedBackground);
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", loadSavedTheme); 
