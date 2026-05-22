# TypeMaster 智能打字学习平台 — 模块功能文档

## 项目概述

TypeMaster 是一个纯前端智能打字学习平台，使用 HTML + CSS + 原生 JavaScript 实现，Chart.js 4.4.1 负责数据可视化。项目采用 IIFE + 全局命名空间 `window.TypeMaster`（简称 TM）的模块化架构，支持 `file://` 协议直接打开，无需 HTTP 服务器。

### 目录结构

```
typemaster/
├── index.html                  # 入口 HTML
├── css/
│   └── style.css               # 全局样式（272 行）
├── js/
│   ├── app.js                  # 应用主入口
│   ├── components/
│   │   ├── keyboard.js         # 虚拟键盘组件
│   │   ├── typing-engine.js    # 打字引擎（共享）
│   │   ├── hand-diagram.js     # 手部示意图组件
│   │   └── effects.js          # 特效组件（共享）
│   └── pages/
│       ├── home.js             # 主页/仪表盘
│       ├── lesson.js           # 键位教学
│       ├── exam.js             # 模拟考试
│       ├── memory.js           # 记忆关联/词汇练习
│       ├── teacher.js          # 教师后台
│       └── game.js             # 趣味游戏（气球爆破）
└── data/
    ├── lessons.js              # 课程文本数据
    ├── vocab.js                # 词汇数据
    ├── exam-texts.js           # 考试文章数据
    └── game-words.js           # 游戏单词数据
```

### 架构设计

- **数据层**（`data/`）：纯数据文件，通过 IIFE 注册到 `TM` 命名空间
- **组件层**（`js/components/`）：可复用的 UI 组件和工具函数，供多个页面共享
- **页面层**（`js/pages/`）：每个页面独立模块，注册到 `TM.pages.{name}`，提供 `init()` 和 `render()` 方法
- **入口层**（`js/app.js`）：页面路由、Toast 提示、全局事件绑定

---

## 入口文件

### index.html

**职责**：应用 HTML 壳，定义导航栏和全局 DOM 结构，按依赖顺序加载所有 JS 文件。

**加载顺序**：
1. Chart.js CDN（数据可视化依赖）
2. 数据文件 → 组件文件 → 页面文件 → app.js

**导航栏**：6 个页面 tab（主页、键位教学、模拟考试、记忆关联、教师后台、趣味游戏），使用 `data-nav` 属性路由。右侧显示连续打卡天数和快捷"开始练习"按钮。

**全局 DOM**：
- `#comboContainer`：Combo 弹窗容器
- `#toast`：底部 Toast 提示
- `#mainContent`：页面容器（由 JS 动态创建子 div）

---

## 样式文件

### css/style.css

**职责**：全局样式表，272 行，覆盖所有页面和组件的视觉样式。

**核心设计系统**：
- CSS 自定义属性（`--purple`, `--green`, `--blue`, `--amber`, `--pink`, `--red`, `--teal` 等主题色）
- 圆角规范（`--radius: 12px`, `--radius-sm: 8px`）
- 卡片/网格/按钮/表单等通用样式

**按模块组织的样式区块**：
| 样式区块 | 覆盖模块 |
|----------|----------|
| Nav | 全局导航栏 |
| Home / Dashboard | 主页 Hero、XP 进度条、课程卡片 |
| Keyboard Lesson | 虚拟键盘、手部示意图、练习区、统计卡片 |
| Exam Mode | 考试设置表单、计时器条、结果卡片 |
| Memory | 词汇卡片、句子输入、词库标签 |
| Teacher Dashboard | Tab 切换、学生表格、任务列表、反馈框 |
| Balloon Game | Canvas 画布、游戏输入区、游戏统计 |
| Misc | Toast、Combo 弹窗、Spark 粒子、Chart.js 容器 |

**动画**：
- `blink`：光标闪烁
- `popIn` + `fadeOut`：Combo 弹窗入场/退场
- `sparkFly`：粒子火花飞散

---

## 数据文件

### data/lessons.js

**提供数据**：`TM.lessonTexts` — 4 套课程练习文本。

| Key | 内容 | 用途 |
|-----|------|------|
| `home` | Home 行键位练习（asdf jkl;） | 基础指法 |
| `common` | 全键盘覆盖短句（the quick brown fox...） | 常用键位 |
| `economics` | 经济学专业词汇（supply demand market...） | 学科词汇 |
| `toefl` | 托福高频词汇（ambiguous benevolent cogent...） | 考试词汇 |

### data/vocab.js

**提供数据**：`TM.vocabData` — 3 个词汇的完整学习数据。

每个词汇包含：
- `phonetic`：音标和词性（如 `/əˈbændən/ · v.`）
- `def`：中文释义和常用搭配
- `sentences`：3 个填空造句，每句含 `show`（带空白的句子）和 `answer`（目标答案）

| 词汇 | 词性 | 主题 |
|------|------|------|
| abandon | v. | 放弃/抛弃 |
| allocate | v. | 分配/拨给 |
| scarcity | n. | 稀缺 |

### data/exam-texts.js

**提供数据**：`TM.examTexts` — 2 篇考试文章。

| Key | 字数 | 主题 |
|-----|------|------|
| `economics` | ~150 词 | 供需法则、市场均衡、消费者剩余 |
| `toefl` | ~100 词 | 环境退化与可持续发展 |

### data/game-words.js

**提供数据**：`TM.gameWords` — 20 个游戏用简单英文单词。

`['apple','river','cloud','tiger','music','happy','dance','quick','earth','light','magic','storm','brave','ocean','flame','peace','dream','power','frost','bloom']`

---

## 共享组件

### js/components/keyboard.js

**职责**：虚拟键盘构建与按键高亮。被 `lesson.js` 页面使用。

**提供数据**：
- `TM.keyLayout`：键盘布局数据（5 行），每个按键含 `k`（键名）、`f`（手指编号 1-8）、`cls`（宽度类名）
- `TM.fingerClasses`：9 个手指 CSS 类名映射（索引 0 为空，1-4 左手，5-8 右手）

**提供函数**：

| 函数 | 参数 | 功能 |
|------|------|------|
| `TM.buildKeyboard(containerId)` | 容器元素 ID | 构建完整的 5 行虚拟键盘，带手指颜色编码（蓝色=左手，紫色=右手），F/J 键底部有归位标记横线。支持点击按键动效 |
| `TM.highlightKey(char)` | 要高亮的字符 | 清除所有按键高亮，高亮目标字符对应的按键 |

**视觉特征**：
- 9 个手指区域用不同 CSS 类着色
- `home-anchor` 类为 F/J 键添加底部内嵌横线（归位标记）
- `wide`/`wider`/`widest`/`space` 类控制特殊键宽度

### js/components/typing-engine.js

**职责**：打字核心逻辑（文本渲染、WPM 计算、准确率计算）。被 `lesson.js` 和 `exam.js` 共享。

**提供函数**：

| 函数 | 参数 | 返回值 | 功能 |
|------|------|--------|------|
| `TM.renderTargetText(el, text, pos)` | 容器元素、完整文本、当前位置 | — | 渲染带进度高亮的目标文本：已完成字符显示为紫色（`.done`），当前位置显示闪烁光标（`.cursor`），未输入字符为默认色 |
| `TM.calcWPM(charCount, startTimeMs)` | 已输入字符数、开始时间戳 | number | 计算实时 WPM（每分钟单词数，1 单词 = 5 字符） |
| `TM.calcAccuracy(correct, errors)` | 正确次数、错误次数 | number | 计算准确率百分比（0-100） |

### js/components/hand-diagram.js

**职责**：手部示意图渲染。被 `lesson.js` 页面使用。

**提供数据**：`TM.handData` — 左右手各含：
- `label`：手部名称（"左手"/"右手"）
- `fingers[]`：5 个手指信息（名称、颜色、填充色、对应按键、指法提示）
- `svg`：内联 SVG 字符串（180×240 viewBox），绘制手掌和手指轮廓，食指区域用紫色描边并标注归位键（F/J）

**提供函数**：

| 函数 | 参数 | 功能 |
|------|------|------|
| `TM.showHand(side, svgWrap, legend, btnLeft, btnRight)` | 左/右、SVG 容器、图例容器、左/右切换按钮 | 切换手部示意图：更新 SVG 图形、手指按键映射表（含颜色圆点、手指名、对应键、指法提示）、按钮激活状态 |

### js/components/effects.js

**职责**：Combo 弹窗和粒子火花特效。被 `lesson.js` 和 `game.js` 共享。

**提供函数**：

| 函数 | 参数 | 功能 |
|------|------|------|
| `TM.showCombo(n)` | Combo 连击数 | 在右上角显示 Combo 弹窗，根据连击数显示不同文案（10+ Combo xN、20+ ⚡、50+ 🔥）。弹窗自动 2.2 秒后消失 |
| `TM.spawnSpark()` | 无 | 40% 概率生成粒子火花效果。从屏幕中央偏下位置发射 4 个随机颜色（紫/绿/琥珀/红/蓝）的圆形粒子，向随机方向飞散并缩放消失 |

---

## 页面模块

### js/pages/home.js

**注册**：`TM.pages.home`

**功能**：主页仪表盘，展示用户学习概览和快速导航。

**页面结构**：
1. **Hero 区域**：欢迎语、学习提醒（如 AP Economics 倒计时）、4 项今日统计（WPM、准确率、总 XP、连续天数）、今日目标完成度环形图（SVG）
2. **XP 进度条**：当前等级 → 下一等级的 XP 进度
3. **课程卡片网格**（6 张）：
   - 键位教学（跳转 lesson）、模拟考试（跳转 exam）、记忆关联（跳转 memory）、趣味游戏（跳转 game）
   - 教师任务（待办提醒，带红点）
   - 即将解锁（锁定状态）
   - 每张卡片含进度条和完成百分比
4. **WPM 趋势图**：Chart.js 折线图，展示本周 7 天的 WPM 变化趋势

**图表**：
- 类型：Line Chart
- 数据：周一到周日 WPM（52→55→58→56→61→65→68）
- 样式：紫色线条、浅紫填充区域、圆点标记

**路由**：卡片上的 `data-nav` 属性支持点击跳转到对应页面。

---

### js/pages/lesson.js

**注册**：`TM.pages.lesson`

**功能**：键位教学与打字练习，核心功能页面。

**页面结构**：
1. **统计栏**（4 张卡片）：实时 WPM、准确率、Combo 连击、用时
2. **键位图区域**：
   - 虚拟键盘（调用 `TM.buildKeyboard`）
   - 手势摆放指南：左右手 SVG 切换（调用 `TM.showHand`），含手指-按键映射表
3. **练习区域**：
   - 课程选择器（基础 Home 行 / 常用词汇 / 经济学词汇 / 托福高频词）
   - 目标文本展示（调用 `TM.renderTargetText`，实时高亮进度）
   - 输入框（捕获每次按键）
4. **成就徽章**：精准一击（100% 准确率）、闪电快手（80+ WPM）、Combo 大师（50 连击）、终极打字员（待解锁）

**打字逻辑**：
- 每次按键对比目标文本，正确则推进位置、增加 Combo、触发粒子特效
- 每 10 连击触发 Combo 弹窗
- 错误则 Combo 归零、错误计数 +1
- 全部完成时弹出完成 Toast
- 实时调用 `TM.highlightKey` 高亮下一个目标按键

**依赖组件**：keyboard、typing-engine、hand-diagram、effects

---

### js/pages/exam.js

**注册**：`TM.pages.exam`

**功能**：模拟考试，三阶段工作流。

**阶段一：考试设置**（`#examSetup`）
- 考试时长选择：1/3/5/10 分钟
- 文章长度：短文（~100 字）/ 中等（~250 字）/ 长文（~500 字）
- 难度选择：入门 / 中级 / 高级
- 主题选择：经济学、托福阅读、AP 科学、历史、计算机、文学、环境科学、商业英语（Chip 多选）
- 自定义文章输入（Textarea）

**阶段二：考试进行**（`#examRunning`）
- 计时器栏：倒计时显示（MM:SS）、进度条（颜色随剩余时间变化：紫 → 琥珀 → 红）、实时 WPM、实时准确率
- 打字区：目标文本 + 输入框
- 手动结束按钮

**阶段三：成绩报告**（`#examResult`）
- 4 项结果指标：最终 WPM、准确率、打出字数、错误次数
- WPM 变化曲线图：Chart.js 折线图，展示考试过程中每秒 WPM 变化
- 重新考试 / 返回主页按钮

**计时器逻辑**：
- 每秒更新倒计时和进度条
- 剩余 < 50% 进度条变琥珀色，< 20% 变红色
- 每秒记录 WPM 到 `wpmHistory` 数组
- 时间到自动结束考试

**依赖组件**：typing-engine

---

### js/pages/memory.js

**注册**：`TM.pages.memory`

**功能**：词汇记忆与造句练习。

**页面结构**：
1. **词库管理**：
   - 词汇标签列表，3 种状态（CSS 类）：
     - `.pending`（琥珀色）：待学习
     - `.learning`（蓝色）：学习中
     - `.mastered`（绿色）：已掌握
   - 添加词汇按钮
   - 状态统计说明
2. **词汇学习卡片**：
   - 目标词汇（大号紫色显示）
   - 音标和词性
   - 中文释义和常用搭配
   - 3 个填空造句练习（句子展示 + 输入框）

**交互逻辑**：
- 点击词库标签切换当前学习词汇
- 用户在每个句子输入框中打出完整句子（含目标词汇填空）
- "检查答案"按钮：逐句校验输入是否包含目标词汇，正确边框变绿，错误变红
- 全部正确时弹出掌握提示 Toast

**依赖组件**：无（直接操作 DOM）

---

### js/pages/teacher.js

**注册**：`TM.pages.teacher`

**功能**：教师后台管理，4 个 Tab 页面。

**Tab 1：班级总览**（`#t-overview`）
- 4 项班级统计卡片：班级人数、平均 WPM、平均准确率、任务完成率
- 学生成绩表格：姓名、WPM、准确率、进度条（颜色编码）、任务状态（已完成/进行中/未提交）、操作按钮
- 班级 WPM 分布图：Chart.js 柱状图（<30、30-40、40-50、50-60、60-70、70-80、80+）

**Tab 2：任务管理**（`#t-tasks`）
- 已发布任务列表（任务名称、类型、截止日期、完成人数/总人数、状态）
- 新建任务表单（名称、截止日期、类型下拉选择、目标 WPM）
- 任务创建后实时更新列表

**Tab 3：内容库**（`#t-content`）
- 已有文章列表（学科标签、标题、摘要、发布状态、使用次数）
- 上传/拖拽文件区域（支持 .txt .docx .pdf）

**Tab 4：反馈中心**（`#t-feedback`）
- 左侧：待反馈学生列表（自动筛选进度 < 50% 或未提交的学生，标记"需关注"）
- 右侧：发送反馈表单（选择学生 + 反馈内容）

**图表**：
- 类型：Bar Chart
- 数据：WPM 分段人数分布（1,2,4,7,6,3,1）
- 样式：浅紫填充、紫色描边、圆角柱体

---

### js/pages/game.js

**注册**：`TM.pages.game`

**功能**：Canvas 气球爆破打字游戏。

**游戏机制**：
- 气球从屏幕顶部随机位置生成并下落
- 每个气球上显示一个英文单词（从 `TM.gameWords` 中随机选取）
- 玩家在输入框中打出单词即可击破对应气球
- 气球落出屏幕底部则失去一条生命

**计分规则**：
- 基础分 10 分 × (1 + Combo / 5)，Combo 越高分数越高
- 每 5 连击触发 Combo 弹窗
- 每积累 100 分升一级，升级后气球下落速度加快

**关卡系统**：
- 气球生成间隔随等级递减（`max(800, 2500 - level × 200)` 毫秒）
- 下落速度随等级增加（`0.6 + level × 0.1 + 随机偏移`）

**生命系统**：初始 3 条生命，用 ❤️ 图标显示，归零时游戏结束。

**视觉效果**：
- Canvas 渲染：椭圆形气球 + 底部挂绳，6 种配色随机
- 游戏结束：半透明遮罩 + 结束文字 + 最终得分

**响应式**：`onResize()` 方法在窗口 resize 时自动调整 Canvas 宽度。

**依赖组件**：effects（showCombo）

---

## 应用入口

### js/app.js

**职责**：应用主入口，初始化和全局管理。

**提供函数**：

| 函数 | 参数 | 功能 |
|------|------|------|
| `TM.showToast(msg, duration)` | 消息文本、持续时间（默认 2000ms） | 底部居中 Toast 提示，CSS transition 淡入淡出 |
| `TM.switchPage(name)` | 页面名称（home/lesson/exam/memory/teacher/game） | 页面路由切换：更新导航 Tab 激活状态、隐藏所有页面容器、调用目标页面的 `render()` 方法 |

**初始化流程**（DOMContentLoaded）：
1. 在 `#mainContent` 中创建 6 个页面容器 div（`#page-home` ~ `#page-game`）
2. 调用所有页面模块的 `init()` 方法
3. 渲染默认页面 `home`
4. 绑定所有 `data-nav` 元素的点击事件

**全局事件**：
- `resize`：游戏页面激活时调用 `TM.pages.game.onResize()` 调整 Canvas 尺寸

---

## 模块依赖关系图

```
数据层                    组件层                     页面层              入口
─────────────────────────────────────────────────────────────────────────────

data/lessons.js ──────────────────────┐
data/vocab.js ────────────────────────┤
data/exam-texts.js ───────────────────┤
data/game-words.js ───────────────────┤
                                      ▼
                           components/typing-engine.js ──┬──► pages/lesson.js
                                                         └──► pages/exam.js

components/keyboard.js ────────────────────► pages/lesson.js
components/hand-diagram.js ────────────────► pages/lesson.js
components/effects.js ──┬──► pages/lesson.js
                        └──► pages/game.js

pages/home.js ──┐
pages/lesson.js ─┤
pages/exam.js ───┼──► js/app.js
pages/memory.js ─┤
pages/teacher.js ─┤
pages/game.js ───┘
```

---

## 技术细节

| 项目 | 说明 |
|------|------|
| 模块模式 | IIFE（立即执行函数表达式）+ 全局命名空间 `window.TypeMaster` |
| 页面注册 | `TM.pages.{name} = { init(), render(containerId, switchPage) }` |
| 组件注册 | 直接挂载到 TM 命名空间（如 `TM.buildKeyboard`、`TM.showToast`） |
| 图表库 | Chart.js 4.4.1（CDN 加载），3 处使用：主页 WPM 趋势、考试 WPM 曲线、班级 WPM 分布 |
| 渲染方式 | Canvas（气球游戏）+ DOM（其他所有页面） |
| 动画 | CSS Keyframes（光标闪烁、Combo 弹窗、粒子火花） |
| 协议兼容 | 纯 script 标签加载，无需 HTTP 服务器，支持 `file://` 直接打开 |
| 总文件数 | 17 个（1 HTML + 1 CSS + 12 JS + 4 数据文件） |
