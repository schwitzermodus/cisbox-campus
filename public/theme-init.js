// Setzt data-theme VOR dem ersten Paint, damit Dark Mode nicht aufblitzt.
// Liest nur die Theme-Wahl aus dem lokalen Verlauf (cisbox-campus.v1.theme).
(function () {
  var pref = 'system';
  try {
    var raw = localStorage.getItem('cisbox-campus.v1');
    if (raw) {
      var parsed = JSON.parse(raw);
      if (parsed && (parsed.theme === 'light' || parsed.theme === 'dark')) pref = parsed.theme;
    }
  } catch (e) { /* localStorage nicht verfuegbar: System-Theme */ }
  var dark = pref === 'dark' || (pref === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
})();
