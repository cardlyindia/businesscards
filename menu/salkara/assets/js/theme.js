/* Theme: default is ALWAYS the device theme ("auto"). The toggle cycles auto → light → dark;
   a manual choice lasts only for the current visit (sessionStorage), so new visits follow the device again.
   Loaded in <head> (not deferred) so the page never flashes the wrong theme. */
(function () {
  var KEY = "salkara-theme";
  var root = document.documentElement;
  var modes = ["auto", "light", "dark"];
  var labels = { auto: "Theme: automatic (follows device)", light: "Theme: light", dark: "Theme: dark" };

  function read() {
    try { localStorage.removeItem(KEY); } catch (e) { /* clear choices saved by older versions */ }
    try { var v = sessionStorage.getItem(KEY); return modes.indexOf(v) > -1 ? v : "auto"; } catch (e) { return "auto"; }
  }
  function save(v) { try { sessionStorage.setItem(KEY, v); } catch (e) { /* private mode */ } }

  function isDark(mode) {
    if (mode === "dark") return true;
    if (mode === "light") return false;
    return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  }

  function apply(mode) {
    if (mode === "auto") root.removeAttribute("data-theme"); else root.setAttribute("data-theme", mode);
    root.setAttribute("data-theme-mode", mode);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", isDark(mode) ? "#171111" : "#faf6f1");
    var btns = document.querySelectorAll("[data-theme-toggle]");
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute("aria-label", labels[mode] + ". Tap to change.");
      btns[i].setAttribute("title", labels[mode]);
    }
  }

  var current = read();
  apply(current);

  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    var onChange = function () { if (current === "auto") apply("auto"); };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange); /* Safari < 14 */
  }

  document.addEventListener("click", function (e) {
    var t = e.target;
    while (t && t !== document) {
      if (t.hasAttribute && t.hasAttribute("data-theme-toggle")) {
        current = modes[(modes.indexOf(current) + 1) % modes.length];
        save(current);
        apply(current);
        return;
      }
      t = t.parentNode;
    }
  });

  document.addEventListener("DOMContentLoaded", function () { apply(current); });
})();
