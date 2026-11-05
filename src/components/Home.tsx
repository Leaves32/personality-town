import { TownScene } from "./TownScene";
import { Icon } from "./Icons";
import { Character } from "./Character";
import type { Session } from "../engine/types";
export function Home({
  session,
  onStart,
  onContinue,
  onResidents,
}: {
  session: Session | null;
  onStart: () => void;
  onContinue: () => void;
  onResidents: () => void;
}) {
  return (
    <main id="main" className="home page-enter">
      <section className="home-intro">
        <div>
          <div className="eyebrow">
            <span /> A LITTLE JOURNEY TO YOURSELF
          </div>
          <h1 tabIndex={-1}>
            在日常的选择里，
            <br />
            遇见<span className="hand-underline">更真实的自己。</span>
          </h1>
        </div>
        <div className="home-description">
          <p>
            先不用急着给自己一个标签。
            <br />
            来小镇坐坐，从一个生活片段开始，
            <br />
            听听每个选择背后的自己。
          </p>
          <span className="quiet-label">
            <Icon name="leaf" size={15} /> 原创情境 · 自适应追问 · 探索性报告
          </span>
        </div>
      </section>
      <section className="hero-landscape">
        <TownScene />
        <div className="map-corner">
          小镇地图 <Icon name="map" size={15} />
        </div>
      </section>
      <section className="start-strip" aria-label="开始旅程">
        <div className="start-caption">
          <span className="tiny-flower">✳</span>
          <div>
            <b>这里没有标准答案</b>
            <p>每一个真实的选择，都值得被认真听见。</p>
          </div>
        </div>
        <div className="start-actions">
          {session && (
            <button className="text-button" onClick={onStart}>
              重新开始
            </button>
          )}
          <button
            className="button primary start-button"
            onClick={session ? onContinue : onStart}
          >
            {session ? "继续探索" : "开始探索"}
            <Icon name="arrow" />
          </button>
          <small>
            {session
              ? `已保存 ${session.answers.length} 个回答`
              : "无需登录 · 进度保存在本机"}
          </small>
        </div>
      </section>
      <section id="guide" className="guide-section">
        <div className="section-heading">
          <div className="eyebrow">HOW IT WORKS</div>
          <h2>一段慢慢认识自己的旅程</h2>
          <p>从你做了什么，到你为什么这样选择。</p>
        </div>
        <div className="journey-steps">
          <article>
            <div className="step-art art-cup">
              <span className="pixel-cup" />
            </div>
            <div className="step-number">01 / 走进生活</div>
            <h3>不是抽象的“你是否”</h3>
            <p>
              一次临时邀约、一场合作、一段空闲。
              <br />
              从你熟悉的生活情境开始。
            </p>
          </article>
          <article>
            <div className="step-art art-dialog">
              <Icon name="spark" size={34} />
              <span className="chat-pixel">···</span>
            </div>
            <div className="step-number">02 / 多问一句</div>
            <h3>每个选择，都有它的原因</h3>
            <p>
              根据你的回答追问动机，换个场景再看看，
              <br />
              允许矛盾，也允许暂时不确定。
            </p>
          </article>
          <article>
            <div className="step-art art-resident">
              <Character type="ENFP" size={71} />
            </div>
            <div className="step-number">03 / 收下居民卡</div>
            <h3>看见倾向，也看见依据</h3>
            <p>
              获得有回答依据的四维探索报告。
              <br />
              类型只是路标，你比四个字母更丰富。
            </p>
          </article>
        </div>
      </section>
      <section className="residents-teaser">
        <div className="resident-group">
          {["ISFJ", "INTP", "ENFP", "ESTP"].map((type) => (
            <Character key={type} type={type} size={60} />
          ))}
        </div>
        <div>
          <h3>不同的性格，都能在这里找到位置。</h3>
          <p>16 位小镇居民，16 种看世界的角度。角色设定不代表能力或职业。</p>
        </div>
        <button className="text-button" onClick={onResidents}>
          认识小镇居民 <Icon name="arrow" size={16} />
        </button>
      </section>
      <div className="home-note">
        <Icon name="book" size={17} />
        <p>
          这是原创、尚未经过测量验证的性格探索工具，并非官方 MBTI
          测评或专业诊断。
          <br className="desktop-break" />
          所有类型推断与扩展分数均为探索性结果，不能替代你对自己的理解。
        </p>
      </div>
    </main>
  );
}
