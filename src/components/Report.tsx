import { CHARACTER_DESIGNS } from "../data/characters";
import { useMemo, useState } from "react";
import { getReport } from "../engine/engine";
import { CONFIG, DIMENSION_LABELS } from "../engine/config";
import { TYPE_STORIES } from "../data/reports";
import { QUESTION_MAP } from "../data/questions";
import type { DimensionResult, Session } from "../engine/types";
import { Character } from "./Character";
import { Icon } from "./Icons";
function DimensionCard({ result }: { result: DimensionResult }) {
  const labels = DIMENSION_LABELS[result.dimension];
  const left = Math.round((result.value + 1) * 50);
  const negative = result.evidence.find((e) => e.value < 0),
    positive = result.evidence.find((e) => e.value > 0);
  const quotes =
    positive && negative ? [positive, negative] : result.evidence.slice(0, 2);
  return (
    <article className="dimension-card">
      <div className="dimension-card-title">
        <h3>{labels.name}</h3>
        <span className={`status-label ${result.uncertain ? "muted" : ""}`}>
          {!result.sufficient
            ? "证据不足"
            : result.uncertain
              ? "两侧接近"
              : result.value > 0
                ? "偏向左侧"
                : "偏向右侧"}
        </span>
      </div>
      <p>{labels.description}</p>
      <div className="dimension-poles">
        <b>{labels.left}</b>
        <b>{labels.right}</b>
      </div>
      <div className="dimension-track">
        <span className="track-center" />
        {result.sufficient && (
          <span
            className="dimension-marker"
            style={{ left: `${100 - left}%` }}
          />
        )}
      </div>
      <div className="dimension-meta">
        <span>
          {result.eventCount} 个有效事件 · 加权证据 {result.strength.toFixed(1)}
        </span>
        <span>
          {result.sufficient
            ? `倾向位置 ${left} : ${100 - left}`
            : "暂不绘制倾向位置"}
        </span>
      </div>
      {quotes.length > 0 ? (
        <div className="evidence-quotes">
          {quotes.map((e) => (
            <blockquote key={e.questionId}>
              <span>{e.context}</span>
              <q>{e.answer}</q>
              <p>{e.explanation}</p>
            </blockquote>
          ))}
        </div>
      ) : (
        <p className="insufficient-note">
          这部分没有足够的可计分回答。“不确定”和“没有经历”都被保留为缺失证据。
        </p>
      )}
      {result.conflict && (
        <div className="conflict-note">
          <Icon name="spark" size={15} />
          <p>
            不同情境出现了两种方向的线索。请结合上面的具体回答理解差异；我们无法仅凭选项确定差异是否来自环境限制。
          </p>
        </div>
      )}
    </article>
  );
}
export function Report({
  session,
  onRestart,
  onEdit,
  onHome,
}: {
  session: Session;
  onRestart: () => void;
  onEdit: (index: number) => void;
  onHome: () => void;
}) {
  const report = useMemo(() => getReport(session), [session]);
  const [showAnswers, setShowAnswers] = useState(false);
  const story = report.bestType ? TYPE_STORIES[report.bestType] : null;
  const unresolved = report.dimensions.filter((d) => d.uncertain);
  const motivation = session.answers.find((a) => a.questionId === "f01");
  const motiveOption = motivation
    ? QUESTION_MAP.get("f01")?.options.find((o) => o.id === motivation.optionId)
    : null;
  const alternatives = report.candidates
    .filter((c) => c.type !== report.bestType)
    .slice(0, 2);
  function download() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify({ session, report }, null, 2)], {
        type: "application/json",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "人格小镇-探索记录.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <main id="main" className="report-page page-enter">
      <div className="report-top">
        <button className="text-button" onClick={onHome}>
          <Icon name="back" size={16} /> 回到小镇
        </button>
        <span className="quiet-label">
          旅程已保存 · {report.answerCount} 个回答
        </span>
      </div>
      <header className="report-heading">
        <div className="eyebrow">A LETTER FROM PERSONALITY TOWN</div>
        <h1 tabIndex={-1}>这一次，遇见这样的自己。</h1>
        <p>一份有依据，也留有余地的探索记录。</p>
      </header>
      <section className="resident-card">
        <div className="resident-portrait">
          <div className="portrait-sun" />
          <Character type={report.bestType ?? "INFP"} size={184} />
          {report.bestType && (
            <p className="report-character-signature">
              {CHARACTER_DESIGNS[report.bestType].signature}
            </p>
          )}
          <span>PERSONALITY TOWN / RESIDENT</span>
        </div>
        <div className="resident-info">
          <span className="eyebrow">
            {report.bestType ? "本次最匹配 · 探索性类型" : "暂未形成完整类型"}
          </span>
          <div className="type-code">{report.pattern}</div>
          <h2>{story?.name ?? "仍在发现的旅人"}</h2>
          <p>
            {story?.intro ??
              "有些线索还不够清晰，我们不急着替你填满四个字母。你可以回看回答，也可以在更多生活经历之后再来。"}
          </p>
          <span className="resident-stamp">
            {unresolved.length ? "留有待确认的部分" : "一次探索，不是定论"}
          </span>
        </div>
      </section>
      <div className="report-disclaimer">
        <Icon name="leaf" />
        <p>
          四字母为启发式推断，不是诊断或统计置信度；倾向位置是本次回答的加权汇总，不是人格百分比。中立回答不计入任一端，同一事件的累计权重上限为{" "}
          {CONFIG.eventWeightCap}。本题库及规则尚需真实用户试测与测量验证。
        </p>
      </div>
      {story && (
        <section className="profile-notes">
          <article>
            <h3>日常里的你</h3>
            <p>{story.everyday}</p>
          </article>
          <article>
            <h3>与人相处的一点提醒</h3>
            <p>{story.connection}</p>
          </article>
          <article>
            <h3>下次可以试试</h3>
            <p>{story.experiment}</p>
          </article>
          <p className="profile-footnote">
            以上是该叙事角色的阅读提示，需结合下方的实际回答；不代表能力、职业适配或固定结论。
          </p>
        </section>
      )}
      {motiveOption && (
        <section className="motive-summary">
          <h2>行为背后的那一句补充</h2>
          <p>你曾婉拒临时邀约，在进一步追问时选择：</p>
          <blockquote>“{motiveOption.text}”</blockquote>
          <p>{motiveOption.explanation}</p>
          <small>这段说明与原事件共享权重上限，不能当作新的独立事件。</small>
        </section>
      )}
      <section className="report-section">
        <div className="section-title">
          <div>
            <div className="eyebrow">THE CLUES YOU LEFT</div>
            <h2>四个维度，你留下的线索</h2>
          </div>
          <span>依据来自你的实际选择</span>
        </div>
        <div className="dimension-grid">
          {report.dimensions.map((d) => (
            <DimensionCard key={d.dimension} result={d} />
          ))}
        </div>
      </section>
      {alternatives.length > 0 && (
        <section className="report-section alternative-section">
          <h2>也值得看看这些邻近居民</h2>
          <p>
            按四维倾向距离排序，不表示各类型的发生概率。未形成完整类型时，这些仅是比较方向。
          </p>
          <div className="alternative-grid">
            {alternatives.map((c) => (
              <article key={c.type}>
                <Character type={c.type} size={84} />
                <div>
                  <h3>
                    {c.type} · {TYPE_STORIES[c.type].name}
                  </h3>
                  <p>
                    {c.differences.length
                      ? `与当前方向的差别在：${c.differences.map((d) => DIMENSION_LABELS[d as keyof typeof DIMENSION_LABELS].name).join("、")}。可回看这些场景，留意你的自然偏好。`
                      : "已有证据不能把这个候选与其他可能清晰区分。请优先看待确认的维度。"}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
      <section className="uncertainty-box">
        <h2>
          <Icon name="spark" /> 还需要确认的部分
        </h2>
        {unresolved.length ? (
          <p>
            {unresolved
              .map((d) => DIMENSION_LABELS[d.dimension].name)
              .join("、")}
            ：
            {unresolved.some((d) => !d.sufficient)
              ? "部分维度独立事件或有效回答不足；"
              : "两侧线索较接近；"}
            暂时保留不确定性，不强行确定倾向。
          </p>
        ) : (
          <p>
            本次回答形成了相对清楚的方向，但没有经过测量验证，也不能推断你在所有情境中都会如此。
          </p>
        )}
        {report.reachedCap && (
          <p>
            已达到核心 {CONFIG.maxCoreQuestions}{" "}
            题上限，系统停止追问。尚存的矛盾或接近维度会继续保留，不视为已解决。
          </p>
        )}
        <p>
          环境差异只在选项明确表达时作为线索，备注没有被自动理解。同类型的人也会有不同经历，这里不另设“官方细分类型”。
        </p>
      </section>
      <section className="report-section extension-report">
        <div className="eyebrow">AN INDEPENDENT CHAPTER</div>
        <h2>A／T · 独立扩展</h2>
        <p>
          A／T 来自另一套体系，不属于官方 MBTI 四维结构。本原创题组不与
          16Personalities 等效，不改变四字母结果。
        </p>
        {report.extension ? (
          <>
            <div className="extension-result">
              {!report.extension.sufficient || report.extension.uncertain
                ? "暂不确定 A／T"
                : report.extension.value >= 0
                  ? "本次偏向 A · 较易恢复安定"
                  : "本次偏向 T · 较多自我检视"}
              <span>探索性结果，不用于心理健康判断</span>
            </div>
            <DimensionCard result={report.extension} />
          </>
        ) : (
          <div className="extension-off">
            本次未开启扩展，没有生成 A／T 标签或分数。
          </div>
        )}
      </section>
      <section className="answer-review">
        <button
          className="text-button"
          aria-expanded={showAnswers}
          onClick={() => setShowAnswers(!showAnswers)}
        >
          <Icon name="book" />{" "}
          {showAnswers ? "收起旅程记录" : "回看或修改全部回答"} ·{" "}
          {session.answers.length} 条
        </button>
        {showAnswers && (
          <ol>
            {session.answers.map((a, i) => {
              const q = QUESTION_MAP.get(a.questionId)!;
              return (
                <li key={a.questionId}>
                  <div>
                    <span>{q.context}</span>
                    <p>{q.options.find((o) => o.id === a.optionId)?.text}</p>
                    {a.note && (
                      <p className="review-note">备注（未计分）：{a.note}</p>
                    )}
                  </div>
                  <button className="text-button" onClick={() => onEdit(i)}>
                    修改<span className="sr-only">第 {i + 1} 个回答</span>
                  </button>
                </li>
              );
            })}
          </ol>
        )}
      </section>
      <div className="report-actions">
        <button className="button secondary" onClick={download}>
          下载探索记录
        </button>
        <button className="button primary" onClick={onRestart}>
          重新探索 <Icon name="arrow" />
        </button>
      </div>
    </main>
  );
}
