/* Cardly promotion popup.
   Turned on/off by SHOW_ADD in assets/js/config.js ("Y" / "N").
   Appears at random intervals, pauses while the tab is hidden or the order list is open,
   and is capped per browsing session so visitors are not annoyed. */
(function () {
  "use strict";
  if (String(window.SHOW_ADD || "N").toUpperCase() !== "Y") return;

  var cfg = (window.SALKARA_CONFIG && window.SALKARA_CONFIG.ad) || {};
  var URL = cfg.url || "https://cardly.in/starvithura/";
  var FIRST = cfg.firstDelaySec || [12, 25];
  var GAP = cfg.intervalSec || [90, 180];
  var MAX = cfg.maxPerVisit == null ? 3 : cfg.maxPerVisit;
  var K_COUNT = "salkara-ad-count", K_LAST = "salkara-ad-last";

  function store(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } }
  function rand(r) { return (r[0] + Math.random() * (r[1] - r[0])) * 1000; }
  function count() { return parseInt(store(K_COUNT), 10) || 0; }

  if (count() >= MAX) return;

  /* ---------- build popup ---------- */
  var root = document.createElement("div");
  root.className = "promo";
  root.setAttribute("aria-hidden", "true");
  var T = window.I18N || { t: function (k) { return k; } };
  function build() {
    var t = T.t;
    root.innerHTML =
      '<div class="promo__backdrop" data-promo-close></div>' +
      '<div class="promo__panel" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="promoTitle" aria-describedby="promoText">' +
        '<button class="promo__x" type="button" data-promo-close aria-label="' + t("ad.close") + '">&times;</button>' +
        '<span class="promo__badge">' + t("ad.badge") + "</span>" +
        '<div class="promo__art" aria-hidden="true">' +
          '<div class="promo__phone"><span></span><span></span><span></span><span></span></div>' +
        "</div>" +
        '<h2 class="promo__title" id="promoTitle">' + t("ad.title") + "</h2>" +
        '<p class="promo__text" id="promoText">' + t("ad.text") + "</p>" +
        '<ul class="promo__list"><li>' + t("ad.c1") + "</li><li>" + t("ad.c2") + "</li><li>" + t("ad.c3") + "</li></ul>" +
        '<a class="promo__cta" href="' + URL + '" target="_blank" rel="noopener">' + t("ad.cta") + ' <span aria-hidden="true">→</span></a>' +
        '<button class="promo__later" type="button" data-promo-close>' + t("ad.later") + "</button>" +
      "</div>";
  }
  build();
  if (T.onChange) T.onChange(build);

  var lastFocus = null, open = false, timer = null, elapsed = 0, target = 0;

  function show() {
    if (open) return;
    if (!root.parentNode) document.body.appendChild(root);
    open = true;
    lastFocus = document.activeElement;
    root.className = "promo is-open";
    root.setAttribute("aria-hidden", "false");
    store(K_COUNT, String(count() + 1));
    store(K_LAST, String(Date.now()));
    setTimeout(function () { var c = root.querySelector(".promo__panel"); if (c) c.focus(); }, 60);
  }
  function hide() {
    if (!open) return;
    open = false;
    root.className = "promo";
    root.setAttribute("aria-hidden", "true");
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) { /* ignore */ } }
    schedule(GAP);
  }

  root.addEventListener("click", function (e) {
    var t = e.target;
    while (t && t !== root) {
      if (t.hasAttribute && t.hasAttribute("data-promo-close")) { hide(); return; }
      if (t.className === "promo__cta") { setTimeout(hide, 300); return; }
      t = t.parentNode;
    }
  });
  document.addEventListener("keydown", function (e) {
    if (open && (e.key === "Escape" || e.key === "Esc")) hide();
  });

  /* ---------- timing: counts only while the page is visible and nothing else is open ---------- */
  function busy() {
    if (document.hidden) return true;
    var sheet = document.getElementById("sheet");
    if (sheet && sheet.className.indexOf("is-open") > -1) return true;   // order list open
    if (document.querySelector(".cdialog.is-open")) return true;            // cache dialog open
    var nav = document.getElementById("siteNav");
    if (nav && nav.className.indexOf("is-open") > -1) return true;          // site menu open
    var ae = document.activeElement;
    if (ae && ae.tagName === "INPUT") return true;                        // typing in search
    return false;
  }
  function schedule(range) {
    clearInterval(timer);
    if (count() >= MAX) return;
    elapsed = 0;
    target = rand(range);
    // across pages: keep the minimum gap since the last popup in this session
    var last = parseInt(store(K_LAST), 10);
    if (last) target = Math.max(target, GAP[0] * 1000 - (Date.now() - last));
    timer = setInterval(function () {
      if (open || busy()) return;
      elapsed += 1000;
      if (elapsed >= target) { clearInterval(timer); show(); }
    }, 1000);
  }

  function start() { schedule(FIRST); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();

  /* handy for testing from the browser console: SalkaraAd.show() */
  window.SalkaraAd = { show: show, hide: hide };
})();
