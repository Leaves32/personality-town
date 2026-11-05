import { BANK_VERSION, QUESTIONS, QUESTION_MAP } from "../data/questions";
import { TYPE_CODES } from "../data/reports";
import { CONFIG, CORE_DIMENSIONS } from "./config";
import type {
  Answer,
  Dimension,
  DimensionResult,
  Evidence,
  Question,
  Report,
  Session,
} from "./types";
export function createSession(extension = false): Session {
  return {
    schema: CONFIG.schema,
    bankVersion: BANK_VERSION,
    scoringVersion: CONFIG.scoringVersion,
    extension,
    answers: [],
    updatedAt: new Date().toISOString(),
  };
}
export function summarize(
  answers: Answer[],
  dimension: Dimension,
): DimensionResult {
  const evidence: Evidence[] = [];
  const seen = new Set<string>();
  for (const a of answers) {
    const q = QUESTION_MAP.get(a.questionId);
    const o = q?.options.find((o) => o.id === a.optionId);
    if (!q || !o || q.dimension !== dimension || !o.score || seen.has(q.id))
      continue;
    seen.add(q.id);
    evidence.push({
      questionId: q.id,
      eventId: q.eventId,
      scene: q.scene,
      context: q.context,
      question: q.text,
      answer: o.text,
      explanation: o.explanation,
      value: o.score * q.weight,
    });
  }
  const groups = new Map<string, number>();
  evidence.forEach((e) =>
    groups.set(e.eventId, (groups.get(e.eventId) ?? 0) + Math.abs(e.value)),
  );
  evidence.forEach((e) => {
    const total = groups.get(e.eventId)!;
    if (total > CONFIG.eventWeightCap) e.value *= CONFIG.eventWeightCap / total;
  });
  const positive = evidence.reduce((n, e) => n + Math.max(0, e.value), 0);
  const negative = evidence.reduce((n, e) => n + Math.max(0, -e.value), 0);
  const strength = positive + negative;
  const value = strength ? (positive - negative) / strength : 0;
  const eventCount = groups.size;
  const sufficient =
    eventCount >= CONFIG.minEvents && strength >= CONFIG.minStrength;
  const conflict =
    Math.min(positive, negative) >= CONFIG.minConflictSide &&
    Math.min(positive, negative) / strength >= CONFIG.conflictMinorityShare;
  return {
    dimension,
    value,
    strength,
    eventCount,
    sufficient,
    uncertain: !sufficient || Math.abs(value) < CONFIG.uncertainMargin,
    conflict,
    evidence,
  };
}
function triggered(q: Question, session: Session): boolean {
  if (!q.trigger) return false;
  return session.answers.some(
    (a) =>
      a.questionId === q.trigger!.questionId &&
      q.trigger!.optionIds.includes(a.optionId),
  );
}
export function eligibleBranches(session: Session): Question[] {
  const answered = new Set(session.answers.map((a) => a.questionId));
  const core = session.answers.filter(
    (a) => QUESTION_MAP.get(a.questionId)?.kind !== "extension",
  );
  if (
    core.length >= CONFIG.maxCoreQuestions ||
    QUESTIONS.some((q) => q.kind === "base" && !answered.has(q.id))
  )
    return [];
  const stats = new Map(
    CORE_DIMENSIONS.map((d) => [d, summarize(session.answers, d)]),
  );
  return QUESTIONS.filter((q) => {
    if (q.kind !== "branch" || answered.has(q.id) || !triggered(q, session))
      return false;
    const d = stats.get(q.dimension as (typeof CORE_DIMENSIONS)[number])!;
    const validations = session.answers.filter((a) => {
      const prev = QUESTION_MAP.get(a.questionId);
      return (
        prev?.kind === "branch" &&
        prev.dimension === q.dimension &&
        prev.purpose === "crosscheck"
      );
    }).length;
    return (
      q.purpose === "motivation" ||
      validations < CONFIG.minCrossChecksPerDimension ||
      d.uncertain ||
      d.conflict
    );
  }).sort((a, b) => {
    const priority = (q: Question) => {
      const s = stats.get(q.dimension as (typeof CORE_DIMENSIONS)[number])!;
      const count = session.answers.filter((a) => {
        const p = QUESTION_MAP.get(a.questionId);
        return p?.kind === "branch" && p.dimension === q.dimension;
      }).length;
      return (
        (q.purpose === "motivation" ? 100 : 0) +
        (s.conflict ? 12 : 0) +
        (!s.sufficient ? 10 : 0) +
        (s.uncertain ? 8 : 0) -
        count * 4
      );
    };
    return priority(b) - priority(a) || a.id.localeCompare(b.id);
  });
}
export function nextQuestion(session: Session): Question | null {
  const answered = new Set(session.answers.map((a) => a.questionId));
  const base = QUESTIONS.find((q) => q.kind === "base" && !answered.has(q.id));
  if (base) return base;
  const branch = eligibleBranches(session)[0];
  if (branch) return branch;
  if (session.extension)
    return (
      QUESTIONS.find((q) => q.kind === "extension" && !answered.has(q.id)) ??
      null
    );
  return null;
}
export function phase(
  session: Session,
): "base" | "branch" | "extension" | "complete" {
  return nextQuestion(session)?.kind ?? "complete";
}
export function recordAnswer(session: Session, answer: Answer): Session {
  const q = QUESTION_MAP.get(answer.questionId);
  if (!q || !q.options.some((o) => o.id === answer.optionId))
    throw new Error("未知题目或选项");
  if (answer.note && answer.note.length > 600) throw new Error("备注过长");
  const index = session.answers.findIndex(
    (a) => a.questionId === answer.questionId,
  );
  if (
    index < 0 &&
    nextQuestion(session)?.id !== answer.questionId &&
    !eligibleBranches(session).some((q) => q.id === answer.questionId)
  )
    throw new Error("当前题目不适用");
  const result: Session = {
    ...session,
    answers:
      index < 0
        ? [...session.answers, answer]
        : [...session.answers.slice(0, index), answer],
    updatedAt: new Date().toISOString(),
  };
  // 改答后按新的触发条件和覆盖状态重放。保留仍适用的回答，移除过期分支及其后续。
  if (index >= 0) {
    for (const old of session.answers.slice(index + 1)) {
      if (
        nextQuestion(result)?.id === old.questionId ||
        eligibleBranches(result).some((q) => q.id === old.questionId)
      )
        result.answers.push(old);
    }
  }
  return result;
}
export function getReport(session: Session): Report {
  const dimensions = CORE_DIMENSIONS.map((d) => summarize(session.answers, d));
  const pattern = dimensions
    .map((s, i) =>
      !s.sufficient || Math.abs(s.value) < CONFIG.tieEpsilon
        ? "?"
        : CORE_DIMENSIONS[i][s.value >= 0 ? 0 : 1],
    )
    .join("");
  const candidates = TYPE_CODES.map((type) => ({
    type,
    distance: dimensions.reduce(
      (n, d, i) =>
        n +
        (d.sufficient
          ? Math.abs((CORE_DIMENSIONS[i][0] === type[i] ? 1 : -1) - d.value)
          : 0),
      0,
    ),
    differences: dimensions
      .filter((d, i) => d.sufficient && type[i] !== pattern[i])
      .map((d) => d.dimension),
  })).sort((a, b) => a.distance - b.distance || a.type.localeCompare(b.type));
  return {
    dimensions,
    candidates: dimensions.some((d) => d.sufficient)
      ? candidates.slice(0, 3)
      : [],
    bestType: pattern.includes("?") ? null : pattern,
    pattern,
    extension: session.extension ? summarize(session.answers, "AT") : null,
    reachedCap:
      session.answers.filter(
        (a) => QUESTION_MAP.get(a.questionId)?.kind !== "extension",
      ).length >= CONFIG.maxCoreQuestions,
    answerCount: session.answers.length,
  };
}
/** 预留审核过的追问选择接口。默认本地规则；备注不进入自动计分。 */
export interface FollowUpAdvisor {
  choose(
    approvedQuestions: readonly Question[],
    answers: readonly Answer[],
  ): Promise<string | null>;
}
