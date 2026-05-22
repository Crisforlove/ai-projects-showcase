// TypeMaster 主入口 - 导航、Toast、页面管理
;(function() {
  var TM = window.TypeMaster;
  var pageNames = ['home', 'lesson', 'exam', 'memory', 'teacher', 'game'];
  var currentPage = 'home';

  // Toast
  var toastEl = null;
  TM.showToast = function(msg, dur) {
    dur = dur || 2000;
    if (!toastEl) toastEl = document.getElementById('toast');
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    setTimeout(function() { toastEl.classList.remove('show'); }, dur);
  };

  // 切换页面
  TM.switchPage = function(name) {
    if (!TM.pages || !TM.pages[name]) return;
    currentPage = name;

    // 更新导航 tab
    document.querySelectorAll('.nav-tab').forEach(function(t, i) {
      t.classList.toggle('active', pageNames[i] === name);
    });

    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });

    // 渲染目标页面
    var targetId = 'page-' + name;
    var container = document.getElementById(targetId);
    if (container) {
      container.classList.add('active');
      container.innerHTML = '';
      TM.pages[name].render(targetId, TM.switchPage);
    }
  };

  // 初始化
  document.addEventListener('DOMContentLoaded', function() {
    // 创建页面容器
    var main = document.getElementById('mainContent');
    pageNames.forEach(function(name) {
      var div = document.createElement('div');
      div.id = 'page-' + name;
      div.className = 'page';
      main.appendChild(div);
    });

    // 初始化所有页面模块
    Object.keys(TM.pages).forEach(function(key) {
      if (TM.pages[key].init) TM.pages[key].init();
    });

    // 渲染默认页面
    TM.switchPage('home');

    // 导航事件绑定
    document.querySelectorAll('[data-nav]').forEach(function(el) {
      el.addEventListener('click', function() { TM.switchPage(el.dataset.nav); });
    });
  });

  // 窗口 resize
  window.addEventListener('resize', function() {
    if (TM.pages.game && TM.pages.game.onResize) TM.pages.game.onResize();
  });
})();
