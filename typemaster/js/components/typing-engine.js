;(function() {
  var TM = window.TypeMaster;

  /**
   * 渲染目标文本（带进度高亮）
   * @param {HTMLElement} el - 目标文本容器
   * @param {string} text - 完整文本
   * @param {number} pos - 当前输入位置
   */
  TM.renderTargetText = function(el, text, pos) {
    if (!el) return;
    var html = '';
    for (var i = 0; i < text.length; i++) {
      if (i < pos) html += '<span class="done">' + (text[i] === ' ' ? '&nbsp;' : text[i]) + '</span>';
      else if (i === pos) html += '<span class="cursor">' + (text[i] === ' ' ? '&nbsp;' : text[i]) + '</span>';
      else html += '<span>' + (text[i] === ' ' ? '&nbsp;' : text[i]) + '</span>';
    }
    el.innerHTML = html;
  };

  /**
   * 计算 WPM（每分钟单词数，1 单词 = 5 字符）
   */
  TM.calcWPM = function(charCount, startTimeMs) {
    var elapsed = (Date.now() - startTimeMs) / 60000;
    return Math.round((charCount / 5) / elapsed) || 0;
  };

  /**
   * 计算准确率
   */
  TM.calcAccuracy = function(correct, errors) {
    var total = correct + errors;
    return total > 0 ? Math.round((correct / total) * 100) : 100;
  };
})();
