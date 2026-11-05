import { useEffect, useState } from "react";
import { QUESTIONS } from "./data/questions";
import { validateBank } from "./engine/validate";
import { createSession, nextQuestion, recordAnswer } from "./engine/engine";
import { loadSession, saveSession, STORAGE_KEY } from "./engine/storage";
import type { Answer, Session } from "./engine/types";
import { Home } from "./components/Home";
import { Intro } from "./components/Intro";
import { Quiz } from "./components/Quiz";
import { Report } from "./components/Report";
import { Modal } from "./components/Modal";
import { ResidentGallery } from "./components/ResidentGallery";
import { Icon } from "./components/Icons";
const bankErrors = validateBank(QUESTIONS);
type Page = "home" | "intro" | "quiz" | "report";
function readPreference(key: string, fallback: boolean) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : raw === "true";
  } catch {
    return fallback;
  }
}
export default function App() {
  const [initial] = useState(() => {
    try {
      return loadSession(localStorage);
    } catch {
      return {
        status: "invalid" as const,
        reason: "浏览器不允许本地存档，刷新后可能无法恢复。",
      };
    }
  });
  const [session, setSession] = useState<Session | null>(
    initial.status === "valid" ? initial.session : null,
  );
  const [storageIssue, setStorageIssue] = useState(
    initial.status === "invalid" ? initial.reason : "",
  );
  const [page, setPage] = useState<Page>("home");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [modal, setModal] = useState<
    "restart" | "residents" | "settings" | null
  >(null);
  const [reducedMotion, setReducedMotion] = useState(() =>
    readPreference(
      "town:reduced-motion",
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
  );
  const [typing, setTyping] = useState(() =>
    readPreference("town:typing", true),
  );
  const [notice, setNotice] = useState("");
  useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", reducedMotion);
    try {
      localStorage.setItem("town:reduced-motion", String(reducedMotion));
      localStorage.setItem("town:typing", String(typing));
    } catch {
      /* UI preferences remain available in memory. */
    }
  }, [reducedMotion, typing]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    if (page !== "quiz")
      document.querySelector<HTMLElement>("main h1")?.focus();
  }, [page]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 7000);
    return () => clearTimeout(timer);
  }, [notice]);
  function persist(s: Session) {
    setSession(s);
    let saved = false;
    try {
      saved = saveSession(localStorage, s);
    } catch {
      /* Storage access may be blocked. */
    }
    if (!saved)
      setStorageIssue(
        "浏览器无法写入存档。当前旅程仍可完成，建议在报告页下载记录；刷新可能丢失进度。",
      );
  }
  function start() {
    if (session?.answers.length) {
      setModal("restart");
      return;
    }
    setPage("intro");
  }
  function begin(extension: boolean) {
    const s = createSession(extension);
    setStorageIssue("");
    persist(s);
    setEditIndex(null);
    setPage("quiz");
  }
  function answer(a: Answer) {
    if (!session) return;
    const changed = recordAnswer(session, a);
    const removed = session.answers.filter(
      (old) =>
        !changed.answers.some((now) => now.questionId === old.questionId),
    ).length;
    persist(changed);
    setEditIndex(null);
    if (removed)
      setNotice(
        `修改已保存，${removed} 条已不适用的后续回答已移除；路线已重新计算。`,
      );
    else if (editIndex !== null)
      setNotice("修改已保存，所有维度与后续路线已重新计算。");
    if (!nextQuestion(changed)) setPage("report");
  }
  function continueJourney() {
    if (!session) return;
    setEditIndex(null);
    setPage(nextQuestion(session) ? "quiz" : "report");
  }
  function exportRaw() {
    let raw = "";
    try {
      raw = localStorage.getItem(STORAGE_KEY) ?? "";
    } catch {
      /* Empty backup if storage is inaccessible. */
    }
    const url = URL.createObjectURL(
      new Blob([raw], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "人格小镇-原始存档备份.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  if (bankErrors.length)
    return (
      <main className="fatal-error">
        <h1>题库需要修复</h1>
        <p>为避免错误计分，探索已安全暂停。</p>
        <pre>{bankErrors.join("\n")}</pre>
      </main>
    );
  return (
    <>
      <a className="skip-link" href="#main">
        跳到主要内容
      </a>
      <header className="site-header">
        <div className="header-inner">
          <button
            className="brand"
            onClick={() => setPage("home")}
            aria-label="人格小镇首页"
          >
            <span className="brand-mark">
              <Icon name="leaf" size={27} />
            </span>
            <span>
              <b>人格小镇</b>
              <small>PERSONALITY TOWN</small>
            </span>
          </button>
          <nav aria-label="主导航">
            <button
              className={page === "home" ? "active" : ""}
              onClick={() => setPage("home")}
            >
              小镇入口
            </button>
            <button
              onClick={() => {
                setPage("home");
                setTimeout(
                  () =>
                    document.getElementById("guide")?.scrollIntoView({
                      behavior: reducedMotion ? "instant" : "smooth",
                    }),
                  50,
                );
              }}
            >
              旅程指南
            </button>
            <button onClick={() => setModal("residents")}>小镇居民</button>
          </nav>
          <div className="header-right">
            <span className="local-badge">
              <span className="live-dot" /> 在自己的节奏里
            </span>
            <button
              className="icon-button settings-button"
              aria-label="体验设置"
              onClick={() => setModal("settings")}
            >
              <Icon name="spark" size={19} />
            </button>
          </div>
        </div>
      </header>
      {storageIssue && (
        <div className="storage-alert" role="alert">
          <p>{storageIssue}</p>
          <div>
            <button className="text-button" onClick={exportRaw}>
              下载原始备份
            </button>
            {initial.status === "invalid" && !session && (
              <button
                className="text-button"
                onClick={() => {
                  setStorageIssue("");
                  setPage("intro");
                }}
              >
                放弃恢复，开始新旅程
              </button>
            )}
          </div>
        </div>
      )}
      {notice && (
        <div className="toast" role="status">
          {notice}
        </div>
      )}
      {page === "home" && (
        <Home
          session={session}
          onStart={start}
          onContinue={continueJourney}
          onResidents={() => setModal("residents")}
        />
      )}
      {page === "intro" && (
        <Intro onBegin={begin} onBack={() => setPage("home")} />
      )}
      {page === "quiz" && session && (
        <Quiz
          session={session}
          editIndex={editIndex}
          onEdit={(i) => {
            setEditIndex(i);
            if (i === null && !nextQuestion(session)) setPage("report");
          }}
          onAnswer={answer}
          onPause={() => {
            persist(session);
            setPage("home");
            setNotice("旅程已暂停。点击“继续探索”就能从这里出发。");
          }}
          reducedMotion={reducedMotion}
          typing={typing}
        />
      )}
      {page === "report" && session && (
        <Report
          session={session}
          onRestart={start}
          onEdit={(i) => {
            setEditIndex(i);
            setPage("quiz");
          }}
          onHome={() => setPage("home")}
        />
      )}
      <footer className="site-footer">
        <div>
          <span className="footer-flower">✳</span> 人格小镇{" "}
          <span>一个认识自己的小小地方</span>
        </div>
        <p>原创探索工具 · 非官方 MBTI · 非专业诊断</p>
        <span>MADE FOR YOUR OWN PACE</span>
      </footer>
      {modal === "restart" && (
        <Modal title="开启一段新的旅程？" onClose={() => setModal(null)}>
          <p>
            当前旅程的 {session?.answers.length}{" "}
            个回答会在你正式开始新测试时被替换。返回介绍页不会立即删除记录；需要保留时，可先到报告页下载。
          </p>
          <div className="modal-actions">
            <button className="button secondary" onClick={() => setModal(null)}>
              保留当前旅程
            </button>
            <button
              className="button primary"
              onClick={() => {
                setModal(null);
                setPage("intro");
              }}
            >
              确认，重新探索
            </button>
          </div>
        </Modal>
      )}
      {modal === "settings" && (
        <Modal title="按舒服的方式探索" onClose={() => setModal(null)}>
          <label className="setting-row">
            <span>
              <b>减少动态效果</b>
              <small>停用环境动画、页面动效和打字效果。</small>
            </span>
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={(e) => setReducedMotion(e.target.checked)}
            />
          </label>
          <label className="setting-row">
            <span>
              <b>逐字显示对话</b>
              <small>关闭后直接显示全文，也可以在对话中跳过。</small>
            </span>
            <input
              type="checkbox"
              checked={typing}
              onChange={(e) => setTyping(e.target.checked)}
            />
          </label>
          <p className="muted-text">
            本版不播放音效，也不请求网络 AI 服务。偏好保存在本机。
          </p>
        </Modal>
      )}
      {modal === "residents" && (
        <Modal title="小镇居民图鉴" wide onClose={() => setModal(null)}>
          <p className="muted-text">
            16
            种四字母类型都能在这里相遇。角色是原创叙事包装，不代表职业或能力等级。
          </p>
          <ResidentGallery />
        </Modal>
      )}
    </>
  );
}
