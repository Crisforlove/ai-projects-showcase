;(function() {
  var TM = window.TypeMaster;
  var typingState = { text: '', pos: 0, errors: 0, startTime: null, combo: 0, timer: null };

  TM.pages = TM.pages || {};
  TM.pages.lesson = {
    init: function() {},
    render: function(containerId, switchPage) {
      var container = document.getElementById(containerId);
      if (!container) return;

      container.innerHTML = '\
  <div class="page-header"><h1>键位教学</h1><p>掌握正确指法，用颜色区分手指区域</p></div>\
  <div class="stats-row">\
    <div class="stat-card"><div class="stat-val" id="wpmVal" style="color:var(--purple)">0</div><div class="stat-lbl">WPM</div></div>\
    <div class="stat-card"><div class="stat-val" id="accVal" style="color:var(--green)">100%</div><div class="stat-lbl">准确率</div></div>\
    <div class="stat-card"><div class="stat-val" id="comboVal" style="color:var(--amber)">0</div><div class="stat-lbl">Combo</div></div>\
    <div class="stat-card"><div class="stat-val" id="timeVal" style="color:var(--blue)">0s</div><div class="stat-lbl">用时</div></div>\
  </div>\
  <div class="keyboard-section">\
    <div class="flex-between mb-12">\
      <div><div class="section-title" style="margin:0 0 4px">键位图</div><div style="font-size:12px;color:var(--text-secondary)">蓝色 = 左手 · 紫色 = 右手 · <span style="color:var(--purple);font-weight:500">F / J 键</span> 底部横线为归位标记</div></div>\
      <div style="display:flex;gap:8px"><div style="display:flex;align-items:center;gap:8px;font-size:12px;padding:0 8px"><span style="width:16px;height:16px;border-radius:3px;background:#EBF3FC;border:0.5px solid #A8CBEE;display:inline-block"></span>左手<span style="width:16px;height:16px;border-radius:3px;background:#EEEDFE;border:0.5px solid #AFA9EC;display:inline-block"></span>右手</div><button class="btn btn-primary" id="btnStartPractice">开始练习</button></div>\
    </div>\
    <div class="keyboard" id="keyboardEl"></div>\
    <div class="hand-section">\
      <div class="flex-between mb-12"><div style="font-size:14px;font-weight:500">手势摆放指南</div><div class="hand-toggle"><button class="hand-btn active" id="btnLeft">左手</button><button class="hand-btn" id="btnRight">右手</button></div></div>\
      <div class="hand-diagram"><div class="hand-svg-wrap" id="handSvgWrap"></div><div class="hand-legend" id="handLegend"></div></div>\
    </div>\
  </div>\
  <div class="practice-area">\
    <div class="flex-between mb-12"><div class="section-title" style="margin:0">练习区</div><div style="display:flex;gap:8px"><select id="lessonSelect" style="padding:6px 10px;border:0.5px solid var(--border);border-radius:6px;font-size:12px;background:var(--card);outline:none"><option value="home">基础课：Home 行</option><option value="common">常用词汇</option><option value="economics">经济学词汇</option><option value="toefl">托福高频词</option></select><button class="btn" id="btnReset">重置</button></div></div>\
    <div class="target-text" id="targetText"></div>\
    <input type="text" class="typing-input" id="typingInput" placeholder="在这里开始打字…" autocomplete="off" autocorrect="off" spellcheck="false">\
  </div>\
  <div class="card"><div class="section-title">本课成就</div><div class="grid-4">\
    <div style="text-align:center;padding:12px"><div style="font-size:24px;margin-bottom:4px">🎯</div><div style="font-size:12px;color:var(--text-secondary)">精准一击</div><div style="font-size:11px;color:var(--text-muted)">100% 准确率</div></div>\
    <div style="text-align:center;padding:12px"><div style="font-size:24px;margin-bottom:4px">⚡</div><div style="font-size:12px;color:var(--text-secondary)">闪电快手</div><div style="font-size:11px;color:var(--text-muted)">超过 80 WPM</div></div>\
    <div style="text-align:center;padding:12px"><div style="font-size:24px;margin-bottom:4px">🔥</div><div style="font-size:12px;color:var(--text-secondary)">Combo 大师</div><div style="font-size:11px;color:var(--text-muted)">连击 50 次</div></div>\
    <div style="text-align:center;padding:12px;opacity:0.4"><div style="font-size:24px;margin-bottom:4px">🏆</div><div style="font-size:12px;color:var(--text-secondary)">终极打字员</div><div style="font-size:11px;color:var(--text-muted)">待解锁</div></div>\
  </div></div>';

      TM.buildKeyboard('keyboardEl');
      TM.showHand('left', document.getElementById('handSvgWrap'), document.getElementById('handLegend'), document.getElementById('btnLeft'), document.getElementById('btnRight'));

      document.getElementById('btnLeft').addEventListener('click', function() {
        TM.showHand('left', document.getElementById('handSvgWrap'), document.getElementById('handLegend'), document.getElementById('btnLeft'), document.getElementById('btnRight'));
      });
      document.getElementById('btnRight').addEventListener('click', function() {
        TM.showHand('right', document.getElementById('handSvgWrap'), document.getElementById('handLegend'), document.getElementById('btnLeft'), document.getElementById('btnRight'));
      });
      document.getElementById('btnStartPractice').addEventListener('click', function() {
        document.getElementById('typingInput').focus();
        TM.showToast('开始打字！');
      });
      document.getElementById('lessonSelect').addEventListener('change', loadLesson);
      document.getElementById('btnReset').addEventListener('click', loadLesson);
      document.getElementById('typingInput').addEventListener('input', handleTyping);
      loadLesson();
    }
  };

  function loadLesson() {
    var sel = document.getElementById('lessonSelect');
    if (!sel) return;
    typingState = { text: TM.lessonTexts[sel.value] || TM.lessonTexts.home, pos: 0, errors: 0, startTime: null, combo: 0, timer: null };
    clearInterval(typingState.timer);
    TM.renderTargetText(document.getElementById('targetText'), typingState.text, typingState.pos);
    var input = document.getElementById('typingInput');
    if (input) input.value = '';
    document.getElementById('wpmVal').textContent = '0';
    document.getElementById('accVal').textContent = '100%';
    document.getElementById('comboVal').textContent = '0';
    document.getElementById('timeVal').textContent = '0s';
  }

  function handleTyping(e) {
    var input = e.target;
    var val = input.value;
    if (!val) return;
    var ch = val[val.length - 1];
    if (!typingState.startTime) {
      typingState.startTime = Date.now();
      typingState.timer = setInterval(updateStats, 500);
    }
    var expected = typingState.text[typingState.pos];
    if (ch === expected) {
      typingState.pos++;
      typingState.combo++;
      TM.spawnSpark();
      if (typingState.combo % 10 === 0) TM.showCombo(typingState.combo);
    } else {
      typingState.errors++;
      typingState.combo = 0;
      document.getElementById('comboVal').textContent = '0';
    }
    input.value = '';
    TM.renderTargetText(document.getElementById('targetText'), typingState.text, typingState.pos);
    TM.highlightKey(typingState.text[typingState.pos] || '');
    if (typingState.pos >= typingState.text.length) {
      clearInterval(typingState.timer);
      updateStats();
      TM.showToast('🎉 完成！按 Combo 获得更多 XP');
    }
  }

  function updateStats() {
    if (!typingState.startTime) return;
    var elapsed = (Date.now() - typingState.startTime) / 1000;
    var wpm = TM.calcWPM(typingState.pos, typingState.startTime);
    var acc = TM.calcAccuracy(typingState.pos, typingState.errors);
    document.getElementById('wpmVal').textContent = wpm;
    document.getElementById('accVal').textContent = acc + '%';
    document.getElementById('comboVal').textContent = typingState.combo;
    document.getElementById('timeVal').textContent = Math.round(elapsed) + 's';
  }
})();
