/* Ортопедія VIP — поведінка інтерфейсу: шапка, mega-menu, мобільне меню, поява блоків */
(function () {
  'use strict';

  // ---------- Тінь шапки під час прокрутки ----------
  var header = document.querySelector('[data-header]');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---------- Mega-menu «Послуги» ----------
  var mega = document.querySelector('[data-mega]');
  if (mega) {
    var toggle = mega.querySelector('[data-mega-toggle]');
    var panel = mega.querySelector('[data-mega-panel]');
    var closeTimer = null;
    var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    var setOpen = function (open) {
      clearTimeout(closeTimer);
      panel.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
    };

    toggle.addEventListener('click', function () {
      setOpen(panel.hidden);
    });

    if (canHover) {
      mega.addEventListener('mouseenter', function () { setOpen(true); });
      mega.addEventListener('mouseleave', function () {
        closeTimer = setTimeout(function () { setOpen(false); }, 160);
      });
    }

    mega.addEventListener('focusout', function (e) {
      if (!mega.contains(e.relatedTarget)) setOpen(false);
    });
    document.addEventListener('click', function (e) {
      if (!mega.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  // ---------- Мобільне меню ----------
  var drawer = document.querySelector('[data-drawer]');
  var openBtn = document.querySelector('[data-drawer-open]');
  if (drawer && openBtn) {
    var panelEl = drawer.querySelector('.drawer__panel');
    var focusableSelector = 'a[href], button:not([disabled]), summary';

    var closeDrawer = function () {
      drawer.hidden = true;
      document.body.classList.remove('is-locked');
      openBtn.setAttribute('aria-expanded', 'false');
      openBtn.focus();
    };
    var openDrawer = function () {
      drawer.hidden = false;
      document.body.classList.add('is-locked');
      openBtn.setAttribute('aria-expanded', 'true');
      var first = panelEl.querySelector(focusableSelector);
      if (first) first.focus();
    };

    openBtn.addEventListener('click', openDrawer);
    drawer.querySelectorAll('[data-drawer-close]').forEach(function (el) {
      el.addEventListener('click', closeDrawer);
    });
    drawer.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') return closeDrawer();
      if (e.key !== 'Tab') return;
      // утримуємо фокус усередині меню
      var items = Array.prototype.filter.call(panelEl.querySelectorAll(focusableSelector), function (el) {
        return el.offsetParent !== null;
      });
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', function (e) {
      if (e.matches && !drawer.hidden) closeDrawer();
    });
  }

  // ---------- Плавна поява блоків ----------
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var targets = document.querySelectorAll('.section__head, .card, .steps__item, .feature, .panel, .approach li, .cta');
  if (!reduce && 'IntersectionObserver' in window && targets.length) {
    document.documentElement.classList.add('js');
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    );
    targets.forEach(function (el, i) {
      el.setAttribute('data-reveal', '');
      el.style.transitionDelay = (i % 4) * 40 + 'ms';
      io.observe(el);
    });
  }
})();
