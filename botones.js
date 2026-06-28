/* ==========================================
   FACILE — SINCRONIZACIÓN ESTABLE RADIO / TEMAS
   - Si se abre Radio, se cierra Temas.
   - Si se abre Temas, se cierra Radio.
   - No toca OpenWidget.
========================================== */
(function(){
  "use strict";

  function onReady(callback){
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
      return;
    }

    callback();
  }

  onReady(function(){
    const radioWidget = document.getElementById("facileRadioWidget");
    const radioToggle = document.getElementById("facileRadioToggle");
    const radioClose = document.getElementById("facileRadioClose");

    const themePanel = document.getElementById("theme-panel");
    const themeToggle = document.getElementById("theme-toggle");
    const themeMenu = document.getElementById("theme-menu");

    if (!radioWidget || !radioToggle || !themeToggle || !themeMenu) {
      return;
    }

    let themeOpen = inferThemeOpen();
    let closingThemeProgrammatically = false;
    let closingRadioProgrammatically = false;

    function hasOpenClass(element){
      if (!element || !element.classList) return false;

      return (
        element.classList.contains("open") ||
        element.classList.contains("is-open") ||
        element.classList.contains("active") ||
        element.classList.contains("show")
      );
    }

    function inferThemeOpen(){
      if (!themeMenu) return false;

      if (themeToggle && themeToggle.getAttribute("aria-expanded") === "true") {
        return true;
      }

      if (themeMenu.getAttribute("aria-hidden") === "false") {
        return true;
      }

      if (hasOpenClass(themePanel) || hasOpenClass(themeMenu)) {
        return true;
      }

      return false;
    }

    function refreshThemeStateSoon(){
      window.setTimeout(function(){
        themeOpen = inferThemeOpen();
      }, 0);
    }

    function radioIsOpen(){
      return radioWidget.classList.contains("is-open");
    }

    function closeRadio(){
      if (!radioIsOpen()) return;

      closingRadioProgrammatically = true;

      if (radioClose) {
        radioClose.click();
      } else {
        radioToggle.click();
      }

      window.setTimeout(function(){
        closingRadioProgrammatically = false;
      }, 0);
    }

    function closeTheme(){
      themeOpen = inferThemeOpen();

      if (!themeOpen) return;

      closingThemeProgrammatically = true;

      /*
        Usamos el propio botón de Temas para cerrar.
        Esto es más seguro que forzar display:none,
        porque respetamos la lógica interna de temas.js.
      */
      themeToggle.click();

      window.setTimeout(function(){
        closingThemeProgrammatically = false;
        themeOpen = inferThemeOpen();
      }, 0);
    }

    /*
      Si el usuario abre Radio, primero cerramos Temas.
      Se usa capture=true para ejecutarlo antes del click interno de radio.js.
    */
    radioToggle.addEventListener("click", function(){
      if (closingRadioProgrammatically) return;
      closeTheme();
    }, true);

    /*
      Si el usuario abre Temas, primero cerramos Radio.
      Se usa capture=true para ejecutarlo antes del click interno de temas.js.
    */
    themeToggle.addEventListener("click", function(){
      if (closingThemeProgrammatically) return;
      closeRadio();
      refreshThemeStateSoon();
    }, true);

    /*
      Observamos cambios de clases/atributos en el menú de Temas
      para mantener themeOpen sincronizado sin depender de estilos visuales.
    */
    const observer = new MutationObserver(function(){
      themeOpen = inferThemeOpen();
    });

    observer.observe(themeMenu, {
      attributes: true,
      attributeFilter: ["class", "aria-hidden", "hidden", "style"]
    });

    observer.observe(themeToggle, {
      attributes: true,
      attributeFilter: ["class", "aria-expanded", "aria-pressed"]
    });

    if (themePanel) {
      observer.observe(themePanel, {
        attributes: true,
        attributeFilter: ["class", "aria-hidden", "hidden", "style"]
      });
    }

    document.addEventListener("keydown", function(event){
      if (event.key !== "Escape") return;

      closeRadio();
      closeTheme();
    });
  });
})();
(function(){
  "use strict";

  function ready(callback){
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
      return;
    }

    callback();
  }

  ready(function(){
    const themePanel = document.getElementById("theme-panel");
    const themeToggle = document.getElementById("theme-toggle");
    const themeMenu = document.getElementById("theme-menu");

    const radioWidget = document.getElementById("facileRadioWidget");
    const radioToggle = document.getElementById("facileRadioToggle");
    const radioClose = document.getElementById("facileRadioClose");

    if (!themePanel || !themeToggle || !themeMenu) {
      return;
    }

    let internalClick = false;

    function radioIsOpen(){
      return !!(radioWidget && radioWidget.classList.contains("is-open"));
    }

    function closeRadio(){
      if (!radioIsOpen()) {
        return;
      }

      if (radioClose) {
        radioClose.click();
        return;
      }

      if (radioToggle) {
        radioToggle.click();
      }
    }

    function themeIsOpenByState(){
      if (themePanel.classList.contains("facile-theme-menu-open")) {
        return true;
      }

      if (themeToggle.getAttribute("aria-expanded") === "true") {
        return true;
      }

      if (themeMenu.getAttribute("aria-hidden") === "false") {
        return true;
      }

      if (themeMenu.classList.contains("is-open")) {
        return true;
      }

      if (themeMenu.classList.contains("open")) {
        return true;
      }

      if (themeMenu.classList.contains("active")) {
        return true;
      }

      return false;
    }

    function applyThemeState(open){
      themePanel.classList.toggle("facile-theme-menu-open", open);
      themeToggle.setAttribute("aria-expanded", open ? "true" : "false");
      themeMenu.setAttribute("aria-hidden", open ? "false" : "true");
    }

    function syncThemeState(){
      applyThemeState(themeIsOpenByState());
    }

    function closeTheme(){
      if (!themeIsOpenByState()) {
        applyThemeState(false);
        return;
      }

      internalClick = true;
      themeToggle.click();

      window.setTimeout(function(){
        internalClick = false;
        applyThemeState(false);
      }, 0);
    }

    themeToggle.addEventListener("click", function(){
      if (internalClick) {
        return;
      }

      closeRadio();

      window.setTimeout(function(){
        const nextOpen = !themePanel.classList.contains("facile-theme-menu-open");
        applyThemeState(nextOpen);
      }, 0);
    });

    if (radioToggle) {
      radioToggle.addEventListener("click", function(){
        closeTheme();
      }, true);
    }

    document.addEventListener("keydown", function(event){
      if (event.key !== "Escape") {
        return;
      }

      closeTheme();
    });

    const observer = new MutationObserver(function(){
      if (internalClick) {
        return;
      }

      syncThemeState();
    });

    observer.observe(themeMenu, {
      attributes: true,
      attributeFilter: ["class", "aria-hidden", "hidden", "style"]
    });

    observer.observe(themeToggle, {
      attributes: true,
      attributeFilter: ["class", "aria-expanded", "aria-pressed"]
    });

    syncThemeState();
  });
})();
