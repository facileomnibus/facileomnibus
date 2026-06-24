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
     BUSCADOR GOOGLE
  ================================ */
  const searchWidget = document.createElement("div");
  searchWidget.className = "widget-box";
  searchWidget.innerHTML = `
    <form
      action="https://www.google.com/search"
      method="get"
      target="_blank"
      style="display:flex; gap:8px; align-items:center; width:100%;"
    >
      <input
        type="text"
        name="q"
        placeholder="Buscar en Google..."
        aria-label="Buscar en Google"
        style="
          flex:1;
          min-width:0;
          padding:10px 12px;
          border:none;
          outline:none;
          border-radius:12px;
          background:rgba(255,255,255,0.88);
          color:#333;
          box-sizing:border-box;
        "
      >
      <button
        type="submit"
        style="
          padding:10px 14px;
          border:none;
          border-radius:12px;
          cursor:pointer;
          background:#5bd3ff;
          color:white;
          font-weight:700;
          box-shadow:0 5px 12px rgba(0,0,0,0.10);
        "
      >
        Buscar
      </button>
    </form>
  `;
  bar.appendChild(searchWidget);

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
