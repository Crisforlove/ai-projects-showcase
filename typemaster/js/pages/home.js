;(function() {
  var TM = window.TypeMaster;
  var homeChartInitialized = false;

  TM.pages = TM.pages || {};
  TM.pages.home = {
    init: function() { homeChartInitialized = false; },
    render: function(containerId, switchPage) {
      var container = document.getElementById(containerId);
      if (!container) return;

      container.innerHTML = '\
  <div class="hero">\
    <div class="hero-left">\
      <h2>欢迎回来，Alex 🎯</h2>\
      <p>今天完成 20 分钟练习，保持你的连续记录！AP Economics 考试还有 28 天，继续加油。</p>\
      <div class="hero-stats">\
        <div class="hero-stat"><div class="num">68</div><div class="lbl">今日 WPM</div></div>\
        <div class="hero-stat"><div class="num">94%</div><div class="lbl">准确率</div></div>\
        <div class="hero-stat"><div class="num">1,240</div><div class="lbl">总 XP</div></div>\
        <div class="hero-stat"><div class="num">7</div><div class="lbl">连续天数</div></div>\
      </div>\
    </div>\
    <div class="hero-right">\
      <svg width="100" height="100" viewBox="0 0 100 100">\
        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="8"/>\
        <circle cx="50" cy="50" r="40" fill="none" stroke="#fff" stroke-width="8" stroke-dasharray="188" stroke-dashoffset="56" stroke-linecap="round" transform="rotate(-90 50 50)"/>\
        <text x="50" y="46" text-anchor="middle" fill="#fff" font-size="18" font-weight="500">70%</text>\
        <text x="50" y="62" text-anchor="middle" fill="#CECBF6" font-size="9">今日目标</text>\
      </svg>\
      <button class="btn" style="background:rgba(255,255,255,0.15);color:#fff;border-color:rgba(255,255,255,0.3)" data-nav="exam">开始模拟考试 →</button>\
    </div>\
  </div>\
  <div class="xp-bar-wrap">\
    <div><div style="font-size:13px;font-weight:500;">Level 8</div><div class="xp-label">1,240 / 1,500 XP → Level 9</div></div>\
    <div class="xp-bar"><div class="fill" style="width:82%"></div></div>\
    <div class="xp-info">还差 260 XP</div>\
  </div>\
  <div class="section-title">继续学习</div>\
  <div class="grid-3 mb-20">\
    <div class="lesson-card" data-nav="lesson"><div class="tag" style="background:var(--blue-light);color:var(--blue)">键位教学</div><h3>第 4 课：F 和 J 键区</h3><p>掌握食指的正确归位手势</p><div class="progress-bar"><div class="fill" style="width:65%;background:var(--blue)"></div></div><div class="text-sm" style="margin-top:6px">65% 完成</div></div>\
    <div class="lesson-card" data-nav="exam"><div class="tag" style="background:var(--green-light);color:var(--green)">模拟考试</div><h3>AP Economics 主题练习</h3><p>微观经济学词汇精讲文章</p><div class="progress-bar"><div class="fill" style="width:40%;background:var(--green)"></div></div><div class="text-sm" style="margin-top:6px">上次：62 WPM · 91%</div></div>\
    <div class="lesson-card" data-nav="memory"><div class="tag" style="background:var(--amber-light);color:var(--amber)">记忆关联</div><h3>今日词汇：abandon / allocate</h3><p>用造句方式加深记忆，待复习 3 个</p><div class="progress-bar"><div class="fill" style="width:33%;background:var(--amber)"></div></div><div class="text-sm" style="margin-top:6px">已掌握 12 个词</div></div>\
    <div class="lesson-card" data-nav="game"><div class="tag" style="background:var(--purple-light);color:var(--purple)">趣味游戏</div><h3>气球爆破挑战</h3><p>最高分：1,850 分，挑战今天的记录</p><div class="progress-bar"><div class="fill" style="width:0%;background:var(--purple)"></div></div><div class="text-sm" style="margin-top:6px">今日未完成</div></div>\
    <div class="lesson-card"><div class="tag" style="background:var(--pink-light);color:var(--pink)">教师任务</div><h3>Wang 老师布置的任务</h3><p>完成经济学词汇章节 A–C</p><div style="position:absolute;top:12px;right:12px;width:8px;height:8px;border-radius:50%;background:#D4537E"></div><div class="progress-bar"><div class="fill" style="width:0%;background:var(--pink)"></div></div><div class="text-sm" style="margin-top:6px">截止：明天</div></div>\
    <div class="lesson-card" style="background:var(--bg);"><div class="tag" style="background:var(--border-soft);color:var(--text-muted)">即将解锁</div><h3 style="color:var(--text-muted)">进阶速打挑战</h3><p style="color:var(--text-muted)">达到 80 WPM 后解锁</p><div class="lock">🔒</div></div>\
  </div>\
  <div class="flex-between mb-12"><div class="section-title" style="margin:0">本周 WPM 趋势</div><span class="text-sm">+8 WPM vs 上周</span></div>\
  <div class="card mb-20"><div class="chart-wrap"><canvas id="wpmChart" role="img" aria-label="本周 WPM 趋势">本周 WPM 数据</canvas></div></div>';

      container.querySelectorAll('[data-nav]').forEach(function(el) {
        el.addEventListener('click', function() { switchPage(el.dataset.nav); });
      });
      initHomeChart();
    }
  };

  function initHomeChart() {
    if (homeChartInitialized) return;
    var ctx = document.getElementById('wpmChart');
    if (!ctx) return;
    homeChartInitialized = true;
    ctx._chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['周一','周二','周三','周四','周五','周六','今天'],
        datasets: [{ label: 'WPM', data: [52,55,58,56,61,65,68], borderColor: '#534AB7', backgroundColor: 'rgba(83,74,183,0.08)', fill: true, tension: 0.4, pointBackgroundColor: '#534AB7', pointRadius: 4 }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: false, min: 40, grid: { color: 'rgba(0,0,0,0.04)' } }, x: { grid: { display: false } } } }
    });
  }
})();
