/* ============================================================
   Termini 落地页 —— 语言 / 主题切换 + 滚动浮现 + 阅读进度
   语言与主题都写在 <html> 的 data-* 上，样式表据此显隐。
   ============================================================ */

(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) {
      /* 隐私模式下写不了，忽略 */
    }
    return null;
  }

  /* ---------------- 语言 ---------------- */

  function setLang(lang) {
    lang = lang === 'en' ? 'en' : 'zh';
    root.setAttribute('data-lang', lang);
    store('termini-lang', lang);
    var buttons = document.querySelectorAll('[data-lang-set]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].classList.toggle('is-active', buttons[i].getAttribute('data-lang-set') === lang);
    }
  }

  /* ---------------- 主题 ---------------- */

  function setTheme(theme) {
    theme = theme === 'light' ? 'light' : 'dark';
    root.setAttribute('data-theme', theme);
    store('termini-theme', theme);
  }

  /* ---------------- 滚动浮现 ---------------- */

  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      for (var i = 0; i < items.length; i++) items[i].classList.add('is-in');
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
    );

    for (var j = 0; j < items.length; j++) observer.observe(items[j]);
  }

  /* ---------------- 导航吸顶 + 阅读进度 ---------------- */

  function initScroll() {
    var nav = document.getElementById('tm-nav');
    var bar = document.getElementById('tm-progress');
    if (!nav) return;

    var ticking = false;

    function update() {
      var y = window.scrollY || document.documentElement.scrollTop;
      nav.classList.toggle('is-stuck', y > 8);
      if (bar) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (max > 0 ? Math.min(1, y / max) * 100 : 0) + '%';
      }
      ticking = false;
    }

    window.addEventListener(
      'scroll',
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
      },
      { passive: true }
    );

    window.addEventListener('resize', update);
    update();
  }

  /* ---------------- 事件绑定 ---------------- */

  document.addEventListener('click', function (e) {
    var langBtn = e.target.closest ? e.target.closest('[data-lang-set]') : null;
    if (langBtn) {
      e.preventDefault();
      setLang(langBtn.getAttribute('data-lang-set'));
      return;
    }
    if (e.target.closest && e.target.closest('[data-theme-toggle]')) {
      e.preventDefault();
      setTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
    }
  });

  /* ---------------- 初始化 ---------------- */

  setLang(root.getAttribute('data-lang'));
  setTheme(root.getAttribute('data-theme'));
  initReveal();
  initScroll();
})();
