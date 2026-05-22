;(function() {
  var TM = window.TypeMaster;

  var students = [
    { name: 'Alex Chen', wpm: 68, acc: 94, progress: 82, status: 'done' },
    { name: 'Lily Wang', wpm: 54, acc: 88, progress: 60, status: 'progress' },
    { name: 'James Liu', wpm: 72, acc: 97, progress: 95, status: 'done' },
    { name: 'Mia Zhang', wpm: 41, acc: 79, progress: 25, status: 'late' },
    { name: 'Kevin Wu', wpm: 63, acc: 91, progress: 70, status: 'progress' },
    { name: 'Sophie Ma', wpm: 35, acc: 75, progress: 10, status: 'late' },
  ];
  var tasks = [
    { title: '经济学词汇 A–C 章节', type: '词汇练习', due: '2026-05-23', done: '18/24', status: 'progress' },
    { title: '托福模拟考 5 分钟', type: '模拟考试', due: '2026-05-20', done: '24/24', status: 'done' },
    { title: '键位基础第 1–4 课', type: '键位训练', due: '2026-05-18', done: '24/24', status: 'done' },
  ];
  var classChartInitialized = false;

  TM.pages = TM.pages || {};
  TM.pages.teacher = {
    init: function() { classChartInitialized = false; },
    render: function(containerId, switchPage) {
      var container = document.getElementById(containerId);
      if (!container) return;

      container.innerHTML = '\
  <div class="page-header"><h1>教师后台</h1><p>查看学生进度、布置任务、提供反馈</p></div>\
  <div class="teacher-tabs"><button class="t-tab active" data-tab="overview">班级总览</button><button class="t-tab" data-tab="tasks">任务管理</button><button class="t-tab" data-tab="content">内容库</button><button class="t-tab" data-tab="feedback">反馈中心</button></div>\
  <div id="t-overview">\
    <div class="grid-4 mb-20">\
      <div class="card card-sm" style="text-align:center"><div style="font-size:24px;font-weight:500;color:var(--purple)">24</div><div class="text-sm" style="margin-top:4px">班级人数</div></div>\
      <div class="card card-sm" style="text-align:center"><div style="font-size:24px;font-weight:500;color:var(--green)">58</div><div class="text-sm" style="margin-top:4px">平均 WPM</div></div>\
      <div class="card card-sm" style="text-align:center"><div style="font-size:24px;font-weight:500;color:var(--blue)">89%</div><div class="text-sm" style="margin-top:4px">平均准确率</div></div>\
      <div class="card card-sm" style="text-align:center"><div style="font-size:24px;font-weight:500;color:var(--amber)">18/24</div><div class="text-sm" style="margin-top:4px">任务完成率</div></div>\
    </div>\
    <div class="card"><div class="flex-between mb-16"><div class="section-title" style="margin:0">学生成绩列表</div><input type="text" placeholder="搜索学生…" style="padding:6px 12px;border:0.5px solid var(--border);border-radius:6px;font-size:12px;background:var(--bg);outline:none;width:180px"></div>\
      <table class="student-table"><thead><tr><th>学生</th><th>WPM</th><th>准确率</th><th>本周进度</th><th>任务状态</th><th>操作</th></tr></thead><tbody id="studentTableBody"></tbody></table>\
    </div>\
    <div style="margin-top:20px"><div class="flex-between mb-12"><div class="section-title" style="margin:0">班级 WPM 分布</div></div><div class="card"><div class="chart-wrap"><canvas id="classChart" role="img" aria-label="班级 WPM 分布">班级分布数据</canvas></div></div></div>\
  </div>\
  <div id="t-tasks" style="display:none">\
    <div class="flex-between mb-16"><div class="section-title" style="margin:0">已发布任务</div><button class="btn btn-primary" id="btnShowCreateTask">+ 新建任务</button></div>\
    <div id="taskCreateForm" style="display:none" class="card mb-16"><div class="section-title">创建新任务</div>\
      <div class="grid-2"><div class="form-group"><label>任务名称</label><input type="text" id="taskName" placeholder="例：经济学词汇章节 A"></div><div class="form-group"><label>截止日期</label><input type="text" id="taskDue" placeholder="例：2026-05-30"></div><div class="form-group"><label>类型</label><select id="taskType"><option>模拟考试</option><option>词汇练习</option><option>键位训练</option></select></div><div class="form-group"><label>目标 WPM</label><input type="number" id="taskWpm" placeholder="例：60" value="60"></div></div>\
      <div style="display:flex;gap:8px"><button class="btn btn-primary" id="btnCreateTask">发布任务</button><button class="btn" id="btnCancelTask">取消</button></div>\
    </div><div id="taskList"></div>\
  </div>\
  <div id="t-content" style="display:none">\
    <div class="flex-between mb-16"><div class="section-title" style="margin:0">文章内容库</div><button class="btn btn-primary">+ 上传文章</button></div>\
    <div class="grid-2">\
      <div class="card"><div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">经济学 · 中级</div><div style="font-size:14px;font-weight:500;margin-bottom:4px">Supply and Demand</div><div style="font-size:12px;color:var(--text-secondary);margin-bottom:12px">The law of supply and demand describes how the price of a commodity changes...</div><div style="display:flex;gap:8px"><span class="badge badge-green">已发布</span><span style="font-size:12px;color:var(--text-muted)">248 字 · 已使用 6 次</span></div></div>\
      <div class="card"><div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">托福 · 高级</div><div style="font-size:14px;font-weight:500;margin-bottom:4px">Environmental Policy</div><div style="font-size:12px;color:var(--text-secondary);margin-bottom:12px">Climate change represents one of the most significant challenges...</div><div style="display:flex;gap:8px"><span class="badge badge-blue">草稿</span><span style="font-size:12px;color:var(--text-muted)">512 字</span></div></div>\
      <div class="card" style="border:0.5px dashed var(--border);display:flex;align-items:center;justify-content:center;min-height:100px;cursor:pointer;background:var(--bg)"><div style="text-align:center;color:var(--text-muted)"><div style="font-size:24px;margin-bottom:6px">+</div><div style="font-size:13px">拖入文件或点击上传</div><div style="font-size:11px;margin-top:4px">支持 .txt .docx .pdf</div></div></div>\
    </div>\
  </div>\
  <div id="t-feedback" style="display:none">\
    <div class="grid-2"><div><div class="section-title">待反馈学生</div><div id="feedbackList"></div></div><div><div class="section-title">发送反馈</div><div class="feedback-box"><div class="form-group"><label>选择学生</label><select><option>Alex Chen</option><option>Lily Wang</option><option>James Liu</option></select></div><div class="form-group"><label>反馈内容</label><textarea placeholder="你的练习准确率有很大进步，但速度还需要提升…"></textarea></div><button class="btn btn-primary" id="btnSendFeedback">发送反馈</button></div></div>\
  </div>';

      container.querySelectorAll('[data-tab]').forEach(function(el) {
        el.addEventListener('click', function() { switchTeacherTab(el.dataset.tab); });
      });
      document.getElementById('btnShowCreateTask').addEventListener('click', function() { document.getElementById('taskCreateForm').style.display = 'block'; });
      document.getElementById('btnCancelTask').addEventListener('click', function() { document.getElementById('taskCreateForm').style.display = 'none'; });
      document.getElementById('btnCreateTask').addEventListener('click', createTask);
      document.getElementById('btnSendFeedback').addEventListener('click', function() { TM.showToast('反馈已发送 ✓'); });

      initStudentTable();
      initTaskList();
      initFeedbackList();
      initClassChart();
    }
  };

  function switchTeacherTab(tab) {
    ['overview','tasks','content','feedback'].forEach(function(t) {
      var el = document.getElementById('t-' + t);
      if (el) el.style.display = t === tab ? 'block' : 'none';
    });
    document.querySelectorAll('[data-tab]').forEach(function(el) { el.classList.toggle('active', el.dataset.tab === tab); });
  }

  function initStudentTable() {
    var tbody = document.getElementById('studentTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    students.forEach(function(s) {
      var statusMap = { done: ['badge-green','已完成'], progress: ['badge-blue','进行中'], late: ['badge-red','未提交'] };
      var cls = statusMap[s.status][0], lbl = statusMap[s.status][1];
      var barColor = s.progress > 70 ? '#639922' : s.progress > 40 ? '#BA7517' : '#A32D2D';
      tbody.innerHTML += '<tr><td style="font-weight:500">' + s.name + '</td><td>' + s.wpm + '</td><td>' + s.acc + '%</td><td><div class="mini-bar"><div class="fill" style="width:' + s.progress + '%;background:' + barColor + '"></div></div> <span style="font-size:12px;color:var(--text-muted)">' + s.progress + '%</span></td><td><span class="badge ' + cls + '">' + lbl + '</span></td><td><button class="btn" style="padding:4px 10px;font-size:12px" data-feedback>反馈</button></td></tr>';
    });
    tbody.querySelectorAll('[data-feedback]').forEach(function(el) {
      el.addEventListener('click', function() { switchTeacherTab('feedback'); });
    });
  }

  function initTaskList() {
    var el = document.getElementById('taskList');
    if (!el) return;
    el.innerHTML = '';
    tasks.forEach(function(t) {
      var statusMap = { done: ['badge-green','已结束'], progress: ['badge-amber','进行中'] };
      var cls = statusMap[t.status][0], lbl = statusMap[t.status][1];
      el.innerHTML += '<div class="task-item"><div><div class="task-title">' + t.title + '</div><div class="task-meta">' + t.type + ' · 截止 ' + t.due + '</div></div><span class="badge ' + cls + '">' + lbl + '</span><div style="font-size:13px;color:var(--text-secondary)">' + t.done + ' 完成</div><button class="btn" style="padding:4px 10px;font-size:12px">查看</button></div>';
    });
  }

  function initFeedbackList() {
    var el = document.getElementById('feedbackList');
    if (!el) return;
    el.innerHTML = '';
    students.filter(function(s) { return s.status === 'late' || s.progress < 50; }).forEach(function(s) {
      el.innerHTML += '<div class="task-item" style="margin-bottom:10px;cursor:pointer"><div style="width:36px;height:36px;border-radius:50%;background:var(--pink-light);color:var(--pink);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:500">' + s.name[0] + '</div><div style="flex:1"><div style="font-size:13px;font-weight:500">' + s.name + '</div><div style="font-size:12px;color:var(--text-muted)">WPM: ' + s.wpm + ' · 进度 ' + s.progress + '%</div></div><span class="badge badge-red">需关注</span></div>';
    });
  }

  function createTask() {
    var name = document.getElementById('taskName').value || '新任务';
    var due = document.getElementById('taskDue').value || '待定';
    var type = document.getElementById('taskType').value;
    tasks.unshift({ title: name, type: type, due: due, done: '0/24', status: 'progress' });
    initTaskList();
    document.getElementById('taskCreateForm').style.display = 'none';
    TM.showToast('任务 "' + name + '" 已发布！');
  }

  function initClassChart() {
    if (classChartInitialized) return;
    var ctx = document.getElementById('classChart');
    if (!ctx) return;
    classChartInitialized = true;
    ctx._chart = new Chart(ctx, {
      type: 'bar',
      data: { labels: ['<30','30–40','40–50','50–60','60–70','70–80','80+'], datasets: [{ label: '人数', data: [1,2,4,7,6,3,1], backgroundColor: '#EEEDFE', borderColor: '#534AB7', borderWidth: 0.5, borderRadius: 4 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: 'rgba(0,0,0,0.04)' } }, x: { grid: { display: false } } } }
    });
  }
})();
