/* SALKARA service worker: makes the site fast and usable offline.

   How updates work (nothing to do when you change the site):
   - Pages (.html) and the menu data (assets/data/menu.json) are always fetched fresh when online
     ("network first"). The saved copy is only used offline, so price changes show immediately.
   - Images, fonts, styles and scripts load instantly from the saved copy and are re-checked in the
     background ("stale while revalidate"). If a file changed, visitors see an "Update" notice.
   - To force every visitor to drop ALL saved files at once, change VERSION below.
*/
var VERSION = "2026-11-22.2";
var CACHE = "salkara-" + VERSION;
var PRECACHE = [
  "./",
  "index.html",
  "menu.html",
  "pdf.html",
  "manifest.webmanifest",
  "assets/data/menu.json",
  "assets/css/fonts.css",
  "assets/css/style.css",
  "assets/js/cache.js",
  "assets/js/config.js",
  "assets/js/i18n.js",
  "assets/js/menu.js",
  "assets/js/nav.js",
  "assets/js/pdf-viewer.js",
  "assets/js/promo.js",
  "assets/js/theme.js",
  "assets/vendor/pdfjs/pdf.min.js",
  "assets/vendor/pdfjs/pdf.worker.min.js",
  "assets/fonts/baloo-chettan-2-latin-600-normal.woff2",
  "assets/fonts/baloo-chettan-2-latin-700-normal.woff2",
  "assets/fonts/baloo-chettan-2-latin-800-normal.woff2",
  "assets/fonts/baloo-chettan-2-latin-ext-600-normal.woff2",
  "assets/fonts/baloo-chettan-2-latin-ext-700-normal.woff2",
  "assets/fonts/baloo-chettan-2-latin-ext-800-normal.woff2",
  "assets/fonts/dancing-script-latin-700-normal.woff2",
  "assets/fonts/dancing-script-latin-ext-700-normal.woff2",
  "assets/fonts/poppins-latin-400-normal.woff2",
  "assets/fonts/poppins-latin-500-normal.woff2",
  "assets/fonts/poppins-latin-600-normal.woff2",
  "assets/fonts/poppins-latin-700-normal.woff2",
  "assets/fonts/poppins-latin-ext-400-normal.woff2",
  "assets/fonts/poppins-latin-ext-500-normal.woff2",
  "assets/fonts/poppins-latin-ext-600-normal.woff2",
  "assets/fonts/poppins-latin-ext-700-normal.woff2",
  "assets/img/logo-480.png",
  "assets/img/logo-white-480.png",
  "assets/img/icon-32.png",
  "assets/img/icon-180.png",
  "assets/img/icon-192.png",
  "assets/img/hero-640.webp",
  "assets/img/hero-1024.webp",
  "assets/img/hero-1024.jpg",
  "assets/img/food-chicken-curry.webp",
  "assets/img/food-green-juice.webp",
  "assets/img/food-grilled-steak.webp",
  "assets/img/food-kebab-platter.webp",
  "assets/img/food-roast-chicken.webp",
  "assets/img/food-tomato.webp",
  "assets/img/drink-orange-cooler.webp",
  "assets/img/drink-orange-juice.webp",
  "assets/img/drink-pineapple-juice.webp",
  "assets/img/drink-pineapple-shake.webp",
  "assets/img/dishes/al-faham.webp",
  "assets/img/dishes/chicken-curry.webp",
  "assets/img/dishes/green-mojito.webp",
  "assets/img/dishes/orange-juice.webp",
  "assets/img/dishes/pineapple-juice.webp"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      // fetch fresh copies (bypass the HTTP cache); skip files that fail instead of failing the install
      return Promise.all(PRECACHE.map(function (u) {
        return fetch(new Request(u, { cache: "reload" })).then(function (r) { if (r.ok) return c.put(u, r); }).catch(function () {});
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) { if (k.indexOf("salkara-") === 0 && k !== CACHE) return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("message", function (e) {
  var d = e.data || {};
  if (d.type === "clear") {
    e.waitUntil(caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) { return caches.delete(k); }));
    }).then(function () { if (e.source) e.source.postMessage({ type: "cleared" }); }));
  } else if (d.type === "version" && e.source) {
    e.source.postMessage({ type: "version", version: VERSION });
  }
});

function notify(msg) {
  return self.clients.matchAll({ type: "window" }).then(function (cs) { cs.forEach(function (c) { c.postMessage(msg); }); });
}
function keyFor(req) { var u = new URL(req.url); return u.origin + u.pathname; } // ignore ?query

function networkFirst(req, isData) {
  return new Promise(function (resolve) {
    var settled = false;
    var timer = setTimeout(function () { fallback(); }, isData ? 6000 : 5000);
    function fallback() {
      if (settled) return; settled = true;
      caches.match(keyFor(req)).then(function (hit) {
        if (hit) { if (isData) notify({ type: "offline" }); resolve(hit); }
        else if (req.mode === "navigate") caches.match(new URL("index.html", self.registration.scope).href).then(function (h) { resolve(h || Response.error()); });
        else resolve(Response.error());
      });
    }
    fetch(req, { cache: "no-store" }).then(function (res) {
      if (!res || !res.ok) { if (!settled && res && res.status === 404) { settled = true; clearTimeout(timer); resolve(res); } else fallback(); return; }
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(keyFor(req), copy); });
      if (!settled) { settled = true; clearTimeout(timer); resolve(res); }
    }).catch(fallback);
  });
}

function sameFile(a, b) {
  var h = ["etag", "last-modified", "content-length"];
  for (var i = 0; i < h.length; i++) {
    var x = a.headers.get(h[i]), y = b.headers.get(h[i]);
    if (x && y) return x === y;
  }
  return true; // no validators: assume unchanged
}

function staleWhileRevalidate(e) {
  var req = e.request, key = keyFor(req);
  return caches.match(key).then(function (hit) {
    // "no-cache" = ask the server whether the file changed (a cheap 304 when it didn't), never trust the HTTP cache
    var net = fetch(req, { cache: "no-cache" }).then(function (res) {
      if (res && res.ok && res.type === "basic") {
        if (hit && !sameFile(hit, res)) notify({ type: "updated", url: key });
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(key, copy); });
      }
      return res;
    }).catch(function () { return hit || Response.error(); });
    e.waitUntil(net.then(function () {}, function () {}));
    return hit || net;
  });
}

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;               // maps, cardly, etc.: browser default
  if (req.headers.has("range") || /\.(pdf|vcf)$/i.test(url.pathname)) return; // big/ranged files: browser default
  var isPage = req.mode === "navigate" || /\.html$/i.test(url.pathname) || /\/$/.test(url.pathname);
  var isData = /\.json$/i.test(url.pathname);
  if (isPage || isData) e.respondWith(networkFirst(req, isData));
  else e.respondWith(staleWhileRevalidate(e));
});
