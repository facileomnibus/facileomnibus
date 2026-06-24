document.addEventListener("DOMContentLoaded", () => {
  /* ===============================
     BARRA DE WIDGETS SUPERIOR
  ================================ */
  const container = document.getElementById("widgets-container");
  if (!container) return;

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
  setInterval(updateDate, 60 * 1000);
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
  setInterval(updateClock, 1000);
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

searchWidget.innerHTML = `
  <form
    id="facileSearchForm"
    class="facile-search-form"
    method="get"
    target="_blank"
    autocomplete="off"
  >
    <div class="facile-search-engine-wrap">
      <span class="facile-search-engine-badge" id="facileSearchBadge" aria-hidden="true">G</span>

      <select
        id="facileSearchEngine"
        class="facile-search-engine"
        aria-label="Seleccionar buscador"
      >
        <option value="google">Google</option>
        <option value="bing">Bing</option>
        <option value="startpage">Startpage</option>
        <option value="duckduckgo">DuckDuckGo</option>
        <option value="brave">Brave Search</option>
        <option value="yahoo">Yahoo</option>
      </select>
    </div>

    <input
      id="facileSearchInput"
      class="facile-search-input"
      type="text"
      placeholder="Buscar..."
      aria-label="Buscar"
      required
    >

    <button
      id="facileSearchSubmit"
      class="facile-search-submit"
      type="submit"
    >
      Buscar
    </button>
  </form>
`;

bar.appendChild(searchWidget);

const searchForm = document.getElementById("facileSearchForm");
const searchEngineSelect = document.getElementById("facileSearchEngine");
const searchInput = document.getElementById("facileSearchInput");
const searchBadge = document.getElementById("facileSearchBadge");

function syncSearchEngine(engineKey) {
  const engine = SEARCH_ENGINES[engineKey] || SEARCH_ENGINES.google;

  searchForm.action = engine.action;
  searchForm.setAttribute("data-engine", engineKey);

  searchInput.name = engine.param;
  searchInput.placeholder = engine.placeholder;
  searchInput.setAttribute("aria-label", engine.placeholder);

  searchBadge.textContent = engine.badge;
  searchBadge.setAttribute("data-engine", engineKey);

  searchEngineSelect.value = engineKey;
  localStorage.setItem("facileSearchEngine", engineKey);
}

searchEngineSelect.addEventListener("change", () => {
  syncSearchEngine(searchEngineSelect.value);
  searchInput.focus();
});

syncSearchEngine(savedEngine);

  /* ===============================
     MENÚ RESPONSIVE
  ================================ */
  const menuBtn =
    document.getElementById("mobileMenuToggle") ||
    document.querySelector(".menu-icon");

  const menu =
    document.getElementById("site-menu") ||
    document.querySelector(".navigation ul");

  if (menuBtn && menu) {
    let isOpen = false;

    const openMenu = () => {
      menu.classList.add("show");
      menuBtn.setAttribute("aria-expanded", "true");
      menuBtn.setAttribute("aria-label", "Cerrar menú");
      isOpen = true;
    };

    const closeMenu = () => {
      menu.classList.remove("show");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.setAttribute("aria-label", "Abrir menú");
      isOpen = false;
    };

    const toggleMenu = (event) => {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    };

    menuBtn.addEventListener("click", toggleMenu);

    menuBtn.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        toggleMenu(event);
      }
    });

    document.addEventListener("click", (event) => {
      if (!isOpen) return;

      const clickedInsideMenu = menu.contains(event.target);
      const clickedButton = menuBtn.contains(event.target);

      if (!clickedInsideMenu && !clickedButton) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isOpen) {
        closeMenu();
      }
    });

    menu.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      if (link) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 768 && isOpen) {
        closeMenu();
      }
    });
  }
});
