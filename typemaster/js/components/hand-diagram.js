;(function() {
  var TM = window.TypeMaster;

  TM.handData = {
    left: {
      label: '左手',
      fingers: [
        { name: '小指', color: '#A8CBEE', fill: '#EBF3FC', keys: 'Q A Z · Tab Caps Shift', tip: '保持弯曲，轻触 A 键归位' },
        { name: '无名指', color: '#A8CBEE', fill: '#EBF3FC', keys: 'W S X', tip: '与小指保持间距' },
        { name: '中指', color: '#A8CBEE', fill: '#EBF3FC', keys: 'E D C', tip: '自然下垂，不要用力' },
        { name: '食指', color: '#534AB7', fill: '#EEEDFE', keys: 'R F V · T G B', tip: '食指负责两列！F 为归位键' },
        { name: '拇指', color: '#888', fill: '#f1f1f1', keys: '空格键', tip: '轻搭空格，不要用力压' },
      ],
      svg: '<svg width="180" height="240" viewBox="0 0 180 240" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="30" y="150" width="110" height="70" rx="20" fill="#f5f0e8" stroke="#ccc" stroke-width="1"/><rect x="30" y="80" width="22" height="80" rx="11" fill="#EBF3FC" stroke="#A8CBEE" stroke-width="1.5"/><rect x="57" y="60" width="22" height="100" rx="11" fill="#EBF3FC" stroke="#A8CBEE" stroke-width="1.5"/><rect x="84" y="50" width="22" height="110" rx="11" fill="#EBF3FC" stroke="#A8CBEE" stroke-width="1.5"/><rect x="111" y="65" width="22" height="95" rx="11" fill="#EEEDFE" stroke="#534AB7" stroke-width="2"/><rect x="128" y="155" width="24" height="50" rx="12" transform="rotate(30 128 155)" fill="#f1f1f1" stroke="#ccc" stroke-width="1"/><text x="41" y="76" text-anchor="middle" font-size="9" fill="#5f5e5a">小</text><text x="68" y="56" text-anchor="middle" font-size="9" fill="#5f5e5a">无名</text><text x="95" y="46" text-anchor="middle" font-size="9" fill="#5f5e5a">中</text><text x="122" y="61" text-anchor="middle" font-size="9" fill="#534AB7" font-weight="500">食</text><circle cx="122" cy="115" r="5" fill="#534AB7" opacity="0.7"/><text x="122" y="119" text-anchor="middle" font-size="7" fill="#fff">F</text><text x="85" y="228" text-anchor="middle" font-size="10" fill="#888">手腕悬空，轻触归位</text></svg>'
    },
    right: {
      label: '右手',
      fingers: [
        { name: '食指', color: '#534AB7', fill: '#EEEDFE', keys: 'Y H N · U J M', tip: '食指负责两列！J 为归位键' },
        { name: '中指', color: '#AFA9EC', fill: '#EEEDFE', keys: 'I K ,', tip: '自然下垂，不要用力' },
        { name: '无名指', color: '#AFA9EC', fill: '#EEEDFE', keys: 'O L .', tip: '与小指保持间距' },
        { name: '小指', color: '#AFA9EC', fill: '#EEEDFE', keys: "P ; ' · [ ] \\", tip: '保持弯曲，轻触 ; 键归位' },
        { name: '拇指', color: '#888', fill: '#f1f1f1', keys: '空格键', tip: '右拇指也可负责空格' },
      ],
      svg: '<svg width="180" height="240" viewBox="0 0 180 240" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="40" y="150" width="110" height="70" rx="20" fill="#f5f0e8" stroke="#ccc" stroke-width="1"/><rect x="45" y="65" width="22" height="95" rx="11" fill="#EEEDFE" stroke="#534AB7" stroke-width="2"/><rect x="72" y="50" width="22" height="110" rx="11" fill="#EEEDFE" stroke="#AFA9EC" stroke-width="1.5"/><rect x="99" y="60" width="22" height="100" rx="11" fill="#EEEDFE" stroke="#AFA9EC" stroke-width="1.5"/><rect x="126" y="80" width="22" height="80" rx="11" fill="#EEEDFE" stroke="#AFA9EC" stroke-width="1.5"/><rect x="24" y="158" width="24" height="50" rx="12" transform="rotate(-30 48 158)" fill="#f1f1f1" stroke="#ccc" stroke-width="1"/><text x="56" y="61" text-anchor="middle" font-size="9" fill="#534AB7" font-weight="500">食</text><text x="83" y="46" text-anchor="middle" font-size="9" fill="#5f5e5a">中</text><text x="110" y="56" text-anchor="middle" font-size="9" fill="#5f5e5a">无名</text><text x="137" y="76" text-anchor="middle" font-size="9" fill="#5f5e5a">小</text><circle cx="56" cy="115" r="5" fill="#534AB7" opacity="0.7"/><text x="56" y="119" text-anchor="middle" font-size="7" fill="#fff">J</text><text x="90" y="228" text-anchor="middle" font-size="10" fill="#888">手腕悬空，轻触归位</text></svg>'
    }
  };

  /**
   * 显示手部示意图
   */
  TM.showHand = function(side, svgWrap, legend, btnLeft, btnRight) {
    btnLeft.classList.toggle('active', side === 'left');
    btnRight.classList.toggle('active', side === 'right');
    var data = TM.handData[side];
    svgWrap.innerHTML = data.svg;
    legend.innerHTML = data.fingers.map(function(f) {
      return '<div class="finger-row">' +
        '<div class="finger-dot" style="background:' + f.fill + ';border:1.5px solid ' + f.color + '"></div>' +
        '<div class="finger-name" style="color:' + (f.color === '#534AB7' ? 'var(--purple)' : 'var(--blue)') + '">' + f.name + '</div>' +
        '<div class="finger-keys">' + f.keys + '</div>' +
        '<div class="finger-tip">' + f.tip + '</div></div>';
    }).join('');
  };
})();
