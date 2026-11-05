import { useState } from "react";
import { Icon } from "./Icons";
import { Character } from "./Character";
export function Intro({
  onBegin,
  onBack,
}: {
  onBegin: (extension: boolean) => void;
  onBack: () => void;
}) {
  const [extension, setExtension] = useState(false);
  return (
    <main id="main" className="intro-page page-enter">
      <button className="text-button" onClick={onBack}>
        <Icon name="back" size={17} /> 回到小镇
      </button>
      <div className="intro-heading">
        <Character type="ISFJ" size={94} />
        <div className="eyebrow">BEFORE WE WANDER</div>
        <h1 tabIndex={-1}>出发前，和自己约定几件小事</h1>
        <p>放下“应该怎样”，想想你长期、自然的倾向。</p>
      </div>
      <div className="intro-paper">
        <div className="welcome-message">
          <span className="npc-sprite" aria-hidden="true" />
          <p>
            “你好呀，我是阿栗。小镇的居民会向你聊起一些日常。
            <br />
            不用表现得更好，只要尽可能诚实地回应。”
          </p>
        </div>
        <div className="intro-rules">
          <article>
            <span>01</span>
            <div>
              <h3>想想平常的自己</h3>
              <p>
                尽量排除工作要求、近期疲劳或经济限制。如果现实做法和自然偏好不同，可以在备注中记下。
              </p>
            </div>
          </article>
          <article>
            <span>02</span>
            <div>
              <h3>不确定，也是可以的</h3>
              <p>
                没有类似经历、取决于情境、暂时不确定都能选。这些回答不会被强行计入某一端。
              </p>
            </div>
          </article>
          <article>
            <span>03</span>
            <div>
              <h3>路线会随着你的回答展开</h3>
              <p>
                先完成 24 道基础情境，再进行适用的追问与跨场景验证。核心约 32–40
                题；预计 12–25 分钟，尚未经实际计时验证，按你的节奏即可。
              </p>
            </div>
          </article>
        </div>
        <label className={`extension-choice ${extension ? "enabled" : ""}`}>
          <input
            type="checkbox"
            checked={extension}
            onChange={(e) => setExtension(e.target.checked)}
          />
          <div>
            <b>
              多走一段：开启 A／T 扩展 <span>可选 · 另 8 题</span>
            </b>
            <p>
              探索失误、反馈和压力后的自我体验。A／T 来自另一套体系，不属于官方
              MBTI 四维结构；本工具的原创扩展与 16Personalities
              测试不等效，不改变四字母结果。
            </p>
          </div>
        </label>
        <div className="intro-privacy">
          <Icon name="leaf" size={17} />
          <span>
            回答仅保存在当前浏览器，可随时暂停。可选文字备注不参与自动计分；本版没有
            AI 语义分析。
          </span>
        </div>
        <button
          className="button primary wide"
          onClick={() => onBegin(extension)}
        >
          准备好了，走进小镇 <Icon name="arrow" />
        </button>
      </div>
    </main>
  );
}
