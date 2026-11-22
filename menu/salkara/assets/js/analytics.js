/* Extra Google Analytics events. The Google tag itself (gtag.js, ID G-GED109S1GN) is in the <head> of
   index.html, menu.html and pdf.html. This file adds events for useful taps: opening the order list,
   the menu card download, Rate Us / Find Us / Call / UPI / Save Contact taps, and Cardly popup clicks. */
(function () {
  "use strict";
  if (typeof window.gtag !== "function") return;   // tag removed from the page -> no events

  function ev(name, params) { try { window.gtag("event", name, params || {}); } catch (e) { /* ignore */ } }
  window.SalkaraTrack = ev;

  document.addEventListener("click", function (e) {
    var t = e.target;
    while (t && t !== document) {
      if (t.nodeType === 1) {
        if (t.id === "cartbar") { ev("view_order"); return; }
        if (t.className && String(t.className).indexOf("promo__cta") > -1) { ev("cardly_click"); return; }
        var href = t.getAttribute && t.getAttribute("href");
        if (href) {
          if (/^tel:/.test(href)) ev("call", { number: href.slice(4) });
          else if (/^upi:/.test(href)) ev("upi_pay");
          else if (/\.vcf$/.test(href)) ev("save_contact");
          else if (/\.pdf$/.test(href)) ev("menu_pdf_download");
          else if (/google\.com\/maps\/place/.test(href)) ev("rate_us");
          else if (/maps\.app\.goo\.gl/.test(href)) ev("find_us");
          return;
        }
      }
      t = t.parentNode;
    }
  }, true);
})();
