/* ===========================================
 * Favor 页面 - 排序 + 弹窗(每页只一种类型,无筛选)
 *
 * 数据源:
 *   1. 卡片本身:#favor-grid .favor-card-wrapper(服务端已渲染主题卡 + data-*)
 *   2. 弹窗正文:<template id="favor-source"> (id → .Content HTML 映射)
 * =========================================== */

(function () {
  'use strict';

  // ==================== 收集已渲染的卡片 ====================
  const wrappers = Array.from(document.querySelectorAll('#favor-grid .favor-card-wrapper'));
  if (wrappers.length === 0) {
    console.warn('favor.js: 没有找到 .favor-card-wrapper');
    return;
  }

  // ==================== 弹窗正文数据源 ====================
  const bodyMap = {};
  const sourceTpl = document.getElementById('favor-source');
  if (sourceTpl) {
    sourceTpl.content.querySelectorAll('article[data-id]').forEach(function (el) {
      bodyMap[el.dataset.id] = el.innerHTML.trim();
    });
  }

  // ==================== DOM 引用 ====================
  const grid = document.getElementById('favor-grid');
  const modal = document.getElementById('favor-modal');
  if (!modal) return;

  const modalCover    = document.getElementById('favor-modal-cover');
  const modalType     = document.getElementById('favor-modal-type');
  const modalTitle    = document.getElementById('favor-modal-title');
  const modalSubtitle = document.getElementById('favor-modal-subtitle');
  const modalMeta     = document.getElementById('favor-modal-meta-list');
  const modalBody     = document.getElementById('favor-modal-body');
  const modalClose    = document.getElementById('favor-modal-close');

  // ==================== 状态 ====================
  let currentSort = 'added-desc';

  // ==================== HTML 转义 ====================
  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ==================== 排序 ====================
  function applySort() {
    const sorted = wrappers.slice();
    sorted.sort(function (a, b) {
      if (currentSort === 'added-desc')  return b.dataset.date.localeCompare(a.dataset.date);
      if (currentSort === 'added-asc')   return a.dataset.date.localeCompare(b.dataset.date);
      if (currentSort === 'rating-desc') return parseFloat(b.dataset.rating || 0) - parseFloat(a.dataset.rating || 0);
      if (currentSort === 'title-asc')   return (a.dataset.title || '').localeCompare(b.dataset.title || '');
      return 0;
    });
    const frag = document.createDocumentFragment();
    sorted.forEach(function (el) { frag.appendChild(el); });
    grid.appendChild(frag);
  }

  // ==================== Modal ====================
  function openById(id) {
    const wrapper = wrappers.find(function (el) { return el.dataset.id === id; });
    if (!wrapper) return;

    // 封面(从主题卡 img 取)
    const img = wrapper.querySelector('img');
    if (img && img.src) {
      modalCover.src = img.src;
      modalCover.style.display = '';
      modalCover.onerror = function () { modalCover.style.display = 'none'; };
    } else {
      modalCover.style.display = 'none';
    }

    // 类型标签(从 wrapper.dataset.type 取,favor-list.html 未注入,可读 dataset fallback)
    const typeLabel = (function () {
      // 尝试从主题卡的角标/类型推断,简化:用页面主类型
      const url = location.pathname;
      if (url.indexOf('/movies') >= 0) return '电影';
      if (url.indexOf('/books')  >= 0) return '阅读';
      if (url.indexOf('/trips')  >= 0) return '旅行';
      return '';
    })();
    modalType.textContent = typeLabel;

    // 标题/副标题
    const h2 = wrapper.querySelector('h2');
    modalTitle.textContent = h2 ? h2.textContent.trim() : (wrapper.dataset.title || '');
    modalSubtitle.textContent = '';

    // 元信息(评分 + 日期)
    modalMeta.innerHTML = [
      ['评分', '★ ' + (wrapper.dataset.rating || '')],
      ['日期', wrapper.dataset.date || ''],
    ].map(function (kv) {
      return '<div><dt>' + escapeHtml(kv[0]) + '</dt><dd>' + escapeHtml(kv[1]) + '</dd></div>';
    }).join('');

    // 正文
    modalBody.innerHTML = bodyMap[id] || '';

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ==================== 事件绑定 ====================
  // capture-phase 拦截卡片点击,阻止主题内置 <a> 跳转
  grid.addEventListener('click', function (e) {
    const wrapper = e.target.closest('.favor-card-wrapper');
    if (!wrapper) return;
    e.preventDefault();
    e.stopPropagation();
    openById(wrapper.dataset.id);
  }, true);

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') closeModal();
  });

  const sortSelect = document.getElementById('favor-sort');
  if (sortSelect) {
    sortSelect.addEventListener('change', function (e) {
      currentSort = e.target.value;
      applySort();
    });
  }

  // ?open=<id> 调试钩子
  const debugOpen = new URLSearchParams(location.search).get('open');
  if (debugOpen) {
    const target = wrappers.find(function (el) { return el.dataset.id === debugOpen; });
    if (target) setTimeout(function () { openById(target.dataset.id); }, 300);
  }

  // ==================== 初始化 ====================
  applySort();
})();
