import { describe, expect, it } from "vitest";
import { BASE_QUESTIONS, QUESTIONS, QUESTION_MAP } from "../data/questions";
import { TYPE_CODES, TYPE_STORIES } from "../data/reports";
import { CONFIG, CORE_DIMENSIONS } from "./config";
import {
  createSession,
  eligibleBranches,
  getReport,
  nextQuestion,
  phase,
  recordAnswer,
  summarize,
} from "./engine";
import { loadSession, parseSession, saveSession } from "./storage";
import { validateBank } from "./validate";
import type { Answer, Question, Session } from "./types";
function walk(type = "ESTJ", extension = false, neutral = false): Session {
  let s = createSession(extension);
  const seen = new Set<string>();
  for (let i = 0; i < 60; i++) {
    const q = nextQuestion(s);
    if (!q) return s;
    expect(seen.has(q.id)).toBe(false);
    seen.add(q.id);
    const index = CORE_DIMENSIONS.indexOf(
      q.dimension as (typeof CORE_DIMENSIONS)[number],
    );
    const option = neutral
      ? "unsure"
      : q.dimension === "AT"
        ? "b"
        : q.dimension[0] === type[index]
          ? "a"
          : "b";
    s = recordAnswer(s, { questionId: q.id, optionId: option });
  }
  throw new Error("流程未终止");
}
function bases(answer: (q: Question, i: number) => string): Session {
  let s = createSession();
  BASE_QUESTIONS.forEach((q, i) => {
    s = recordAnswer(s, { questionId: q.id, optionId: answer(q, i) });
  });
  return s;
}
describe("原创结构化题库", () => {
  it("24 基础 + 24 分支 + 8 扩展，覆盖均衡且引用有效", () => {
    expect(validateBank(QUESTIONS)).toEqual([]);
    expect(BASE_QUESTIONS).toHaveLength(24);
    expect(QUESTIONS.filter((q) => q.kind === "branch")).toHaveLength(24);
    expect(QUESTIONS.filter((q) => q.kind === "extension")).toHaveLength(8);
    CORE_DIMENSIONS.forEach((d) =>
      expect(BASE_QUESTIONS.filter((q) => q.dimension === d)).toHaveLength(6),
    );
  });
  it("检测重复 ID、未知交叉引用和未知分支目标", () => {
    const bank = structuredClone(QUESTIONS);
    bank[1].id = bank[0].id;
    bank[3].crossChecks = ["ghost"];
    bank[24].trigger!.questionId = "ghost";
    expect(validateBank(bank).join(" ")).toMatch(/重复/);
    expect(validateBank(bank).join(" ")).toMatch(/未知交叉/);
    expect(validateBank(bank).join(" ")).toMatch(/未知分支/);
  });
  it("检测无效选项、中立计分和分支选项", () => {
    const bank = structuredClone(QUESTIONS);
    bank[0].options[2].score = 1;
    bank[24].trigger!.optionIds = ["ghost"];
    bank[1].options[0].score = Infinity;
    expect(validateBank(bank).join(" ")).toMatch(/中立选项/);
    expect(validateBank(bank).join(" ")).toMatch(/无效分支选项/);
    expect(validateBank(bank).join(" ")).toMatch(/无效选项/);
  });
  it("检测多节点循环，防止追问死循环", () => {
    const bank = structuredClone(QUESTIONS);
    bank[24].trigger!.questionId = "f05";
    bank[28].trigger!.questionId = "f01";
    expect(validateBank(bank).join(" ")).toMatch(/死循环/);
  });
});
describe("自适应路线与证据", () => {
  it("必须先完整均衡覆盖基础题，再追问，并保留各维跨场景验证", () => {
    const s = bases(() => "a");
    expect(s.answers.map((a) => a.questionId)).toEqual(
      BASE_QUESTIONS.map((q) => q.id),
    );
    expect(phase(s)).toBe("branch");
    const complete = walk();
    CORE_DIMENSIONS.forEach((d) =>
      expect(
        complete.answers.filter((a) => {
          const q = QUESTION_MAP.get(a.questionId)!;
          return (
            q.kind === "branch" &&
            q.dimension === d &&
            q.purpose === "crosscheck"
          );
        }).length,
      ).toBeGreaterThanOrEqual(CONFIG.minCrossChecksPerDimension),
    );
    expect(phase(complete)).toBe("complete");
  });
  it("拒绝临时邀约不直接判断内向，原因追问仅在适用时出现", () => {
    const s = bases((q) => (q.id === "b01" ? "b" : "a"));
    expect(summarize([s.answers[0]], "EI").strength).toBe(0);
    expect(nextQuestion(s)?.id).toBe("f01");
    expect(eligibleBranches(bases(() => "a")).some((q) => q.id === "f01")).toBe(
      false,
    );
    const fatigue = recordAnswer(s, { questionId: "f01", optionId: "a" });
    expect(
      summarize(
        fatigue.answers.filter((a) => ["b01", "f01"].includes(a.questionId)),
        "EI",
      ).strength,
    ).toBe(0);
  });
  it("只聚合同一事件的上限权重，重复答案不能重复贡献证据", () => {
    const ans: Answer[] = [
      { questionId: "b01", optionId: "a" },
      { questionId: "f01", optionId: "b" },
      { questionId: "b01", optionId: "a" },
    ];
    const r = summarize(ans, "EI");
    expect(r.strength).toBeCloseTo(1.4);
    expect(r.eventCount).toBe(1);
    expect(r.evidence).toHaveLength(2);
  });
  it.each(["depends", "no-experience", "unsure"])(
    "%s 不强制计入任一端",
    (optionId) => {
      const r = summarize(
        QUESTIONS.map((q) => ({ questionId: q.id, optionId })),
        "EI",
      );
      expect(r.value).toBe(0);
      expect(r.strength).toBe(0);
      expect(r.sufficient).toBe(false);
    },
  );
  it("检测跨场景的方向冲突，并优先继续验证", () => {
    const s = bases((_q, i) => (Math.floor(i / 4) % 2 ? "b" : "a"));
    const r = getReport(s);
    expect(r.dimensions.every((d) => d.conflict)).toBe(true);
    expect(eligibleBranches(s).length).toBeGreaterThan(8);
  });
  it("修改触发答案后重新计算，并移除不适用动机追问", () => {
    let s = bases((q) => (q.id === "b01" ? "b" : "a"));
    s = recordAnswer(s, { questionId: "f01", optionId: "b" });
    expect(s.answers.some((a) => a.questionId === "f01")).toBe(true);
    const changed = recordAnswer(s, { questionId: "b01", optionId: "a" });
    expect(changed.answers.some((a) => a.questionId === "f01")).toBe(false);
    expect(
      changed.answers.filter(
        (a) => QUESTION_MAP.get(a.questionId)!.kind === "base",
      ),
    ).toHaveLength(24);
    expect(summarize(changed.answers, "EI").value).toBe(1);
  });
  it("修改完成旅程仍可恢复，且恢复结果与内存相同", () => {
    const changed = recordAnswer(walk("INFP", true), {
      questionId: "b01",
      optionId: "a",
    });
    const loaded = parseSession(JSON.stringify(changed));
    expect(loaded.status).toBe("valid");
    if (loaded.status === "valid") {
      expect(loaded.session.answers).toEqual(changed.answers);
      expect(getReport(loaded.session)).toEqual(getReport(changed));
    }
  });
  it("达到最大题数后正常结束，保留证据不足", () => {
    const s = walk("ESTJ", false, true);
    expect(s.answers).toHaveLength(40);
    expect(nextQuestion(s)).toBeNull();
    const r = getReport(s);
    expect(r.reachedCap).toBe(true);
    expect(r.bestType).toBeNull();
    expect(r.pattern).toBe("????");
    expect(r.candidates).toEqual([]);
  });
  it("空答案不生成类型，平分不强行确定字母", () => {
    expect(getReport(createSession()).bestType).toBeNull();
    const answers = ["b05", "b09", "b13", "b17"].map((id, i) => ({
      questionId: id,
      optionId: i % 2 ? "a" : "b",
    }));
    const r = summarize(answers, "EI");
    expect(r.value).toBe(0);
    expect(r.sufficient).toBe(true);
    expect(r.uncertain).toBe(true);
  });
  it("未知题目、非法选项和越序回答直接拒绝", () => {
    expect(() =>
      recordAnswer(createSession(), { questionId: "ghost", optionId: "a" }),
    ).toThrow();
    expect(() =>
      recordAnswer(createSession(), { questionId: "b01", optionId: "x" }),
    ).toThrow();
    expect(() =>
      recordAnswer(createSession(), { questionId: "b10", optionId: "a" }),
    ).toThrow();
  });
  it("文字备注不参与计分，也不伪造语义理解", () => {
    const s = walk();
    const changed = recordAnswer(s, {
      ...s.answers[0],
      note: "虽然拒绝但其实我想参加，这句话不应改变分数",
    });
    expect(getReport(s).dimensions).toEqual(getReport(changed).dimensions);
  });
});
describe("分支实际可达性", () => {
  it("24 道追问都能在相应的不确定路径中被选到", () => {
    const reached = new Set<string>();
    for (const target of CORE_DIMENSIONS) {
      let s = bases((q, i) =>
        q.dimension === target ? (Math.floor(i / 4) % 2 ? "a" : "b") : "a",
      );
      for (let i = 0; i < 24; i++) {
        const q = nextQuestion(s);
        if (!q) break;
        if (q.kind === "branch") reached.add(q.id);
        s = recordAnswer(s, {
          questionId: q.id,
          optionId: q.dimension === target ? "unsure" : "a",
        });
      }
    }
    expect([...reached].sort()).toEqual(
      QUESTIONS.filter((q) => q.kind === "branch")
        .map((q) => q.id)
        .sort(),
    );
  });
});
describe("全部类型与独立扩展", () => {
  it.each(TYPE_CODES)("%s 在合成答案中可达且有完整原创内容", (type) => {
    const s = walk(type);
    expect(getReport(s).bestType).toBe(type);
    expect(nextQuestion(s)).toBeNull();
    for (const k of ["intro", "everyday", "connection", "experiment"] as const)
      expect(TYPE_STORIES[type][k].length).toBeGreaterThan(20);
  });
  it("A／T 开关不改变核心路线或四维计分，扩展单独结束", () => {
    const off = walk("ENFP"),
      on = walk("ENFP", true);
    const a = getReport(off),
      b = getReport(on);
    expect(
      on.answers.filter(
        (a) => QUESTION_MAP.get(a.questionId)!.kind === "extension",
      ),
    ).toHaveLength(8);
    expect(a.dimensions).toEqual(b.dimensions);
    expect(a.bestType).toBe(b.bestType);
    expect(a.extension).toBeNull();
    expect(b.extension?.value).toBe(-1);
  });
  it("A／T 证据不足时不强行定向", () => {
    const r = getReport(walk("ESTJ", true, true));
    expect(r.extension?.sufficient).toBe(false);
    expect(r.extension?.value).toBe(0);
  });
});
describe("版本化存档", () => {
  it("序列化与恢复后下一题、分数和备注保持一致", () => {
    let s = createSession(true);
    for (let i = 0; i < 13; i++)
      s = recordAnswer(s, {
        questionId: nextQuestion(s)!.id,
        optionId: "a",
        note: i === 2 ? "我的备注" : undefined,
      });
    const r = parseSession(JSON.stringify(s));
    expect(r.status).toBe("valid");
    if (r.status === "valid") {
      expect(r.session).toEqual(s);
      expect(nextQuestion(r.session)).toEqual(nextQuestion(s));
    }
  });
  it("损坏 JSON、版本不兼容、重复/未知答案和越序存档安全拒绝", () => {
    expect(parseSession("{oops").status).toBe("invalid");
    expect(parseSession(null).status).toBe("empty");
    const s = createSession();
    expect(
      parseSession(JSON.stringify({ ...s, bankVersion: "old" })).status,
    ).toBe("invalid");
    for (const answers of [
      [{ questionId: "ghost", optionId: "a" }],
      [{ questionId: "b02", optionId: "a" }],
      [
        { questionId: "b01", optionId: "a" },
        { questionId: "b01", optionId: "a" },
      ],
    ])
      expect(parseSession(JSON.stringify({ ...s, answers })).status).toBe(
        "invalid",
      );
  });
  it("localStorage 不可用时返回安全状态，不崩溃", () => {
    expect(
      loadSession({
        getItem() {
          throw new Error("denied");
        },
      }).status,
    ).toBe("invalid");
    expect(
      saveSession(
        {
          setItem() {
            throw new Error("quota");
          },
        },
        createSession(),
      ),
    ).toBe(false);
  });
});
