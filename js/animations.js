/*!
 * Scroll Reveal Animations — Intersection Observer API
 * Partagé entre index.html (FR) et en/index.html (EN)
 * Aucune dépendance externe.
 */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Reveal Observer ──────────────────────────────────────────────────────────
  function initReveal() {
    var els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    if (prefersReduced) {
      els.forEach(function (el) { el.classList.add('revealed'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    els.forEach(function (el) { observer.observe(el); });
  }

  // ── Counter Animation ────────────────────────────────────────────────────────
  function animateCounter(el) {
    var target   = parseFloat(el.dataset.counter);
    var decimals = parseInt(el.dataset.decimals || '0', 10);
    var suffix   = el.dataset.suffix || '';
    var duration = 1500;
    var startTime = null;

    function tick(now) {
      if (!startTime) startTime = now;
      var elapsed  = now - startTime;
      var progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      var eased    = 1 - Math.pow(1 - progress, 3);
      var value    = target * eased;
      el.textContent = (decimals > 0 ? value.toFixed(decimals) : Math.round(value)) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  function initCounters() {
    var counterEls = document.querySelectorAll('[data-counter]');

    if (prefersReduced) {
      // Affiche immédiatement la valeur finale
      counterEls.forEach(function (el) {
        var target   = parseFloat(el.dataset.counter);
        var decimals = parseInt(el.dataset.decimals || '0', 10);
        var suffix   = el.dataset.suffix || '';
        el.textContent = (decimals > 0 ? target.toFixed(decimals) : target) + suffix;
      });
      return;
    }

    // Valeur initiale à 0
    counterEls.forEach(function (el) {
      var decimals = parseInt(el.dataset.decimals || '0', 10);
      var suffix   = el.dataset.suffix || '';
      el.textContent = (decimals > 0 ? (0).toFixed(decimals) : '0') + suffix;
    });

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    counterEls.forEach(function (el) { observer.observe(el); });
  }

  // ── Init ─────────────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initReveal();
      initCounters();
    });
  } else {
    initReveal();
    initCounters();
  }

}());
