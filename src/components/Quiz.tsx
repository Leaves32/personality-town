import { useEffect, useRef, useState } from "react";
import { QUESTIONS, QUESTION_MAP, SCENE_NAMES } from "../data/questions";
import { nextQuestion } from "../engine/engine";
import { CONFIG } from "../engine/config";
import type { Answer, Question, Session } from "../engine/types";
import { TownScene } from "./TownScene";
import { Character } from "./Character";
import { Icon } from "./Icons";
function Dialogue({
  question,
  typing,
}: {
  question: Question;
  typing: boolean;
}) {
  // 每道题都会通过 key 重新挂载，因此逐字进度只需从 0 开始累加。
  const full = question.text.length;
  const [revealed, setRevealed] = useState(0);
  const length = typing ? Math.min(revealed, full) : full;
  const done = length >= full;
  useEffect(() => {
    if (done) return;
    const timer = window.setInterval(() => setRevealed((n) => n + 2), 24);
    return () => window.clearInterval(timer);
  }, [done]);
  return (
    <div className="dialogue">
      <div className="npc-name">
        <span className="live-dot" />
        {question.npc}
      </div>
      <h2 id="question-title" aria-label={question.text}>
        <span aria-hidden="true">{question.text.slice(0, length)}</span>
        <span className="sr-only">{question.text}</span>
      </h2>
      {length < question.text.length && (
        <button
          type="button"
          className="skip-typing"
          onClick={() => setRevealed(full)}
        >
          显示全文
        </button>
      )}
    </div>
  );
}
export function Quiz({
  session,
  editIndex,
  onEdit,
  onAnswer,
  onPause,
  reducedMotion,
  typing,
}: {
  session: Session;
  editIndex: number | null;
  onEdit: (index: number | null) => void;
  onAnswer: (a: Answer) => void;
  onPause: () => void;
  reducedMotion: boolean;
  typing: boolean;
}) {
  const question =
    editIndex === null
      ? nextQuestion(session)
      : QUESTION_MAP.get(session.answers[editIndex]?.questionId);
  if (!question) return null;
  return (
    <QuizQuestion
      key={`${question.id}-${editIndex}`}
      question={question}
      session={session}
      editIndex={editIndex}
      onEdit={onEdit}
      onAnswer={onAnswer}
      onPause={onPause}
      reducedMotion={reducedMotion}
      typing={typing}
    />
  );
}
function QuizQuestion({
  question,
  session,
  editIndex,
  onEdit,
  onAnswer,
  onPause,
  reducedMotion,
  typing,
}: {
  question: Question;
  session: Session;
  editIndex: number | null;
  onEdit: (index: number | null) => void;
  onAnswer: (a: Answer) => void;
  onPause: () => void;
  reducedMotion: boolean;
  typing: boolean;
}) {
  const previous = session.answers.find((a) => a.questionId === question.id);
  const [selected, setSelected] = useState(previous?.optionId ?? "");
  const [note, setNote] = useState(previous?.note ?? "");
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, []);
  const baseCount = session.answers.filter(
    (a) => QUESTION_MAP.get(a.questionId)?.kind === "base",
  ).length;
  const followCount = session.answers.filter(
    (a) => QUESTION_MAP.get(a.questionId)?.kind === "branch",
  ).length;
  const extCount = session.answers.filter(
    (a) => QUESTION_MAP.get(a.questionId)?.kind === "extension",
  ).length;
  const phase =
    question.kind === "base"
      ? "基础走访"
      : question.kind === "branch"
        ? "深入聊聊"
        : "独立扩展";
  return (
    <main id="main" className="quiz-page page-enter">
      <div className="quiz-topline">
        <div>
          <span className="eyebrow">YOUR TOWN JOURNEY</span>
          <h1 ref={heading} tabIndex={-1}>
            {editIndex !== null ? "回看一个生活片段" : phase}
          </h1>
        </div>
        <button className="text-button" onClick={onPause}>
          <Icon name="pause" size={17} /> 暂停并保存
        </button>
      </div>
      <div className="quiz-layout">
        <aside className="scene-panel">
          <TownScene scene={question.scene} compact />
          <div className="scene-resident">
            <Character
              type={
                {
                  cafe: "ISFJ",
                  studio: "ISTP",
                  station: "ENFP",
                  cabin: "INFJ",
                }[question.scene]
              }
              size={136}
            />
            <div className="scene-resident-name">
              {SCENE_NAMES[question.scene]}
            </div>
            <p>“我们慢慢聊，不用急着决定。”</p>
          </div>
          <div className="journey-log">
            <span>这段旅程</span>
            <b>已留下 {session.answers.length} 个回答</b>
            <div className="journey-stages">
              {[
                "基础走访",
                "深入聊聊",
                ...(session.extension ? ["独立扩展"] : []),
              ].map((s, i) => (
                <span key={s} className={s === phase ? "active" : ""}>
                  <i />
                  {s}
                  {i === 0 && baseCount === 24 && " ✓"}
                </span>
              ))}
            </div>
            <p>
              {question.kind === "base"
                ? `基础覆盖：${baseCount} / ${QUESTIONS.filter((q) => q.kind === "base").length}`
                : question.kind === "branch"
                  ? `已完成 ${followCount} 道适应性追问；核心最多 ${CONFIG.maxCoreQuestions} 题`
                  : `扩展已完成 ${extCount} / ${QUESTIONS.filter((q) => q.kind === "extension").length}`}
            </p>
          </div>
        </aside>
        <section className="question-paper" aria-labelledby="question-title">
          <div className="question-context">
            <span>生活片段 / {question.context}</span>
            <span>
              {editIndex !== null
                ? `修改第 ${editIndex + 1} 个回答`
                : "跟随你的自然倾向"}
            </span>
          </div>
          <Dialogue question={question} typing={typing && !reducedMotion} />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (selected)
                onAnswer({
                  questionId: question.id,
                  optionId: selected,
                  ...(note.trim() ? { note: note.trim() } : {}),
                });
            }}
          >
            <fieldset className="answers">
              <legend className="sr-only">选择最接近你的回答</legend>
              <div className="main-options">
                {question.options
                  .filter(
                    (o) =>
                      !["depends", "no-experience", "unsure"].includes(o.id),
                  )
                  .map((o, i) => (
                    <label
                      key={o.id}
                      className={`answer-option ${selected === o.id ? "selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name="answer"
                        value={o.id}
                        checked={selected === o.id}
                        onChange={() => setSelected(o.id)}
                      />
                      <span className="option-letter">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span>{o.text}</span>
                      <span className="radio-mark">
                        {selected === o.id && <Icon name="check" size={12} />}
                      </span>
                    </label>
                  ))}
              </div>
              <p className="neutral-prompt">也可以如实保留判断</p>
              <div className="neutral-options">
                {question.options
                  .filter((o) =>
                    ["depends", "no-experience", "unsure"].includes(o.id),
                  )
                  .map((o) => (
                    <label
                      key={o.id}
                      className={selected === o.id ? "selected" : ""}
                    >
                      <input
                        type="radio"
                        name="answer"
                        value={o.id}
                        checked={selected === o.id}
                        onChange={() => setSelected(o.id)}
                      />
                      {o.text}
                    </label>
                  ))}
              </div>
            </fieldset>
            <details className="note-input" open={note ? true : undefined}>
              <summary>
                ＋ 给这个回答留一句备注 <span>可选，不参与计分</span>
              </summary>
              <label className="sr-only" htmlFor="answer-note">
                回答备注
              </label>
              <textarea
                id="answer-note"
                value={note}
                maxLength={600}
                onChange={(e) => setNote(e.target.value)}
                placeholder="例如：最近加班很多，所以实际做法和偏好不太一样。"
                rows={3}
              />
              <small>
                仅供你回看；本版不使用 AI 理解文字。{note.length}/600
              </small>
            </details>
            <div className="question-actions">
              <button
                type="button"
                className="text-button"
                disabled={
                  editIndex === 0 ||
                  (!session.answers.length && editIndex === null)
                }
                onClick={() =>
                  onEdit(
                    editIndex === null
                      ? session.answers.length - 1
                      : Math.max(0, editIndex - 1),
                  )
                }
              >
                <Icon name="back" size={17} /> 上一题
              </button>
              <button
                className="button primary"
                type="submit"
                disabled={!selected}
              >
                {editIndex !== null ? "保存修改并继续" : "收好这个回答"}
                <Icon name="arrow" size={18} />
              </button>
            </div>
            {editIndex !== null && (
              <button
                type="button"
                className="text-button cancel-edit"
                onClick={() => onEdit(null)}
              >
                不修改，回到旅程
              </button>
            )}
          </form>
        </section>
      </div>
      <p className="quiz-reassurance">
        <Icon name="leaf" size={15} />{" "}
        不需要回答得一致。不同场景下的你，都值得被理解。
      </p>
    </main>
  );
}
