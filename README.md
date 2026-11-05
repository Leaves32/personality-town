# 人格小镇 · Personality Town

一个可以完整运行的中文性格探索网站。React + TypeScript + Vite；原创程序化像素小镇；本地自适应规则引擎。无登录、数据库、付费 API 或外部 AI 服务。安装依赖之后，核心体验不请求外部资源。

**定位：原创、尚未经测量验证的探索工具。不是官方 MBTI 测评、专业诊断，也不声称科学精准。** 合成答案测试仅证明程序行为，不证明心理测量有效性。

## 安装与运行

需要 Node.js 20.19+ 或 22.12+（本次使用 22.13.0），以及 npm。

```bash
npm ci
npm run dev
```

打开终端显示的地址，默认是 **http://127.0.0.1:5173/**。端口被占用时 Vite 会选择下一个端口。请通过开发服务器访问，不直接双击 `index.html`。

```bash
npm run build       # TypeScript 严格检查 + 生产构建，输出 dist/
npm run preview     # 预览生产构建，默认 http://127.0.0.1:4173/
npm run check       # TypeScript + ESLint + Prettier 检查 + Vitest
npm run lint        # ESLint（含 React Hooks 规则）
npm run format      # 用 Prettier 格式化全部源码
npm run format:check # 只检查格式，不改文件
npm test            # 单次运行引擎测试
npm run test:watch   # 引擎测试监听
```

ESLint 配置在 `eslint.config.js`（TypeScript、React Hooks、React Refresh，并用 `eslint-config-prettier` 关闭格式类规则）；Prettier 使用默认风格。提交前运行 `npm run check`。`package.json` 中的 `overrides.minimatch` 用于修复 ESLint 依赖链上的已知审计问题，升级 ESLint 后可复查是否仍需要。

首次运行浏览器测试需要下载测试浏览器：

```bash
npx playwright install chromium
npm run test:e2e
```

Playwright 自动启动 `127.0.0.1:5173` 上的开发服务；本地已有该服务时复用。测试会在隔离的浏览器上下文中写入合成回答，不修改你的日常浏览器存档。查看报告：`npx playwright show-report`。失败时保留截图和 trace；首页、报告、320px 答题页截图写入 `test-results/`。

## 第一版已完成

- 首页 → 介绍 → 逐题情境 → 动态追问 → 完整报告；继续已有旅程、暂停、刷新恢复、上一题改答、报告内回看和修改。
- 页面记录在 URL hash（`#/intro`、`#/quiz`、`#/report`，首页无 hash）：刷新停留在当前页，浏览器前进/后退可用。地址只表示想去的页面，实际页面仍按存档校正：无存档回首页；已完成的答题页显示报告；未完成的报告页回到当前题；已有回答时须经“重新探索”确认才能进入介绍页。开始旅程会替换介绍页的历史记录，后退直接回首页。
- 24 道基础情境（每维 6 道）、24 道有实际路径可达的追问/跨场景验证、8 道独立 A／T 扩展。均为原创中文。核心通常 32–40 题，开启扩展另加 8 题。
- 临时拒绝邀约不直接判断内向；动机追问区分精力恢复、疲劳或限制、临时改计划、活动兴趣。其他生活场景继续验证。
- 16 种类型均可达，并有完整的原创角色介绍、日常提示、相处提示及小实验。角色不是职业建议或能力等级。
- 报告展示四维位置、实际选择与解释、候选差异、跨场景矛盾和证据不足。完全平分或独立证据不足时保留 `?`，不强制生成完整类型。
- A／T 作为独立章节，不改变四维路线和四字母结果。未开启或证据不足不强行定向。原创扩展不与 16Personalities 测试等效。
- 原创 SVG 像素场景：树叶、云、蒸汽、水面、灯光、居民待机与眨眼；四处地点的背景取景随情境切换。四帧 SVG 精灵配合 CSS steps 动画。无 PixiJS 或额外动画框架。
- 桌面及手机响应式，支持减少动态效果、系统减少动态偏好、关闭/跳过打字效果；无音效。原生单选框支持方向键和空格，按钮支持 Enter，弹窗支持 Esc。
- 版本化 localStorage 存档。损坏或版本不符时安全提示，原始数据不自动覆盖，可先下载备份。正式开始新旅程才替换旧记录；有回答时重新测试需确认。
- 文字备注仅供回看，不参与自动计分；代码预留 `FollowUpAdvisor` 类型接口，未假装调用 AI。

介绍页的 12–25 分钟只是未经实际计时验证的预计阅读范围，不是承诺。自适应阶段显示已答题数和题数上限，没有固定完成百分比。

## 代码结构

```text
src/
  App.tsx                  hash 页面路由与校正、存档协调、确认弹窗
  components/
    Home.tsx Intro.tsx      首页与说明
    Quiz.tsx               单题作答、回看、打字效果与键盘交互
    Report.tsx             证据报告、候选、扩展、旅程导出
    TownScene.tsx          原创程序化像素场景
    Character.tsx          共用角色基础 + 16 种配色/配饰
    Modal.tsx Icons.tsx    原生 dialog、内联图标
  data/
    questions.ts           基础题、追问、独立扩展、场景信息
    reports.ts             全部 16 种原创角色报告
  engine/
    types.ts               结构化题目、回答、结果模型
    config.ts              可调整的启发式规则及版本
    validate.ts            题库、引用、触发与循环校验
    engine.ts              计分、证据、选题、冲突、改答重放、报告
    storage.ts             存档格式及版本校验、存储失败降级
    engine.test.ts         Vitest 引擎/题库/存档测试
  styles.css               像素边框、布局、动画、窄屏与打印样式
public/
  npc-sprite.svg           原创四帧 NPC 精灵图
  favicon.svg              原创图标
tests/e2e/journey.spec.ts   Playwright 桌面/手机完整流程
```

## 自适应与计分规则

所有规则均为**待校准的启发式**，不代表统计置信度。

1. 先完成全部基础题；四维均衡出现，不在答题界面显示测量目标。
2. 基于触发选项筛选动机追问；根据接近程度、矛盾和已有验证数量排序。每维至少保留两次跨场景验证机会，强方向也不会直接跳到报告。
3. 选项分数在 `[-1, 1]`。正方向分别为 **E、S、T、J、A**，负方向为 I、N、F、P、T。正分并不表示更好。
4. 证据取 `score × weight`；按 `eventId` 归组。单事件所有回答的绝对权重总量超过 1.4 时等比例缩小，不能把一个事件当作多个独立事件。
5. 维度值为 `(正向证据 - 负向证据) / 总绝对证据`。有效独立事件少于 3 或权重总量小于 2.2，标记证据不足；绝对值低于 0.22，标记方向接近。绝对值小于 0.015 时不确定字母。
6. 两侧均有足够证据且少数方向占比达到阈值时标记冲突；展示具体回答，不自动断言差异的心理原因。
7. 没有适用的追问时结束核心；核心最多 40 题。若达到上限，报告明确保留尚未解决的不确定性。A／T 在核心结束后单独进行。
8. 改答时，从改动处按新条件重放之后的记录；保留仍适用的回答，移除不再适用的分支和后续记录，全部分数重新计算。尚需补充的题会再次进入当前路线。
9. 候选按四维端点与已有倾向的距离排序。未形成证据的维度不参与距离。候选不是概率；全无证据时不提供候选。

## 添加情境题或调整分支

修改 `src/data/questions.ts`。`Spec` 元组为：

```ts
[
  id,
  dimension,
  scene,
  context,
  text,
  leftOption,
  rightOption,
  leftExplanation,
  rightExplanation,
];
```

也可直接添加符合 `Question` 的完整对象。每道题必须有唯一 `id`、题型、场景、目标、计分理由、选项解释、权重、`eventId` 和交叉关系。所有题保留 `depends`、`no-experience`、`unsure` 三个零分选项；不是所有普通选项都必须计分，例如疲劳和兴趣原因也可为零。

分支示例：

```ts
{
  // ...完整的 Question 字段
  kind: 'branch',
  purpose: 'motivation', // 或 crosscheck
  trigger: { questionId: 'b01', optionIds: ['b', 'depends', 'unsure'] },
  crossChecks: ['b01', 'b05'],
  eventId: 'b01',        // 同一事件的追问共享 ID
}
```

新生活场景的交叉验证使用新的 `eventId`。不要用一个事件拆出许多独立证据。避免把工作要求、疲劳、经济限制直接当作自然偏好。

当前示例用基础题与分支题数组的对应索引建立父题关系；新增时同步检查对应关系，复杂关系请使用显式 `trigger`。每维至少 6 道基础题并覆盖多个场景。题库在应用启动及 Vitest 中校验，未知引用、重复 ID、非法选项或循环会阻止测试运行。

规则修改在 `src/engine/config.ts`。修改最大题数时同步更新介绍页时间/题数文案，且上限应容纳完整基础覆盖与必要验证。修改题库需提升 `BANK_VERSION`；修改计分需提升 `scoringVersion`；不兼容的旧存档会安全提示，不直接混算。

修改后运行 `npm run check`、`npm run build` 及受影响的 Playwright 流程。测试用合成答案不替代真实用户试测。

## 修改角色与场景

- 在 `src/data/characters.ts` 修改 16 位居民的独立发型、服装、配色、随身物件、叙事关键词、对白和小镇日常；在 `src/data/reports.ts` 修改探索报告。外观设定不参与计分。
- `src/components/Character.tsx` 使用 48×48 整数网格，`Hair`、`Outfit`、`Props` 分别绘制发型、服装轮廓及 16 套独立道具。小动作写在 `src/characters.css`，使用 CSS steps 动画；保持 `shapeRendering="crispEdges"`。`ResidentGallery.tsx` 显示放大的居民、物件说明和对白。
- `src/components/TownScene.tsx` 中的树、建筑、河流、桥和小居民为程序化原创 SVG；场景取景在 `.scene-*` 样式中设置。
- `public/npc-sprite.svg` 有四个横向 16×16 帧；`.npc-sprite` 放大至 48×48，以 `steps(4)` 切换。改帧数或尺寸时同步修改 CSS 背景大小、位移和 steps 数量。
- 动画必须同时接受 `prefers-reduced-motion` 和 `.reduce-motion` 控制，不根据回答播放好坏反馈。

## 数据与隐私边界

存档键是 `personality-town:journey`；设置键是 `town:typing`、`town:reduced-motion`。回答保存在当前浏览器、当前网站源中，不上传。隐私窗口、浏览器清理或禁用存储会影响恢复；不可写入时仍可在内存中继续，并显示提示。

“下载探索记录”导出 JSON（回答、备注、版本、证据报告）。原始备份用于避免损坏或不兼容记录被误删，第一版不提供自动导入/迁移。用户选择恢复新旅程前，旧数据仍保留。

未来 AI 如接入，只能在审核过的题库中辅助选择；需要显式实现接口与隐私告知，不能让不受审查的文本生成计分规则。当前接口只有类型定义，运行时完全采用本地规则。

## 已执行的检查

详见 [VALIDATION.md](./VALIDATION.md)。当前引擎测试 39 项、桌面/手机 Playwright 共 18 项全部通过；生产构建通过，`npm audit` 为 0 项漏洞。浏览器测试覆盖 Chromium 与模拟手机视口，没有验证真实移动设备、Safari 或 Firefox，也未执行心理测量验证或完整无障碍审计。

开发依据参考 [Vite 官方指南](https://vite.dev/guide/)、[Vitest 官方指南](https://vitest.dev/guide/) 与 [Playwright Web server 文档](https://playwright.dev/docs/test-webserver)。
