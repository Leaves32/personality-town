import type { CSSProperties } from "react";
import { TYPE_STORIES } from "../data/reports";
import { CHARACTER_DESIGNS } from "../data/characters";
import type { CharacterDesign } from "../data/characters";

function Hair({
  style,
  color,
}: {
  style: CharacterDesign["hair"];
  color: string;
}) {
  const shapes = {
    parted: "M18 7h13v2h4v12h-3v-7h-6v-3h-3v4h-6v6h-2V11h3z",
    bun: "M20 3h8v2h3v5h3v15h-4V14H19v11h-5V11h4V7h2z",
    long: "M19 6h12v3h4v25h-4V15H19v19h-5V12h2V9h3z",
    swept: "M21 6h13v3h3v4h-4v9h-3v-8h-6v-3h-5v7h-4v-7h3V8h3z",
    crop: "M18 8h14v2h3v8h-4v-5H19v5h-4v-8h3z",
    bob: "M18 7h13v2h4v20h-3V15H18v14h-5V12h2V9h3z",
    waves:
      "M19 6h12v3h4v7h2v10h-3v5h-6v-7h3V14h-6v-3h-4v5h-3v9h2v6h-7v-8h-2v-9h3V9h5z",
    curls:
      "M17 5h5V3h7v3h6v4h3v7h-4v6h-4v-9h-4v-3h-5v4h-4v8h-4v-8h-2v-5h3V7h3z",
    spikes: "M16 7h4V3h4v3h5V2h3v5h5v4h3v4h-7v7h-3v-9h-7v3h-6v6h-3v-8h-3V9h5z",
  };
  return <path fill={color} d={shapes[style]} />;
}
function Outfit({
  design: d,
  type,
}: {
  design: CharacterDesign;
  type: string;
}) {
  const base = {
    waistcoat: "M18 24h13v3h4v13H14V27h4z",
    apron: "M18 24h13v3h3v5h3v10H12V32h3v-5h3z",
    cloak: "M20 21h10v3h4v5h3v6h4v7H8v-7h4v-6h4v-5h4z",
    coat: "M18 23h14v3h3v16H13V26h5z",
    overalls: "M18 24h13v3h5v11h-3v4H16v-4h-4V27h6z",
    smock: "M17 24h15v3h5v14H11V27h6z",
    poncho: "M19 23h11v3h4v4h5v9H28v4H12v-9h-3v-4h6v-4h4z",
    knit: "M17 24h15v3h5v13H11V27h6z",
    jacket: "M18 24h13v3h5v12H15V28h3z",
    dress: "M18 24h13v3h4v7h3v9H11v-9h3v-7h4z",
  };
  return (
    <g>
      <path fill={d.shade} d={base[d.outfit]} />
      <path
        fill={d.coat}
        d={
          d.outfit === "cloak"
            ? "M20 24h8v3h4v7h4v5H12v-5h4v-7h4z"
            : d.outfit === "poncho"
              ? "M19 25h9v3h5v4h3v4H25v4H14v-6h-2v-2h6v-4h1z"
              : "M18 25h12v3h3v10H16V28h2z"
        }
      />
      {["waistcoat", "coat", "jacket"].includes(d.outfit) && (
        <>
          <path fill="#f1e5c7" d="M21 24h7v4h-2v7h-3v-7h-2z" />
          <path
            fill={d.accent}
            d="M24 27h2v6h-2zM29 34h2v2h-2zM29 39h2v2h-2z"
          />
        </>
      )}
      {["apron", "dress"].includes(d.outfit) && (
        <>
          <path fill="#e9d8b0" d="M19 26h10v5h3v9H16v-9h3z" />
          <path fill={d.accent} d="M20 34h9v5h-9z" />
          <path fill={d.coat} d="M21 35h3v3h-3z" />
        </>
      )}
      {d.outfit === "overalls" && (
        <>
          <path fill="#e7d7b2" d="M18 24h13v6H18z" />
          <path
            fill={d.shade}
            d="M19 25h3v9h-3zM28 25h3v9h-3zM19 31h12v9H19z"
          />
          <path
            fill={d.accent}
            d="M20 32h2v2h-2zM28 32h2v2h-2zM22 35h6v3h-6z"
          />
        </>
      )}
      {d.outfit === "cloak" && (
        <>
          <path fill={d.accent} d="M21 23h7v3h-7zM24 26h2v5h-2z" />
          <path fill={d.shade} d="M19 31h2v9h-2zM30 32h2v8h-2z" />
          {type === "INFJ" && (
            <path fill="#9aab7b" d="M14 37h3v2h-3zM33 36h3v2h-3z" />
          )}
        </>
      )}
      {d.outfit === "smock" && (
        <path fill="#d6ae68" d="M17 30h3v3h-3zM27 34h4v3h-4zM19 37h3v2h-3z" />
      )}
      {d.outfit === "knit" && (
        <>
          <path fill="#c0d3c5" d="M13 35h23v2H13zM18 26h13v2H18z" />
          <path fill={d.accent} d="M19 31h3v3h-3zM27 31h3v3h-3z" />
        </>
      )}
      {d.outfit === "poncho" && (
        <path
          fill={d.accent}
          d={
            type === "INFP"
              ? "M17 31h3v2h-3zM14 34h3v2h-3zM22 35h2v2h-2z"
              : "M17 31h5v5h-5zM26 30h5v4h-5zM23 37h3v3h-3z"
          }
        />
      )}
    </g>
  );
}
function Props({ type }: { type: string }) {
  switch (type) {
    case "ISTJ":
      return (
        <>
          <g className="character-prop motion-page">
            <path fill="#735d46" d="M4 27h13v15H4z" />
            <path fill="#e8d8ad" d="M7 28h11v12H7z" />
            <path fill="#9c8a64" d="M9 30h7v1H9zM9 33h7v1H9zM9 36h5v1H9z" />
            <path fill="#aa7355" d="M5 27h3v15H5z" />
          </g>
          <path fill="#d3b26c" d="M34 34h4v4h-4zM35 38h2v5h-2zM37 40h2v2h-2z" />
        </>
      );
    case "ISFJ":
      return (
        <>
          <path fill="#edc69c" d="M15 32h5v4h-5zM30 32h4v4h-4z" />
          <path fill="#cfac78" d="M19 30h12v9H19zM31 31h4v6h-4z" />
          <path fill="#fcf1cf" d="M20 31h10v6H20zM17 39h17v2H17z" />
          <g className="character-prop motion-steam" fill="#d0b98d">
            <path d="M22 23h2v5h-2zM27 21h2v6h-2z" />
          </g>
        </>
      );
    case "INFJ":
      return (
        <>
          <path fill="#867354" d="M39 13h2v30h-2zM35 13h10v2H35z" />
          <g className="character-prop motion-chime">
            <path fill="#cab67b" d="M42 15h1v6h-1zM39 21h6v5h-6z" />
            <path fill="#ecdb9c" d="M40 22h4v2h-4z" />
            <path fill="#719595" d="M42 26h1v8h-1zM40 32h5v2h-5z" />
          </g>
        </>
      );
    case "INTJ":
      return (
        <>
          <g className="character-prop motion-scan">
            <path
              fill="#876f4b"
              d="M31 20h5v4h-5zM35 17h5v6h-5zM39 14h5v7h-5z"
            />
            <path
              fill="#d5b974"
              d="M32 20h3v2h-3zM36 18h3v3h-3zM40 15h3v4h-3z"
            />
            <path fill="#779aa5" d="M43 15h2v4h-2z" />
          </g>
          <path fill="#353f66" d="M5 30h14v12H5z" />
          <path fill="#e4cf8a" d="M8 33h2v2H8zM14 36h2v2h-2zM11 39h1v1h-1z" />
          <path fill="#8eabbd" d="M9 35h2v1H9zM11 36h3v1h-3z" />
        </>
      );
    case "ISTP":
      return (
        <>
          <path fill="#735d49" d="M16 36h18v4H16z" />
          <path fill="#c9aa75" d="M18 36h3v3h-3zM25 37h3v5h-3z" />
          <g className="character-prop motion-tool">
            <path
              fill="#516b70"
              d="M37 22h3v19h-3zM34 18h3v7h-3zM40 18h3v7h-3zM35 24h7v4h-7z"
            />
            <path
              fill="#b5c8c1"
              d="M37 27h2v12h-2zM35 20h2v4h-2zM40 20h2v4h-2z"
            />
          </g>
          <path fill="#d6b47e" d="M12 10h6v3h-6zM30 10h7v3h-7z" />
        </>
      );
    case "ISFP":
      return (
        <>
          <path fill="#8e7350" d="M34 19h2v20h-2z" />
          <g className="character-prop motion-brush">
            <path fill="#dbcba4" d="M34 17h2v5h-2z" />
            <path fill="#718e88" d="M33 13h3v5h-3z" />
          </g>
          <path fill="#bda071" d="M3 33h3v-4h9v3h3v9H5v-2H3z" />
          <path fill="#e5cc94" d="M6 32h8v7H6z" />
          <path fill="#b7786f" d="M7 32h3v2H7z" />
          <path fill="#739991" d="M11 34h3v3h-3z" />
          <path fill="#8f8dab" d="M7 37h3v2H7z" />
        </>
      );
    case "INFP":
      return (
        <>
          <path fill="#bd9669" d="M28 23h2v5h-2zM30 28h2v5h-2zM32 33h2v9h-2z" />
          <path fill="#765d70" d="M32 33h10v10H32z" />
          <path fill="#c39b74" d="M33 34h8v4h-8z" />
          <path fill="#ecd08b" d="M35 36h3v1h-2v3h2v1h-3z" />
          <g className="character-prop motion-letter">
            <path fill="#c7ad83" d="M5 29h15v10H5z" />
            <path fill="#f8e9c5" d="M6 30h13v8H6z" />
            <path
              fill="#d4bd95"
              d="M7 31h2v2H7zM9 33h2v2H9zM14 33h3v2h-3zM16 31h2v2h-2z"
            />
            <path fill="#ad6c6b" d="M11 33h4v4h-4z" />
          </g>
        </>
      );
    case "INTP":
      return (
        <>
          <path fill="#546d7d" d="M3 29h16v13H3z" />
          <path fill="#e4e3cd" d="M5 30h5v10H5zM12 31h5v10h-5z" />
          <path fill="#829f9c" d="M6 33h3v1H6zM6 36h2v1H6zM13 34h3v1h-3z" />
          <g className="character-prop motion-puzzle">
            <path fill="#a5bb9b" d="M35 25h4v-3h3v3h4v4h-3v3h-8z" />
            <path fill="#e0cf85" d="M36 26h3v2h-3z" />
          </g>
        </>
      );
    case "ESTP":
      return (
        <>
          <path fill="#687e69" d="M9 25h8v14H9zM7 27h3v10H7z" />
          <path fill="#d5ad76" d="M10 27h4v4h-4z" />
          <g className="character-prop motion-flag">
            <path fill="#7f6c4e" d="M37 12h2v28h-2z" />
            <path fill="#bb6754" d="M39 12h8v4h-3v3h-5z" />
            <path fill="#dfaf75" d="M39 13h5v2h-5z" />
          </g>
          <path fill="#d1b68c" d="M18 25h3v8h-3z" />
        </>
      );
    case "ESFP":
      return (
        <>
          <g className="character-prop motion-photo">
            <path fill="#556d66" d="M30 25h14v10H30zM33 23h5v3h-5z" />
            <path fill="#d9c69b" d="M34 27h7v6h-7z" />
            <path fill="#54788b" d="M36 28h4v4h-4z" />
            <path fill="#f0db97" d="M41 26h2v2h-2z" />
          </g>
          <path fill="#e4c25e" d="M31 5h5v10h-5zM28 8h11v4H28z" />
          <path fill="#8f6b46" d="M31 8h5v4h-5z" />
          <path fill="#e9c39b" d="M9 28h4v5H9zM7 25h3v5H7z" />
        </>
      );
    case "ENFP":
      return (
        <>
          <g className="character-prop motion-mobile">
            <path fill="#866f52" d="M36 9h2v29h-2zM30 12h14v2H30z" />
            <path fill="#d2ad72" d="M31 14h1v7h-1zM41 14h1v8h-1z" />
            <path fill="#779d9c" d="M29 20h5v5h-5z" />
            <path fill="#b77b78" d="M39 21h5v5h-5z" />
            <path fill="#d1b563" d="M35 26h4v5h-4z" />
          </g>
          <path fill="#ac8959" d="M7 33h9v10H7z" />
          <path fill="#e4cb87" d="M8 35h7v3H8z" />
          <path fill="#708659" d="M11 30h2v5h-2zM8 29h4v3H8z" />
        </>
      );
    case "ENTP":
      return (
        <>
          <path fill="#5f5147" d="M16 9h18v4H16z" />
          <path fill="#e0bb77" d="M17 8h6v5h-6zM26 8h6v5h-6z" />
          <path fill="#8caeac" d="M18 9h4v3h-4zM27 9h4v3h-4z" />
          <g className="character-prop motion-invent">
            <path
              fill="#8e7350"
              d="M30 33h16v3H30zM30 29h3v12h-3zM43 29h3v12h-3z"
            />
            <path
              fill="#cbb17c"
              d="M33 30h10v2H33zM34 27h2v3h-2zM39 27h2v3h-2z"
            />
            <path fill="#6f9f9d" d="M35 35h5v5h-5z" />
            <path fill="#e2c27c" d="M36 36h3v3h-3z" />
          </g>
        </>
      );
    case "ESTJ":
      return (
        <>
          <path fill="#89734f" d="M4 27h14v16H4z" />
          <path fill="#e8dbb7" d="M6 29h10v12H6z" />
          <path
            fill="#668a78"
            d="M8 31h2v2H8zM8 35h2v2H8zM11 32h3v1h-3zM11 36h3v1h-3z"
          />
          <path fill="#bcaa80" d="M8 25h7v5H8z" />
          <g className="character-prop motion-ruler">
            <path fill="#d4af70" d="M37 22h3v18h-3zM32 37h8v3h-8z" />
            <path
              fill="#8b744e"
              d="M37 25h2v1h-2zM37 29h2v1h-2zM37 33h2v1h-2z"
            />
          </g>
        </>
      );
    case "ESFJ":
      return (
        <>
          <path
            fill="#80674b"
            d="M30 30h13v2H30zM30 30h2v9h-2zM41 30h2v9h-2z"
          />
          <g className="character-prop motion-basket">
            <path fill="#ae895a" d="M28 35h18v8H28z" />
            <path
              fill="#d7b783"
              d="M29 36h16v2H29zM31 39h2v3h-2zM36 39h2v3h-2zM41 39h2v3h-2z"
            />
            <path
              fill="#e5c28d"
              d="M30 33h5v4h-5zM36 31h5v6h-5zM41 33h4v4h-4z"
            />
            <path fill="#b57f54" d="M32 34h1v2h-1zM38 32h1v3h-1z" />
          </g>
          <path fill="#a4736a" d="M17 33h4v3h-4zM25 33h4v3h-4zM21 37h4v3h-4z" />
        </>
      );
    case "ENFJ":
      return (
        <>
          <path fill="#8c734b" d="M37 24h2v7h-2zM33 26h10v2H33z" />
          <g className="character-prop motion-lantern">
            <path fill="#846c45" d="M32 30h12v12H32zM35 27h6v4h-6z" />
            <path fill="#e5bf6d" d="M34 32h8v8h-8z" />
            <path
              className="character-light"
              fill="#fae6a2"
              d="M36 33h4v6h-4z"
            />
            <path fill="#a58a54" d="M32 41h12v2H32z" />
          </g>
          <path fill="#d1b77c" d="M19 27h2v4h-2zM17 31h2v5h-2zM15 36h2v4h-2z" />
        </>
      );
    case "ENTJ":
      return (
        <>
          <g className="character-prop motion-blueprint">
            <path fill="#527b94" d="M3 31h20v12H3z" />
            <path fill="#acc6cc" d="M5 33h16v8H5z" />
            <path
              fill="#60899b"
              d="M8 35h9v1H8zM8 36h1v4H8zM14 35h1v6h-1zM7 39h12v1H7z"
            />
            <path fill="#e2cf9f" d="M3 30h3v14H3zM21 30h3v14h-3z" />
          </g>
          <path fill="#967c54" d="M39 20h2v22h-2z" />
          <path fill="#d7b16c" d="M41 20h6v6h-6z" />
        </>
      );
    default:
      return null;
  }
}
export function Character({
  type = "INFP",
  size = 96,
  still = false,
}: {
  type?: string;
  size?: number;
  still?: boolean;
}) {
  const code = CHARACTER_DESIGNS[type] ? type : "INFP";
  const d = CHARACTER_DESIGNS[code],
    story = TYPE_STORIES[code];
  const reaching = ["ESTP", "ENFP", "ENFJ", "ENTP"].includes(code);
  return (
    <span
      className={`character character-${code.toLowerCase()} ${still ? "still" : ""}`}
      role="img"
      aria-label={`${story.name}像素角色，${d.signature}`}
      data-character={code}
      style={
        {
          "--shirt": d.coat,
          "--character-accent": d.accent,
          width: size,
          height: size,
        } as CSSProperties
      }
    >
      <svg viewBox="0 0 48 48" shapeRendering="crispEdges" aria-hidden="true">
        <path fill="#64745a" opacity=".18" d="M10 44h28v3H10z" />
        <g className="character-body">
          <path
            fill={d.hairColor}
            d={
              ["long", "waves", "bob"].includes(d.hair)
                ? "M16 11h18v23H16z"
                : "M16 11h18v12H16z"
            }
          />
          <path
            fill="#45564c"
            d={
              code === "ESTP"
                ? "M17 38h6v6h-8v-3h2zM28 38h5v4h3v3h-8z"
                : "M17 38h6v6h-8v-3h2zM27 38h6v4h2v2h-8z"
            }
          />
          <path fill={d.accent} d="M17 42h6v1h-6zM27 42h6v1h-6z" />
          <Outfit design={d} type={code} />
          <path
            fill={d.skin}
            d={
              reaching
                ? "M12 28h4v5h-4zM33 25h4v6h-4z"
                : "M12 30h4v7h-4zM33 30h4v7h-4z"
            }
          />
          <path
            fill={d.skin}
            d="M17 12h16v10h-3v3H20v-3h-3zM15 15h2v5h-2zM33 15h2v5h-2z"
          />
          <path fill="#ca936f" opacity=".65" d="M20 22h10v2H20z" />
          <Hair style={d.hair} color={d.hairColor} />
          <path fill="#f4d7b2" opacity=".45" d="M19 16h2v2h-2z" />
          <g className="eyes" fill="#354b44">
            <path
              d={
                ["INFJ", "INTJ", "ISTJ"].includes(code)
                  ? "M20 17h3v2h-3zM28 17h3v2h-3z"
                  : "M20 16h2v3h-2zM28 16h2v3h-2z"
              }
            />
          </g>
          <path fill="#d3967b" d="M18 20h3v1h-3zM29 20h3v1h-3z" />
          <path
            fill="#956e59"
            d={
              ["ENFP", "ESFP", "ESFJ", "ENFJ"].includes(code)
                ? "M23 21h4v1h-4zM24 22h2v1h-2z"
                : "M24 21h3v1h-3z"
            }
          />
          {code === "ISTJ" && (
            <path
              fill="#dbc78f"
              d="M19 16h5v1h-5zM19 19h5v1h-5zM19 17h1v2h-1zM23 17h1v2h-1zM27 16h5v1h-5zM27 19h5v1h-5zM27 17h1v2h-1zM31 17h1v2h-1zM24 17h3v1h-3z"
            />
          )}
          {code === "ISFJ" && (
            <path fill="#e0bc78" d="M24 4h3v4h-3zM22 5h7v2h-7z" />
          )}
          <Props type={code} />
        </g>
      </svg>
    </span>
  );
}
