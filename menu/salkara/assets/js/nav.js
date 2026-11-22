/* Side navigation drawer (menu.html, pdf.html). Opened by any [data-nav-open] button. */
(function () {
  "use strict";
  var REVIEW = "https://www.google.com/maps/place/Salkara+Restaurant/@8.6734044,77.08869,17z/data=!4m8!3m7!1s0x3b05c90013112a67:0x33b27cf497eda9d5!8m2!3d8.6734044!4d77.08869!9m1!1b1!16s%2Fg%2F11zb3fd61f?entry=ttu&g_ep=EgoyMDI2MTExOC4xIKXMDSoASAFQAw%3D%3D";
  var MAP = "https://maps.app.goo.gl/RUKr6jaKvM8EMdob9";

  var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  function icon(id) { return '<svg class="icon" aria-hidden="true"><use href="#' + id + '" xlink:href="#' + id + '"/></svg>'; }
  function link(href, ic, label, sub, ext) {
    var here = !ext && href === page;
    return '<li><a class="nav__link' + (here ? " is-current" : "") + '" href="' + href.replace(/&/g, "&amp;") + '"' +
      (ext ? ' target="_blank" rel="noopener"' : "") + (here ? ' aria-current="page"' : "") + ">" +
      '<span class="nav__icon">' + icon(ic) + '</span><span class="nav__text"><b>' + label + "</b>" +
      (sub ? "<small>" + sub + "</small>" : "") + "</span></a></li>";
  }

  var T = window.I18N || { t: function (k) { return k; }, onChange: function () {} };
  var root = document.createElement("div");
  root.className = "nav";
  root.id = "siteNav";
  root.setAttribute("aria-hidden", "true");

  function build() {
    var t = T.t;
    root.innerHTML =
      '<div class="nav__backdrop" data-nav-close></div>' +
      '<nav class="nav__panel" aria-label="Site menu" tabindex="-1">' +
        '<div class="nav__head"><img src="assets/img/logo-white-480.png" alt="Salkara" width="480" height="127">' +
        '<button class="nav__close" type="button" data-nav-close aria-label="' + t("nav.close") + '">' + icon("i-x") + "</button>" +
        '<p class="script">' + t("tagline") + "</p></div>" +
        '<ul class="nav__list">' +
          link("index.html", "i-home", t("a.home"), t("a.home.sub")) +
          link("menu.html", "i-menu", t("a.menu"), t("a.menu.sub")) +
          link("pdf.html", "i-file", t("a.pdf"), t("a.pdf.sub")) +
        '</ul><p class="nav__label">' + t("nav.visit") + '</p><ul class="nav__list">' +
          link(REVIEW, "i-star", t("a.rate"), t("a.rate.sub"), true) +
          link(MAP, "i-pin", t("a.find"), t("a.find.sub"), true) +
          link("tel:+919020637099", "i-phone", t("a.callNum", { n: "90206 37099" }), "", true) +
          link("tel:+917356794579", "i-phone", t("a.callNum", { n: "73567 94579" }), "", true) +
          link("files/salkara.vcf", "i-user-plus", t("a.contact"), t("a.contact.sub"), true) +
          link("upi://pay?pa=paytmqr14c6e4@paytm&pn=Salkara&cu=INR", "i-wallet", t("a.upi"), t("a.upi.sub"), true) +
        "</ul>" +
        '<div class="nav__tools">' +
          '<button class="nav__tool" type="button" data-lang-toggle-row>' + icon("i-globe") + "<span>" + (T.lang === "ml" ? "English" : "മലയാളം") + "</span></button>" +
          '<button class="nav__tool" type="button" data-theme-toggle>' + icon("i-palette") + "<span>" + t("theme.row") + "</span></button>" +
          '<button class="nav__tool" type="button" data-cache-clear>' + icon("i-refresh") + "<span>" + t("cache.btn") + "</span></button>" +
        "</div>" +
        '<p class="nav__foot"><span>' + t("hours") + "</span></p>" +
      "</nav>";
  }
  build();
  if (T.onChange) T.onChange(function () { var wasOpen = root.className.indexOf("is-open") > -1; build(); if (wasOpen) root.querySelector(".nav__panel").focus(); });

  var lastFocus = null;
  function open() {
    if (!root.parentNode) document.body.appendChild(root);
    lastFocus = document.activeElement;
    // force reflow so the slide-in animates
    void root.offsetWidth;
    root.className = "nav is-open";
    root.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setBtns(true);
    setTimeout(function () { root.querySelector(".nav__panel").focus(); }, 40);
  }
  function close() {
    if (root.className.indexOf("is-open") < 0) return;
    root.className = "nav";
    root.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    setBtns(false);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function setBtns(state) {
    var b = document.querySelectorAll("[data-nav-open]");
    for (var i = 0; i < b.length; i++) b[i].setAttribute("aria-expanded", state ? "true" : "false");
  }

  document.addEventListener("click", function (e) {
    var t = e.target;
    while (t && t !== document) {
      if (t.hasAttribute) {
        if (t.hasAttribute("data-nav-open")) { e.preventDefault(); open(); return; }
        if (t.hasAttribute("data-nav-close")) { close(); return; }
        if (t.hasAttribute("data-lang-toggle-row") && window.I18N) { window.I18N.set(window.I18N.lang === "en" ? "ml" : "en"); return; }
        if (t.className && String(t.className).indexOf("nav__link") > -1) { setTimeout(close, 150); return; }
      }
      t = t.parentNode;
    }
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" || e.key === "Esc") close(); });

  document.body.appendChild(root);
  window.SalkaraNav = { open: open, close: close };
})();
