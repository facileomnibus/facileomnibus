document.addEventListener("DOMContentLoaded", () => {
  function initTopWidgets() {
    const container = document.getElementById("widgets-container");
    if (!container) return;

    // Evita duplicados si el script se ejecuta más de una vez
    const existingBar = container.querySelector(".widgets-bar");
    if (existingBar) existingBar.remove();

    const bar = document.createElement("div");
    bar.className = "widgets-bar";
    container.appendChild(bar);

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

    updateDate();
    window.setInterval(updateDate, 60 * 1000);
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

    updateClock();
    window.setInterval(updateClock, 1000);
    bar.appendChild(clockWidget);

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

    function syncSearchEngine(engineKey) {
      const engine = SEARCH_ENGINES[engineKey] || SEARCH_ENGINES.google;
      form.action = engine.action;
      form.setAttribute("data-engine", engineKey);
      input.name = engine.param;
      input.placeholder = engine.placeholder;
      input.setAttribute("aria-label", engine.placeholder);
      badge.textContent = engine.badge;
      badge.setAttribute("data-engine", engineKey);
      select.value = engineKey;
      localStorage.setItem("facileSearchEngine", engineKey);
    }

    select.addEventListener("change", () => {
      syncSearchEngine(select.value);
      input.focus();
    });

    syncSearchEngine(savedEngine);
  }

  function initMobileMenu() {
    const menuBtn = document.getElementById("mobileMenuToggle") || document.querySelector(".menu-icon");
    const menu = document.getElementById("site-menu") || document.querySelector(".navigation ul");
    if (!menuBtn || !menu) return;

    // Evita volver a enlazar el mismo botón y generar comportamientos raros
    if (menuBtn.dataset.menuInit === "true") return;
    menuBtn.dataset.menuInit = "true";

    const setMenuState = (open) => {
  menu.classList.toggle("show", open);
  menuBtn.classList.toggle("is-open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  document.body.classList.toggle("mobile-menu-open", open);
};

const isMenuOpen = () => menu.classList.contains("show");

setMenuState(false);

/* Evita que el mismo clic que abre/cierra el botón
   dispare inmediatamente el cierre del documento */
let ignoreDocumentClick = false;

const toggleMenu = (event) => {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  ignoreDocumentClick = true;
  setMenuState(!isMenuOpen());

  window.setTimeout(() => {
    ignoreDocumentClick = false;
  }, 0);
};

menuBtn.addEventListener("click", toggleMenu);

menuBtn.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    toggleMenu(event);
  }
});

document.addEventListener("click", (event) => {
  if (ignoreDocumentClick || !isMenuOpen()) return;

  const clickedInsideMenu = menu.contains(event.target);
  const clickedButton = menuBtn.contains(event.target);

  if (!clickedInsideMenu && !clickedButton) {
    setMenuState(false);
  }
});

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isMenuOpen()) {
        setMenuState(false);
      }
    });

    menu.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      if (link) {
        setMenuState(false);
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 768 && isMenuOpen()) {
        setMenuState(false);
      }
    });
  }

  try {
    initTopWidgets();
  } catch (error) {
    console.error("[Facile widgets] Error al montar los widgets superiores:", error);
  }

  try {
    initMobileMenu();
  } catch (error) {
    console.error("[Facile menu] Error al inicializar el menú móvil:", error);
  }
});
