"use client";

import { useState } from "react";
import { withBasePath } from "@/lib/base-path";

// Toạ độ dò lại từ ảnh tham khảo design/vergo.png bằng phân tích điểm ảnh
// (đo độ sáng dọc theo từng cặp điểm để xác nhận đúng cạnh nối, không ước
// lượng bằng mắt). Phần giữa là một hình thang khép kín (KHÔNG có đường
// chéo cắt qua giữa): cạnh trên nối 2 đỉnh trên, cạnh trái nối đỉnh trái
// xuống Từ, cạnh phải nối đỉnh phải xuống Vì, cạnh đáy đi từ Từ qua điểm
// giữa rồi tới Vì. Chỉ 6 điểm sáng nhất mang từ + thông điệp.
const points: {
  x: number;
  y: number;
  word?: string;
  message?: string;
}[] = [
  {
    x: 212,
    y: 60,
    word: "THÔNG",
    message:
      "Thông suốt tâm trí, thả trôi những muộn phiền không còn cần thiết. Khi tâm an, trái tim mới thực sự được thảnh thơi.",
  }, // 0 — mút trên cùng
  {
    x: 349,
    y: 169,
    word: "ĐIỆP",
    message:
      "Điệp khúc của vạn vật vốn luôn là sự đổi thay. Vậy nên đừng ngại tỏa sáng theo đúng nhịp điệu của riêng bạn.",
  }, // 1 — điểm gấp khúc nhánh trên-trái
  {
    x: 402,
    y: 265,
    word: "TỪ",
    message:
      "Từ bỏ những điều đã cũ chính là cách bạn mở lòng. Để đón nhận muôn vàn phép màu mới đang chờ phía trước.",
  }, // 2 — đỉnh trái của hình thang giữa
  {
    x: 545,
    y: 288,
    word: "NHỮNG",
    message:
      "Những bước đi nhỏ bé hôm nay tưởng chừng như vô nghĩa. Nhưng chúng đang âm thầm dệt nên ước mơ lớn của tương lai.",
  }, // 3 — đỉnh phải của hình thang giữa
  { x: 612, y: 185 }, // 4 — mút trên bên phải
  { x: 147, y: 198 }, // 5 — mút trái (xa nhất bên trái)
  { x: 226, y: 264 }, // 6 — điểm gấp khúc nhánh trái (khúc 1)
  { x: 214, y: 328 }, // 7 — điểm gấp khúc nhánh trái (khúc 2, sát trước Từ)
  { x: 329, y: 419 }, // 8 — đỉnh dưới-trái của hình thang giữa, đầu mối 4 nhánh
  { x: 431, y: 384 }, // 9 — điểm giữa cạnh đáy
  {
    x: 563,
    y: 396,
    word: "VÌ",
    message:
      "Vì bạn là một phiên bản độc bản, không ai có thể thay thế. Hãy luôn tự hào về chặng đường mình đã đi qua.",
  }, // 10 — đỉnh dưới-phải của hình thang giữa, đầu mối nhánh phải-dưới
  { x: 638, y: 435 }, // 11 — điểm gấp khúc nhánh phải dưới
  {
    x: 753,
    y: 460,
    word: "SAO",
    message:
      "Sao phải lo lắng khi bầu trời đêm càng tối? Bởi khi ấy, ánh sáng của bạn lại càng thêm lung linh.",
  }, // 12 — mút phải dưới cùng
];

const links: [number, number][] = [
  [0, 1], // mút trên -> gấp khúc
  [1, 2], // gấp khúc -> đỉnh trái tam giác
  [2, 3], // cạnh trên hình thang: đỉnh trái -> đỉnh phải
  [2, 8], // cạnh trái hình thang: đỉnh trái -> Từ
  [3, 10], // cạnh phải hình thang: đỉnh phải -> Vì
  [4, 3], // mút trên-phải -> đỉnh phải hình thang
  [5, 6], // mút trái -> gấp khúc nhánh trái (khúc 1)
  [6, 7], // gấp khúc khúc 1 -> gấp khúc khúc 2
  [7, 8], // gấp khúc khúc 2 -> Từ
  [8, 9], // cạnh đáy: trái -> giữa
  [9, 10], // cạnh đáy: giữa -> phải
  [10, 11], // gấp khúc nhánh phải-dưới
  [11, 12], // gấp khúc -> mút phải dưới cùng
];

// Tách message thành 2 câu để hiển thị thành 2 dòng riêng ở panel lớn.
function splitSentences(message: string): string[] {
  return message.match(/[^.?!]+[.?!]/g)?.map((s) => s.trim()) ?? [message];
}

// Độ trễ (ms) giữa các từ khi hiện dần thông điệp.
const WORD_STAGGER_MS = 90;

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
  const activeStar = active !== null ? points[active] : null;

  return (
    <section
      id="thong-diep"
      className="relative flex min-h-screen items-center overflow-hidden py-28"
    >
      <img
        src={withBasePath("/images/background/bg-star1-optimized.webp")}
        alt=""
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-background/40" />
      {/* Bóng mờ 2 mép trên/dưới để chuyển tiếp mượt sang section liền kề */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-background to-transparent sm:h-48" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-background to-transparent sm:h-48" />

      {twinkles.map((t, i) => (
        <span
          key={i}
          className="absolute h-1 w-1 animate-pulse rounded-full bg-gold-soft/70"
          style={{ top: t.top, left: t.left, animationDelay: t.delay }}
        />
      ))}

      <div className="relative mx-auto flex w-full max-w-[90rem] flex-col items-center gap-12 px-6 lg:min-h-[560px] lg:flex-row lg:justify-center lg:gap-0">
        <div
          className={`w-full max-w-3xl shrink-0 transition-transform duration-700 ease-in-out ${
            activeStar ? "lg:-translate-x-[14rem]" : "lg:translate-x-0"
          }`}
        >
          <svg
            viewBox="0 0 900 520"
            preserveAspectRatio="xMidYMid meet"
            className="w-full overflow-visible"
            onClick={() => setActive(null)}
          >
            <g className="stroke-gold-soft/30" strokeWidth="1">
              {links.map(([a, b], i) => (
                <line
                  key={i}
                  x1={points[a].x}
                  y1={points[a].y}
                  x2={points[b].x}
                  y2={points[b].y}
                />
              ))}
            </g>

            {points.map((p, i) =>
              p.word ? (
                <g
                  key={p.word}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActive(i);
                  }}
                >
                  {/* vùng bắt click/tap rộng hơn, trong suốt */}
                  <circle cx={p.x} cy={p.y} r="22" fill="transparent" />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={active === i ? 6 : 4}
                    className={`transition-all duration-200 ${
                      active === i ? "fill-gold" : "fill-gold-soft"
                    }`}
                  />
                  <text
                    x={p.x + 20}
                    y={p.y + 8}
                    className={`font-display text-2xl tracking-[0.15em] transition-colors duration-200 sm:text-3xl ${
                      active === i ? "fill-gold" : "fill-foreground"
                    }`}
                  >
                    {p.word}
                  </text>
                </g>
              ) : (
                // Điểm nối thuần trang trí, không có từ/thông điệp — chỉ để
                // vẽ đúng dáng chòm sao Virgo.
                <circle key={i} cx={p.x} cy={p.y} r="3" className="fill-gold-soft/50" />
              ),
            )}
          </svg>
        </div>

        <div
          className={`flex min-h-[220px] w-full max-w-xl items-center justify-center text-center transition-all duration-700 ease-in-out lg:absolute lg:right-0 lg:top-1/2 lg:min-h-0 lg:max-w-lg lg:-translate-y-1/2 lg:justify-start lg:text-left ${
            activeStar
              ? "lg:translate-x-0 lg:opacity-100"
              : "lg:translate-x-12 lg:opacity-0 lg:pointer-events-none"
          }`}
        >
          {activeStar ? (
            <div key={active}>
              {(() => {
                let wordIndex = 0;
                return splitSentences(activeStar.message ?? "").map(
                  (sentence, si) => (
                    <p
                      key={si}
                      className={`font-body text-2xl leading-relaxed text-foreground sm:text-3xl ${
                        si > 0 ? "mt-4" : ""
                      }`}
                    >
                      {sentence
                        .split(/(\s+)/)
                        .filter((token) => token.length > 0)
                        .map((token, ti) => {
                          if (/^\s+$/.test(token)) return token;
                          const isFirstWord = si === 0 && wordIndex === 0;
                          const delay = wordIndex * WORD_STAGGER_MS;
                          wordIndex += 1;
                          return (
                            <span
                              key={ti}
                              className={`inline-block animate-[message-fade_0.4s_ease-out_backwards] ${
                                isFirstWord ? "font-display text-gold" : ""
                              }`}
                              style={{ animationDelay: `${delay}ms` }}
                            >
                              {token}
                            </span>
                          );
                        })}
                    </p>
                  ),
                );
              })()}
            </div>
          ) : (
            <p className="font-body text-lg text-muted">
              Di chuột (hoặc chạm) vào từng vì sao để nhận thông điệp riêng.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
