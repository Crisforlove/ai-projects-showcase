;(function() {
  var TM = window.TypeMaster;

  /**
   * 显示 Combo 弹窗
   */
  TM.showCombo = function(n) {
    var c = document.getElementById('comboContainer');
    if (!c) return;
    var badge = document.createElement('div');
    badge.className = 'combo-badge';
    var msgs = ['不错！','Combo x' + n,'好厉害！','火力全开！','无敌！'];
    badge.textContent = n >= 50 ? '🔥 Combo x' + n : (n >= 20 ? '⚡ Combo x' + n : msgs[Math.min(Math.floor(n/10), msgs.length-1)]);
    c.appendChild(badge);
    setTimeout(function() { badge.remove(); }, 2200);
  };

  /**
   * 生成粒子火花特效
   */
  TM.spawnSpark = function() {
    if (Math.random() > 0.4) return;
    var colors = ['#534AB7','#3B6D11','#854F0B','#A32D2D','#185FA5'];
    for (var i = 0; i < 4; i++) {
      var s = document.createElement('div');
      s.className = 'spark';
      var size = 4 + Math.random() * 6;
      var angle = Math.random() * Math.PI * 2;
      var dist = 30 + Math.random() * 60;
      s.style.cssText = 'width:' + size + 'px;height:' + size + 'px;background:' + colors[Math.floor(Math.random()*colors.length)] + ';left:' + window.innerWidth/2 + 'px;top:' + window.innerHeight*0.7 + 'px;--tx:' + Math.cos(angle)*dist + 'px;--ty:' + Math.sin(angle)*dist + 'px';
      document.body.appendChild(s);
      setTimeout(function(el) { el.remove(); }, 700, s);
    }
  };
})();
