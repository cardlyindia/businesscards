/* Caching on the visitor's side:
   - registers sw.js (only on https:// or localhost; it can't run from a double-clicked file)
   - shows a small notice when a newer version is available, or when the saved menu is shown offline
   - "Refresh menu (clear cache)" dialog for any [data-cache-clear] button */
(function () {
  "use strict";
  var T = window.I18N || { plain: function (k) { return k; }, onChange: function () {} };
  var hasSW = "serviceWorker" in navigator &&
    (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1");
  var FLAG = "salkara-cache-cleared";

  /* ---------- toast ---------- */
  var toastEl = null, toastTimer = null;
  function toast(text, action, onAction, ms) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      toastEl.setAttribute("aria-live", "polite");
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML = '<span class="toast__text"></span>' + (action ? '<button type="button" class="toast__btn"></button>' : "") +
      '<button type="button" class="toast__x" aria-label="Close">&times;</button>';
    toastEl.querySelector(".toast__text").textContent = text;
    if (action) {
      var b = toastEl.querySelector(".toast__btn");
      b.textContent = action;
      b.onclick = function () { hideToast(); onAction(); };
    }
    toastEl.querySelector(".toast__x").onclick = hideToast;
    void toastEl.offsetWidth;
    toastEl.className = "toast is-visible";
    clearTimeout(toastTimer);
    if (ms) toastTimer = setTimeout(hideToast, ms);
  }
  function hideToast() { if (toastEl) toastEl.className = "toast"; }

  /* ---------- service worker ---------- */
  /* Automatic update: when the site changed, the new files are already saved by sw.js.
     - right after the page opened (visitor hasn't started yet): reload at once
     - otherwise: reload quietly the next time the visitor comes back to this tab
       (a small notice also offers to update right now) */
  var reloading = false, updateShown = false, pending = false;
  function busy() {
    var sheet = document.getElementById("sheet");
    var ae = document.activeElement;
    return (sheet && sheet.className.indexOf("is-open") > -1) || (ae && ae.tagName === "INPUT" && ae.value);
  }
  function applyUpdate() {
    if (reloading) return;
    reloading = true;
    try { sessionStorage.setItem("salkara-scroll", String(window.pageYOffset || 0)); } catch (e) { /* ignore */ }
    location.reload();
  }
  function showUpdate() {
    if (updateShown) return;
    updateShown = true;
    var sinceLoad = window.performance && performance.now ? performance.now() : 99999;
    if (sinceLoad < 8000 && !busy()) { applyUpdate(); return; }
    pending = true;
    toast(T.plain("cache.update"), T.plain("cache.reload"), applyUpdate);
  }
  document.addEventListener("visibilitychange", function () {
    if (pending && document.visibilityState === "hidden" && !busy()) applyUpdate();  // reload unseen while the tab is in the background
  });
  /* restore scroll position after an automatic update */
  try {
    var sy = sessionStorage.getItem("salkara-scroll");
    if (sy) { sessionStorage.removeItem("salkara-scroll"); window.addEventListener("load", function () { setTimeout(function () { window.scrollTo(0, +sy); }, 300); }); }
  } catch (e) { /* ignore */ }
  if (hasSW) {
    var hadController = !!navigator.serviceWorker.controller;
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").then(function (reg) {
        // check for a new sw.js whenever the visitor comes back to the tab
        document.addEventListener("visibilitychange", function () { if (!document.hidden) reg.update().catch(function () {}); });
      }).catch(function (e) { if (window.console) console.warn("Service worker:", e); });
    });
    navigator.serviceWorker.addEventListener("controllerchange", function () {
      if (hadController && !reloading) showUpdate();   // a new version was installed
      hadController = true;
    });
    navigator.serviceWorker.addEventListener("message", function (e) {
      var d = e.data || {};
      if (d.type === "updated") showUpdate();
      else if (d.type === "offline") toast(T.plain("cache.offline"), null, null, 5000);
    });
  }

  /* after a manual clear: tidy the address bar (remove the ?r=… used to bypass caches) */
  if (/[?&]r=\d+/.test(location.search) && history.replaceState) {
    history.replaceState(null, "", location.pathname + location.search.replace(/[?&]r=\d+/, "").replace(/^&/, "?") + location.hash);
  }
  try {
    if (sessionStorage.getItem(FLAG)) {
      sessionStorage.removeItem(FLAG);
      document.addEventListener("DOMContentLoaded", function () { toast("✓ " + T.plain("cache.done"), null, null, 4500); });
    }
  } catch (e) { /* ignore */ }

  /* ---------- clear-cache dialog ---------- */
  var dlg = null, lastFocus = null;
  function fmt(bytes) {
    if (!bytes && bytes !== 0) return "";
    if (bytes < 1024 * 1024) return Math.max(1, Math.round(bytes / 1024)) + " KB";
    return (bytes / 1024 / 1024).toFixed(1) + " MB";
  }
  function build() {
    if (!dlg) {
      dlg = document.createElement("div");
      dlg.className = "cdialog";
      dlg.setAttribute("aria-hidden", "true");
      document.body.appendChild(dlg);
      dlg.addEventListener("click", function (e) {
        var t = e.target;
        while (t && t !== dlg) {
          if (t.hasAttribute && t.hasAttribute("data-cd-close")) { close(); return; }
          if (t.hasAttribute && t.hasAttribute("data-cd-go")) { clearAll(); return; }
          t = t.parentNode;
        }
      });
    }
    dlg.innerHTML =
      '<div class="cdialog__backdrop" data-cd-close></div>' +
      '<div class="cdialog__panel" role="dialog" aria-modal="true" aria-labelledby="cdTitle" tabindex="-1">' +
        '<div class="cdialog__icon" aria-hidden="true"><svg class="icon"><use href="#i-refresh" xlink:href="#i-refresh"/></svg></div>' +
        '<h2 class="cdialog__title" id="cdTitle">' + T.plain("cache.title") + "</h2>" +
        '<p class="cdialog__text">' + T.plain("cache.text") + "</p>" +
        '<p class="cdialog__meta" id="cdMeta"></p>' +
        '<div class="cdialog__btns">' +
          '<button type="button" class="btn" data-cd-close>' + T.plain("cache.cancel") + "</button>" +
          '<button type="button" class="btn btn--primary" data-cd-go>' + T.plain("cache.confirm") + "</button>" +
        "</div>" +
      "</div>";
  }
  function open() {
    build();
    lastFocus = document.activeElement;
    var nav = document.getElementById("siteNav");
    if (nav && window.SalkaraNav && nav.className.indexOf("is-open") > -1) window.SalkaraNav.close();
    void dlg.offsetWidth;
    dlg.className = "cdialog is-open";
    dlg.setAttribute("aria-hidden", "false");
    setTimeout(function () { dlg.querySelector(".cdialog__panel").focus(); }, 40);
    var meta = dlg.querySelector("#cdMeta");
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then(function (est) { if (est && est.usage) meta.textContent = T.plain("cache.size", { s: fmt(est.usage) }); }).catch(function () {});
    }
  }
  function close() {
    if (!dlg || dlg.className.indexOf("is-open") < 0) return;
    dlg.className = "cdialog";
    dlg.setAttribute("aria-hidden", "true");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function clearAll() {
    var go = dlg.querySelector("[data-cd-go]");
    go.disabled = true;
    go.innerHTML = '<span class="cdialog__spin" aria-hidden="true"></span>' + T.plain("cache.working");
    var jobs = [];
    if (window.caches && caches.keys) {
      jobs.push(caches.keys().then(function (keys) { return Promise.all(keys.map(function (k) { return caches.delete(k); })); }));
    }
    if (hasSW && navigator.serviceWorker.getRegistrations) {
      jobs.push(navigator.serviceWorker.getRegistrations().then(function (regs) {
        return Promise.all(regs.map(function (r) { return r.update().catch(function () {}); }));
      }));
    }
    var finish = function () {
      try { sessionStorage.setItem(FLAG, "1"); } catch (e) { /* ignore */ }
      reloading = true;
      // add a throw-away query so the page itself is fetched fresh from the server
      var u = location.pathname + "?r=" + Date.now() + location.hash;
      setTimeout(function () { location.replace(u); }, 400);
    };
    (window.Promise ? Promise.all(jobs) : { then: function (f) { f(); } }).then(finish, finish);
  }

  document.addEventListener("click", function (e) {
    var t = e.target;
    while (t && t !== document) {
      if (t.hasAttribute && t.hasAttribute("data-cache-clear")) { e.preventDefault(); open(); return; }
      t = t.parentNode;
    }
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" || e.key === "Esc") close(); });
  T.onChange(function () { if (dlg && dlg.className.indexOf("is-open") > -1) { build(); dlg.className = "cdialog is-open"; } });

  window.SalkaraCache = { open: open, clear: clearAll, toast: toast };
})();
