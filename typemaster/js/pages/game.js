;(function() {
  var TM = window.TypeMaster;
  var balloonColors = ['#EEEDFE','#EAF3DE','#FAEEDA','#E6F1FB','#FBEAF0','#E1F5EE'];
  var balloonStroke = ['#7F77DD','#639922','#BA7517','#378ADD','#D4537E','#1D9E75'];
  var gameState = { active: false, balloons: [], score: 0, level: 1, lives: 3, combo: 0, animId: null, speed: 0.5 };

  TM.pages = TM.pages || {};
  TM.pages.game = {
    init: function() {},
    render: function(containerId, switchPage) {
      var container = document.getElementById(containerId);
      if (!container) return;

      container.innerHTML = '\
  <div class="page-header"><h1>趣味游戏</h1><p>用打字消灭气球，练习速度同时享受乐趣</p></div>\
  <div class="flex-between mb-12">\
    <div class="game-stats">\
      <div class="game-stat">得分：<span id="gameScore">0</span></div><div class="game-stat">关卡：<span id="gameLevel">1</span></div>\
      <div class="game-stat">剩余生命：<span id="gameLives">3</span></div><div class="game-stat">连击：<span id="gameCombo">0</span>x</div>\
    </div>\
    <div style="display:flex;gap:8px"><button class="btn btn-primary" id="btnStartGame">开始游戏</button><button class="btn" id="btnResetGame">重置</button></div>\
  </div>\
  <canvas id="gameCanvas" width="1060" height="400"></canvas>\
  <div class="game-input-area"><input type="text" class="game-input" id="gameInput" placeholder="打出气球上的单词来消灭它…" autocomplete="off" autocorrect="off" spellcheck="false"><button class="btn btn-primary" id="btnStartGame2">开始</button></div>\
  <div style="margin-top:16px;font-size:12px;color:var(--text-muted);text-align:center">气球会从上方下落，快速打出单词来击破它，单词消失可得分。连续击破可获得 Combo 加成！</div>';

      document.getElementById('btnStartGame').addEventListener('click', startGame);
      document.getElementById('btnStartGame2').addEventListener('click', startGame);
      document.getElementById('btnResetGame').addEventListener('click', resetGame);
      document.getElementById('gameInput').addEventListener('input', checkGameInput);

      setTimeout(function() {
        var canvas = document.getElementById('gameCanvas');
        if (canvas) { canvas.width = canvas.offsetWidth || 1060; initGameCanvas(); }
      }, 100);
    },
    onResize: function() {
      var canvas = document.getElementById('gameCanvas');
      var page = document.getElementById('page-game');
      if (canvas && page && page.classList.contains('active')) { canvas.width = canvas.offsetWidth; }
    }
  };

  function initGameCanvas() {
    var canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    canvas.width = canvas.offsetWidth || 1060;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f0f8ff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#888';
    ctx.font = '16px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('按"开始游戏"开始，打出气球上的单词来击破它！', canvas.width / 2, canvas.height / 2);
  }

  function startGame() {
    gameState = { active: true, balloons: [], score: 0, level: 1, lives: 3, combo: 0, animId: null, speed: 0.6 };
    updateGameUI();
    document.getElementById('gameInput').focus();
    spawnBalloon();
    gameLoop();
  }

  function resetGame() {
    cancelAnimationFrame(gameState.animId);
    gameState.active = false;
    initGameCanvas();
    updateGameUI();
    document.getElementById('gameInput').value = '';
  }

  function spawnBalloon() {
    if (!gameState.active) return;
    var canvas = document.getElementById('gameCanvas');
    var w = canvas.width;
    var word = TM.gameWords[Math.floor(Math.random() * TM.gameWords.length)];
    var ci = Math.floor(Math.random() * balloonColors.length);
    gameState.balloons.push({ word: word, x: 60 + Math.random() * (w - 120), y: -60, color: balloonColors[ci], stroke: balloonStroke[ci], speed: gameState.speed + Math.random() * 0.3 });
    var delay = Math.max(800, 2500 - gameState.level * 200);
    setTimeout(spawnBalloon, delay);
  }

  function gameLoop() {
    if (!gameState.active) return;
    var canvas = document.getElementById('gameCanvas');
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f0f8ff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    gameState.balloons = gameState.balloons.filter(function(b) {
      b.y += b.speed;
      if (b.y > canvas.height + 30) {
        gameState.lives--;
        gameState.combo = 0;
        if (gameState.lives <= 0) { endGame(); return false; }
        updateGameUI();
        return false;
      }
      var r = 36;
      ctx.beginPath();
      ctx.ellipse(b.x, b.y, r, r + 8, 0, 0, Math.PI * 2);
      ctx.fillStyle = b.color;
      ctx.fill();
      ctx.strokeStyle = b.stroke;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(b.x, b.y + r + 8);
      ctx.lineTo(b.x, b.y + r + 22);
      ctx.strokeStyle = b.stroke;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#333';
      ctx.font = 'bold 13px -apple-system, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(b.word, b.x, b.y + 5);
      return true;
    });
    document.getElementById('gameCombo').textContent = gameState.combo;
    gameState.animId = requestAnimationFrame(gameLoop);
  }

  function checkGameInput(e) {
    var val = e.target.value.trim().toLowerCase();
    var idx = gameState.balloons.findIndex(function(b) { return b.word === val; });
    if (idx !== -1) {
      gameState.score += 10 * (1 + Math.floor(gameState.combo / 5));
      gameState.combo++;
      gameState.balloons.splice(idx, 1);
      e.target.value = '';
      if (gameState.score > gameState.level * 100) { gameState.level++; gameState.speed += 0.1; }
      updateGameUI();
      if (gameState.combo % 5 === 0) TM.showCombo(gameState.combo);
    }
  }

  function updateGameUI() {
    document.getElementById('gameScore').textContent = gameState.score;
    document.getElementById('gameLevel').textContent = gameState.level;
    document.getElementById('gameLives').textContent = '❤️'.repeat(Math.max(0, gameState.lives));
    document.getElementById('gameCombo').textContent = gameState.combo;
  }

  function endGame() {
    gameState.active = false;
    cancelAnimationFrame(gameState.animId);
    var canvas = document.getElementById('gameCanvas');
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '500 28px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('游戏结束！', canvas.width / 2, canvas.height / 2 - 30);
    ctx.font = '18px -apple-system, sans-serif';
    ctx.fillText('最终得分：' + gameState.score + ' 分', canvas.width / 2, canvas.height / 2 + 10);
    ctx.font = '14px -apple-system, sans-serif';
    ctx.fillStyle = '#ccc';
    ctx.fillText('按"开始游戏"再来一次', canvas.width / 2, canvas.height / 2 + 44);
    TM.showToast('游戏结束！得分：' + gameState.score);
  }
})();
