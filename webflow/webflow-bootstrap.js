(() => {
  const ASSET_BASE = "https://cdn.jsdelivr.net/gh/clothboi/Colour-palette@main/webflow";
  const CACHE_BUCKET_MS = 5 * 60 * 1000;
  const cacheTag = Math.floor(Date.now() / CACHE_BUCKET_MS).toString();
  const styleId = "colour-palette-webflow-styles";
  const scriptId = "colour-palette-webflow-script";

  function ensureStyle() {
    const href = `${ASSET_BASE}/webflow-styles.css?v=${cacheTag}`;
    let link = document.getElementById(styleId);
    if (!(link instanceof HTMLLinkElement)) {
      link = document.createElement("link");
      link.id = styleId;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    if (link.href !== href) {
      link.href = href;
    }
  }

  function ensureScript() {
    const src = `${ASSET_BASE}/webflow-script.js?v=${cacheTag}`;
    let script = document.getElementById(scriptId);
    if (!(script instanceof HTMLScriptElement)) {
      script = document.createElement("script");
      script.id = scriptId;
      script.defer = true;
      document.body.appendChild(script);
    }
    if (script.src !== src) {
      script.src = src;
    }
  }

  function boot() {
    if (!document.querySelector("[data-webflow-palette]")) {
      return;
    }
    ensureStyle();
    ensureScript();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
