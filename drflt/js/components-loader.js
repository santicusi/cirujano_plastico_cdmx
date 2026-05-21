/* =====================================================================
   COMPONENTS LOADER · Dr. Francisco López Torres
   Carga navbar, footer y WhatsApp float vía fetch.
   IMPORTANTE: requiere servidor HTTP local (Live Server, etc.) por CORS.
   ===================================================================== */

(function () {
  'use strict';

  // ---- WhatsApp number config (cambiar aquí cuando el doctor lo proporcione) ----
  const WA_NUMBER = '525610071046'; // PLACEHOLDER · Reemplazar por número real
  const WA_MESSAGES = {
    default:   'Hola Dr. Francisco, me gustaría agendar una consulta',
    consulta:  'Hola Dr. Francisco, me gustaría agendar una consulta de valoración',
    cirugia:   'Hola Dr. Francisco, me interesa información sobre cirugía estética',
    clinica:   'Hola Dr. Francisco, me interesa información sobre cirugía plástica reconstructiva',
    blefaro:   'Hola Dr. Francisco, me interesa información sobre blefaroplastia',
    facelift:  'Hola Dr. Francisco, me interesa información sobre estiramiento facial (facelift)',
    lipo:      'Hola Dr. Francisco, me interesa información sobre liposucción',
    rino:      'Hola Dr. Francisco, me interesa información sobre rinoplastia',
    abdomen:   'Hola Dr. Francisco, me interesa información sobre abdominoplastia',
    mamas:     'Hola Dr. Francisco, me interesa información sobre aumento de mamas',
    mastopexia:'Hola Dr. Francisco, me interesa información sobre mastopexia',
    float:     'Hola Dr. Francisco, me gustaría hacer una consulta'
  };

  window.WA_CONFIG = { WA_NUMBER, WA_MESSAGES };

  // Build WhatsApp URL for given key
  function buildWaUrl(key) {
    const msg = WA_MESSAGES[key] || WA_MESSAGES.default;
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  }
  window.buildWaUrl = buildWaUrl;

  // Update all data-wa attributes after components load
  function refreshWaLinks() {
    document.querySelectorAll('[data-wa]').forEach(el => {
      const key = el.getAttribute('data-wa');
      el.href = buildWaUrl(key);
      el.target = el.target || '_blank';
      el.rel = el.rel || 'noopener';
    });
  }

  // Load component into a slot
  async function loadInto(selector, file) {
    const slot = document.querySelector(selector);
    if (!slot) return;
    try {
      const res = await fetch(file);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      slot.innerHTML = await res.text();
    } catch (err) {
      console.warn(`[components-loader] Falló la carga de ${file}.`,
                   'Asegúrate de servir el sitio por HTTP (Live Server, etc.). Error:', err);
    }
  }

  async function loadComponents() {
    await Promise.allSettled([
      loadInto('#navbar-slot', 'components/navbar.html'),
      loadInto('#footer-slot', 'components/footer.html'),
      loadInto('#wa-slot',     'components/wa-float.html')
    ]);

    // Pequeño delay para asegurar DOM listo antes de adjuntar listeners
    setTimeout(() => {
      refreshWaLinks();
      initNavbarBehavior();
      if (window.initTheme) window.initTheme();
      if (window.initI18n)  window.initI18n();
      if (window.initAnimations) window.initAnimations();
      if (window.initBeforeAfter) window.initBeforeAfter();
      if (window.initFaq) window.initFaq();
      document.dispatchEvent(new CustomEvent('components:loaded'));
    }, 50);
  }

  function initNavbarBehavior() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    const onScroll = () => {
      if (window.scrollY > 40) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const burger = document.getElementById('navbar-burger');
    if (burger) {
      burger.addEventListener('click', () => {
        nav.classList.toggle('menu-open');
        burger.classList.toggle('active');
      });
    }

    // Cerrar menú móvil al hacer click en un link
    document.querySelectorAll('.navbar-menu a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('menu-open');
        if (burger) burger.classList.remove('active');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadComponents);
  } else {
    loadComponents();
  }
})();
