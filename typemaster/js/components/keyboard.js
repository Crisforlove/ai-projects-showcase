;(function() {
  var TM = window.TypeMaster;

  // 键盘布局数据
  TM.keyLayout = [
    [{k:'`',f:1},{k:'1',f:1},{k:'2',f:1},{k:'3',f:2},{k:'4',f:3},{k:'5',f:4},{k:'6',f:5},{k:'7',f:5},{k:'8',f:6},{k:'9',f:7},{k:'0',f:7},{k:'-',f:8},{k:'=',f:8},{k:'⌫',f:8,cls:'wider'}],
    [{k:'Tab',f:1,cls:'wide'},{k:'Q',f:1},{k:'W',f:2},{k:'E',f:3},{k:'R',f:4},{k:'T',f:4},{k:'Y',f:5},{k:'U',f:5},{k:'I',f:6},{k:'O',f:7},{k:'P',f:8},{k:'[',f:8},{k:']',f:8},{k:'\\',f:8}],
    [{k:'Caps',f:1,cls:'wide'},{k:'A',f:1},{k:'S',f:2},{k:'D',f:3},{k:'F',f:4},{k:'G',f:4},{k:'H',f:5},{k:'J',f:5},{k:'K',f:6},{k:'L',f:7},{k:';',f:8},{k:"'",f:8},{k:'↵',f:8,cls:'wider'}],
    [{k:'Shift',f:1,cls:'wider'},{k:'Z',f:1},{k:'X',f:2},{k:'C',f:3},{k:'V',f:4},{k:'B',f:4},{k:'N',f:5},{k:'M',f:5},{k:',',f:6},{k:'.',f:7},{k:'/',f:8},{k:'⇧',f:8,cls:'wider'}],
    [{k:'Ctrl',f:1,cls:'wide'},{k:'Alt',f:1},{k:'',f:0,cls:'space'}]
  ];

  TM.fingerClasses = ['','finger-l1','finger-l2','finger-l3','finger-l4','finger-r1','finger-r2','finger-r3','finger-r4'];

  /**
   * 在指定容器内构建虚拟键盘
   * @param {string} containerId - 键盘容器元素 ID
   */
  TM.buildKeyboard = function(containerId) {
    containerId = containerId || 'keyboardEl';
    var el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = '';
    var homeAnchors = {'f': true, 'j': true};
    TM.keyLayout.forEach(function(row) {
      var rowEl = document.createElement('div');
      rowEl.className = 'key-row';
      row.forEach(function(k) {
        var keyEl = document.createElement('div');
        var isAnchor = homeAnchors[k.k.toLowerCase()];
        keyEl.className = 'key' + (k.cls ? ' ' + k.cls : '') + (k.f ? ' ' + TM.fingerClasses[k.f] : '') + (isAnchor ? ' home-anchor' : '');
        keyEl.textContent = k.k;
        keyEl.dataset.key = k.k.toLowerCase();
        keyEl.addEventListener('click', function() {
          keyEl.classList.add('active');
          setTimeout(function() { keyEl.classList.remove('active'); }, 200);
        });
        rowEl.appendChild(keyEl);
      });
      el.appendChild(rowEl);
    });
  };

  /**
   * 高亮指定字符对应的按键
   * @param {string} char - 要高亮的字符
   */
  TM.highlightKey = function(char) {
    document.querySelectorAll('.key').forEach(function(k) { k.classList.remove('active'); });
    var key = char.toLowerCase();
    document.querySelectorAll('.key').forEach(function(k) {
      if (k.dataset.key === key) k.classList.add('active');
    });
  };
})();
