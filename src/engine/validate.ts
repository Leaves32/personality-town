import type { Question } from "./types";
export function validateBank(bank: Question[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const map = new Map(bank.map((q) => [q.id, q]));
  for (const q of bank) {
    if (!q.id || ids.has(q.id)) errors.push(`重复或空 ID：${q.id}`);
    ids.add(q.id);
    if (!["base", "branch", "extension"].includes(q.kind))
      errors.push(`无效题型：${q.id}`);
    if (!["EI", "SN", "TF", "JP", "AT"].includes(q.dimension))
      errors.push(`无效维度：${q.id}`);
    if (!["cafe", "studio", "station", "cabin"].includes(q.scene))
      errors.push(`无效场景：${q.id}`);
    if ((q.kind === "extension") !== (q.dimension === "AT"))
      errors.push(`扩展维度不独立：${q.id}`);
    if (
      !q.text ||
      !q.target ||
      !q.rationale ||
      !q.eventId ||
      !Number.isFinite(q.weight) ||
      q.weight <= 0
    )
      errors.push(`元数据不完整：${q.id}`);
    const opts = new Set<string>();
    for (const o of q.options) {
      if (
        !o.id ||
        opts.has(o.id) ||
        !o.text ||
        !o.explanation ||
        !Number.isFinite(o.score) ||
        Math.abs(o.score) > 1
      )
        errors.push(`无效选项：${q.id}/${o.id}`);
      if (
        ["depends", "unsure", "no-experience"].includes(o.id) &&
        o.score !== 0
      )
        errors.push(`中立选项有计分：${q.id}`);
      opts.add(o.id);
    }
    if (q.options.length < 2) errors.push(`选项不足：${q.id}`);
    for (const ref of q.crossChecks) {
      if (!map.has(ref)) errors.push(`未知交叉引用：${q.id} → ${ref}`);
      else if (map.get(ref)!.dimension !== q.dimension || ref === q.id)
        errors.push(`无效交叉验证：${q.id}`);
    }
    if (q.kind === "branch" && !q.trigger)
      errors.push(`分支缺少触发条件：${q.id}`);
    if (q.kind !== "branch" && q.trigger)
      errors.push(`非分支包含触发：${q.id}`);
    if (q.trigger) {
      const parent = map.get(q.trigger.questionId);
      if (!parent) errors.push(`未知分支引用：${q.id}`);
      else if (parent.kind === "extension" || parent.dimension !== q.dimension)
        errors.push(`无效分支目标：${q.id}`);
      if (
        !q.trigger.optionIds.length ||
        q.trigger.optionIds.some(
          (id) => !parent?.options.some((o) => o.id === id),
        )
      )
        errors.push(`无效分支选项：${q.id}`);
    }
  }
  const visiting = new Set<string>();
  const done = new Set<string>();
  function visit(id: string) {
    if (visiting.has(id)) {
      errors.push(`分支死循环：${id}`);
      return;
    }
    if (done.has(id)) return;
    visiting.add(id);
    const parent = map.get(id)?.trigger?.questionId;
    if (parent && map.has(parent)) visit(parent);
    visiting.delete(id);
    done.add(id);
  }
  bank.forEach((q) => visit(q.id));
  for (const d of ["EI", "SN", "TF", "JP"]) {
    if (bank.filter((q) => q.kind === "base" && q.dimension === d).length < 6)
      errors.push(`基础覆盖不足：${d}`);
    if (
      new Set(bank.filter((q) => q.dimension === d).map((q) => q.scene)).size <
      3
    )
      errors.push(`场景覆盖不足：${d}`);
  }
  if (bank.filter((q) => q.kind === "branch").length < 24)
    errors.push("追问覆盖不足");
  if (bank.filter((q) => q.kind === "extension").length < 8)
    errors.push("扩展覆盖不足");
  return [...new Set(errors)];
}
