;(function() {
  var TM = window.TypeMaster;
  var examState = { timer: null, totalSecs: 300, remaining: 300, text: '', pos: 0, errors: 0, wpmHistory: [], startTime: null };

  TM.pages = TM.pages || {};
  TM.pages.exam = {
    init: function() {},
    render: function(containerId, switchPage) {
      var container = document.getElementById(containerId);
      if (!container) return;

      container.innerHTML = '\
  <div class="page-header"><h1>模拟考试</h1><p>自定义时间、长度和主题，模拟真实考试环境</p></div>\
  <div id="examSetup">\
    <div class="exam-setup">\
      <div class="card"><div class="section-title">考试设置</div>\
        <div class="form-group"><label>考试时长</label><select id="examDuration"><option value="60">1 分钟</option><option value="180">3 分钟</option><option value="300" selected>5 分钟</option><option value="600">10 分钟</option></select></div>\
        <div class="form-group"><label>文章长度</label><select id="examLength"><option value="short">短文（~100字）</option><option value="medium" selected>中等（~250字）</option><option value="long">长文（~500字）</option></select></div>\
        <div class="form-group"><label>难度</label><select id="examDiff"><option value="easy">入门</option><option value="mid" selected>中级</option><option value="hard">高级 / 考试级</option></select></div>\
      </div>\
      <div class="card"><div class="section-title">选择主题</div>\
        <div class="topic-chips" id="topicChips"><div class="chip selected" data-chip>经济学</div><div class="chip" data-chip>托福阅读</div><div class="chip" data-chip>AP 科学</div><div class="chip" data-chip>历史</div><div class="chip" data-chip>计算机</div><div class="chip" data-chip>文学</div><div class="chip" data-chip>环境科学</div><div class="chip" data-chip>商业英语</div></div>\
        <div class="divider"></div>\
        <div class="form-group" style="margin:0"><label>或上传/输入自定义文章</label><textarea style="width:100%;padding:8px 12px;border:0.5px solid var(--border);border-radius:6px;font-size:12px;min-height:80px;resize:vertical;background:var(--bg);outline:none;font-family:inherit" placeholder="粘贴文章内容…"></textarea></div>\
      </div>\
    </div>\
    <button class="btn btn-green" style="width:100%;padding:12px" id="btnStartExam">开始考试</button>\
  </div>\
  <div id="examRunning" style="display:none">\
    <div class="exam-timer-bar">\
      <div><div style="font-size:11px;color:var(--text-muted);margin-bottom:2px">剩余时间</div><div class="timer-display" id="timerDisplay">05:00</div></div>\
      <div class="timer-progress"><div class="fill" id="timerFill" style="width:100%"></div></div>\
      <div><div style="font-size:11px;color:var(--text-muted);margin-bottom:2px">实时 WPM</div><div class="wpm-live" id="liveWpm">0</div></div>\
      <div><div style="font-size:11px;color:var(--text-muted);margin-bottom:2px">准确率</div><div style="font-size:20px;font-weight:500;color:var(--blue)" id="liveAcc">100%</div></div>\
      <button class="btn" id="btnEndExam">结束考试</button>\
    </div>\
    <div class="practice-area"><div class="target-text" id="examText" style="font-size:15px"></div><input type="text" class="typing-input" id="examInput" placeholder="在这里开始打字…" autocomplete="off" autocorrect="off" spellcheck="false"></div>\
  </div>\
  <div id="examResult" style="display:none">\
    <div class="card mb-20" style="text-align:center;padding:32px"><div style="font-size:32px;margin-bottom:8px">🎉</div><div style="font-size:20px;font-weight:500;margin-bottom:4px">考试完成！</div><div style="font-size:13px;color:var(--text-secondary)">以下是你的成绩报告</div></div>\
    <div class="result-grid">\
      <div class="result-card"><div class="rval" style="color:var(--purple)" id="res-wpm">—</div><div class="rlbl">最终 WPM</div></div>\
      <div class="result-card"><div class="rval" style="color:var(--green)" id="res-acc">—</div><div class="rlbl">准确率</div></div>\
      <div class="result-card"><div class="rval" style="color:var(--blue)" id="res-words">—</div><div class="rlbl">打出字数</div></div>\
      <div class="result-card"><div class="rval" style="color:var(--amber)" id="res-errors">—</div><div class="rlbl">错误次数</div></div>\
    </div>\
    <div class="card" style="margin-top:16px"><div class="chart-wrap"><canvas id="examChart" role="img" aria-label="考试 WPM 曲线">考试进度数据</canvas></div></div>\
    <div style="margin-top:16px;display:flex;gap:12px"><button class="btn btn-primary" id="btnRestartExam">再来一次</button><button class="btn" id="btnBackHome">返回主页</button></div>\
  </div>';

      container.querySelectorAll('[data-chip]').forEach(function(el) {
        el.addEventListener('click', function() { el.classList.toggle('selected'); });
      });
      document.getElementById('btnStartExam').addEventListener('click', startExam);
      document.getElementById('btnEndExam').addEventListener('click', endExam);
      document.getElementById('examInput').addEventListener('input', handleExamTyping);
      document.getElementById('btnRestartExam').addEventListener('click', function() {
        document.getElementById('examSetup').style.display = 'block';
        document.getElementById('examResult').style.display = 'none';
      });
      document.getElementById('btnBackHome').addEventListener('click', function() { switchPage('home'); });
    }
  };

  function startExam() {
    var dur = parseInt(document.getElementById('examDuration').value) || 300;
    examState = { timer: null, totalSecs: dur, remaining: dur, pos: 0, errors: 0, wpmHistory: [], startTime: null };
    var chips = document.querySelectorAll('#topicChips .chip.selected');
    var topicKey = chips.length > 0 ? chips[0].textContent.trim() : '经济学';
    examState.text = topicKey === '经济学' ? TM.examTexts.economics : TM.examTexts.toefl;
    document.getElementById('examSetup').style.display = 'none';
    document.getElementById('examRunning').style.display = 'block';
    document.getElementById('examResult').style.display = 'none';
    TM.renderTargetText(document.getElementById('examText'), examState.text, examState.pos);
    document.getElementById('examInput').focus();
    startExamTimer();
  }

  function startExamTimer() {
    clearInterval(examState.timer);
    examState.timer = setInterval(function() {
      examState.remaining--;
      var m = String(Math.floor(examState.remaining / 60)).padStart(2, '0');
      var s = String(examState.remaining % 60).padStart(2, '0');
      document.getElementById('timerDisplay').textContent = m + ':' + s;
      var pct = (examState.remaining / examState.totalSecs) * 100;
      document.getElementById('timerFill').style.width = pct + '%';
      document.getElementById('timerFill').style.background = pct < 20 ? '#A32D2D' : pct < 50 ? '#BA7517' : '#534AB7';
      if (examState.startTime) {
        var wpm = TM.calcWPM(examState.pos, examState.startTime);
        document.getElementById('liveWpm').textContent = wpm;
        examState.wpmHistory.push(wpm);
      }
      if (examState.remaining <= 0) endExam();
    }, 1000);
  }

  function handleExamTyping(e) {
    var input = e.target;
    var val = input.value;
    if (!val) return;
    var ch = val[val.length - 1];
    if (!examState.startTime) examState.startTime = Date.now();
    var expected = examState.text[examState.pos];
    if (ch === expected) {
      examState.pos++;
      var wpm = TM.calcWPM(examState.pos, examState.startTime);
      var acc = TM.calcAccuracy(examState.pos, examState.errors);
      document.getElementById('liveWpm').textContent = wpm;
      document.getElementById('liveAcc').textContent = acc + '%';
    } else {
      examState.errors++;
    }
    input.value = '';
    TM.renderTargetText(document.getElementById('examText'), examState.text, examState.pos);
  }

  function endExam() {
    clearInterval(examState.timer);
    document.getElementById('examRunning').style.display = 'none';
    document.getElementById('examResult').style.display = 'block';
    var wpm = TM.calcWPM(examState.pos, examState.startTime || Date.now() - 60000);
    var acc = TM.calcAccuracy(examState.pos, examState.errors);
    document.getElementById('res-wpm').textContent = wpm;
    document.getElementById('res-acc').textContent = acc + '%';
    document.getElementById('res-words').textContent = examState.pos;
    document.getElementById('res-errors').textContent = examState.errors;
    renderExamChart();
  }

  function renderExamChart() {
    var hist = examState.wpmHistory.length > 0 ? examState.wpmHistory : [0,20,35,42,50,55,58,60];
    var ctx = document.getElementById('examChart');
    if (!ctx) return;
    if (ctx._chart) ctx._chart.destroy();
    ctx._chart = new Chart(ctx, {
      type: 'line',
      data: { labels: hist.map(function(_, i) { return (i+1) + 's'; }), datasets: [{ label: 'WPM', data: hist, borderColor: '#534AB7', backgroundColor: 'rgba(83,74,183,0.08)', fill: true, tension: 0.4, pointRadius: 2 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' } }, x: { grid: { display: false }, ticks: { maxTicksLimit: 10 } } } }
    });
  }
})();
