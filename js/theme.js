/* =====================================================================
   THEME TOGGLE · Dr. Francisco López Torres
   Modo oscuro (default) / Modo claro · persistido en localStorage
   ===================================================================== */

(function () {
  'use strict';

  const STORAGE_KEY = 'drflt-theme';
  const DEFAULT_THEME = 'dark';

  function getStoredTheme() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function setStoredTheme(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) { /* noop */ }
  }
  function getPreferredTheme() {
    const stored = getStoredTheme();
    if (stored === 'light' || stored === 'dark') return stored;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return DEFAULT_THEME;
  }
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    const icon = document.getElementById('theme-icon');
    if (icon) icon.textContent = theme === 'dark' ? '☾' : '☀';
  }

  // Apply theme ASAP (before paint) to avoid flash
  applyTheme(getPreferredTheme());

  window.initTheme = function () {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    applyTheme(getPreferredTheme());
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || DEFAULT_THEME;
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      setStoredTheme(next);
    });
  };
})();
