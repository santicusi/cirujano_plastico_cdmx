/* =====================================================================
   I18N · Dr. Francisco López Torres
   Sistema bilingüe ES/EN basado en data-i18n + JSON files.
   ===================================================================== */

(function () {
  'use strict';

  const STORAGE_KEY = 'drflt-lang';
  const DEFAULT_LANG = 'es';
  const SUPPORTED = ['es', 'en'];
  let dict = {};
  let currentLang = DEFAULT_LANG;

  function getStored() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function setStored(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) { /* noop */ }
  }
  function getPreferred() {
    const stored = getStored();
    if (SUPPORTED.includes(stored)) return stored;
    const browser = (navigator.language || 'es').slice(0, 2).toLowerCase();
    if (SUPPORTED.includes(browser)) return browser;
    return DEFAULT_LANG;
  }

  async function loadDict(lang) {
    try {
      const res = await fetch(`lang/${lang}.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      dict = await res.json();
    } catch (err) {
      console.warn(`[i18n] No se pudo cargar lang/${lang}.json`, err);
      dict = {};
    }
  }

  function getNested(obj, path) {
    return path.split('.').reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : null), obj);
  }

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const value = getNested(dict, key);
      if (value != null) el.textContent = value;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      const value = getNested(dict, key);
      if (value != null) el.innerHTML = value;
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const pairs = el.getAttribute('data-i18n-attr').split(',');
      pairs.forEach(pair => {
        const [attr, key] = pair.split(':').map(s => s.trim());
        const value = getNested(dict, key);
        if (value != null) el.setAttribute(attr, value);
      });
    });
    document.documentElement.lang = currentLang;
  }

  async function setLang(lang) {
    if (!SUPPORTED.includes(lang)) lang = DEFAULT_LANG;
    currentLang = lang;
    await loadDict(lang);
    applyTranslations();
    setStored(lang);
    const label = document.getElementById('lang-current');
    if (label) label.textContent = lang.toUpperCase();
    document.dispatchEvent(new CustomEvent('i18n:changed', { detail: { lang } }));
  }

  window.initI18n = async function () {
    const initial = getPreferred();
    await setLang(initial);
    const btn = document.getElementById('lang-toggle');
    if (btn) {
      btn.addEventListener('click', () => {
        const next = currentLang === 'es' ? 'en' : 'es';
        setLang(next);
      });
    }
  };

  window.t = function (key) {
    const value = getNested(dict, key);
    return value != null ? value : key;
  };
})();
