/* ==========================================
   FACILE — SINCRONIZACIÓN ESTABLE RADIO / TEMAS
   - Si se abre Radio, se cierra Temas.
   - Si se abre Temas, se cierra Radio.
   - No toca OpenWidget.
========================================== */
(function(){
  "use strict";

  function ready(callback){
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
      return;
    }
    callback();
  }

  function runWhenIdle(callback, timeout){
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(callback, { timeout: timeout || 2500 });
      return;
    }
    window.setTimeout(callback, Math.min(timeout || 2500, 1200));
  }

  function once(target, eventName, callback, options){
    if (!target) return;
    target.addEventListener(eventName, callback, Object.assign({ once: true, passive: true }, options || {}));
  }

  function loadOpenWidget(){
    if (!window.OpenWidget || typeof window.OpenWidget.init !== "function") return;
    if (window.__facileOpenWidgetLoaded) return;
    window.__facileOpenWidgetLoaded = true;
    window.OpenWidget.init();
  }

  function scheduleOpenWidget(){
    runWhenIdle(loadOpenWidget, 4500);
    once(window, "pointerdown", loadOpenWidget);
    once(window, "keydown", loadOpenWidget);
    once(window, "scroll", loadOpenWidget);
  }

  function loadTradingView(){
    const container = document.querySelector(".tradingview-widget-container");
    const config = document.getElementById("facile-tradingview-config");
    if (!container || !config || window.__facileTradingViewLoaded) return;
    window.__facileTradingViewLoaded = true;

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.textContent = config.textContent || "{}";
    container.appendChild(script);
  }

  function scheduleTradingView(){
    const widget = document.querySelector(".widget-box.ticker-widget");
    if (!widget) return;

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (!entry.isIntersecting) return;
          observer.disconnect();
          loadTradingView();
        });
      }, { rootMargin: "600px 0px" });
      observer.observe(widget);
      return;
    }

    runWhenIdle(loadTradingView, 3500);
  }

  function setupRadioThemeSync(){
    const themePanel = document.getElementById("theme-panel");
    const themeToggle = document.getElementById("theme-toggle");
    const themeMenu = document.getElementById("theme-menu");
    const radioWidget = document.getElementById("facileRadioWidget");
    const radioToggle = document.getElementById("facileRadioToggle");
    const radioClose = document.getElementById("facileRadioClose");

    if (!themePanel || !themeToggle || !themeMenu) return;

    let syncing = false;

    function radioIsOpen(){
      return !!(radioWidget && radioWidget.classList.contains("is-open"));
    }

    function themeIsOpen(){
      return themePanel.classList.contains("facile-theme-menu-open") ||
        themeToggle.getAttribute("aria-expanded") === "true" ||
        themeMenu.getAttribute("aria-hidden") === "false" ||
        themeMenu.classList.contains("is-open") ||
        themeMenu.classList.contains("open") ||
        themeMenu.classList.contains("active");
    }

    function setThemeState(open){
      themePanel.classList.toggle("facile-theme-menu-open", open);
      themeToggle.setAttribute("aria-expanded", open ? "true" : "false");
      themeMenu.setAttribute("aria-hidden", open ? "false" : "true");
    }

    function closeRadio(){
      if (!radioIsOpen()) return;
      if (radioClose) {
        radioClose.click();
        return;
      }
      if (radioToggle) radioToggle.click();
    }

    function closeTheme(){
      if (!themeIsOpen()) {
        setThemeState(false);
        return;
      }
      setThemeState(false);
    }

    themeToggle.addEventListener("click", function(event){
      if (syncing) return;
      syncing = true;
      closeRadio();
      window.setTimeout(function(){
        setThemeState(!themePanel.classList.contains("facile-theme-menu-open"));
        syncing = false;
      }, 0);
    });

    if (radioToggle) {
      radioToggle.addEventListener("click", function(){
        if (syncing) return;
        closeTheme();
      }, true);
    }

    document.addEventListener("keydown", function(event){
      if (event.key !== "Escape") return;
      closeTheme();
      closeRadio();
    });

    setThemeState(false);
  }

  function makeWeatherLazy(){
    if (typeof window.facileStartWeather !== "function" && typeof window.loadWeather !== "function") return;
    const weather = document.getElementById("weather-widget");
    if (!weather || window.__facileWeatherLazyDone) return;

    function startWeather(){
      if (window.__facileWeatherLazyDone) return;
      window.__facileWeatherLazyDone = true;
      if (typeof window.facileStartWeather === "function") {
        window.facileStartWeather();
        return;
      }
      window.loadWeather(40.4168, -3.7038, "Madrid");
    }

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (!entry.isIntersecting) return;
          observer.disconnect();
          startWeather();
        });
      }, { rootMargin: "500px 0px" });
      observer.observe(weather);
      return;
    }

    runWhenIdle(startWeather, 3500);
  }

  ready(function(){
    setupRadioThemeSync();
    scheduleOpenWidget();
    scheduleTradingView();
    runWhenIdle(makeWeatherLazy, 2000);
  });
})();

