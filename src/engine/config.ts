/** 待真实试测校准的启发式规则。所有阈值都不是统计置信度。 */
export const CONFIG = {
  scoringVersion: "heuristic-1.0.0",
  schema: 1,
  maxCoreQuestions: 40,
  minCrossChecksPerDimension: 2,
  eventWeightCap: 1.4,
  minEvents: 3,
  minStrength: 2.2,
  uncertainMargin: 0.22,
  tieEpsilon: 0.015,
  conflictMinorityShare: 0.28,
  minConflictSide: 1,
} as const;
export const CORE_DIMENSIONS = ["EI", "SN", "TF", "JP"] as const;
export const DIMENSION_LABELS = {
  EI: {
    left: "E · 互动取能",
    right: "I · 独处取能",
    name: "精力与注意力",
    description: "观察互动与独处怎样帮助你恢复、整理思路；不衡量社交能力。",
  },
  SN: {
    left: "S · 具体信息",
    right: "N · 联系与可能",
    name: "信息与理解",
    description:
      "观察你从具体经验还是整体联系开始理解；不衡量想象力或学习能力。",
  },
  TF: {
    left: "T · 一致原则",
    right: "F · 价值与影响",
    name: "判断与取舍",
    description: "观察取舍时先考虑的依据；两边都可以理性，也都可以关心他人。",
  },
  JP: {
    left: "J · 形成安排",
    right: "P · 保留开放",
    name: "安排与变化",
    description:
      "观察在没有外部要求时，你怎样处理计划与未定的选项；不衡量整洁或执行力。",
  },
  AT: {
    left: "A · 较易恢复安定",
    right: "T · 较多自我检视",
    name: "压力后的自我体验",
    description:
      "原创扩展：回顾反馈、失误与比较后的自我体验，不是心理健康筛查。",
  },
};
