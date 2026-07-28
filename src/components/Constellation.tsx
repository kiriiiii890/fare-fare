"use client";

import { useState } from "react";

const stars = [
  { word: "THÔNG", x: 120, y: 260, message: "Thông điệp #1 sẽ được cập nhật sau." },
  { word: "ĐIỆP", x: 230, y: 150, message: "Thông điệp #2 sẽ được cập nhật sau." },
  { word: "TỪ", x: 300, y: 340, message: "Thông điệp #3 sẽ được cập nhật sau." },
  { word: "NHỮNG", x: 430, y: 430, message: "Thông điệp #4 sẽ được cập nhật sau." },
  { word: "VÌ", x: 620, y: 180, message: "Thông điệp #5 sẽ được cập nhật sau." },
  { word: "SAO", x: 760, y: 400, message: "Thông điệp #6 sẽ được cập nhật sau." },
];

const links: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
];

// Vệt dẫn gấp khúc từ khoảng trống, dẫn vào ngôi sao đầu tiên (THÔNG).
const leadIn = "M 20 15 L 140 95 L 55 150 L 60 190";
const leadInDot = { x: 60, y: 190 };

// Vệt đuôi bắt chéo từ ngôi sao cuối (SAO): 1 nét ngắn chếch lên rồi 1 nét dài chéo xuống.
const trailOutA = { x: 850, y: 330 };
const trailOutB = { x: 700, y: 515 };
const trailOut = "M 760 400 L 850 330 L 700 515";

const POPUP_WIDTH = 220;
const POPUP_HEIGHT = 100;

function popupPosition(star: { x: number; y: number }) {
  const flipX = star.x > 450;
  const flipY = star.y < 110;
  return {
    x: flipX ? star.x - POPUP_WIDTH - 20 : star.x + 20,
    y: flipY ? star.y + 20 : star.y - POPUP_HEIGHT - 14,
  };
}

const twinkles = [
  { top: "12%", left: "8%", delay: "0s" },
  { top: "22%", left: "82%", delay: "0.6s" },
  { top: "68%", left: "88%", delay: "1.2s" },
  { top: "80%", left: "18%", delay: "0.3s" },
  { top: "40%", left: "48%", delay: "0.9s" },
  { top: "88%", left: "60%", delay: "1.5s" },
  { top: "8%", left: "55%", delay: "1.8s" },
];

export default function Constellation() {
  const [active, setActive] = useState<number | null>(null);
  const activeStar = active !== null ? stars[active] : null;

  const clear = (i: number) =>
    setActive((cur) => (cur === i ? null : cur));
  const toggle = (i: number) =>
    setActive((cur) => (cur === i ? null : i));

  return (
    <section
      id="thong-diep"
      className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-b from-background via-background-alt to-background py-28"
    >
      {twinkles.map((t, i) => (
        <span
          key={i}
          className="absolute h-1 w-1 animate-pulse rounded-full bg-gold-soft/70"
          style={{ top: t.top, left: t.left, animationDelay: t.delay }}
        />
      ))}

      <div className="mx-auto w-full max-w-5xl px-6">
        <svg
          viewBox="0 0 900 520"
          preserveAspectRatio="xMidYMid meet"
          className="mx-auto w-full overflow-visible"
        >
          <g className="stroke-gold-soft/30" strokeWidth="1">
            {links.map(([a, b], i) => (
              <line
                key={i}
                x1={stars[a].x}
                y1={stars[a].y}
                x2={stars[b].x}
                y2={stars[b].y}
              />
            ))}
            <path d={leadIn} fill="none" />
            <line
              x1={leadInDot.x}
              y1={leadInDot.y}
              x2={stars[0].x}
              y2={stars[0].y}
            />
            <path d={trailOut} fill="none" />
          </g>

          <circle
            cx={leadInDot.x}
            cy={leadInDot.y}
            r="3"
            className="fill-gold-soft/50"
          />
          <circle
            cx={trailOutA.x}
            cy={trailOutA.y}
            r="3"
            className="fill-gold-soft/50"
          />
          <circle
            cx={trailOutB.x}
            cy={trailOutB.y}
            r="3"
            className="fill-gold-soft/50"
          />

          {stars.map((s, i) => (
            <g
              key={s.word}
              className="cursor-pointer"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => clear(i)}
              onClick={() => toggle(i)}
            >
              {/* vùng bắt hover/tap rộng hơn, trong suốt */}
              <circle cx={s.x} cy={s.y} r="22" fill="transparent" />
              <circle
                cx={s.x}
                cy={s.y}
                r={active === i ? 6 : 4}
                className={`transition-all duration-200 ${
                  active === i ? "fill-gold" : "fill-gold-soft"
                }`}
              />
              <text
                x={s.x + 20}
                y={s.y + 8}
                className={`font-display text-2xl tracking-[0.15em] transition-colors duration-200 sm:text-3xl ${
                  active === i ? "fill-gold" : "fill-foreground"
                }`}
              >
                {s.word}
              </text>
            </g>
          ))}

          {activeStar && (
            <foreignObject
              {...popupPosition(activeStar)}
              width={POPUP_WIDTH}
              height={POPUP_HEIGHT}
              className="pointer-events-none overflow-visible"
            >
              <div className="pointer-events-none rounded-lg border border-gold/40 bg-background-alt/95 px-4 py-3 font-body text-xs leading-relaxed text-foreground shadow-lg shadow-black/50">
                {activeStar.message}
              </div>
            </foreignObject>
          )}
        </svg>

        <div className="mx-auto mt-16 max-w-md text-center">
          <p className="font-body text-sm text-muted">
            Di chuột (hoặc chạm) vào từng vì sao để nhận thông điệp riêng.
          </p>
        </div>
      </div>
    </section>
  );
}
