import React from "react";
import {
  AbsoluteFill,
  Composition,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";

loadFont({
  family: "Noto Sans SC",
  url: staticFile("fonts/noto-sans-sc-subset.woff2"),
  weight: "400 800",
});

type Lab = {
  name: string;
  model: string;
  score: number;
  error: number;
  icon: string;
  color: string;
  modelRank: number;
  spread: string;
};
const labs: Lab[] = [
  {
    name: "贵州茅台",
    model: "600519 · 上交所",
    score: 1509,
    error: 6,
    icon: "茅",
    color: "#333",
    modelRank: 1,
    spread: "1 ↔ 4",
  },
  {
    name: "中国平安",
    model: "601318 · 上交所",
    score: 1490,
    error: 6,
    icon: "平",
    color: "#2684ed",
    modelRank: 9,
    spread: "4 ↔ 18",
  },
  {
    name: "招商银行",
    model: "600036 · 上交所",
    score: 1486,
    error: 4,
    icon: "招",
    color: "#4285f4",
    modelRank: 11,
    spread: "5 ↔ 19",
  },
  {
    name: "中芯国际",
    model: "688981 · 科创板",
    score: 1485,
    error: 10,
    icon: "芯",
    color: "#222",
    modelRank: 13,
    spread: "4 ↔ 31",
  },
  {
    name: "海光信息",
    model: "688041 · 科创板",
    score: 1483,
    error: 6,
    icon: "光",
    color: "#777",
    modelRank: 15,
    spread: "5 ↔ 29",
  },
  {
    name: "寒武纪",
    model: "688256 · 科创板",
    score: 1474,
    error: 5,
    icon: "寒",
    color: "#333",
    modelRank: 25,
    spread: "13 ↔ 40",
  },
  {
    name: "隆基绿能",
    model: "601012 · 上交所",
    score: 1469,
    error: 5,
    icon: "隆",
    color: "#222",
    modelRank: 33,
    spread: "18 ↔ 47",
  },
  {
    name: "中国移动",
    model: "600941 · 上交所",
    score: 1468,
    error: 5,
    icon: "移",
    color: "#4894e2",
    modelRank: 38,
    spread: "19 ↔ 48",
  },
  {
    name: "长江电力",
    model: "600900 · 上交所",
    score: 1466,
    error: 4,
    icon: "江",
    color: "#222",
    modelRank: 40,
    spread: "21 ↔ 51",
  },
  {
    name: "中微公司",
    model: "688012 · 科创板",
    score: 1458,
    error: 4,
    icon: "微",
    color: "#596fff",
    modelRank: 49,
    spread: "39 ↔ 60",
  },
];
const highlightedCompany: Lab = {
  name: "长鑫国际",
  model: "半导体 · 综合榜",
  score: 1496,
  error: 10,
  icon: "鑫",
  color: "#5569ff",
  modelRank: 5,
  spread: "1 ↔ 17",
};
const easing = Easing.bezier(0.33, 0, 0.2, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const rowHeight = 76;
const tableTop = 368;
export const rankAt = (seconds: number) =>
  interpolate(
    seconds,
    [0, 0.25, 0.85, 1.35, 1.9, 2.4, 2.9, 3.35],
    [10, 10, 8, 6, 4, 2, 1, 1],
    { ...clamp, easing },
  );
const Row: React.FC<{ lab: Lab; index: number; selected?: boolean }> = ({
  lab,
  index,
  selected = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const rank = rankAt(t);
  const position = selected
    ? rank
    : index + interpolate(rank, [index, index + 1], [1, 0], clamp);
  const focus = interpolate(t, [0, 0.4, 5.4, 6.7], [0.1, 1, 1, 0], clamp);
  const blur = selected
    ? 0
    : Math.max(0, Math.abs(position - rank) - 1.2) * 0.85 * focus;
  const score = selected
    ? Math.round(interpolate(t, [0.2, 1.8], [1458, 1496], { ...clamp, easing }))
    : lab.score;
  return (
    <div
      style={{
        position: "absolute",
        top: tableTop + position * rowHeight,
        left: 26,
        right: 26,
        height: rowHeight,
        display: "grid",
        gridTemplateColumns: "176px 397px 230px 140px 161px",
        alignItems: "center",
        borderBottom: "1px solid #deded9",
        background: selected ? "#f3fff8" : "rgba(255,255,255,0.5)",
        borderRadius: selected ? 8 : 0,
        borderLeft: selected ? "2px solid #56c788" : "1px solid #e5e5e1",
        boxShadow: selected
          ? "0 10px 34px rgba(49,128,76,0.28),0 0 35px rgba(76,211,133,0.14)"
          : "none",
        zIndex: selected ? 10 : 1,
        filter: `blur(${blur}px)`,
        color: "#262a27",
      }}
    >
      <div style={{ textAlign: "center", fontSize: 20, fontWeight: 700 }}>
        {Math.round(position) + 1}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          borderLeft: "1px solid #e0e3dc",
          height: "100%",
          paddingLeft: 24,
        }}
      >
        <span
          style={{
            color: lab.color,
            fontFamily: "Noto Sans SC, sans-serif",
            width: 20,
            textAlign: "center",
            fontWeight: 800,
            fontSize: selected ? 25 : 20,
          }}
        >
          {lab.icon}
        </span>
        <div>
          <div
            style={{
              fontFamily: selected
                ? "Noto Sans SC, sans-serif"
                : "Noto Sans SC, sans-serif",
              fontSize: selected ? 23 : 20,
              fontWeight: selected ? 700 : 500,
              letterSpacing: selected ? 1 : 0,
            }}
          >
            {lab.name}
          </div>
          <div style={{ fontSize: 14, marginTop: 3, color: "#444941" }}>
            {lab.model}
          </div>
        </div>
      </div>
      <div style={{ position: "relative", width: 190, fontSize: 19 }}>
        <span
          style={{
            fontSize: selected ? 23 : 19,
            fontWeight: selected ? 800 : 400,
          }}
        >
          {score}
        </span>
        <span style={{ marginLeft: 8, fontSize: 13, color: "#70766e" }}>
          ±{lab.error}
        </span>
        {selected && (
          <>
            <span style={{ fontSize: 16, marginLeft: 8, color: "#81877f" }}>
              ⓘ
            </span>
            <div
              style={{
                position: "absolute",
                height: 5,
                left: 8,
                top: 28,
                borderRadius: 4,
                width: interpolate(t, [1, 2, 6.1], [0, 112, 190], {
                  ...clamp,
                  easing,
                }),
                background: "linear-gradient(90deg,#1cce69,#8ceba3)",
                boxShadow: "0 0 8px #78ec9a66",
              }}
            />
          </>
        )}
      </div>
      <div style={{ fontSize: 19, textAlign: "center" }}>{lab.modelRank}</div>
      <div style={{ fontSize: 16, textAlign: "center" }}>{lab.spread}</div>
    </div>
  );
};
export const RankingRise: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const rank = rankAt(t);
  const scale = interpolate(
    t,
    [0, 0.3, 1.5, 3, 5.6, 6.5, 7.4],
    [2.7, 2.45, 2.1, 1.75, 1.7, 1.12, 1],
    { ...clamp, easing },
  );
  const angle = interpolate(t, [0, 0.6, 2.8, 5.7, 7.3], [-18, -18, -8, -4, 0], {
    ...clamp,
    easing,
  });
  const final = interpolate(t, [5.7, 7.4], [0, 1], { ...clamp, easing });
  const rowY = tableTop + rank * rowHeight + rowHeight / 2;
  const centerY = interpolate(
    t,
    [0, 0.25, 1.5, 3, 5.5, 7.4],
    [-170, 160, 820, 1000, 960, 960],
    { ...clamp, easing },
  );
  const translateY = centerY - 960 + (714 - rowY) * scale * (1 - final);
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 48% 47%,#f8f8ef 0%,#dedbd1 53%,#bab6ae 100%)",
        fontFamily: "Noto Sans SC, sans-serif",
        overflow: "hidden",
      }}
    >
      <Audio
        name="Original smooth score"
        src={staticFile("audio/smooth-score.wav")}
        premountFor={fps}
      />
      <Audio
        name="Synchronized slide sound design"
        src={staticFile("audio/slide-sound-design.wav")}
        premountFor={fps}
      />
      <div
        style={{ position: "absolute", left: 540, top: 960, perspective: 2800 }}
      >
        <div
          style={{
            width: 1156,
            height: 1250,
            position: "absolute",
            left: -578,
            top: -714,
            transformOrigin: "50% 50%",
            transform: `translate(${interpolate(t, [0, 0.6, 2.3, 6, 7.4], [200, 40, 220, 160, 14], clamp)}px,${translateY}px) scale(${scale}) rotateZ(${angle}deg) rotateX(${interpolate(t, [0, 6, 7.4], [17, 9, 0], clamp)}deg) rotateY(${interpolate(t, [0, 6, 7.4], [-14, -5, 0], clamp)}deg)`,
            background: "#fbfbf9",
            boxShadow: "0 25px 70px #4d493b35",
            border: "1px solid #ebe9e2",
          }}
        >
          <div
            style={{
              height: 48,
              borderBottom: "1px solid #e8e8e2",
              padding: "0 28px",
              display: "flex",
              alignItems: "center",
              gap: 40,
              fontSize: 13,
              color: "#333",
              opacity: interpolate(t, [0, 5.7, 6.7], [0.3, 0.4, 1], clamp),
            }}
          >
            <span style={{ marginRight: 195 }}>⌘ 榜单概览</span>
            <span>行情</span>
            <span
              style={{ padding: 14, background: "#eeece6", borderRadius: 7 }}
            >
              企业⌄
            </span>
            <span>行业⌄</span>
            <span>板块⌄</span>
            <span>趋势⌄</span>
            <span
              style={{
                marginLeft: "auto",
                background: "#222",
                color: "white",
                padding: "12px 17px",
                borderRadius: 6,
              }}
            >
              查看榜单
            </span>
          </div>
          <div
            style={{
              padding: "31px 30px",
              height: 178,
              boxSizing: "border-box",
              filter: `blur(${interpolate(t, [0, 5.5, 6.7], [3, 2, 0], clamp)}px)`,
              opacity: interpolate(t, [0, 5.5, 6.7], [0.2, 0.3, 1], clamp),
            }}
          >
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <span
                style={{ fontFamily: "Noto Sans SC, sans-serif", fontSize: 31 }}
              >
                A股企业榜单
              </span>
              <span
                style={{
                  fontSize: 13,
                  background: "#eeebe3",
                  borderRadius: 6,
                  padding: "9px 12px",
                }}
              >
                🏆 综合排名
              </span>
            </div>
            <div style={{ fontSize: 14, marginTop: 14 }}>
              中国企业排名动画演示 · 展示排名变化。
            </div>
            <div style={{ fontSize: 12, color: "#65655e", marginTop: 20 }}>
              ◷ 排名攀升动效 · 11家企业 · 示例分值
            </div>
          </div>
          <div
            style={{
              height: 55,
              padding: "0 32px",
              display: "flex",
              alignItems: "center",
              fontSize: 13,
              borderTop: "1px solid #ecebe4",
              color: "#54554f",
            }}
          >
            ⌘ 筛选条件
            <span style={{ marginLeft: "auto" }}>
              企业{" "}
              <span
                style={{
                  padding: "8px 16px",
                  background: "#e8e6df",
                  borderRadius: 6,
                }}
              >
                综合榜
              </span>
              | ↗
            </span>
          </div>
          <div
            style={{
              position: "absolute",
              top: 282,
              left: 26,
              right: 26,
              height: 64,
              display: "grid",
              gridTemplateColumns: "176px 397px 230px 140px 161px",
              alignItems: "center",
              border: "1px solid #e0e1dc",
              borderRadius: 7,
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            <span style={{ textAlign: "center" }}>企业排名 ↕</span>
            <span style={{ paddingLeft: 27 }}>公司 ↕</span>
            <span>示意评分 ⓘ ↓</span>
            <span style={{ textAlign: "center" }}>综合位次 ↕</span>
            <span style={{ textAlign: "center" }}>排名区间 ⓘ</span>
          </div>
          {labs.map((lab, index) => (
            <Row key={lab.name} lab={lab} index={index} />
          ))}
          <Row lab={highlightedCompany} index={10} selected />
        </div>
      </div>
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: `radial-gradient(ellipse at 48% 48%,transparent 25%,rgba(68,60,49,${interpolate(t, [0, 6.2, 7.4], [0.24, 0.17, 0.04], clamp)}) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
export const MyComposition = () => (
  <Composition
    id="RankingRise"
    component={RankingRise}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={240}
  />
);
