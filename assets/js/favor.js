/* ===========================================
 * Favor 页面 - 客户端逻辑
 * 数据源: <template id="favor-source"> 里的 <article data-favor> 节点
 * 优势: 数据从 markdown frontmatter 生成,新增收藏 = 新建 .md,无需碰代码
 * =========================================== */

(function () {
  'use strict';

  // ============ 读取数据 ============
  const sourceTpl = document.getElementById('favor-source');
  if (!sourceTpl) return;

  // clone template 内容(包含所有 article)到内存
  const sourceFragment = sourceTpl.content.cloneNode(true);
  const sourceArticles = Array.from(sourceFragment.querySelectorAll('article[data-favor]'));

  if (sourceArticles.length === 0) {
    console.warn('favor.js: 没找到任何 <article data-favor>');
    return;
  }

  // ============ 提取每条数据 ============
  const get = (el, key) => el.dataset[key] || '';

  const DATA = sourceArticles.map(el => ({
    id: get(el, 'id'),
    type: get(el, 'type'),
    title: get(el, 'title'),
    subtitle: get(el, 'subtitle'),
    rating: parseFloat(get(el, 'rating')) || 0,
    date: get(el, 'date'),
    summary: get(el, 'summary'),
    cover: get(el, 'cover'),
    source: get(el, 'source'),
    director: get(el, 'director'),
    author: get(el, 'author'),
    publisher: get(el, 'publisher'),
    genre: get(el, 'genre'),
    location: get(el, 'location'),
    permalink: get(el, 'permalink'),
    body: (el.querySelector('.favor-source-body') || el).innerHTML.trim(),
  }));

  // ============ 类型映射 ============
  const TYPE_LABEL = {
    movie: { tag: '电影', pretty: '🎬 电影', class: 'favor-type-movie' },
    book:  { tag: '阅读', pretty: '📖 阅读', class: 'favor-type-book' },
    trip:  { tag: '旅行', pretty: '✈️ 旅行', class: 'favor-type-trip' },
  };

  // ============ DOM 引用 ============
  const grid = document.getElementById('favor-grid');
  const empty = document.getElementById('favor-empty');
  const totalCountEl = document.getElementById('favor-total-count');

  const modal = document.getElementById('favor-modal');
  if (!modal) return;
  const modalCover = document.getElementById('favor-modal-cover');
  const modalType = document.getElementById('favor-modal-type');
  const modalTitle = document.getElementById('favor-modal-title');
  const modalSubtitle = document.getElementById('favor-modal-subtitle');
  const modalMeta = document.getElementById('favor-modal-meta-list');
  const modalBody = document.getElementById('favor-modal-body');
  const modalPos = document.getElementById('favor-modal-position');
  const modalPrev = document.getElementById('favor-modal-prev');
  const modalNext = document.getElementById('favor-modal-next');
  const modalClose = document.getElementById('favor-modal-close');

  // ============ 状态 ============
  let currentFilter = 'all';
  let currentSort = 'added-desc';
  let currentVisible = DATA.slice();

  // ============ 卡片渲染 ============
  function renderCards() {
    let items = DATA.slice();
    if (currentFilter !== 'all') items = items.filter(x => x.type === currentFilter);

    if (currentSort === 'added-desc') items.sort((a, b) => b.date.localeCompare(a.date));
    else if (currentSort === 'added-asc') items.sort((a, b) => a.date.localeCompare(b.date));
    else if (currentSort === 'rating-desc') items.sort((a, b) => b.rating - a.rating);
    else if (currentSort === 'title-asc') items.sort((a, b) => a.title.localeCompare(b.title));

    if (items.length === 0) {
      grid.innerHTML = '';
      empty.hidden = false;
      return;
    }
    empty.hidden = true;

    grid.innerHTML = items.map(item => {
      const meta = TYPE_LABEL[item.type] || TYPE_LABEL.movie;
      return `
        <article class="favor-card" data-id="${escapeAttr(item.id)}">
          <div class="favor-card-cover">
            ${item.cover ? `<img src="${escapeAttr(item.cover)}" alt="${escapeHtml(item.title)}" loading="lazy" onerror="this.style.display='none'" />` : ''}
            <span class="favor-type-tag ${meta.class}">${meta.tag}</span>
            <span class="favor-card-rating">★ ${item.rating}</span>
          </div>
          <div class="favor-card-body">
            <h3 class="favor-card-title">${escapeHtml(item.title)}</h3>
            <p class="favor-card-subtitle">${escapeHtml(item.subtitle)}</p>
            <p class="favor-card-note">${escapeHtml(item.summary)}</p>
            <div class="favor-card-meta">
              <span>${escapeHtml(item.date)}</span>
              <span>${escapeHtml(item.source)}</span>
            </div>
          </div>
        </article>
      `;
    }).join('');

    grid.querySelectorAll('.favor-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        const item = DATA.find(x => x.id === id);
        if (item) openModal(item);
      });
    });

    currentVisible = items;
  }

  function updateCounts() {
    const counts = { all: DATA.length, movie: 0, book: 0, trip: 0 };
    DATA.forEach(x => { if (counts[x.type] !== undefined) counts[x.type]++; });
    document.querySelectorAll('[data-filter-count]').forEach(el => {
      el.textContent = counts[el.dataset.filterCount] || 0;
    });
    if (totalCountEl) totalCountEl.textContent = DATA.length;
  }

  // ============ Modal ============
  let currentVisibleIndex = -1;

  function openModal(item) {
    const idx = currentVisible.findIndex(x => x.id === item.id);
    if (idx === -1) return;
    currentVisibleIndex = idx;

    if (item.cover) {
      modalCover.src = item.cover;
      modalCover.style.display = '';
      modalCover.onerror = () => { modalCover.style.display = 'none'; };
    } else {
      modalCover.style.display = 'none';
    }

    const meta = TYPE_LABEL[item.type] || TYPE_LABEL.movie;
    modalType.textContent = meta.pretty;
    modalType.className = 'favor-type-tag ' + meta.class;

    modalTitle.textContent = item.title;
    modalSubtitle.textContent = item.subtitle || '';

    const fields = [
      ['评分', '★ ' + item.rating],
      ['日期', item.date],
      ['来源', item.source],
    ];
    if (item.director) fields.push(['导演', item.director]);
    if (item.author) fields.push(['作者', item.author]);
    if (item.publisher) fields.push(['出版社', item.publisher]);
    if (item.genre) fields.push(['类型', item.genre]);
    if (item.location) fields.push(['地点', item.location]);

    modalMeta.innerHTML = fields
      .filter(([, v]) => v)
      .map(([k, v]) => `<div><dt>${escapeHtml(k)}</dt><dd>${escapeHtml(String(v))}</dd></div>`)
      .join('');

    // 正文:每条收藏的 markdown 已经渲染成 HTML 在 source article 里
    // 直接复用,无需重新解析
    modalBody.innerHTML = item.body || `<p>${escapeHtml(item.summary)}</p>`;

    modalPos.textContent = `${idx + 1} / ${currentVisible.length}`;
    modalPrev.disabled = idx === 0;
    modalNext.disabled = idx === currentVisible.length - 1;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function navModal(direction) {
    const newIdx = currentVisibleIndex + direction;
    if (newIdx < 0 || newIdx >= currentVisible.length) return;
    openModal(currentVisible[newIdx]);
  }

  // ============ 事件绑定 ============
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  modalPrev.addEventListener('click', () => navModal(-1));
  modalNext.addEventListener('click', () => navModal(1));

  document.addEventListener('keydown', e => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') closeModal();
    else if (e.key === 'ArrowLeft') navModal(-1);
    else if (e.key === 'ArrowRight') navModal(1);
  });

  document.querySelectorAll('[data-filter]').forEach(btn => {
    if (btn.dataset.filterCount !== undefined) return;
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderCards();
    });
  });

  const sortSelect = document.getElementById('favor-sort');
  if (sortSelect) {
    sortSelect.addEventListener('change', e => {
      currentSort = e.target.value;
      renderCards();
    });
  }

  // ============ 调试钩子:?open=<id> 自动打开弹窗(用于截图测试) ============
  const debugOpen = new URLSearchParams(location.search).get('open');
  if (debugOpen) {
    const target = DATA.find(x => x.id === debugOpen);
    if (target) setTimeout(() => openModal(target), 300);
  }

  // ============ HTML 转义工具 ============
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  function escapeAttr(s) { return escapeHtml(s); }

  // ============ 初始化 ============
  updateCounts();
  renderCards();
})();
