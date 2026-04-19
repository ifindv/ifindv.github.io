/**
 * 冰岛背景轮播
 * 每天自动切换一张冰岛图片（5张循环）
 * 按年内第几天算index，无需构建，每天刷新即换图
 */
(function () {
  const images = [
    '/media/iceland/iceland-01-aurora.png',
    '/media/iceland/iceland-02-waterfall.png',
    '/media/iceland/iceland-03-volcano.png',
    '/media/iceland/iceland-04-lagoon.png',
    '/media/iceland/iceland-05-blackbeach.png',
  ];

  function getDayOfYear() {
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = now - start;
    var oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }

  var dayIndex = (getDayOfYear() - 1) % images.length;
  var selectedImage = images[dayIndex];

  var bgImg = document.getElementById('background-image');
  if (bgImg) {
    bgImg.src = selectedImage;
    bgImg.onload = function () {
      bgImg.style.opacity = '1';
    };
  }

  // Also update blur version if exists
  var blurDiv = document.getElementById('background-blur');
  if (blurDiv && window.blurBgInit) {
    // will be handled by blur script
  }
})();
