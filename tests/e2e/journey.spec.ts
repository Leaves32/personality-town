import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
const key = "personality-town:journey";
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("town:typing", "false");
    localStorage.setItem("town:reduced-motion", "true");
  });
});
async function start(page: Page, extension = false) {
  await page.goto("/");
  await page.getByRole("button", { name: "开始探索", exact: true }).click();
  if (extension) await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "准备好了，走进小镇" }).click();
  await expect(page.locator(".question-context")).toContainText("临时的邀约");
}
async function answer(page: Page, which = 1) {
  const context = await page.locator(".question-context").innerText();
  await page.locator(".answer-option").nth(which).click();
  await page.getByRole("button", { name: "收好这个回答" }).click();
  await expect
    .poll(async () =>
      (await page.locator(".question-context").count())
        ? (await page.locator(".question-context").innerText()) !== context
        : (await page.locator(".report-heading").count()) > 0,
    )
    .toBe(true);
}
async function finish(page: Page, which = 1) {
  let count = 0;
  while (await page.locator(".question-context").count()) {
    if (count++ > 48) throw new Error("UI 流程未正常结束");
    await answer(page, which);
  }
  await expect(page.locator(".report-heading")).toBeVisible();
  return count;
}
async function noOverflow(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
}
test("首页 → 介绍 → 自适应旅程 → 含扩展报告，刷新恢复，重新测试需确认", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await start(page, true);
  await noOverflow(page);
  const count = await finish(page);
  expect(count).toBeGreaterThanOrEqual(40);
  expect(count).toBeLessThanOrEqual(48);
  await expect(page.locator(".type-code")).toHaveText("INFP");
  await expect(page.locator(".extension-result")).toContainText("本次偏向 T");
  await expect(page.locator(".evidence-quotes")).toHaveCount(5);
  await noOverflow(page);
  await page.screenshot({
    path: `test-results/report-${test.info().project.name}.png`,
    fullPage: true,
  });
  const saved = await page.evaluate((k) => localStorage.getItem(k), key);
  await page.reload();
  await expect(page).toHaveURL(/#\/report$/);
  await expect(page.locator(".type-code")).toHaveText("INFP");
  await page.getByRole("button", { name: "重新探索", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "保留当前旅程" }).click();
  expect(await page.evaluate((k) => localStorage.getItem(k), key)).toBe(saved);
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "下载探索记录" }).click();
  expect((await download).suggestedFilename()).toContain("探索记录");
  expect(errors).toEqual([]);
});
test("上一题改答、备注、暂停和刷新均保留正确进度", async ({ page }) => {
  await start(page);
  await page.getByText("给这个回答留一句备注", { exact: false }).click();
  await page
    .getByRole("textbox", { name: "回答备注" })
    .fill("最近加班，这句话不自动计分");
  await answer(page, 1);
  await answer(page, 0);
  await page.getByRole("button", { name: "上一题" }).click();
  await expect(page.locator(".question-context")).toContainText(
    "第一次接触陶艺",
  );
  await page.getByRole("button", { name: "上一题" }).click();
  await expect(page.locator(".question-context")).toContainText("临时的邀约");
  await expect(page.getByRole("textbox", { name: "回答备注" })).toHaveValue(
    "最近加班，这句话不自动计分",
  );
  await page.locator(".answer-option").nth(0).click();
  await page.getByRole("button", { name: "保存修改并继续" }).click();
  await expect(page.locator(".question-context")).toContainText(
    "共享工具的规则",
  );
  await page.getByRole("button", { name: "暂停并保存" }).click();
  await expect(
    page.getByRole("button", { name: "继续探索", exact: true }),
  ).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "继续探索", exact: true }).click();
  await expect(page.locator(".question-context")).toContainText(
    "共享工具的规则",
  );
  const stored = await page.evaluate(
    (k) => JSON.parse(localStorage.getItem(k)!),
    key,
  );
  expect(stored.answers).toHaveLength(2);
  expect(stored.answers[0].optionId).toBe("a");
});
test("报告中改动触发回答会移除过期分支并重新生成结果", async ({ page }) => {
  await start(page);
  await finish(page);
  await page
    .getByRole("button", { name: "回看或修改全部回答", exact: false })
    .click();
  await page.locator(".answer-review li").first().getByRole("button").click();
  await page.locator(".answer-option").nth(0).click();
  await page.getByRole("button", { name: "保存修改并继续" }).click();
  const stored = await page.evaluate(
    (k) => JSON.parse(localStorage.getItem(k)!),
    key,
  );
  expect(
    stored.answers.some((a: { questionId: string }) => a.questionId === "f01"),
  ).toBe(false);
  await page.reload();
  await expect(
    page.locator(".question-context, .report-heading"),
  ).toBeVisible();
  if (await page.locator(".question-context").count()) await finish(page);
  await expect(page.locator(".report-heading")).toBeVisible();
});
test("答题中刷新停在当前题，后退回首页，地址无效或无存档时安全回落", async ({
  page,
}) => {
  await start(page);
  await expect(page).toHaveURL(/#\/quiz$/);
  await answer(page, 1);
  await expect(page.locator(".question-context")).toContainText(
    "第一次接触陶艺",
  );
  await page.reload();
  await expect(page).toHaveURL(/#\/quiz$/);
  await expect(page.locator(".question-context")).toContainText(
    "第一次接触陶艺",
  );
  // 开始旅程时介绍页被替换，后退直接回到首页，不会落到可重新开局的介绍页。
  await page.goBack();
  await expect(
    page.getByRole("button", { name: "继续探索", exact: true }),
  ).toBeVisible();
  await page.goForward();
  await expect(page.locator(".question-context")).toContainText(
    "第一次接触陶艺",
  );
  // 已有回答时手输介绍页地址，不会绕过“重新探索”确认。
  await page.goto("/#/intro");
  await expect(
    page.getByRole("button", { name: "继续探索", exact: true }),
  ).toBeVisible();
  // 未完成时访问报告页，回到当前题。
  await page.goto("/#/report");
  await expect(page).toHaveURL(/#\/quiz$/);
  await expect(page.locator(".question-context")).toContainText(
    "第一次接触陶艺",
  );
  // 没有存档时访问答题页，回到首页。
  await page.evaluate((k) => localStorage.removeItem(k), key);
  await page.goto("/#/quiz");
  await page.reload();
  await expect(
    page.getByRole("button", { name: "开始探索", exact: true }),
  ).toBeVisible();
  await expect(page).not.toHaveURL(/#\/quiz/);
});
test("损坏存档提供备份与安全重开，不自动覆盖原始数据", async ({ page }) => {
  await page.goto("/");
  await page.evaluate((k) => localStorage.setItem(k, "{broken-save"), key);
  await page.reload();
  await expect(page.getByRole("alert")).toContainText("存档可能损坏");
  expect(await page.evaluate((k) => localStorage.getItem(k), key)).toBe(
    "{broken-save",
  );
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "下载原始备份" }).click();
  expect((await download).suggestedFilename()).toContain("原始存档备份");
  await page.getByRole("button", { name: "放弃恢复，开始新旅程" }).click();
  await page.getByRole("button", { name: "准备好了，走进小镇" }).click();
  await expect(page.locator(".question-context")).toContainText("临时的邀约");
  await expect(page.getByRole("alert")).toHaveCount(0);
});
test("全不确定达到上限后报告证据不足，未开启扩展不生成标签", async ({
  page,
}) => {
  await start(page);
  for (let i = 0; i < 40; i++) {
    await page.getByText("暂时不确定", { exact: true }).click();
    await page.getByRole("button", { name: "收好这个回答" }).click();
  }
  await expect(page.locator(".type-code")).toHaveText("????");
  await expect(
    page.getByText("已达到核心 40 题上限", { exact: false }),
  ).toBeVisible();
  await expect(page.locator(".extension-off")).toContainText("本次未开启扩展");
  await noOverflow(page);
});
test("基础键盘操作、减少动态效果和居民图鉴可用", async ({ page }) => {
  await page.goto("/");
  await noOverflow(page);
  await page.screenshot({
    path: `test-results/home-${test.info().project.name}.png`,
    fullPage: true,
  });
  const startButton = page.getByRole("button", {
    name: "开始探索",
    exact: true,
  });
  await startButton.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("出发前");
  await page.getByRole("button", { name: "准备好了，走进小镇" }).focus();
  await page.keyboard.press("Enter");
  const first = page.locator("input[type=radio]").first();
  await first.focus();
  await page.keyboard.press("Space");
  await expect(first).toBeChecked();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("input[type=radio][value=b]")).toBeChecked();
  await page.getByRole("button", { name: "收好这个回答" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".question-context")).toContainText(
    "第一次接触陶艺",
  );
  await page.getByRole("button", { name: "体验设置" }).click();
  await expect(
    page.getByRole("checkbox", { name: "减少动态效果", exact: false }),
  ).toBeChecked();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "小镇居民", exact: true }).click();
  await expect(page.locator(".residents-gallery button")).toHaveCount(16);
  await page
    .getByRole("button", { name: "ENTJ 远景建造者", exact: false })
    .click();
  await expect(page.locator(".resident-detail")).toContainText("ENTJ");
  await noOverflow(page);
});

test("320 像素窄屏、环境动画与本地运行边界", async ({ page }) => {
  const externalRequests: string[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.protocol.startsWith("http") && url.hostname !== "127.0.0.1")
      externalRequests.push(url.href);
  });
  await page.setViewportSize({ width: 320, height: 760 });
  await page.goto("/");
  await noOverflow(page);
  await page.getByRole("button", { name: "体验设置" }).click();
  await page
    .getByRole("checkbox", { name: "减少动态效果", exact: false })
    .uncheck();
  await page.keyboard.press("Escape");
  expect(
    await page
      .locator(".tree-crown")
      .first()
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("sway");
  expect(
    await page
      .locator(".steam")
      .first()
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("steam");
  await page.getByRole("button", { name: "体验设置" }).click();
  await page
    .getByRole("checkbox", { name: "减少动态效果", exact: false })
    .check();
  await page.keyboard.press("Escape");
  expect(
    await page
      .locator(".tree-crown")
      .first()
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  await page.getByRole("button", { name: "开始探索", exact: true }).click();
  await noOverflow(page);
  await page.getByRole("button", { name: "准备好了，走进小镇" }).click();
  await noOverflow(page);
  await page.screenshot({
    path: `test-results/quiz-narrow-${test.info().project.name}.png`,
    fullPage: true,
  });
  expect(externalRequests).toEqual([]);
});

test("浏览器拒绝 localStorage 时，仍可在内存中答题", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    // 此测试只修改测试浏览器的当前页面；刷新后通过 init script 模拟受限存储。
    sessionStorage.setItem("test:denied-storage", "true");
  });
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new DOMException("Blocked", "SecurityError");
      },
    });
  });
  await page.reload();
  await expect(page.getByRole("alert")).toContainText("本地存档");
  await page.getByRole("button", { name: "开始探索", exact: true }).click();
  await page.getByRole("button", { name: "准备好了，走进小镇" }).click();
  await answer(page, 0);
  await expect(page.locator(".question-context")).toContainText(
    "第一次接触陶艺",
  );
  await expect(page.getByRole("alert")).toContainText("无法写入存档");
});
