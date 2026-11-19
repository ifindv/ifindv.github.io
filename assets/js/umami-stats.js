/* ============================================================
   关于页面 —— 访客统计面板
   数据来自 Umami 的公开分享接口（只读 token），不涉及任何账号凭据。
   ============================================================ */

(function () {
  'use strict';

  var box = document.getElementById('umami-stats');
  if (!box) return;

  var api = box.getAttribute('data-api');
  var slug = box.getAttribute('data-slug');
  var websiteId = box.getAttribute('data-website-id');

  var el = function (role) {
    return box.querySelector('[data-role="' + role + '"]');
  };

  var stateEl = el('state');
  var kpiEl = el('kpis');
  var chartEl = el('chart');
  var peakEl = el('peak');
  var pathEl = el('paths');
  var refEl = el('referrers');
  var rangeEl = el('ranges');
  var tableEl = el('table');
  var tipEl = el('tip');

  var token = null;
  var days = 7;
  var hasData = false;

  /* ---------- 小工具 ---------- */

  function pad(n) {
    return (n < 10 ? '0' : '') + n;
  }

  /* 千分位；过万折成「万」，符合中文读法 */
  function num(n) {
    n = Number(n) || 0;
    if (n >= 10000) {
      var w = n / 10000;
      return (w >= 100 ? Math.round(w) : Math.round(w * 10) / 10) + '万';
    }
    return n.toLocaleString('zh-CN');
  }

  function timezone() {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    } catch (e) {
      return 'UTC';
    }
  }

  /* 把 YYYY-MM-DD 转成天数序号，用来按真实日历位置排柱子 */
  function dayIndex(key) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(key || '');
    if (!m) return null;
    return Date.UTC(+m[1], +m[2] - 1, +m[3]) / 86400000;
  }

  /* 天数序号 → MM-DD */
  function dayLabel(index) {
    var d = new Date(index * 86400000);
    return pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate());
  }

  /* 天数序号 → YYYY-MM-DD */
  function dayFull(index) {
    var d = new Date(index * 86400000);
    return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate());
  }

  /* 本地时区的日期键，跟接口按 timezone 分桶的口径保持一致 */
  function localKey(d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  function make(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  /* 换分享 token：只读，公开可取 */
  function getToken() {
    if (token) return Promise.resolve(token);
    return fetch(api + '/share/' + encodeURIComponent(slug), { credentials: 'omit' })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (d) {
        if (!d || !d.token) throw new Error('没有拿到分享 token');
        token = d.token;
        return token;
      });
  }

  /* 统计区间按自然日对齐：N 天 = 今天的本地零点往前推 N-1 天。
     滚动 7×24h 的窗口会跨到 8 个自然日，图表就会多出一个空槽。 */
  function range() {
    var startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    return {
      start: startOfDay.getTime() - (days - 1) * 86400000,
      end: Date.now(),
    };
  }

  /* 查统计数据 */
  function query(endpoint, params, r) {
    var qs = 'startAt=' + r.start + '&endAt=' + r.end;
    var k;
    for (k in params) {
      if (Object.prototype.hasOwnProperty.call(params, k)) {
        qs += '&' + encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
      }
    }
    return getToken().then(function (t) {
      return fetch(
        api + '/websites/' + encodeURIComponent(websiteId) + endpoint + '?' + qs,
        {
          credentials: 'omit',
          headers: {
            'x-umami-share-token': t,
            'x-umami-share-context': '1',
          },
        }
      ).then(function (r2) {
        if (!r2.ok) throw new Error('HTTP ' + r2.status);
        return r2.json();
      });
    });
  }

  /* ---------- 渲染 ---------- */

  function renderKpis(d) {
    var visits = d.visits || 0;
    var bounce = visits > 0 ? Math.round(((d.bounces || 0) / visits) * 100) : 0;
    var items = [
      { label: '页面浏览', value: num(d.pageviews || 0) },
      { label: '访客', value: num(d.visitors || 0) },
      { label: '会话', value: num(visits) },
      { label: '跳出率', value: bounce + '%' },
    ];

    kpiEl.textContent = '';
    items.forEach(function (i) {
      var cell = make('div', 'ab-kpi');
      cell.appendChild(make('span', 'ab-kpi-label', i.label));
      cell.appendChild(make('span', 'ab-kpi-num', i.value));
      kpiEl.appendChild(cell);
    });
  }

  /* 柱状图：单序列，柱宽封顶 24px，柱间留 2px 底色缝，
     数据端 4px 圆角、基线端切平。 */
  function renderChart(d, r) {
    var series = (d && d.pageviews) || [];

    chartEl.textContent = '';
    peakEl.textContent = '';

    if (!series.length) {
      chartEl.appendChild(make('p', 'ab-chart-empty', '这段时间还没有访问记录'));
      renderTable([]);
      return;
    }

    var byIdx = {};
    series.forEach(function (p) {
      var idx = dayIndex(p.x);
      if (idx === null) return;
      byIdx[idx] = p.y || 0;
    });

    /* 区间按自然日铺开，接口只返回有数据的天，缺的天留空 */
    var startIdx = dayIndex(localKey(new Date(r.start)));
    var endIdx = dayIndex(localKey(new Date(r.end)));
    var total = Math.max(endIdx - startIdx + 1, 1);

    var rows = [];
    var max = 0;
    for (var i = 0; i < total; i++) {
      var idx = startIdx + i;
      var y = byIdx[idx] || 0;
      if (y > max) max = y;
      rows.push({ idx: idx, y: y });
    }

    var plot = make('div', 'ab-chart-plot');
    rows.forEach(function (row) {
      var col = make('div', 'ab-chart-col');
      col.dataset.label = dayFull(row.idx);
      col.dataset.short = dayLabel(row.idx);
      col.dataset.value = String(row.y);
      if (row.y > 0) {
        col.style.setProperty('--h', Math.max((row.y / max) * 100, 2) + '%');
      } else {
        col.classList.add('is-empty');
      }
      col.appendChild(make('span', 'ab-chart-bar'));
      plot.appendChild(col);
    });

    var axis = make('div', 'ab-chart-axis');
    axis.appendChild(make('span', null, dayLabel(rows[0].idx)));
    axis.appendChild(make('span', null, dayLabel(rows[rows.length - 1].idx)));

    chartEl.appendChild(plot);
    chartEl.appendChild(axis);

    if (max > 0) peakEl.textContent = '峰值 ' + num(max) + ' 次';

    renderTable(rows);
  }

  /* 表格视图：图里能读到的每个数字，这里都能逐条查到 */
  function renderTable(rows) {
    tableEl.textContent = '';
    if (!rows.length) {
      tableEl.appendChild(make('p', 'ab-tableview-empty', '暂无数据'));
      return;
    }

    var table = make('table', 'ab-table');
    var thead = make('thead');
    var headRow = make('tr');
    ['日期', '页面浏览量'].forEach(function (text, i) {
      headRow.appendChild(make('th', i === 1 ? 'ab-table-num' : null, text));
    });
    thead.appendChild(headRow);

    var tbody = make('tbody');
    rows
      .slice()
      .reverse()
      .forEach(function (row) {
        var tr = make('tr');
        tr.appendChild(make('td', null, dayFull(row.idx)));
        tr.appendChild(make('td', 'ab-table-num', num(row.y)));
        tbody.appendChild(tr);
      });

    table.appendChild(thead);
    table.appendChild(tbody);
    tableEl.appendChild(table);
  }

  /* 榜单：横向条，同一序列用同一个色相 */
  function renderList(target, rows, emptyText) {
    target.textContent = '';

    if (!rows || !rows.length) {
      target.appendChild(make('li', 'ab-statbox-empty', emptyText));
      return;
    }

    var sorted = rows.slice().sort(function (a, b) {
      return (b.y || 0) - (a.y || 0);
    });
    var max = 0;
    sorted.forEach(function (r) {
      if ((r.y || 0) > max) max = r.y || 0;
    });
    max = max || 1;

    sorted.forEach(function (r, idx) {
      var name = r.x || '';
      if (!name || name === '(direct)') {
        name = '直接访问';
      } else if (name.charAt(0) === '/') {
        /* 站内路径去掉首尾的斜杠，短一点好读 */
        name = name.replace(/^\/+|\/+$/g, '');
      }

      var li = make('li', 'ab-statbox-row');
      li.appendChild(make('span', 'ab-statbox-rank', String(idx + 1)));

      var label = make('span', 'ab-statbox-name', name);
      label.title = name;
      li.appendChild(label);

      var track = make('span', 'ab-statbox-track');
      var fill = make('i');
      fill.style.width = Math.max(Math.round(((r.y || 0) / max) * 100), 2) + '%';
      track.appendChild(fill);
      li.appendChild(track);

      li.appendChild(make('span', 'ab-statbox-num', num(r.y || 0)));
      target.appendChild(li);
    });
  }

  /* ---------- 悬浮提示 ---------- */

  function showTip(col, x, y) {
    if (!tipEl) return;
    tipEl.textContent = '';
    tipEl.appendChild(make('strong', 'ab-tip-num', num(col.dataset.value) + ' 次浏览'));
    tipEl.appendChild(make('span', 'ab-tip-label', col.dataset.label));

    var rect = box.getBoundingClientRect();
    tipEl.style.left = x - rect.left + 'px';
    tipEl.style.top = y - rect.top + 'px';
    tipEl.hidden = false;
  }

  function hideTip() {
    if (tipEl) tipEl.hidden = true;
  }

  if (chartEl) {
    chartEl.addEventListener('pointermove', function (e) {
      var col = e.target.closest ? e.target.closest('.ab-chart-col') : null;
      if (!col) {
        hideTip();
        return;
      }
      showTip(col, e.clientX, e.clientY);
    });
    chartEl.addEventListener('pointerleave', hideTip);
  }

  /* ---------- 加载 ---------- */

  function load() {
    /* 只有重新取数时才压低上一版画面的透明度；首屏本来就该是空的 */
    if (hasData) {
      box.classList.add('is-loading');
      stateEl.textContent = '正在加载统计数据…';
      stateEl.classList.remove('is-error');
    }

    var r = range();

    Promise.all([
      query('/stats', null, r),
      query('/pageviews', { unit: 'day', timezone: timezone() }, r),
      query('/metrics', { type: 'path', limit: 6 }, r),
      query('/metrics', { type: 'referrer', limit: 6 }, r),
    ])
      .then(function (res) {
        renderKpis(res[0]);
        renderChart(res[1], r);
        renderList(pathEl, res[2], '还没有页面访问记录');
        renderList(refEl, res[3], '还没有来源记录');
        hasData = true;
        box.classList.remove('is-loading');
        stateEl.textContent =
          '更新于 ' +
          new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
      })
      .catch(function (e) {
        box.classList.remove('is-loading');
        stateEl.textContent =
          '统计数据暂时取不到：' + (e && e.message ? e.message : '未知错误');
        stateEl.classList.add('is-error');
      });
  }

  if (rangeEl) {
    var buttons = rangeEl.querySelectorAll('.ab-range-btn');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', function () {
        for (var j = 0; j < buttons.length; j++) buttons[j].classList.remove('is-active');
        this.classList.add('is-active');
        days = parseInt(this.getAttribute('data-days'), 10) || 7;
        load();
      });
    }
  }

  load();
})();
