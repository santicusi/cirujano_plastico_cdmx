/* =====================================================================
   ANIMATIONS · Dr. Francisco López Torres
   Scroll reveals con IntersectionObserver + FAQ acordeón
   ===================================================================== */

(function () {
  'use strict';

  window.initAnimations = function () {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    elements.forEach(el => observer.observe(el));
  };

  window.initFaq = function () {
    document.querySelectorAll('.faq-item').forEach(item => {
      const q = item.querySelector('.faq-question');
      if (!q) return;
      q.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Cerrar otros (opcional: descomenta para accordion exclusivo)
        // document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
        if (isOpen) item.classList.remove('open');
        else item.classList.add('open');
      });
    });
  };

  // Marquee duplicator: clona contenido para loop continuo
  document.addEventListener('components:loaded', () => {
    document.querySelectorAll('.marquee-track').forEach(track => {
      if (track.dataset.duplicated) return;
      const clone = track.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.parentNode.appendChild(clone);
      track.dataset.duplicated = 'true';
    });
  });
})();
