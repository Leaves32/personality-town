import { useId } from "react";
import type { Scene } from "../engine/types";
import { SCENE_NAMES } from "../data/questions";
function Tree({
  x,
  y,
  s = 1,
  tone = 0,
}: {
  x: number;
  y: number;
  s?: number;
  tone?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path fill="#718168" opacity=".16" d="M-32 17h68v8h-68z" />
      <path fill="#88755a" d="M-5-38H5v57H-5z" />
      <path fill="#a08a64" d="M-2-12h4v29h-4z" />
      <g className="tree-crown" style={{ animationDelay: `${-x / 100}s` }}>
        <path
          fill={tone ? "#5a7c60" : "#6b8b65"}
          d="M-13-100h26v8h16v12h11v24h-8v17H18v10h-36v-10h-15v-17h-7v-24h12v-12h15z"
        />
        <path
          fill={tone ? "#72946c" : "#86a477"}
          d="M-13-100h26v8h16v11h-5v13H10v10h-37v-10h-8v-12h8v-12h14z"
        />
        <path
          fill="#a4b88a"
          d="M-11-94H8v5h-19zM-26-79h11v5h-11zM9-69h10v5H9z"
        />
        <path fill="#55745b" d="M22-59h11v10H22zM-12-45h20v8h-20z" />
      </g>
    </g>
  );
}
function House({
  x,
  y,
  kind,
}: {
  x: number;
  y: number;
  kind: "cafe" | "studio" | "cabin";
}) {
  const cafe = kind === "cafe",
    studio = kind === "studio";
  const width = studio ? 148 : 128;
  return (
    <g transform={`translate(${x} ${y})`}>
      <path fill="#91a080" opacity=".3" d={`M-10 87h${width + 22}v10H-10z`} />
      <path fill="#b39876" d={`M0 0h${width}v88H0z`} />
      <path
        fill={cafe ? "#f1ddb4" : studio ? "#e7d7b2" : "#d2b792"}
        d={`M4 4h${width - 8}v77H4z`}
      />
      <path
        fill="#bca17f"
        d={`M4 68h${width - 8}v4H4zM4 79h${width - 8}v4H4z`}
      />
      <path
        fill={cafe ? "#876e5d" : studio ? "#597a70" : "#8b765f"}
        d={`M-12-4v-8h8v-8h8v-8h8v-8h${width - 24}v8h8v8h8v8h8v8z`}
      />
      <path
        fill={cafe ? "#b48971" : studio ? "#7d9a87" : "#ac9775"}
        d={`M-4-13h${width + 8}v6H-4zM4-24h${width - 8}v5H4zM14-34h${width - 28}v5H14z`}
      />
      <path fill="#beaa88" d={`M${width - 27}-54h13v26h-13z`} />
      <path fill="#88755e" d={`M${width - 30}-57h19v6h-19z`} />
      <g className="steam">
        <path
          fill="#fff9e9"
          opacity=".65"
          d={`M${width - 23}-66h6v-9h-6zM${width - 21}-86h7v-9h-7z`}
        />
      </g>
      <path fill="#7a6d59" d="M46 32h34v54H46z" />
      <path fill="#b3baa0" d="M51 37h24v43H51z" />
      <path fill="#d6e4cd" d="M54 40h18v20H54z" />
      <path fill="#f5e5ad" className="window-glow" d="M56 42h14v16H56z" />
      <path fill="#8c7c60" d="M63 40h3v20h-3zM52 49h21v3H52z" />
      <path fill="#e5cc8b" d="M69 67h4v4h-4z" />
      {[10, width - 39].map((v, i) => (
        <g key={i} transform={`translate(${v} 24)`}>
          <path fill="#9c876a" d="M0 0h28v34H0z" />
          <path className="window-glow" fill="#f5e6b3" d="M4 4h20v24H4z" />
          <path fill="#b6c5a4" d="M5 5h18v10H5z" />
          <path fill="#a48d6c" d="M13 3h3v27h-3zM3 15h23v3H3z" />
          <path fill="#b09c77" d="M-3 32h34v5H-3z" />
        </g>
      ))}
      {cafe && (
        <>
          <path fill="#78937b" d={`M-3 11h${width + 6}v11H-3z`} />
          {Array.from({ length: 8 }, (_, i) => (
            <path key={i} fill="#f0e6c8" d={`M${i * 17} 11h9v11h-9z`} />
          ))}
          <path fill="#f4e4bd" d="M38-12h52v20H38z" />
          <text
            x="64"
            y="2"
            textAnchor="middle"
            fontSize="10"
            fontWeight="bold"
            fill="#676e55"
          >
            COFFEE
          </text>
        </>
      )}
      {studio && (
        <>
          <path fill="#e9d9ae" d="M33-11h82v21H33z" />
          <text
            x="74"
            y="4"
            textAnchor="middle"
            fontSize="10"
            letterSpacing="2"
            fill="#5a7061"
          >
            STUDIO
          </text>
          <path fill="#b18b6d" d="M103 63h24v19h-24z" />
          <path fill="#809a68" d="M107 54h16v13h-16zM111 47h7v14h-7z" />
        </>
      )}
      <path fill="#d1c5a2" d="M41 86h44v6H41zM35 92h56v5H35z" />
    </g>
  );
}
export function TownScene({
  scene = "cafe",
  compact = false,
}: {
  scene?: Scene;
  compact?: boolean;
}) {
  const id = useId().replaceAll(":", "");
  return (
    <div
      className={`town-scene scene-${scene} ${compact ? "compact" : ""}`}
      role="img"
      aria-label={`有摇曳树叶、蒸汽和居民的像素小镇，当前来到${SCENE_NAMES[scene]}`}
    >
      <svg
        viewBox="0 0 960 420"
        preserveAspectRatio={compact ? "xMidYMid slice" : "xMidYMid slice"}
        shapeRendering="crispEdges"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id={`grass${id}`}
            width="48"
            height="43"
            patternUnits="userSpaceOnUse"
          >
            <path fill="#8fa777" d="M8 24h3v-4h2v7H8zM33 9h2v3h-2z" />
            <path fill="#b3bf8f" d="M16 38h3v2h-3zM40 31h3v2h-3z" />
          </pattern>
          <pattern
            id={`roof${id}`}
            width="15"
            height="8"
            patternUnits="userSpaceOnUse"
          >
            <path fill="#a7b995" d="M0 0h15v8H0z" />
            <path fill="#9caf8b" d="M0 6h15v2H0z" />
          </pattern>
        </defs>
        <path fill="#dce6d2" d="M0 0h960v420H0z" />
        <g className="cloud cloud-one" fill="#f6f5e4">
          <path d="M90 48h37v-8h44v8h22v13H90zM590 35h39v-9h35v9h24v12h-98z" />
        </g>
        <g className="cloud cloud-two" fill="#edf0db">
          <path d="M772 72h30v-9h47v9h27v11H772zM300 24h24v-8h38v8h22v10h-84z" />
        </g>
        <path
          fill="#c2d0ae"
          d="M0 122h45V98h51V83h64v16h55v23h52v-18h48V76h48V66h58v21h58v35h63v-20h65V87h62v13h43v25h48v-17h48V94h64v20h76v306H0z"
        />
        <path
          fill="#a8bd94"
          d="M0 151h50v-20h61v16h62v-17h44v28h72v-11h59v20h71v-24h56v13h75v-19h51v20h64v-21h63v-12h48v21h58v-14h56v18h70v271H0z"
        />
        <path fill="#b3c399" d="M0 178h960v242H0z" />
        <path fill={`url(#grass${id})`} d="M0 178h960v242H0z" />
        <path
          fill="#8aaba1"
          d="M712 145h47v35h-13v44h-15v34h-21v43h-15v49h-18v70h-69v-40h17v-49h19v-47h16v-46h20v-40h17v-53h15z"
        />
        <path
          fill="#a5c7b5"
          d="M722 145h25v40h-13v45h-17v38h-20v42h-15v46h-18v64h-39v-38h16v-50h20v-46h16v-47h20v-41h16v-52h9z"
        />
        <g className="water-sparkle" fill="#d6e3cc">
          <path d="M718 195h17v3h-17zM697 251h15v3h-15zM655 365h20v3h-20zM679 304h12v3h-12z" />
        </g>
        <path
          fill="#cebd95"
          d="M0 348h257v-26h125v-40h178v-23h80v35h-63v25H407v44H285v24H0zM462 287h44v133h-44zM228 249h38v103h-38z"
        />
        <path
          fill="#e1d2ae"
          d="M0 353h262v-25h125v-40h180v-23h67v23h-63v25H401v44H279v24H0zM468 288h32v132h-32zM234 250h26v106h-26z"
        />
        <g fill="#c9ba98">
          <path d="M297 342h14v4h-14zM355 333h18v4h-18zM438 300h11v4h-11zM479 375h14v4h-14zM155 363h17v4h-17zM246 315h11v4h-11zM534 299h14v4h-14z" />
        </g>
        <Tree x={66} y={222} s={1.15} />
        <Tree x={839} y={196} s={1.05} tone={1} />
        <Tree x={906} y={238} s={1.28} />
        <Tree x={369} y={186} s={0.8} />
        <Tree x={30} y={290} s={0.85} tone={1} />
        <House x={153} y={165} kind="cafe" />
        <House x={454} y={120} kind="studio" />
        <House x={785} y={272} kind="cabin" />
        <g transform="translate(568 299)">
          <path
            fill="#866c51"
            d="M0 0h103v7H0zM0 10h103v7H0zM0 20h103v7H0zM0 30h103v6H0z"
          />
          <path fill="#b2986c" d="M0-5h5v46H0zM98-5h5v46h-5z" />
        </g>
        <g transform="translate(55 323)">
          <path
            fill="#806d55"
            d="M0-25h62v7H0zM0-15h62v7H0zM-4-4h70v7H-4zM3 3h6v14H3zM53 3h6v14h-6z"
          />
        </g>
        <g transform="translate(345 275)">
          <path fill="#8b795c" d="M0-43h5v45H0zM-17-43h41v20h-41z" />
          <path fill="#e3d1a5" d="M-14-40h35v14h-35z" />
          <text x="3" y="-30" textAnchor="middle" fontSize="7" fill="#6a7458">
            TOWN →
          </text>
        </g>
        {[
          { x: 304, y: 227 },
          { x: 556, y: 245 },
          { x: 119, y: 341 },
          { x: 758, y: 344 },
        ].map(({ x, y }, i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <path fill="#7c795b" d="M0-38h4v40H0zM-6-42h16v4H-6z" />
            <path fill="#a28e67" d="M-5-54h14v12H-5z" />
            <path fill="#f4e1a0" className="lamp-glow" d="M-2-51h8v8H-2z" />
            <path fill="#747456" d="M-3-57h10v3H-3z" />
          </g>
        ))}
        {[
          { x: 335, y: 312, c: "#ac8869" },
          { x: 430, y: 257, c: "#7a8b9a" },
          { x: 524, y: 355, c: "#b59586" },
          { x: 198, y: 285, c: "#8b9b75" },
        ].map(({ x, y, c }, i) => (
          <g
            key={i}
            className={`town-person person-${i}`}
            style={{ animationDelay: `${-i * 1.1}s` }}
            transform={`translate(${x} ${y})`}
          >
            <path fill="#6d7d63" opacity=".3" d="M-4 16h20v4H-4z" />
            <path fill="#645f4e" d="M0-12h12v12H0z" />
            <path fill="#efc798" d="M2-7h9v9H2z" />
            <path
              fill="#4c584b"
              className="pixel-eyes"
              d="M4-3h2v2H4zM9-3h2v2H9z"
            />
            <path fill={c} d="M0 3h13v11H0z" />
            <path fill="#f0cf9c" d="M-2 5h3v7h-3zM13 5h3v7h-3z" />
            <path fill="#5b6657" d="M1 14h4v4H1zM9 14h4v4H9z" />
          </g>
        ))}
        <g className="cat" transform="translate(105 352)">
          <path
            fill="#d0ac76"
            d="M0 1h18v9H0zM1-5h4v9H1zM12-5h4v9h-4zM18 5h9v4h-9zM24-2h4v9h-4z"
          />
          <path fill="#615e4c" d="M4 2h2v2H4zM11 2h2v2h-2z" />
        </g>
        <g fill="#e8d7a3">
          {[90, 135, 328, 396, 740, 883, 851, 57, 548, 423, 800].map((x, i) => (
            <g key={x} transform={`translate(${x} ${295 + ((i * 37) % 113)})`}>
              <path fill="#7d9565" d="M0 0h3v9H0z" />
              <path
                fill={i % 2 ? "#d2a587" : "#f1dfa4"}
                d="M-3-4h9v6h-9zM0-7h3v12H0z"
              />
              <path fill="#b39b65" d="M0-2h3v2H0z" />
            </g>
          ))}
        </g>
        <Tree x={378} y={428} s={1.18} tone={1} />
        <Tree x={912} y={464} s={1.4} />
        <Tree x={40} y={463} s={1.3} />
        <g className="falling-leaf" fill="#d3ba78">
          <path d="M302 122h6v3h-6zM396 203h5v3h-5zM871 232h5v4h-5z" />
        </g>
      </svg>
      <div className="scene-tag">
        <span className="live-dot" />{" "}
        {compact ? SCENE_NAMES[scene] : "小镇的一个平常午后"}{" "}
        <span className="scene-time">14:28</span>
      </div>
      {!compact && (
        <>
          <div className="town-welcome">
            欢迎来到
            <br />
            <b>PERSONALITY TOWN</b>
          </div>
          <div className="scene-caption">
            <span>✦</span> 不必成为谁，先认识自己。
          </div>
        </>
      )}
    </div>
  );
}
