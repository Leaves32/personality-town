import { useState } from "react";
import type { CSSProperties } from "react";
import { TYPE_CODES, TYPE_STORIES } from "../data/reports";
import { CHARACTER_DESIGNS } from "../data/characters";
import { Character } from "./Character";

export function ResidentGallery() {
  const [resident, setResident] = useState("INFP");
  const design = CHARACTER_DESIGNS[resident],
    story = TYPE_STORIES[resident];
  return (
    <div className="resident-gallery-content">
      <div className="residents-gallery" aria-label="选择一位小镇居民">
        {TYPE_CODES.map((type) => {
          const d = CHARACTER_DESIGNS[type];
          return (
            <button
              key={type}
              type="button"
              className={resident === type ? "selected" : ""}
              aria-pressed={resident === type}
              aria-label={`${type} ${TYPE_STORIES[type].name}`}
              onClick={() => setResident(type)}
              style={
                {
                  "--resident-bg": d.backdrop,
                  "--resident-ink": d.shade,
                } as CSSProperties
              }
            >
              <span className="resident-thumb">
                <Character type={type} size={88} />
              </span>
              <b>{type}</b>
              <small>{TYPE_STORIES[type].name}</small>
              <span className="resident-signature-mini">
                {d.signature.split(" · ")[0]}
              </span>
            </button>
          );
        })}
      </div>
      <article
        className="resident-detail resident-spotlight"
        style={
          {
            "--resident-bg": design.backdrop,
            "--resident-ink": design.shade,
            "--resident-accent": design.accent,
          } as CSSProperties
        }
      >
        <div className="resident-stage">
          <span className="resident-stage-star" aria-hidden="true">
            ✦
          </span>
          <Character type={resident} size={184} />
          <span className="resident-stage-label">
            TOWN RESIDENT / {resident}
          </span>
        </div>
        <div className="resident-story" aria-live="polite">
          <div className="eyebrow">MEET YOUR NEIGHBOUR</div>
          <h3>
            {resident} <span>·</span> {story.name}
          </h3>
          <p className="resident-greeting">{design.greeting}</p>
          <div className="resident-traits">
            {design.traits.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <dl className="resident-details">
            <div>
              <dt>随身物件</dt>
              <dd>{design.signature}</dd>
            </div>
            <div>
              <dt>小镇日常</dt>
              <dd>{design.habit}</dd>
            </div>
          </dl>
        </div>
      </article>
      <details className="resident-reading" key={resident}>
        <summary>
          读读这位居民的探索提示 <span>角色不等于固定的你</span>
        </summary>
        <p>{story.intro}</p>
        <p>{story.everyday}</p>
        <p>{story.connection}</p>
        <p>{story.experiment}</p>
      </details>
    </div>
  );
}
