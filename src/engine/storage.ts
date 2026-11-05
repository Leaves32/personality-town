import { BANK_VERSION, QUESTIONS } from "../data/questions";
import { CONFIG } from "./config";
import {
  createSession,
  eligibleBranches,
  nextQuestion,
  recordAnswer,
} from "./engine";
import type { Session } from "./types";
export const STORAGE_KEY = "personality-town:journey";
export type StorageResult =
  | { status: "empty" }
  | { status: "valid"; session: Session }
  | { status: "invalid"; reason: string };
export function parseSession(raw: string | null): StorageResult {
  if (!raw) return { status: "empty" };
  try {
    const x = JSON.parse(raw);
    if (
      !x ||
      x.schema !== CONFIG.schema ||
      x.bankVersion !== BANK_VERSION ||
      x.scoringVersion !== CONFIG.scoringVersion
    )
      return { status: "invalid", reason: "这份存档的版本与当前题库不兼容。" };
    if (
      typeof x.extension !== "boolean" ||
      !Array.isArray(x.answers) ||
      x.answers.length >
        CONFIG.maxCoreQuestions +
          QUESTIONS.filter((q) => q.kind === "extension").length ||
      typeof x.updatedAt !== "string" ||
      Number.isNaN(Date.parse(x.updatedAt))
    )
      throw new Error();
    let session = createSession(x.extension);
    for (const a of x.answers) {
      if (
        !a ||
        typeof a.questionId !== "string" ||
        typeof a.optionId !== "string" ||
        (a.note !== undefined &&
          (typeof a.note !== "string" || a.note.length > 600)) ||
        session.answers.some((b) => b.questionId === a.questionId) ||
        (nextQuestion(session)?.id !== a.questionId &&
          !eligibleBranches(session).some((q) => q.id === a.questionId))
      )
        throw new Error();
      session = recordAnswer(session, {
        questionId: a.questionId,
        optionId: a.optionId,
        ...(a.note ? { note: a.note } : {}),
      });
    }
    return { status: "valid", session: { ...session, updatedAt: x.updatedAt } };
  } catch {
    return {
      status: "invalid",
      reason:
        "这份存档可能损坏，无法安全恢复。原始数据仍保留，可先下载备份再重新开始。",
    };
  }
}
export function loadSession(storage: Pick<Storage, "getItem">): StorageResult {
  try {
    return parseSession(storage.getItem(STORAGE_KEY));
  } catch {
    return {
      status: "invalid",
      reason:
        "浏览器当前不允许读取本地存档。你仍可探索，但刷新后可能无法恢复。",
    };
  }
}
export function saveSession(
  storage: Pick<Storage, "setItem">,
  session: Session,
): boolean {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(session));
    return true;
  } catch {
    return false;
  }
}
