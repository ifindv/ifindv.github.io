// Giscus 评论：
// 1. 按站点当前外观（亮/暗）注入 giscus 客户端，保证首屏主题就正确
// 2. 站点外观切换时通过 postMessage 同步 giscus 主题
(function () {
  var root = document.getElementById("giscus");
  var cfgNode = document.getElementById("giscus-config");
  if (!root || !cfgNode) return;

  var cfg;
  try {
    cfg = JSON.parse(cfgNode.textContent);
  } catch (e) {
    return;
  }

  var isDark = function () {
    return document.documentElement.classList.contains("dark");
  };
  var desired = isDark() ? "dark" : "light";

  // 把当前主题推送给 giscus iframe
  var push = function () {
    var frame = document.querySelector("iframe.giscus-frame");
    if (!frame || !frame.contentWindow) return false;
    try {
      frame.contentWindow.postMessage(
        { giscus: { setConfig: { theme: desired } } },
        "https://giscus.app"
      );
      return true;
    } catch (e) {
      return false;
    }
  };

  // 动态注入，保证 data-theme 与站点当前外观一致
  var s = document.createElement("script");
  s.src = "https://giscus.app/client.js";
  s.async = true;
  s.crossOrigin = "anonymous";
  Object.keys(cfg).forEach(function (k) {
    s.setAttribute(k, cfg[k]);
  });
  s.setAttribute("data-theme", desired);
  root.appendChild(s);

  // iframe 懒加载，等它挂载后再补推一次主题
  var timer = setInterval(function () {
    if (!push()) return;
    clearInterval(timer);
    setTimeout(push, 500);
    setTimeout(push, 1500);
  }, 500);
  setTimeout(function () {
    clearInterval(timer);
  }, 30000);

  // 站点外观切换时同步 giscus 主题
  new MutationObserver(function () {
    var t = isDark() ? "dark" : "light";
    if (t === desired) return;
    desired = t;
    push();
  }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
})();
