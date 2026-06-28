document.addEventListener("DOMContentLoaded", () => {
  const widget = document.getElementById("facileRadioWidget");
  const toggle = document.getElementById("facileRadioToggle");
  const panel = document.getElementById("facileRadioPanel");
  const closeBtn = document.getElementById("facileRadioClose");
  const frame = document.getElementById("facileRadioFrame");
  const searchForm = document.getElementById("facileRadioSearch");
  const searchInput = document.getElementById("facileRadioQuery");

  if (!widget || !toggle || !panel || !frame) return;

  let frameLoaded = false;

  function loadRadioFrameOnce() {
    if (frameLoaded) return;

    const src = frame.getAttribute("data-src");
    if (src) {
      frame.src = src;
      frameLoaded = true;
    }
  }

  function openRadio() {
    widget.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    panel.setAttribute("aria-hidden", "false");
    loadRadioFrameOnce();
  }

  function closeRadio() {
    widget.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    panel.setAttribute("aria-hidden", "true");
  }

  function toggleRadio() {
    if (widget.classList.contains("is-open")) {
      closeRadio();
    } else {
      openRadio();
    }
  }

  toggle.addEventListener("click", toggleRadio);

  if (closeBtn) {
    closeBtn.addEventListener("click", closeRadio);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeRadio();
    }
  });

  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const query = searchInput.value.trim();
      if (!query) return;

      const url = "https://mytuner-radio.com/es/search/?q=" + encodeURIComponent(query);
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }

  /*
    Desplaza OpenWidget hacia arriba sin eliminarlo.
    Usa MutationObserver porque OpenWidget se inyecta después de cargar la página.
  */
  function moveOpenWidgetUp() {
    const candidates = document.querySelectorAll(
      'iframe[src*="openwidget"], iframe[src*="openwidget.com"], div[id*="openwidget"], div[class*="openwidget"]'
    );

    candidates.forEach((node) => {
      if (node.closest("#facileRadioWidget")) return;

      const rect = node.getBoundingClientRect();

      /*
        Solo tocamos elementos flotantes visibles cerca de la esquina inferior derecha.
        Esto evita afectar contenido normal de la página.
      */
      const looksLikeFloatingWidget =
        rect.width > 40 &&
        rect.height > 40 &&
        rect.right > window.innerWidth - 130 &&
        rect.bottom > window.innerHeight - 170;

      if (!looksLikeFloatingWidget) return;

      node.classList.add("facile-openwidget-shifted");

      node.style.setProperty("transform", "translateY(-74px)", "important");
      node.style.setProperty("transition", "transform 180ms ease", "important");
      node.style.setProperty("z-index", "2190", "important");
    });
  }

  moveOpenWidgetUp();

  const observer = new MutationObserver(() => {
    moveOpenWidgetUp();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  window.addEventListener("resize", moveOpenWidgetUp, { passive: true });
});
