/* ============================================================
   关于页面 —— 站内统计面板
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
  var pathEl = el('paths');
  var refEl = el('referrers');
  var rangeEl = el('ranges');

  var token = null;
  var days = 7;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function timezone() {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    } catch (e) {
      return 'UTC';
    }
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
      { label: '页面浏览', value: d.pageviews || 0 },
      { label: '访客', value: d.visitors || 0 },
      { label: '会话', value: visits },
      { label: '跳出率', value: bounce + '%' },
    ];
    kpiEl.innerHTML = items
      .map(function (i) {
        return (
          '<div class="ab-kpi"><span class="ab-kpi-num">' +
          i.value +
          '</span><span class="ab-kpi-label">' +
          esc(i.label) +
          '</span></div>'
        );
      })
      .join('');
  }

  function dayLabel(x) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(x || '');
    if (!m) return '';
    return m[2].replace(/^0/, '') + '-' + m[3].replace(/^0/, '');
  }

  /* 把 YYYY-MM-DD 转成天数序号，用来按真实日历位置排柱子 */
  function dayIndex(key) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(key || '');
    if (!m) return null;
    return Date.UTC(+m[1], +m[2] - 1, +m[3]) / 86400000;
  }

  /* 本地时区的日期键，跟接口按 timezone 分桶的口径保持一致 */
  function localKey(d) {
    var pad = function (n) {
      return (n < 10 ? '0' : '') + n;
    };
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  function renderChart(d, r) {
    var series = (d && d.pageviews) || [];
    if (!series.length) {
      chartEl.innerHTML = '<p class="ab-chart-empty">这段时间还没有访问记录</p>';
      return;
    }

    var W = 720;
    var H = 120;
    var PAD = 6;
    var max = 0;
    series.forEach(function (p) {
      if (p.y > max) max = p.y;
    });
    max = max || 1;

    /* 区间按自然日铺开，接口只返回有数据的天，缺的天留空 */
    var startIdx = dayIndex(localKey(new Date(r.start)));
    var endIdx = dayIndex(localKey(new Date(r.end)));
    var total = Math.max(endIdx - startIdx + 1, series.length);
    var slot = W / total;
    var bw = Math.min(Math.max(slot * 0.6, 1.5), 40);
    var bars = '';

    series.forEach(function (p) {
      var idx = dayIndex(p.x);
      if (idx === null) return;
      idx = Math.min(Math.max(idx - startIdx, 0), total - 1);
      var h = p.y > 0 ? Math.max((p.y / max) * (H - PAD * 2), 3) : 1.5;
      var x = idx * slot + (slot - bw) / 2;
      var y = H - PAD - h;
      bars +=
        '<rect class="ab-chart-bar" x="' +
        x.toFixed(1) +
        '" y="' +
        y.toFixed(1) +
        '" width="' +
        bw.toFixed(1) +
        '" height="' +
        h.toFixed(1) +
        '" rx="2"><title>' +
        esc(dayLabel(p.x)) +
        '：' +
        p.y +
        ' 次浏览</title></rect>';
    });

    chartEl.innerHTML =
      '<svg class="ab-chart-svg" viewBox="0 0 ' +
      W +
      ' ' +
      H +
      '" role="img" aria-label="每日页面浏览量">' +
      '<line class="ab-chart-base" x1="0" y1="' +
      (H - PAD) +
      '" x2="' +
      W +
      '" y2="' +
      (H - PAD) +
      '" />' +
      bars +
      '</svg>' +
      '<div class="ab-chart-axis"><span>' +
      esc(dayLabel(localKey(new Date(r.start)))) +
      '</span><span>' +
      esc(dayLabel(localKey(new Date(r.end)))) +
      '</span></div>';
  }

  function renderList(target, rows, emptyText) {
    if (!rows || !rows.length) {
      target.innerHTML = '<li class="ab-statbox-empty">' + esc(emptyText) + '</li>';
      return;
    }
    var max = rows[0].y || 1;
    target.innerHTML = rows
      .map(function (r) {
        var name = r.x || '';
        if (!name || name === '(direct)') name = '直接访问';
        var pct = Math.round((r.y / max) * 100);
        return (
          '<li class="ab-statbox-row">' +
          '<span class="ab-statbox-name" title="' +
          esc(name) +
          '">' +
          esc(name) +
          '</span>' +
          '<span class="ab-statbox-track"><i style="width:' +
          pct +
          '%"></i></span>' +
          '<span class="ab-statbox-num">' +
          r.y +
          '</span>' +
          '</li>'
        );
      })
      .join('');
  }

  /* ---------- 加载 ---------- */

  function load() {
    stateEl.textContent = '正在加载统计数据…';
    stateEl.classList.remove('is-error');

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
        stateEl.textContent =
          '更新于 ' +
          new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
      })
      .catch(function (e) {
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
