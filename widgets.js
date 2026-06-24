document.addEventListener("DOMContentLoaded", () => {
  /* ===============================
     BARRA DE WIDGETS SUPERIOR
  ================================ */
  const bar = document.createElement("div");
  bar.className = "widgets-bar";

  const container = document.getElementById("widgets-container");
  if (container) {
    container.appendChild(bar);
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
    dateWidget.innerHTML = "📅 " + now.toLocaleDateString("es-ES", options);
  }

  updateDate();
  setInterval(updateDate, 60 * 1000);
  bar.appendChild(dateWidget);

  /* ===============================
     RELOJ
  ================================ */
  const clock = document.createElement("div");
  clock.className = "widget-box";

  function updateClock() {
    const now = new Date();
    clock.innerHTML = "🕒 " + now.toLocaleTimeString();
  }

  setInterval(updateClock, 1000);
  updateClock();
  bar.appendChild(clock);

  /* ===============================
     BUSCADOR GOOGLE
  ================================ */
  const search = document.createElement("div");
  search.className = "widget-box";
  search.innerHTML = `
    <form action="https://www.google.com/search" target="_blank">
      <input
        name="q"
        placeholder="Buscar en Internet..."
        style="
          padding:8px;
          border-radius:10px;
          border:none;
          outline:none;
          width:260px;
          max-width:90vw;
          font-size:14px;
        "
      >
    </form>
  `;
  bar.appendChild(search);

  /* ===============================
   MENÚ RESPONSIVE
================================ */
const menuBtn = document.querySelector(".menu-icon");
const menu = document.querySelector(".navigation ul");

if (menuBtn && menu) {
  const toggleMenu = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const isOpen = !menu.classList.contains("show");
    menu.classList.toggle("show", isOpen);
    menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  };

  const closeMenu = (event) => {
    if (menu.contains(event.target) || menuBtn.contains(event.target)) return;

    menu.classList.remove("show");
    menuBtn.setAttribute("aria-expanded", "false");
  };

  /* un solo evento universal */
  menuBtn.addEventListener("pointerup", toggleMenu);

  /* cerrar al tocar fuera */
  document.addEventListener("pointerup", closeMenu);

  /* opcional: cerrar al pulsar Escape */
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      menu.classList.remove("show");
      menuBtn.setAttribute("aria-expanded", "false");
    }
  });
}
});
