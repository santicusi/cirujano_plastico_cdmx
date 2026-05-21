/* =====================================================================
   BEFORE / AFTER SLIDER · Dr. Francisco López Torres
   Slider arrastrable con divisor en cobre
   ===================================================================== */

(function () {
  'use strict';

  function setupSlider(slider) {
    if (slider.dataset.initialized) return;
    slider.dataset.initialized = 'true';

    const before = slider.querySelector('.ba-before');
    const divider = slider.querySelector('.ba-divider');
    const handle = slider.querySelector('.ba-handle');
    if (!before || !divider) return;

    let isDragging = false;

    function setPosition(pct) {
      pct = Math.max(0, Math.min(100, pct));
      before.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      divider.style.left = pct + '%';
      if (handle) handle.style.left = pct + '%';
    }

    function getPctFromEvent(e) {
      const rect = slider.getBoundingClientRect();
      const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      return (x / rect.width) * 100;
    }

    function onStart(e) {
      isDragging = true;
      slider.classList.add('dragging');
      setPosition(getPctFromEvent(e));
      e.preventDefault();
    }
    function onMove(e) {
      if (!isDragging) return;
      setPosition(getPctFromEvent(e));
    }
    function onEnd() {
      isDragging = false;
      slider.classList.remove('dragging');
    }

    slider.addEventListener('mousedown', onStart);
    slider.addEventListener('touchstart', onStart, { passive: false });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchend', onEnd);

    // Animación inicial al hacer scroll cerca
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          let pct = 80;
          const animate = setInterval(() => {
            pct -= 1.5;
            if (pct <= 50) {
              setPosition(50);
              clearInterval(animate);
            } else {
              setPosition(pct);
            }
          }, 18);
          observer.unobserve(slider);
        }
      });
    }, { threshold: 0.4 });
    observer.observe(slider);

    setPosition(80);
  }

  window.initBeforeAfter = function () {
    document.querySelectorAll('.ba-slider').forEach(setupSlider);
  };
})();
