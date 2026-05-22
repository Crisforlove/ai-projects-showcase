;(function() {
  var TM = window.TypeMaster;
  var currentWord = 'abandon';

  TM.pages = TM.pages || {};
  TM.pages.memory = {
    init: function() {},
    render: function(containerId, switchPage) {
      var container = document.getElementById(containerId);
      if (!container) return;

      container.innerHTML = '\
  <div class="page-header"><h1>记忆关联</h1><p>通过在不同语境中打出词汇造句，加深长期记忆</p></div>\
  <div class="card mb-20">\
    <div class="flex-between mb-12"><div class="section-title" style="margin:0">我的词库</div><button class="btn btn-primary" id="btnAddWord">+ 添加词汇</button></div>\
    <div class="word-bank" id="wordBank">\
      <div class="word-tag pending" data-word="abandon">abandon</div><div class="word-tag pending" data-word="allocate">allocate</div>\
      <div class="word-tag learning" data-word="economy">economy</div><div class="word-tag learning" data-word="deficit">deficit</div>\
      <div class="word-tag mastered">surplus</div><div class="word-tag mastered">inflation</div><div class="word-tag mastered">revenue</div>\
      <div class="word-tag pending" data-word="scarcity">scarcity</div>\
    </div>\
    <div style="display:flex;gap:16px;font-size:12px">\
      <span style="display:flex;align-items:center;gap:6px"><span style="width:10px;height:10px;border-radius:50%;background:var(--amber-light);border:1px solid #FAC775;display:inline-block"></span>待学习 (3)</span>\
      <span style="display:flex;align-items:center;gap:6px"><span style="width:10px;height:10px;border-radius:50%;background:var(--blue-light);border:1px solid #B5D4F4;display:inline-block"></span>学习中 (2)</span>\
      <span style="display:flex;align-items:center;gap:6px"><span style="width:10px;height:10px;border-radius:50%;background:var(--green-light);border:1px solid #C0DD97;display:inline-block"></span>已掌握 (3)</span>\
    </div>\
  </div>\
  <div class="vocab-card">\
    <div class="flex-between mb-12"><div><div class="vocab-word" id="vocabWord">abandon</div><div class="vocab-phonetic" id="vocabPhonetic">/əˈbændən/ · v.</div></div><button class="btn" id="btnNextWord">换一个词 →</button></div>\
    <div class="vocab-def" id="vocabDef"></div>\
    <div class="section-title">打出以下句子，强化记忆</div>\
    <div class="sentence-list" id="sentenceList"></div>\
    <div style="margin-top:16px;display:flex;gap:12px"><button class="btn btn-primary" id="btnCheckMemory">检查答案</button><button class="btn" id="btnNextWord2">下一个词</button></div>\
  </div>';

      container.querySelectorAll('[data-word]').forEach(function(el) {
        el.addEventListener('click', function() { selectWord(el.dataset.word); });
      });
      document.getElementById('btnAddWord').addEventListener('click', function() {
        var w = prompt('输入要添加的词汇：');
        if (w) TM.showToast('已添加 "' + w + '" 到词库（演示模式）');
      });
      document.getElementById('btnNextWord').addEventListener('click', function() { selectWord(getNextWord()); });
      document.getElementById('btnNextWord2').addEventListener('click', function() { selectWord(getNextWord()); });
      document.getElementById('btnCheckMemory').addEventListener('click', checkAllSentences);
      selectWord('abandon');
    }
  };

  function getNextWord() {
    var words = Object.keys(TM.vocabData);
    var idx = (words.indexOf(currentWord) + 1) % words.length;
    return words[idx];
  }

  function selectWord(word) {
    if (!TM.vocabData[word]) return;
    currentWord = word;
    var data = TM.vocabData[word];
    document.getElementById('vocabWord').textContent = word;
    document.getElementById('vocabPhonetic').textContent = data.phonetic;
    document.getElementById('vocabDef').innerHTML = data.def.replace(/\n/g, '<br>');
    var list = document.getElementById('sentenceList');
    list.innerHTML = '';
    data.sentences.forEach(function(s, i) {
      var item = document.createElement('div');
      item.className = 'sentence-item';
      item.innerHTML = '<div class="num">句子 ' + (i+1) + '</div><div class="sentence-text">' + s.show + '</div><div class="sentence-input-wrap"><input class="sentence-input" data-answer="' + s.answer + '" placeholder="请打出完整句子（用 ' + word + ' 填空）…" autocomplete="off" autocorrect="off" spellcheck="false"></div>';
      list.appendChild(item);
    });
  }

  function checkAllSentences() {
    var allCorrect = true;
    document.querySelectorAll('.sentence-input').forEach(function(input) {
      var val = input.value.trim().toLowerCase();
      var ans = input.dataset.answer.toLowerCase();
      if (val.includes(ans)) { input.classList.add('correct-state'); input.classList.remove('error-state'); }
      else { input.classList.add('error-state'); input.classList.remove('correct-state'); allCorrect = false; }
    });
    if (allCorrect) TM.showToast('🎉 全部正确！已掌握 ' + currentWord);
    else TM.showToast('有句子还未完全打对，继续加油！');
  }
})();
