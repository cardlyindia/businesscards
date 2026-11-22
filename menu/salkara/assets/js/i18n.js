/* Language support: English (default) and Malayalam.
   - Page text uses data-i18n="key" (text), data-i18n-html="key" (markup) and
     data-i18n-attr="placeholder:key;aria-label:key" (attributes).
   - Any [data-lang-toggle] button switches language. The choice is remembered on this device;
     first-time visitors always get English.
   - Dish and category names come from assets/data/menu.json ("en" / "ml"). */
(function () {
  "use strict";
  /* Language switch on/off. false = hide the EN / മല buttons and always show English.
     Set back to true to bring Malayalam back (all translations stay in this file and in menu.json). */
  var SHOW_LANGUAGE = false;

  var KEY = "salkara-lang";
  var LANGS = ["en", "ml"];

  var S = {
    en: {
      "lang.switch": "മല", "lang.switchLabel": "മലയാളത്തിൽ കാണുക (Switch to Malayalam)",
      "tag": "Restaurant · Cafeteria · Juice Hub",
      "tagline": "Choose the <em>food</em> you love.",
      "place": "Vithura · <span class=\"nw\">Open daily 5:30 AM – 11:00 PM</span>",
      "hours": "Open daily 5:30 AM – 11:00 PM",
      "a.menu": "Food Menu", "a.menu.sub": "Kitchen &amp; Juice Hub",
      "a.pdf": "Menu Card (PDF)", "a.pdf.sub": "Our printed menu",
      "a.rate": "Rate Us", "a.rate.sub": "Review us on Google",
      "a.contact": "Save Contact", "a.contact.sub": "Add to your phone",
      "a.upi": "Pay with UPI", "a.upi.sub": "GPay · PhonePe · Paytm",
      "a.call": "Call Us",
      "a.home": "Home", "a.home.sub": "Back to the start page",
      "a.find": "Find Us", "a.find.sub": "Salkara Restaurant, Vithura",
      "a.callNum": "Call {n}",
      "nav.visit": "Visit &amp; contact", "nav.open": "Open menu", "nav.close": "Close menu",
      "foot.maps": "Find us on Google Maps", "foot.credit": "Designed &amp; developed by",
      "search.ph": "Search menu…", "search.label": "Search the menu", "search.clear": "Clear search",
      "theme": "Change theme", "theme.row": "Light / dark theme", "home": "Home", "top": "Back to top",
      "items": "{n} items", "items.of": "{n} of {m}",
      "daily": "Daily rate", "popular": "Popular", "popular.title": "Popular dishes",
      "add": "Add", "add.one": "Add one {x}", "remove.one": "Remove one {x}",
      "empty.title": "No dishes found", "empty.text": "Try a different name, for example “biriyani” or “shake”.",
      "juice.sub": "Juices · Mojitos · Shakes",
      "cart.items": "{n} items", "cart.item": "1 item", "cart.daily": " · incl. daily rate", "cart.view": "View order",
      "order.title": "Your order", "order.item": "Item", "order.qty": "Qty", "order.amount": "Amount",
      "order.total": "Total", "order.each": "{p} each", "order.ask": "Price on request", "order.plusDaily": " + daily rate",
      "order.note": "Show this list to our staff. Prices may vary; please confirm with our table service.",
      "order.dailyNote": "Daily-rate items (fish & prawns) are priced by our staff. ",
      "order.clear": "Clear", "order.done": "Done", "order.confirm": "Clear your whole order list?",
      "foot.hours": "Open hours", "foot.hoursText": "Every day, 5:30 AM – 11:00 PM",
      "foot.address": "Address", "foot.addressText": "Salkara Restaurant, Vithura", "foot.contact": "Contact",
      "foot.prices": "Prices may vary. Please confirm with our table service.",
      "loading": "Loading the menu…", "loadFail": "Couldn’t load the menu.", "loadFailHint": "Please check your connection and try again, or open the",
      "pdf.title": "Menu Card", "pdf.page": "Page {n} of {m}", "pdf.loading": "Loading…", "pdf.opening": "Opening the menu card…",
      "pdf.fail": "Can’t show the menu card here", "pdf.failHint": "Open it in your phone’s PDF viewer instead.",
      "pdf.open": "Open PDF", "pdf.download": "Download", "pdf.zoomIn": "Zoom in", "pdf.zoomOut": "Zoom out", "pdf.fit": "Fit",
      "ad.badge": "Ad · Cardly", "ad.title": "Like this page?",
      "ad.text": "Interested in building an <strong>online portfolio like this</strong> for you or for your business?",
      "ad.c1": "Digital menu &amp; business card", "ad.c2": "Works on every phone", "ad.c3": "QR code ready",
      "ad.cta": "Visit Cardly", "ad.later": "Maybe later", "ad.close": "Close",
      "cache.btn": "Refresh menu (clear cache)", "cache.title": "Refresh the menu?",
      "cache.text": "This clears the copy of the website saved on this device and loads the latest menu and prices. Your order list will stay.",
      "cache.size": "Saved on this device: {s}", "cache.cancel": "Cancel", "cache.confirm": "Clear & reload", "cache.working": "Clearing…",
      "cache.done": "Menu refreshed. You’re seeing the latest version.",
      "cache.update": "A newer version of the menu is ready.", "cache.reload": "Update now",
      "cache.offline": "You’re offline. Showing the saved menu."
    },
    ml: {
      "lang.switch": "EN", "lang.switchLabel": "Switch to English (ഇംഗ്ലീഷിൽ കാണുക)",
      "tag": "റെസ്റ്റോറന്റ് · കഫറ്റീരിയ · ജ്യൂസ് ഹബ്",
      "tagline": "ഇഷ്ടമുള്ള <em>രുചി</em> തിരഞ്ഞെടുക്കൂ.",
      "place": "വിതുര · <span class=\"nw\">എല്ലാ ദിവസവും രാവിലെ 5:30 – രാത്രി 11:00</span>",
      "hours": "എല്ലാ ദിവസവും രാവിലെ 5:30 – രാത്രി 11:00",
      "a.menu": "ഭക്ഷണ മെനു", "a.menu.sub": "ഭക്ഷണം &amp; ജ്യൂസ് ഹബ്",
      "a.pdf": "മെനു കാർഡ് (PDF)", "a.pdf.sub": "ഞങ്ങളുടെ അച്ചടിച്ച മെനു",
      "a.rate": "റേറ്റ് ചെയ്യൂ", "a.rate.sub": "ഗൂഗിളിൽ അഭിപ്രായം എഴുതൂ",
      "a.contact": "കോൺടാക്റ്റ് സേവ് ചെയ്യൂ", "a.contact.sub": "നിങ്ങളുടെ ഫോണിൽ ചേർക്കൂ",
      "a.upi": "UPI വഴി പണമടയ്ക്കൂ", "a.upi.sub": "GPay · PhonePe · Paytm",
      "a.call": "വിളിക്കൂ",
      "a.home": "ഹോം", "a.home.sub": "ആദ്യ പേജിലേക്ക്",
      "a.find": "ഞങ്ങളെ കണ്ടെത്തൂ", "a.find.sub": "സൽക്കാര റെസ്റ്റോറന്റ്, വിതുര",
      "a.callNum": "{n} വിളിക്കൂ",
      "nav.visit": "സന്ദർശിക്കൂ &amp; ബന്ധപ്പെടൂ", "nav.open": "മെനു തുറക്കുക", "nav.close": "മെനു അടയ്ക്കുക",
      "foot.maps": "ഗൂഗിൾ മാപ്പിൽ കാണുക", "foot.credit": "രൂപകൽപ്പനയും നിർമ്മാണവും:",
      "search.ph": "മെനുവിൽ തിരയൂ…", "search.label": "മെനുവിൽ തിരയുക", "search.clear": "തിരച്ചിൽ മായ്ക്കുക",
      "theme": "തീം മാറ്റുക", "theme.row": "ലൈറ്റ് / ഡാർക്ക് തീം", "home": "ഹോം", "top": "മുകളിലേക്ക്",
      "items": "{n} ഇനങ്ങൾ", "items.of": "{m}-ൽ {n}",
      "daily": "ദിവസ നിരക്ക്", "popular": "ജനപ്രിയം", "popular.title": "ജനപ്രിയ വിഭവങ്ങൾ",
      "add": "ചേർക്കൂ", "add.one": "{x} ഒന്ന് ചേർക്കുക", "remove.one": "{x} ഒന്ന് കുറയ്ക്കുക",
      "empty.title": "വിഭവങ്ങൾ ഒന്നും കണ്ടെത്തിയില്ല", "empty.text": "മറ്റൊരു പേര് നോക്കൂ, ഉദാ: “ബിരിയാണി” അല്ലെങ്കിൽ “ഷേക്ക്”.",
      "juice.sub": "ജ്യൂസ് · മോജിറ്റോ · ഷേക്ക്",
      "cart.items": "{n} ഇനങ്ങൾ", "cart.item": "1 ഇനം", "cart.daily": " · ദിവസ നിരക്ക് ഉൾപ്പെടെ", "cart.view": "ഓർഡർ കാണുക",
      "order.title": "നിങ്ങളുടെ ഓർഡർ", "order.item": "ഇനം", "order.qty": "എണ്ണം", "order.amount": "തുക",
      "order.total": "ആകെ", "order.each": "ഒന്നിന് {p}", "order.ask": "വില ചോദിക്കൂ", "order.plusDaily": " + ദിവസ നിരക്ക്",
      "order.note": "ഈ ലിസ്റ്റ് ഞങ്ങളുടെ ജീവനക്കാരെ കാണിക്കൂ. വിലയിൽ മാറ്റം വരാം; ടേബിൾ സർവീസുമായി ഉറപ്പുവരുത്തൂ.",
      "order.dailyNote": "ദിവസ നിരക്കുള്ള ഇനങ്ങളുടെ (മീൻ, ചെമ്മീൻ) വില ജീവനക്കാർ അറിയിക്കും. ",
      "order.clear": "മായ്ക്കുക", "order.done": "ശരി", "order.confirm": "മുഴുവൻ ഓർഡർ ലിസ്റ്റും മായ്ക്കണോ?",
      "foot.hours": "പ്രവർത്തന സമയം", "foot.hoursText": "എല്ലാ ദിവസവും, രാവിലെ 5:30 – രാത്രി 11:00",
      "foot.address": "വിലാസം", "foot.addressText": "സൽക്കാര റെസ്റ്റോറന്റ്, വിതുര", "foot.contact": "ബന്ധപ്പെടുക",
      "foot.prices": "വിലയിൽ മാറ്റം വരാം. ടേബിൾ സർവീസുമായി ഉറപ്പുവരുത്തൂ.",
      "loading": "മെനു ലോഡ് ചെയ്യുന്നു…", "loadFail": "മെനു ലോഡ് ചെയ്യാനായില്ല.", "loadFailHint": "ഇന്റർനെറ്റ് പരിശോധിച്ച് വീണ്ടും ശ്രമിക്കൂ, അല്ലെങ്കിൽ തുറക്കൂ:",
      "pdf.title": "മെനു കാർഡ്", "pdf.page": "പേജ് {n} / {m}", "pdf.loading": "ലോഡ് ചെയ്യുന്നു…", "pdf.opening": "മെനു കാർഡ് തുറക്കുന്നു…",
      "pdf.fail": "മെനു കാർഡ് ഇവിടെ കാണിക്കാനാവുന്നില്ല", "pdf.failHint": "ഫോണിലെ PDF വ്യൂവറിൽ തുറക്കൂ.",
      "pdf.open": "PDF തുറക്കൂ", "pdf.download": "ഡൗൺലോഡ്", "pdf.zoomIn": "വലുതാക്കുക", "pdf.zoomOut": "ചെറുതാക്കുക", "pdf.fit": "ഫിറ്റ്",
      "ad.badge": "പരസ്യം · Cardly", "ad.title": "ഈ പേജ് ഇഷ്ടപ്പെട്ടോ?",
      "ad.text": "നിങ്ങൾക്കോ നിങ്ങളുടെ ബിസിനസിനോ <strong>ഇതുപോലൊരു ഓൺലൈൻ പോർട്ട്ഫോളിയോ</strong> വേണോ?",
      "ad.c1": "ഡിജിറ്റൽ മെനു &amp; ബിസിനസ് കാർഡ്", "ad.c2": "എല്ലാ ഫോണിലും പ്രവർത്തിക്കും", "ad.c3": "QR കോഡ് സൗകര്യം",
      "ad.cta": "Cardly സന്ദർശിക്കൂ", "ad.later": "പിന്നീട്", "ad.close": "അടയ്ക്കുക",
      "cache.btn": "മെനു പുതുക്കുക (കാഷെ മായ്ക്കുക)", "cache.title": "മെനു പുതുക്കണോ?",
      "cache.text": "ഈ ഉപകരണത്തിൽ സേവ് ചെയ്ത വെബ്സൈറ്റ് പകർപ്പ് മായ്ച്ച് ഏറ്റവും പുതിയ മെനുവും വിലകളും ലോഡ് ചെയ്യും. നിങ്ങളുടെ ഓർഡർ ലിസ്റ്റ് നഷ്ടമാകില്ല.",
      "cache.size": "ഈ ഉപകരണത്തിൽ സേവ് ചെയ്തത്: {s}", "cache.cancel": "വേണ്ട", "cache.confirm": "മായ്ച്ച് റീലോഡ് ചെയ്യുക", "cache.working": "മായ്ക്കുന്നു…",
      "cache.done": "മെനു പുതുക്കി. ഏറ്റവും പുതിയ പതിപ്പാണ് കാണുന്നത്.",
      "cache.update": "മെനുവിന്റെ പുതിയ പതിപ്പ് തയ്യാർ.", "cache.reload": "ഇപ്പോൾ പുതുക്കുക",
      "cache.offline": "നിങ്ങൾ ഓഫ്‌ലൈനാണ്. സേവ് ചെയ്ത മെനു കാണിക്കുന്നു."
    }
  };

  function read() {
    if (!SHOW_LANGUAGE) return "en";
    try { var v = localStorage.getItem(KEY); return LANGS.indexOf(v) > -1 ? v : "en"; } catch (e) { return "en"; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) { /* storage unavailable */ } }

  var lang = read();
  var listeners = [];

  function t(key, vars) {
    var s = (S[lang] && S[lang][key] != null) ? S[lang][key] : (S.en[key] != null ? S.en[key] : key);
    if (vars) for (var k in vars) if (vars.hasOwnProperty(k)) s = s.split("{" + k + "}").join(vars[k]);
    return s;
  }
  function plain(key, vars) { var d = document.createElement("div"); d.innerHTML = t(key, vars); return d.textContent; }

  function apply(scope) {
    scope = scope || document;
    var i, el, n;
    n = scope.querySelectorAll("[data-i18n]");
    for (i = 0; i < n.length; i++) { el = n[i]; el.textContent = plain(el.getAttribute("data-i18n")); }
    n = scope.querySelectorAll("[data-i18n-html]");
    for (i = 0; i < n.length; i++) { el = n[i]; el.innerHTML = t(el.getAttribute("data-i18n-html")); }
    n = scope.querySelectorAll("[data-i18n-attr]");
    for (i = 0; i < n.length; i++) {
      el = n[i];
      var pairs = el.getAttribute("data-i18n-attr").split(";");
      for (var j = 0; j < pairs.length; j++) {
        var p = pairs[j].split(":");
        if (p.length === 2) el.setAttribute(p[0].trim(), plain(p[1].trim()));
      }
    }
    n = document.querySelectorAll("[data-lang-toggle]");
    for (i = 0; i < n.length; i++) {
      n[i].textContent = t("lang.switch");
      n[i].setAttribute("aria-label", t("lang.switchLabel"));
      n[i].setAttribute("title", t("lang.switchLabel"));
      n[i].setAttribute("lang", lang === "en" ? "ml" : "en");
    }
  }

  function set(l) {
    if (!SHOW_LANGUAGE) return;
    if (LANGS.indexOf(l) < 0 || l === lang) return;
    lang = l;
    save(l);
    document.documentElement.setAttribute("lang", l);
    apply();
    for (var i = 0; i < listeners.length; i++) { try { listeners[i](l); } catch (e) { if (window.console) console.error(e); } }
  }

  document.documentElement.setAttribute("lang", lang);
  if (!SHOW_LANGUAGE) document.documentElement.className += " lang-off";
  document.addEventListener("DOMContentLoaded", function () { apply(); });
  document.addEventListener("click", function (e) {
    var el = e.target;
    while (el && el !== document) {
      if (el.hasAttribute && el.hasAttribute("data-lang-toggle")) { set(lang === "en" ? "ml" : "en"); return; }
      el = el.parentNode;
    }
  });

  window.I18N = {
    t: t, plain: plain, apply: apply, set: set,
    get lang() { return lang; },
    onChange: function (fn) { listeners.push(fn); },
    pick: function (obj) { return obj ? (obj[lang] || obj.en || "") : ""; }
  };
})();
