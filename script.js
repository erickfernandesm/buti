/* =========================================================
   BUTI BARBER — interações
   ========================================================= */
(function () {
  'use strict';

  /* ---------- ano no rodapé ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- nav com fundo ao rolar ---------- */
  var nav = document.getElementById('nav');
  var onScroll = function () {
    nav.classList.toggle('is-stuck', window.scrollY > 24);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- menu mobile ---------- */
  var burger = document.getElementById('burger');
  var links = document.getElementById('navLinks');
  burger.addEventListener('click', function () {
    var open = links.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      links.classList.remove('is-open');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- carrossel contínuo (hall da fama) ---------- */
  (function initCarousel() {
    var track = document.getElementById('craquesTrack');
    if (!track) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var originals = Array.prototype.slice.call(track.children);
    if (!originals.length) return;

    /* duplica os cards uma vez para o loop fechar sem emenda */
    originals.forEach(function (el) {
      var clone = el.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelectorAll('a, button').forEach(function (n) { n.setAttribute('tabindex', '-1'); });
      track.appendChild(clone);
    });

    /* velocidade constante (px/s) independente da quantidade de cards */
    var SPEED = 42;
    var setSpeed = function () {
      var half = track.scrollWidth / 2;
      if (!half) return;
      track.style.setProperty('--roll', (half / SPEED).toFixed(1) + 's');
    };

    setSpeed();
    window.addEventListener('load', setSpeed);
    window.addEventListener('resize', setSpeed);
  })();

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- contadores animados ---------- */
  var counters = document.querySelectorAll('[data-count]');
  var animate = function (el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1600;
    var start = null;

    var step = function (ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.round(target * eased);
      el.textContent = val.toLocaleString('pt-BR') + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window) {
    var ioc = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate(entry.target);
          ioc.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { ioc.observe(el); });
  } else {
    counters.forEach(animate);
  }

  /* ---------- esconde placeholders cuja imagem existir ---------- */
  document.querySelectorAll('.gal img, .player img').forEach(function (img) {
    img.addEventListener('error', function () {
      var box = img.closest('.gal, .player');
      if (box) box.style.display = 'none';
    });
  });

})();
