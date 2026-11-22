/* SALKARA web menu: loads assets/data/menu.json, renders it in English or Malayalam,
   with popular-dish photos, category navigation, search and an order list.
   Plain ES5 + feature checks so it runs on old and new browsers alike. */
(function () {
  "use strict";

  var DATA_URL = "assets/data/menu.json";
  var STORE_KEY = "salkara-order";
  var L = window.I18N || { t: function (k) { return k; }, plain: function (k) { return k; }, pick: function (o) { return o.en; }, lang: "en", onChange: function () {} };

  var $ = function (id) { return document.getElementById(id); };
  var sectionsEl = $("sections"), chipsEl = $("chips"), sideEl = $("side");
  var qInput = $("q"), searchBox = qInput.parentNode;
  var cartbar = $("cartbar"), sheet = $("sheet");

  var MENU = [], GROUPS = {}, ITEMS = {}, order = {};

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function rupees(n) { return "₹" + Number(n).toLocaleString("en-IN"); }
  function norm(s) { return String(s).toLowerCase().replace(/[\s\-_,.()&]+/g, " ").replace(/\s+/g, " ").trim(); }
  function icon(id) { return '<svg class="icon" aria-hidden="true"><use href="#' + id + '" xlink:href="#' + id + '"/></svg>'; }
  function itemKey(catId, it) { return catId + "|" + it.en; }
  function name(it) { return L.pick(it); }
  function photo(it, cls, size) {
    var base = "assets/img/dishes/" + it.photo;
    // "photo": "name"           -> name.webp with name.jpg fallback
    // "photo": "name.jpg/.png"  -> that single file
    if (/\.(jpe?g|png|webp)$/i.test(it.photo)) {
      return '<picture class="' + cls + '"><img src="' + esc(base) + '" alt="" width="' + size + '" height="' + size + '" loading="lazy" decoding="async"></picture>';
    }
    return '<picture class="' + cls + '"><source type="image/webp" srcset="' + esc(base) + '.webp">' +
      '<img src="' + esc(base) + '.jpg" alt="" width="' + size + '" height="' + size + '" loading="lazy" decoding="async"></picture>';
  }
  function drink(n) {
    return '<picture><source type="image/webp" srcset="assets/img/drink-' + n + '.webp">' +
      '<img src="assets/img/drink-' + n + '.jpg" alt="" width="300" height="439" loading="lazy" decoding="async"></picture>';
  }

  /* ---------- load data ---------- */
  function load(cb, fail) {
    function done(text) { try { cb(JSON.parse(text)); } catch (e) { fail(e); } }
    if (window.fetch) {
      fetch(DATA_URL, { cache: "no-cache" }).then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.text();
      }).then(done).catch(xhr);
    } else xhr();
    function xhr() { // older browsers, and some file:// setups
      try {
        var x = new XMLHttpRequest();
        x.open("GET", DATA_URL, true);
        x.onload = function () { if (x.status === 200 || (x.status === 0 && x.responseText)) done(x.responseText); else fail(new Error("HTTP " + x.status)); };
        x.onerror = function () { fail(new Error("network")); };
        x.send();
      } catch (e) { fail(e); }
    }
  }

  /* ---------- order storage ---------- */
  function readOrder() {
    try { order = JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { order = {}; }
    Object.keys(order).forEach(function (k) { if (!ITEMS[k] || !(order[k] > 0)) delete order[k]; });
  }
  function persist() { try { localStorage.setItem(STORE_KEY, JSON.stringify(order)); } catch (e) { /* storage unavailable */ } }

  /* ---------- render ---------- */
  function qtyControls(it) {
    var n = esc(name(it));
    return '<div class="qty">' +
      '<button type="button" class="qty__btn qty__minus" data-act="dec" aria-label="' + esc(L.plain("remove.one", { x: n })) + '">' + icon("i-minus") + "</button>" +
      '<span class="qty__num" aria-live="polite">0</span>' +
      '<button type="button" class="qty__btn qty__btn--add" data-act="inc" aria-label="' + esc(L.plain("add.one", { x: n })) + '">' + icon("i-plus") + "</button>" +
      "</div>";
  }
  function priceHtml(it) {
    return it.price == null ? '<span class="item__price item__price--daily">' + esc(L.plain("daily")) + "</span>"
      : '<span class="item__price">' + rupees(it.price) + "</span>";
  }

  function renderPopular() {
    var cards = "";
    MENU.forEach(function (cat) {
      cat.items.forEach(function (it) {
        if (!it.popular || !it.photo) return;
        var key = itemKey(cat.id, it);
        cards += '<li class="pop item" data-key="' + esc(key) + '">' +
          '<div class="item__main pop__main" role="button" tabindex="0" aria-label="' + esc(L.plain("add") + " " + name(it)) + '">' +
          photo(it, "pop__img", 360) +
          '<span class="pop__badge">★ ' + esc(L.plain("popular")) + "</span>" +
          '<span class="pop__name item__name">' + esc(name(it)) + "</span>" +
          '<span class="pop__cat">' + esc(L.pick(cat.name)) + "</span></div>" +
          '<div class="pop__foot">' + priceHtml(it) + qtyControls(it) + "</div></li>";
      });
    });
    return cards ? '<section class="popular" id="popular" aria-labelledby="h-popular">' +
      '<div class="cat__head"><h2 class="cat__title" id="h-popular">' + esc(L.plain("popular.title")) + "</h2></div>" +
      '<ul class="pop-track">' + cards + "</ul></section>" : "";
  }

  function render() {
    var html = renderPopular(), chips = "", side = "", lastGroup = null;
    MENU.forEach(function (cat) {
      var gName = L.pick(GROUPS[cat.group]) || cat.group;
      if (cat.group !== lastGroup) {
        if (lastGroup !== null) chips += '<span class="chip-sep" aria-hidden="true"></span>';
        if (lastGroup === "drinks") html += "</div>";
        if (cat.group === "drinks") {
          html += '<div class="juicehub" data-group="drinks"><div class="juicehub__head">' +
            '<h2 class="juicehub__title script">' + esc(gName) + "</h2>" +
            '<p class="juicehub__sub">' + esc(L.plain("juice.sub")) + "</p>" +
            '<div class="drinks-row" aria-hidden="true">' + drink("orange-juice") + drink("pineapple-juice") + drink("orange-cooler") + drink("pineapple-shake") + "</div></div>";
        }
        html += '<h2 class="group-title" data-group="' + cat.group + '">' + esc(gName) + "</h2>";
        side += '<div class="side-group" data-group="' + cat.group + '">' + esc(gName) + "</div>";
        lastGroup = cat.group;
      }
      var drinks = cat.group === "drinks", cName = L.pick(cat.name);
      chips += '<a class="chip' + (drinks ? " chip--drinks" : "") + '" href="#' + cat.id + '" data-cat="' + cat.id + '">' + esc(cName) + "</a>";
      side += '<a class="side-link" href="#' + cat.id + '" data-cat="' + cat.id + '">' + esc(cName) + " <small>" + cat.items.length + "</small></a>";

      html += '<section class="cat' + (drinks ? " cat--drinks" : "") + '" id="' + cat.id + '" aria-labelledby="h-' + cat.id + '">' +
        '<div class="cat__head"><h2 class="cat__title" id="h-' + cat.id + '">' + esc(cName) + '</h2><span class="cat__count">' + esc(L.plain("items", { n: cat.items.length })) + "</span></div>" +
        (cat.note ? '<p class="cat__note">' + esc(L.pick(cat.note)) + "</p>" : "") +
        '<ul class="items">';
      cat.items.forEach(function (it) {
        var key = itemKey(cat.id, it);
        html += '<li class="item' + (it.photo ? " item--photo" : "") + '" data-key="' + esc(key) + '" data-search="' + esc(norm(it.en + " " + (it.ml || "") + " " + cat.name.en + " " + (cat.name.ml || ""))) + '">' +
          (it.photo ? photo(it, "item__img", 360) : "") +
          '<div class="item__main" role="button" tabindex="0" aria-label="' + esc(L.plain("add") + " " + name(it)) + '"><span class="item__name">' + esc(name(it)) + "</span>" +
          (it.popular ? '<span class="item__tag">★</span>' : "") +
          '<span class="item__dots" aria-hidden="true"></span>' + priceHtml(it) + "</div>" +
          qtyControls(it) + "</li>";
      });
      html += "</ul></section>";
    });
    if (lastGroup === "drinks") html += "</div>";
    sectionsEl.innerHTML = html;
    chipsEl.innerHTML = chips;
    sideEl.innerHTML = side;
    Object.keys(ITEMS).forEach(syncItem);
  }

  /* ---------- order UI ---------- */
  function setQty(key, q) {
    if (!ITEMS[key]) return;
    if (q > 0) order[key] = Math.min(q, 99); else delete order[key];
    persist();
    syncItem(key);
    syncCart();
  }
  function syncItem(key) {
    var els = sectionsEl.querySelectorAll('.item[data-key="' + key.replace(/"/g, '\\"') + '"]');
    var q = order[key] || 0;
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (q) { if (el.className.indexOf("in-cart") < 0) el.className += " in-cart"; }
      else el.className = el.className.replace(/\s?in-cart/g, "");
      el.querySelector(".qty__num").textContent = q;
    }
  }
  function totals() {
    var count = 0, sum = 0, daily = 0;
    Object.keys(order).forEach(function (k) {
      var q = order[k], it = ITEMS[k].item;
      count += q;
      if (it.price == null) daily += q; else sum += it.price * q;
    });
    return { count: count, sum: sum, daily: daily };
  }
  function syncCart() {
    var t = totals();
    $("cartCount").textContent = (t.count === 1 ? L.plain("cart.item") : L.plain("cart.items", { n: t.count })) + (t.daily ? L.plain("cart.daily") : "");
    $("cartTotal").textContent = rupees(t.sum) + (t.daily ? " +" : "");
    cartbar.className = "cartbar" + (t.count ? " is-visible" : "");
    document.body.className = document.body.className.replace(/\s?has-order/g, "") + (t.count ? " has-order" : "");
    if (!t.count && sheet.className.indexOf("is-open") > -1) closeSheet();
    if (sheet.className.indexOf("is-open") > -1) renderOrder();
  }
  function renderOrder() {
    var rows = "", t = totals();
    MENU.forEach(function (cat) {
      cat.items.forEach(function (it) {
        var k = itemKey(cat.id, it), q = order[k];
        if (!q) return;
        var amount = it.price == null ? esc(L.plain("daily")) : rupees(it.price * q);
        var unit = it.price == null ? esc(L.plain("order.ask")) : esc(L.plain("order.each", { p: rupees(it.price) }));
        rows += '<tr><td><span class="order__item-name">' + esc(name(it)) + '</span><span class="order__unit">' + unit + "</span></td>" +
          '<td class="q">' + q + '</td><td class="num">' + amount + "</td></tr>";
      });
    });
    $("orderRows").innerHTML = rows;
    $("sheetTotal").textContent = rupees(t.sum) + (t.daily ? L.plain("order.plusDaily") : "");
    $("sheetNote").textContent = (t.daily ? L.plain("order.dailyNote") : "") + L.plain("order.note");
  }

  /* ---------- sheet ---------- */
  var lastFocus = null;
  function openSheet() {
    renderOrder();
    lastFocus = document.activeElement;
    sheet.className = "sheet is-open";
    sheet.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    var c = sheet.querySelector(".sheet__head [data-close]");
    if (c) setTimeout(function () { c.focus(); }, 50);
  }
  function closeSheet() {
    sheet.className = "sheet";
    sheet.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* ---------- search ---------- */
  function highlight(text, terms) {
    var out = esc(text);
    terms.forEach(function (t) {
      if (!t) return;
      var re = new RegExp("(" + esc(t).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig");
      out = out.replace(re, "<mark>$1</mark>");
    });
    return out;
  }
  function runSearch() {
    var raw = qInput.value, q = norm(raw), terms = q ? q.split(" ") : [];
    searchBox.className = "search" + (raw ? " has-value" : "");
    var anyVisible = false, groupsVisible = {};
    var pop = $("popular");
    if (pop) pop.style.display = terms.length ? "none" : "";
    MENU.forEach(function (cat) {
      var sec = $(cat.id), visible = 0;
      var lis = sec.querySelectorAll(".item");
      for (var i = 0; i < lis.length; i++) {
        var li = lis[i], hay = li.getAttribute("data-search");
        var ok = terms.every(function (t) { return hay.indexOf(t) > -1; });
        li.style.display = ok ? "" : "none";
        var nm = name(ITEMS[li.getAttribute("data-key")].item);
        li.querySelector(".item__name").innerHTML = terms.length && ok ? highlight(nm, terms) : esc(nm);
        if (ok) visible++;
      }
      sec.style.display = visible ? "" : "none";
      sec.querySelector(".cat__count").textContent = terms.length ? L.plain("items.of", { n: visible, m: cat.items.length }) : L.plain("items", { n: cat.items.length });
      toggleNav(cat.id, !!visible);
      if (visible) { anyVisible = true; groupsVisible[cat.group] = true; }
    });
    var gts = document.querySelectorAll("[data-group]");
    for (var g = 0; g < gts.length; g++) gts[g].style.display = groupsVisible[gts[g].getAttribute("data-group")] ? "" : "none";
    $("empty").className = "empty" + (anyVisible ? "" : " is-visible");
  }
  function toggleNav(catId, show) {
    var els = document.querySelectorAll('[data-cat="' + catId + '"]');
    for (var i = 0; i < els.length; i++) els[i].style.display = show ? "" : "none";
  }

  /* ---------- scroll spy ---------- */
  var activeCat = null;
  function setActive(id) {
    if (id === activeCat) return;
    activeCat = id;
    var els = document.querySelectorAll("[data-cat]");
    for (var i = 0; i < els.length; i++) {
      var on = els[i].getAttribute("data-cat") === id;
      els[i].className = els[i].className.replace(/\s?is-active/g, "") + (on ? " is-active" : "");
      if (on && els[i].className.indexOf("chip") === 0) {
        var track = chipsEl, chip = els[i];
        var target = chip.offsetLeft - (track.clientWidth - chip.offsetWidth) / 2;
        if (track.scrollTo) { try { track.scrollTo({ left: target, behavior: "smooth" }); } catch (e) { track.scrollLeft = target; } }
        else track.scrollLeft = target;
      }
    }
  }
  function spy() {
    if (!MENU.length) return;
    var offset = (window.innerWidth >= 1024 ? 64 : 120) + 24, current = MENU[0].id;
    for (var i = 0; i < MENU.length; i++) {
      var sec = $(MENU[i].id);
      if (sec.style.display === "none") continue;
      if (sec.getBoundingClientRect().top - offset <= 0) current = MENU[i].id; else break;
    }
    var docH = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    if ((window.pageYOffset || 0) + window.innerHeight >= docH - 4) {
      for (var j = MENU.length - 1; j >= 0; j--) { if ($(MENU[j].id).style.display !== "none") { current = MENU[j].id; break; } }
    }
    setActive(current);
    var tt = $("toTop");
    tt.className = "icon-btn to-top" + ((window.pageYOffset || document.documentElement.scrollTop) > 600 ? " is-visible" : "");
  }
  var ticking = false, navLock = false, lockTimer;
  function onScroll() {
    if (navLock) {
      clearTimeout(lockTimer);
      lockTimer = setTimeout(function () { navLock = false; spy(); }, 180);
      return;
    }
    if (ticking) return;
    ticking = true;
    (window.requestAnimationFrame || setTimeout)(function () { ticking = false; spy(); });
  }
  function smoothTo(y) {
    try { window.scrollTo({ top: y, behavior: "smooth" }); } catch (e) { window.scrollTo(0, y); }
  }
  function jumpTo(id) {
    var sec = $(id);
    if (!sec) return;
    var header = window.innerWidth >= 1024 ? 64 + 8 : 64 + 56 + 4;
    smoothTo(sec.getBoundingClientRect().top + (window.pageYOffset || 0) - header);
    if (history.replaceState) history.replaceState(null, "", "#" + id);
  }

  /* ---------- events ---------- */
  function closest(el, sel) {
    while (el && el.nodeType === 1) {
      if ((el.matches || el.msMatchesSelector || el.webkitMatchesSelector).call(el, sel)) return el;
      el = el.parentNode;
    }
    return null;
  }

  sectionsEl.addEventListener("click", function (e) {
    var li = closest(e.target, ".item");
    if (!li) return;
    var key = li.getAttribute("data-key"), q = order[key] || 0;
    var btn = closest(e.target, "[data-act]");
    if (btn) setQty(key, btn.getAttribute("data-act") === "inc" ? q + 1 : q - 1);
    else if ((closest(e.target, ".item__main") || closest(e.target, ".item__img")) && !q) setQty(key, 1);
  });
  sectionsEl.addEventListener("keydown", function (e) {
    var main = closest(e.target, ".item__main");
    if (main && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      var key = closest(main, ".item").getAttribute("data-key");
      setQty(key, (order[key] || 0) + 1);
    }
  });

  function navClick(e) {
    var a = closest(e.target, "[data-cat]");
    if (!a) return;
    e.preventDefault();
    var id = a.getAttribute("data-cat");
    setActive(id);
    navLock = true;
    clearTimeout(lockTimer);
    lockTimer = setTimeout(function () { navLock = false; spy(); }, 1200);
    jumpTo(id);
  }
  chipsEl.addEventListener("click", navClick);
  sideEl.addEventListener("click", navClick);

  var searchTimer;
  qInput.addEventListener("input", function () { clearTimeout(searchTimer); searchTimer = setTimeout(function () { if (MENU.length) { runSearch(); spy(); } }, 80); });
  qInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      qInput.blur();
      var secs = sectionsEl.querySelectorAll(".cat");
      for (var i = 0; i < secs.length; i++) if (secs[i].style.display !== "none") { jumpTo(secs[i].id); break; }
    } else if (e.key === "Escape") { qInput.value = ""; runSearch(); }
  });
  searchBox.querySelector(".search__clear").addEventListener("click", function () { qInput.value = ""; runSearch(); qInput.focus(); });

  cartbar.addEventListener("click", openSheet);
  sheet.addEventListener("click", function (e) { if (closest(e.target, "[data-close]")) closeSheet(); });
  document.addEventListener("keydown", function (e) { if ((e.key === "Escape" || e.key === "Esc") && sheet.className.indexOf("is-open") > -1) closeSheet(); });
  $("clearCart").addEventListener("click", function () {
    if (!window.confirm || window.confirm(L.plain("order.confirm"))) {
      var keys = Object.keys(order);
      order = {};
      persist();
      keys.forEach(syncItem);
      syncCart();
      closeSheet();
    }
  });
  $("toTop").addEventListener("click", function () { smoothTo(0); });

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  /* language switch: re-render in place, keep scroll position and search */
  L.onChange(function () {
    if (!MENU.length) return;
    var y = window.pageYOffset || 0;
    activeCat = null;
    render();
    if (qInput.value) runSearch();
    syncCart();
    window.scrollTo(0, y);
    spy();
  });

  /* ---------- start ---------- */
  load(function (data) {
    MENU = data.categories || [];
    GROUPS = data.groups || {};
    MENU.forEach(function (cat) { cat.items.forEach(function (it) { ITEMS[itemKey(cat.id, it)] = { item: it, cat: cat }; }); });
    readOrder();
    render();
    syncCart();
    if (qInput.value) runSearch();
    spy();
    if (location.hash && $(location.hash.slice(1))) setTimeout(function () { jumpTo(location.hash.slice(1)); }, 60);
  }, function (err) {
    if (window.console) console.warn("Menu data:", err);
    sectionsEl.innerHTML = '<div class="empty is-visible"><strong>' + esc(L.plain("loadFail")) + "</strong>" +
      esc(L.plain("loadFailHint")) + ' <a href="pdf.html">' + esc(L.plain("a.pdf")) + "</a></div>";
  });
})();
