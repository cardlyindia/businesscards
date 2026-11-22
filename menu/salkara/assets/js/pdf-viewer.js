/* SALKARA menu card viewer: renders files/salkara.pdf with the bundled pdf.js (no internet needed).
   Pages render lazily, sharply on high-DPI screens, and re-render on resize / zoom. */
(function () {
  "use strict";
  var pagesEl = document.getElementById("pages");
  var statusEl = document.getElementById("status");
  var infoEl = document.getElementById("pageInfo");
  var zoomLabel = document.getElementById("zoomLabel");
  var url = pagesEl.getAttribute("data-pdf");
  var T = window.I18N || { plain: function (k) { return k; }, onChange: function () {} };
  var failed = false;

  var ZOOMS = [1, 1.25, 1.5, 2, 2.5];
  var zoomIdx = 0;
  var MAX_FIT = 860;               // px: comfortable reading width at "Fit"
  var MAX_CANVAS_PX = 4096 * 4096; // iOS Safari canvas memory limit guard

  var doc = null, pages = [], observer = null;

  function failHtml() {
    statusEl.innerHTML =
      "<strong style=\"display:block;color:var(--text);font-size:1.05rem;margin-bottom:4px\">" + T.plain("pdf.fail") + "</strong>" +
      T.plain("pdf.failHint") +
      "<br><a class=\"btn btn--primary\" href=\"" + url + "\" target=\"_blank\" rel=\"noopener\">" + T.plain("pdf.open") + "</a> " +
      "<a class=\"btn\" href=\"" + url + "\" download=\"Salkara-Menu.pdf\">" + T.plain("pdf.download") + "</a>";
  }
  function fail(err) {
    if (window.console) console.warn("PDF viewer:", err);
    failed = true;
    infoEl.textContent = T.plain("pdf.title");
    failHtml();
    statusEl.style.display = "";
  }
  T.onChange(function () { if (failed) { failHtml(); infoEl.textContent = T.plain("pdf.title"); } else { updateInfo(); if (zoomLabel && zoomIdx === 0) zoomLabel.textContent = "100%"; } });

  if (!window.pdfjsLib) { fail("pdf.js not loaded"); return; }
  pdfjsLib.GlobalWorkerOptions.workerSrc = "assets/vendor/pdfjs/pdf.worker.min.js";

  function fitWidth() {
    var avail = pagesEl.clientWidth - 24;
    return Math.min(avail, MAX_FIT);
  }

  function layout() {
    var w = Math.round(fitWidth() * ZOOMS[zoomIdx]);
    for (var i = 0; i < pages.length; i++) {
      var p = pages[i];
      p.el.style.width = w + "px";
      p.el.style.maxWidth = zoomIdx === 0 ? "100%" : "none";
      p.el.style.height = Math.round(w * p.ratio) + "px";
      p.dirty = true;
    }
    pagesEl.style.alignItems = zoomIdx === 0 ? "center" : "flex-start";
    pagesEl.style.overflowX = zoomIdx === 0 ? "" : "auto";
    if (zoomLabel) zoomLabel.textContent = zoomIdx === 0 ? "100%" : Math.round(ZOOMS[zoomIdx] * 100) + "%";
    renderVisible();
  }

  function renderPage(p) {
    if (p.busy) { p.again = true; return; }
    p.dirty = false;
    p.busy = true;
    var cssW = p.el.clientWidth;
    var dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    var scale = (cssW / p.baseW) * dpr;
    var vp = p.page.getViewport({ scale: scale });
    if (vp.width * vp.height > MAX_CANVAS_PX) {
      scale = scale * Math.sqrt(MAX_CANVAS_PX / (vp.width * vp.height));
      vp = p.page.getViewport({ scale: scale });
    }
    var canvas = document.createElement("canvas");
    canvas.width = Math.floor(vp.width);
    canvas.height = Math.floor(vp.height);
    canvas.setAttribute("aria-label", T.plain("pdf.title") + " " + p.num);
    canvas.setAttribute("role", "img");
    var task = p.page.render({ canvasContext: canvas.getContext("2d"), viewport: vp });
    task.promise.then(function () {
      if (p.canvas) p.el.replaceChild(canvas, p.canvas); else p.el.appendChild(canvas);
      p.canvas = canvas;
      p.el.className = "pdf-pg is-rendered";
    }, function (e) { if (window.console) console.warn(e); })
    .then(function () {
      p.busy = false;
      if (p.again) { p.again = false; renderPage(p); }
    });
  }

  function isNear(el) {
    var r = el.getBoundingClientRect(), vh = window.innerHeight || document.documentElement.clientHeight;
    return r.bottom > -vh && r.top < vh * 2;
  }
  function renderVisible() {
    for (var i = 0; i < pages.length; i++) if (pages[i].dirty && isNear(pages[i].el)) renderPage(pages[i]);
  }

  function updateInfo() {
    if (!pages.length) return;
    var mid = (window.innerHeight || 0) / 2, cur = 1;
    for (var i = 0; i < pages.length; i++) {
      if (pages[i].el.getBoundingClientRect().top <= mid) cur = i + 1;
    }
    infoEl.textContent = T.plain("pdf.page", { n: cur, m: pages.length });
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    (window.requestAnimationFrame || setTimeout)(function () { ticking = false; renderVisible(); updateInfo(); });
  }

  var resizeTimer, lastW = window.innerWidth;
  window.addEventListener("resize", function () {
    if (window.innerWidth === lastW) return; // ignore mobile URL-bar height changes
    lastW = window.innerWidth;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layout, 150);
  });
  window.addEventListener("scroll", onScroll, { passive: true });
  pagesEl.addEventListener("scroll", onScroll, { passive: true });

  function setZoom(d) {
    var n = Math.max(0, Math.min(ZOOMS.length - 1, zoomIdx + d));
    if (n !== zoomIdx) { zoomIdx = n; layout(); }
  }
  var zi = document.getElementById("zoomIn"), zo = document.getElementById("zoomOut");
  if (zi) zi.addEventListener("click", function () { setZoom(1); });
  if (zo) zo.addEventListener("click", function () { setZoom(-1); });

  pdfjsLib.getDocument({ url: url }).promise.then(function (pdf) {
    doc = pdf;
    var chain = Promise.resolve();
    for (var n = 1; n <= pdf.numPages; n++) {
      (function (num) {
        chain = chain.then(function () { return pdf.getPage(num); }).then(function (page) {
          var vp = page.getViewport({ scale: 1 });
          var el = document.createElement("div");
          el.className = "pdf-pg";
          el.innerHTML = '<div class="pdf-pg__ph">Page ' + num + "</div>";
          pagesEl.appendChild(el);
          pages.push({ num: num, page: page, el: el, baseW: vp.width, ratio: vp.height / vp.width, dirty: true });
        });
      })(n);
    }
    return chain;
  }).then(function () {
    statusEl.style.display = "none";
    layout();
    updateInfo();
  }).catch(fail);
})();
