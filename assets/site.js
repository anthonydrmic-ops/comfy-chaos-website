/* Comfy Chaos site behaviour. No dependencies. Everything on the page is visible and usable without this file. */
(function () {
  'use strict';
  var d = document;
  var root = d.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- current year ---- */
  var year = d.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---- rise: only for a block arriving from below at reading pace ----
     A block that is already high in the viewport when first seen (jump, fling, deep link) just stays visible. */
  var blocks = d.querySelectorAll('[data-rise]');
  if (blocks.length && 'IntersectionObserver' in window && !reduceMotion) {
    try {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          if (e.boundingClientRect.top > window.innerHeight * 0.6) e.target.classList.add('rise');
          io.unobserve(e.target);
        });
      }, { rootMargin: '0px 0px 10% 0px' });
      blocks.forEach(function (b) { io.observe(b); });
    } catch (_) { /* content is visible by default, nothing to undo */ }
  }

  /* ---- scroll progress + back to top ---- */
  var progress = d.getElementById('progress');
  var toTop = d.getElementById('toTop');
  var ticking = false;
  function onScroll() {
    ticking = false;
    var st = root.scrollTop || d.body.scrollTop || 0;
    var sh = (root.scrollHeight - root.clientHeight) || 1;
    if (progress) progress.style.transform = 'scaleX(' + Math.min(1, Math.max(0, st / sh)) + ')';
    if (toTop) toTop.classList.toggle('show', st > 600);
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ---- mobile menu ---- */
  var burger = d.getElementById('burger');
  var menu = d.getElementById('mobileMenu');
  var hideTimer = 0;
  function menuIsOpen() { return !!burger && burger.getAttribute('aria-expanded') === 'true'; }
  function setMenu(open, returnFocus) {
    if (!burger || !menu) return;
    window.clearTimeout(hideTimer);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
    root.classList.toggle('menu-open', open);
    if (open) {
      menu.hidden = false;
      void menu.offsetWidth; /* let the closed state paint once so the panel slides in */
      menu.classList.add('open');
    } else {
      menu.classList.remove('open');
      hideTimer = window.setTimeout(function () { menu.hidden = true; }, reduceMotion ? 0 : 240);
      if (returnFocus) burger.focus();
    }
  }
  if (burger && menu) {
    burger.addEventListener('click', function () { setMenu(!menuIsOpen(), false); });
    menu.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('a')) setMenu(false, false);
    });
    d.addEventListener('keydown', function (e) {
      if ((e.key === 'Escape' || e.key === 'Esc') && menuIsOpen()) setMenu(false, true);
    });
    d.addEventListener('click', function (e) {
      if (!menuIsOpen()) return;
      if (menu.contains(e.target) || burger.contains(e.target)) return;
      setMenu(false, false);
    });
    if (window.matchMedia) {
      var wide = window.matchMedia('(min-width: 901px)');
      var onWide = function (e) { if (e.matches && menuIsOpen()) setMenu(false, false); };
      if (wide.addEventListener) wide.addEventListener('change', onWide);
      else if (wide.addListener) wide.addListener(onWide);
    }
  }

  /* ---- active nav highlight (clears over the hero) ---- */
  var navLinks = Array.prototype.slice.call(d.querySelectorAll('.nav-links a'));
  if (navLinks.length && 'IntersectionObserver' in window) {
    var watched = navLinks
      .map(function (a) { return d.querySelector(a.getAttribute('href')); })
      .filter(Boolean);
    var top = d.getElementById('top');
    if (top) watched.push(top);
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (a) {
          var on = a.getAttribute('href') === '#' + e.target.id;
          a.classList.toggle('active', on);
          if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    watched.forEach(function (s) { spy.observe(s); });
  }

  /* ---- contact form: builds an email draft, sends nothing anywhere ---- */
  var form = d.getElementById('contactForm');
  var statusLine = d.getElementById('formStatus');
  var copyBtn = d.getElementById('copyMessage');
  var TO = 'admin@comfychaos.com.au';
  var lastDraft = '';
  if (form && statusLine) {
    form.noValidate = true; /* we show our own message; without JS the browser's own checks still run */
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements;
      var name = f.name.value.trim();
      var email = f.email.value.trim();
      var message = f.message.value.trim();
      while (statusLine.firstChild) statusLine.removeChild(statusLine.firstChild);
      [f.name, f.email, f.message].forEach(function (el) { el.removeAttribute('aria-invalid'); el.removeAttribute('aria-describedby'); });
      if (!name || !email || !message || !form.checkValidity()) {
        statusLine.textContent = 'Add your name, a valid email and a message.';
        if (copyBtn) copyBtn.hidden = true;
        var bad = !name ? f.name : (!email || !f.email.checkValidity()) ? f.email : f.message;
        /* the field itself carries the message, so a screen reader hears it when focus lands there */
        bad.setAttribute('aria-invalid', 'true');
        bad.setAttribute('aria-describedby', 'formStatus');
        if (bad.focus) bad.focus();
        return;
      }
      var subject = 'Project enquiry from ' + name;
      var body = 'Name: ' + name + '\r\nEmail: ' + email + '\r\n\r\n' + message.replace(/\r?\n/g, '\r\n');
      lastDraft = 'To: ' + TO + '\r\nSubject: ' + subject + '\r\n\r\n' + body;
      var link = d.createElement('a');
      link.id = 'draftLink';
      link.href = 'mailto:' + TO + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      link.textContent = TO;
      /* Windows browsers will not hand an email app a link over about 2,000 characters */
      var tooLong = link.href.length > 2000;
      statusLine.appendChild(d.createTextNode(tooLong
        ? 'Your message is too long to open as an email draft. Copy it with the button below and paste it into an email to '
        : 'Your email app should have opened with the details filled in. If nothing happened, email '));
      statusLine.appendChild(link);
      statusLine.appendChild(d.createTextNode('.'));
      if (copyBtn) { copyBtn.hidden = false; copyBtn.textContent = 'Copy message'; }
      if (!tooLong) link.click(); /* opens the draft in the visitor's email app */
    });
  }
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      if (!lastDraft) return;
      var done = function () {
        copyBtn.textContent = 'Copied';
        window.setTimeout(function () { copyBtn.textContent = 'Copy message'; }, 2400);
      };
      var fallback = function () {
        var ta = d.createElement('textarea');
        ta.value = lastDraft;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.top = '0';
        ta.style.left = '-9999px';
        d.body.appendChild(ta);
        ta.select();
        try { if (d.execCommand('copy')) done(); } catch (_) { /* leave the label as it is */ }
        d.body.removeChild(ta);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(lastDraft).then(done, fallback);
      } else {
        fallback();
      }
    });
  }
})();
