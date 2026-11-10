/* ============================================================
   Termini 落地页 —— 语言切换 / 主题切换 / 导航吸顶描边
   语言与主题都在 <html> 上用 data-* 表达，样式表据此显隐。
   ============================================================ */

(function () {
  'use strict';

  var root = document.documentElement;

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

  /* ---------------- 导航吸顶描边 ---------------- */

  var nav = document.getElementById('tm-nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------------- 初始化 ---------------- */

  setLang(root.getAttribute('data-lang'));
  setTheme(root.getAttribute('data-theme'));
})();
