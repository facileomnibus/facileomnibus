document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("widgets-container");
  if (!container) return;

  // Estado de menú móvil para poder aligerar widgets mediante CSS solo cuando haga falta
  const mobileMenu = document.querySelector(".mobile-menu-native");
  function syncMobileMenuState() {
    document.body.classList.toggle("facile-mobile-menu-open", !!(mobileMenu && mobileMenu.open));
  }
  if (mobileMenu) {
  mobileMenu.addEventListener("toggle", syncMobileMenuState, { passive: true });
  syncMobileMenuState();

  const desktopQuery = window.matchMedia("(min-width: 768px)");

  function closeMobileMenuOnDesktop() {
    if (desktopQuery.matches && mobileMenu.open) {
      mobileMenu.open = false;
      syncMobileMenuState();
    }
  }

  if (desktopQuery.addEventListener) {
    desktopQuery.addEventListener("change", closeMobileMenuOnDesktop);
  } else if (desktopQuery.addListener) {
    desktopQuery.addListener(closeMobileMenuOnDesktop);
  }

  closeMobileMenuOnDesktop();
}

  // Evita duplicados si el script se ejecuta más de una vez
  const existingBar = container.querySelector(".widgets-bar");
  if (existingBar) existingBar.remove();

  const bar = document.createElement("div");
  bar.className = "widgets-bar";
  container.appendChild(bar);

  let clockTimer = null;
  let dateTimer = null;

  const canRunTimers = () => !document.hidden && !(mobileMenu && mobileMenu.open);

  function clearWidgetTimers() {
    if (clockTimer) window.clearTimeout(clockTimer);
    if (dateTimer) window.clearTimeout(dateTimer);
    clockTimer = null;
    dateTimer = null;
  }

  /* ===============================
     FECHA
  ================================ */
  const dateWidget = document.createElement("div");
  dateWidget.className = "widget-box";

  function updateDate() {
    const now = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    };
    dateWidget.textContent = "📅 " + now.toLocaleDateString("es-ES", options);
  }

  function scheduleDate() {
    if (dateTimer) window.clearTimeout(dateTimer);
    if (!canRunTimers()) return;
    const now = new Date();
    const nextMinute = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds());
    dateTimer = window.setTimeout(() => {
      updateDate();
      scheduleDate();
    }, Math.max(1000, nextMinute));
  }

  updateDate();
  bar.appendChild(dateWidget);

  /* ===============================
     RELOJ
  ================================ */
  const clockWidget = document.createElement("div");
  clockWidget.className = "widget-box";

  function updateClock() {
    const now = new Date();
    clockWidget.textContent = "🕒 " + now.toLocaleTimeString("es-ES");
  }

  function scheduleClock() {
    if (clockTimer) window.clearTimeout(clockTimer);
    if (!canRunTimers()) return;
    const now = new Date();
    const nextSecond = 1000 - now.getMilliseconds();
    clockTimer = window.setTimeout(() => {
      updateClock();
      scheduleClock();
    }, Math.max(250, nextSecond));
  }

  updateClock();
  bar.appendChild(clockWidget);

  function resumeLightTimers() {
    clearWidgetTimers();
    if (canRunTimers()) {
      updateClock();
      updateDate();
      scheduleClock();
      scheduleDate();
    }
  }

  document.addEventListener("visibilitychange", resumeLightTimers, { passive: true });
  if (mobileMenu) mobileMenu.addEventListener("toggle", resumeLightTimers, { passive: true });
  resumeLightTimers();

  /* ===============================
     BUSCADOR MULTI-BUSCADOR
  ================================ */
  const SEARCH_ENGINES = {
    google: {
      label: "Google",
      action: "https://www.google.com/search",
      param: "q",
      placeholder: "Buscar en Google...",
      badge: "G"
    },
    bing: {
      label: "Bing",
      action: "https://www.bing.com/search",
      param: "q",
      placeholder: "Buscar en Bing...",
      badge: "B"
    },
    startpage: {
      label: "Startpage",
      action: "https://www.startpage.com/sp/search",
      param: "query",
      placeholder: "Buscar en Startpage...",
      badge: "S"
    },
    duckduckgo: {
      label: "DuckDuckGo",
      action: "https://duckduckgo.com/",
      param: "q",
      placeholder: "Buscar en DuckDuckGo...",
      badge: "D"
    },
    brave: {
      label: "Brave Search",
      action: "https://search.brave.com/search",
      param: "q",
      placeholder: "Buscar en Brave Search...",
      badge: "B"
    },
    yahoo: {
      label: "Yahoo",
      action: "https://search.yahoo.com/search",
      param: "p",
      placeholder: "Buscar en Yahoo...",
      badge: "Y"
    }
  };

  const savedEngine = localStorage.getItem("facileSearchEngine") || "google";
  const searchWidget = document.createElement("div");
  searchWidget.className = "widget-box facile-search-widget";

  const form = document.createElement("form");
  form.id = "facileSearchForm";
  form.className = "facile-search-form";
  form.method = "get";
  form.target = "_blank";
  form.autocomplete = "off";

  const engineWrap = document.createElement("div");
  engineWrap.className = "facile-search-engine-wrap";

  const badge = document.createElement("span");
  badge.id = "facileSearchBadge";
  badge.className = "facile-search-engine-badge";
  badge.setAttribute("aria-hidden", "true");
  badge.textContent = "G";

  const select = document.createElement("select");
  select.id = "facileSearchEngine";
  select.className = "facile-search-engine";
  select.setAttribute("aria-label", "Seleccionar buscador");

  [
    ["google", "Google"],
    ["bing", "Bing"],
    ["startpage", "Startpage"],
    ["duckduckgo", "DuckDuckGo"],
    ["brave", "Brave Search"],
    ["yahoo", "Yahoo"]
  ].forEach(([value, label]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    select.appendChild(option);
  });

  const input = document.createElement("input");
  input.id = "facileSearchInput";
  input.className = "facile-search-input";
  input.type = "text";
  input.placeholder = "Buscar...";
  input.setAttribute("aria-label", "Buscar");
  input.required = true;

  const submit = document.createElement("button");
  submit.id = "facileSearchSubmit";
  submit.className = "facile-search-submit";
  submit.type = "submit";
  submit.textContent = "Buscar";

  engineWrap.appendChild(badge);
  engineWrap.appendChild(select);
  form.appendChild(engineWrap);
  form.appendChild(input);
  form.appendChild(submit);
  searchWidget.appendChild(form);
  bar.appendChild(searchWidget);

  function normalizeEngineText(text) {
  return (text || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function findSearchEngineIcon(engineKey) {
  const iconAliases = {
    google: "google",
    bing: "bing",
    startpage: "startpage",
    duckduckgo: "duckduckgo",
    brave: "brave",
    yahoo: "yahoo"
  };

  const wantedAlt = normalizeEngineText(iconAliases[engineKey] || engineKey);
  const icons = document.querySelectorAll("#buscadores img");

  for (const img of icons) {
    const alt = normalizeEngineText(img.getAttribute("alt"));
    if (alt === wantedAlt) {
      return img.currentSrc || img.src;
    }
  }

  return "";
}
  function syncSearchEngine(engineKey) {
    const engine = SEARCH_ENGINES[engineKey] || SEARCH_ENGINES.google;
    form.action = engine.action;
    form.setAttribute("data-engine", engineKey);
    input.name = engine.param;
    input.placeholder = engine.placeholder;
    input.setAttribute("aria-label", engine.placeholder);
    const iconSrc = findSearchEngineIcon(engineKey);

badge.textContent = "";

if (iconSrc) {
  const icon = document.createElement("img");
  icon.src = iconSrc;
  icon.alt = "";
  icon.loading = "lazy";
  icon.decoding = "async";
  badge.appendChild(icon);
} else {
  badge.textContent = engine.badge;
}
    badge.setAttribute("data-engine", engineKey);
    select.value = engineKey;
    localStorage.setItem("facileSearchEngine", engineKey);
  }

  select.addEventListener("change", () => {
    syncSearchEngine(select.value);
    input.focus();
  });

  syncSearchEngine(savedEngine);
});
