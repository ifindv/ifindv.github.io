/* ============================================================
   Termini landing page — 中英切换
   页面里每个双语元素都带 data-lang-zh / data-lang-en，
   可见性由 CSS 按 <html data-lang> 决定，JS 只负责切换 + 记忆。
   ============================================================ */

(function () {
  'use strict';

  var KEY = 'termini-lang';
  var root = document.documentElement;

  function current() {
    return root.getAttribute('data-lang') === 'en' ? 'en' : 'zh';
  }

  function set(lang) {
    root.setAttribute('data-lang', lang === 'en' ? 'en' : 'zh');
    try {
      localStorage.setItem(KEY, lang);
    } catch (e) {
      /* 隐私模式下写不了，忽略 */
    }
    var buttons = document.querySelectorAll('[data-lang-set]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].classList.toggle('is-active', buttons[i].getAttribute('data-lang-set') === lang);
    }
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('[data-lang-set]') : null;
    if (!btn) return;
    e.preventDefault();
    set(btn.getAttribute('data-lang-set'));
  });

  set(current());
})();
