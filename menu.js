document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("mobileMenuToggle") || document.querySelector(".menu-icon");
  const menu = document.getElementById("site-menu") || document.querySelector(".navigation ul");

  if (!menuBtn || !menu) return;

  // Evita doble inicialización si el archivo se carga dos veces
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

  // Estado inicial consistente
  setMenuState(false);

  const toggleMenu = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setMenuState(!isMenuOpen());
  };

  // Un solo evento principal para el botón
  menuBtn.addEventListener("click", toggleMenu);

  // Cerrar al pulsar fuera (en captura para adelantarse al bubbling)
  document.addEventListener(
    "pointerdown",
    (event) => {
      if (!isMenuOpen()) return;

      const clickedInsideMenu = menu.contains(event.target);
      const clickedButton = menuBtn.contains(event.target);

      if (!clickedInsideMenu && !clickedButton) {
        setMenuState(false);
      }
    },
    true
  );

  // Cerrar con Escape
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isMenuOpen()) {
      setMenuState(false);
    }
  });

  // Cerrar al pulsar un enlace del menú
  menu.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (link) {
      setMenuState(false);
    }
  });

  // Cerrar al volver a escritorio
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768 && isMenuOpen()) {
      setMenuState(false);
    }
  });
});
