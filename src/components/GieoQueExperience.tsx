"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { withBasePath } from "@/lib/base-path";
import { queSticks } from "@/lib/que";

// que-ht-01 chưa có chữ (bản nháp) nên chỉ dùng làm que "phím" ló ra lúc lắc
// hộp — kết quả thật rút ra luôn nằm trong nhóm đã có nội dung.
const DRAWABLE = queSticks.filter((s) => s.id !== "01");
const PEEK_STICK = queSticks.find((s) => s.id === "01") ?? queSticks[0];

const SHAKE_DURATION = 1700;

// Ảnh que thiết kế theo chiều dọc (chữ nằm ngang khi xoay 90°) — banner kết
// quả xoay lại để đọc được trọn câu, kích thước cố định vì banner sau khi
// xoay rất dài (tỉ lệ ~12.6:1), không co giãn theo breakpoint được.
const BANNER_H = 120;
const BANNER_W = Math.round(BANNER_H * (2245 / 178));

type Phase = "closed" | "shaking" | "revealed";

export default function GieoQueExperience() {
  const [phase, setPhase] = useState<Phase>("closed");
  const [result, setResult] = useState(DRAWABLE[0]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDraw = () => {
    if (phase !== "closed") return;
    setResult(DRAWABLE[Math.floor(Math.random() * DRAWABLE.length)]);
    setPhase("shaking");
    timerRef.current = setTimeout(() => setPhase("revealed"), SHAKE_DURATION);
  };

  const reset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase("closed");
  };

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background-alt to-background px-6 py-28">
      <div className="mx-auto w-full max-w-2xl text-center">
        <p className="mb-3 font-display text-xs tracking-[0.4em] text-gold-soft">
          BỘ QUẺ
        </p>
        <h1 className="font-display text-3xl text-foreground sm:text-4xl">
          Gieo Quẻ
        </h1>
        <p className="mx-auto mt-4 max-w-md font-body text-sm leading-relaxed text-muted">
          Lặng lòng trong giây lát, chạm vào ống quẻ và để trực giác chọn ra
          lời nhắn dành cho bạn lúc này.
        </p>

        <div className="relative mx-auto mt-16 flex min-h-[640px] w-full flex-col items-center justify-end">
          {/* "Hộp" = nắp + ống xếp chồng trực tiếp lên nhau (không overlay đè
              vào nhau) — cả cụm cùng chịu hiệu ứng rung khi lắc quẻ. */}
          <div
            style={{
              animation:
                phase === "shaking"
                  ? `box-shake ${SHAKE_DURATION}ms ease-in-out`
                  : undefined,
            }}
            className="flex w-56 flex-col items-center sm:w-72"
          >
            {/* Nắp — chiều ngang khớp đúng chiều ngang ống, nằm ngay trên
                đỉnh ống, bật ra khi bấm gieo quẻ. */}
            {phase !== "revealed" && (
              <div
                style={{
                  animation:
                    phase === "shaking"
                      ? "lid-pop 500ms ease-in forwards"
                      : undefined,
                }}
                className="relative z-20 w-full aspect-[672/716]"
              >
                <Image
                  src={withBasePath("/images/nap.png")}
                  alt=""
                  fill
                  className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]"
                />
              </div>
            )}

            {/* Ống quẻ — kéo âm lên vài px để miệng ống (phần elip lõm vào,
                sâu ~5% chiều cao ống) chui khuất sau nắp, tránh lộ khe hở
                giữa 2 ảnh vốn được vẽ riêng, không khớp tuyệt đối đường cong. */}
            <div className="relative z-10 -mt-5 aspect-[1254/2348] w-full overflow-visible sm:-mt-7">
              {/* Que gieo — nằm dưới (z thấp hơn) để phần thân dài ẩn sau
                  lưng ống, chỉ phần đầu (biểu tượng, chưa tới chữ) trồi lên
                  khỏi miệng ống — mép trên của ống chính là chỗ nắp vừa xếp
                  lên, nên neo que bằng `bottom` tính theo % chiều cao ống. */}
              <div
                style={{
                  left: "50%",
                  bottom: phase === "revealed" ? "90%" : "50%",
                  transform: "translateX(-50%)",
                  transition:
                    phase === "revealed"
                      ? "bottom 900ms cubic-bezier(0.22,1,0.36,1)"
                      : "bottom 300ms ease",
                }}
                className="absolute z-0 h-28 w-14 overflow-hidden rounded-t-full sm:h-36 sm:w-[4.5rem]"
              >
                <Image
                  src={withBasePath(
                    `/images/${phase === "revealed" ? result.file : PEEK_STICK.file}`
                  )}
                  alt=""
                  fill
                  className="object-cover object-top"
                />
              </div>

              <Image
                src={withBasePath("/images/box-que.png")}
                alt="Ống quẻ FAYE Fortune"
                fill
                priority
                className="object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.55)]"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleDraw}
            disabled={phase !== "closed"}
            aria-label="Gieo quẻ"
            className={`absolute inset-0 z-30 ${
              phase === "closed" ? "cursor-pointer" : "pointer-events-none"
            }`}
          />
        </div>

        {phase === "revealed" && (
          <div
            style={{ animation: "message-fade 600ms ease-out both" }}
            className="mt-10 w-full"
          >
            {/* Ảnh que vẽ theo chiều dọc nên xoay 90° để đọc ngang được —
                khung ngoài giữ đúng kích thước đã xoay, khung trong giữ
                nguyên tỉ lệ gốc rồi xoay quanh tâm cho khớp. */}
            <div className="w-full overflow-x-auto pb-2">
              <div
                className="relative mx-auto"
                style={{ height: BANNER_H, width: BANNER_W }}
              >
                <div
                  className="absolute left-1/2 top-1/2"
                  style={{
                    width: BANNER_H,
                    height: BANNER_W,
                    transform: "translate(-50%, -50%) rotate(90deg)",
                  }}
                >
                  <Image
                    src={withBasePath(`/images/${result.file}`)}
                    alt={`Quẻ số ${result.id}`}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
            <p className="mt-3 text-center font-body text-[10px] tracking-[0.3em] text-muted">
              VUỐT NGANG ĐỂ ĐỌC TRỌN QUẺ
            </p>
          </div>
        )}

        <div className="mt-10 flex min-h-[52px] flex-col items-center justify-center gap-4">
          {phase === "closed" && (
            <span
              style={{ animation: "message-fade 500ms ease-out both" }}
              className="font-body text-xs tracking-[0.3em] text-muted"
            >
              CHẠM VÀO ỐNG QUẺ ĐỂ GIEO QUẺ
            </span>
          )}
          {phase === "shaking" && (
            <span
              style={{ animation: "message-fade 500ms ease-out both" }}
              className="font-body text-xs tracking-[0.3em] text-muted"
            >
              ĐANG LẮC QUẺ...
            </span>
          )}
          {phase === "revealed" && (
            <button
              type="button"
              onClick={reset}
              style={{ animation: "message-fade 600ms ease-out both" }}
              className="rounded-full border border-gold/50 px-6 py-2 font-body text-xs tracking-[0.2em] text-gold-soft transition-colors hover:border-gold hover:text-gold"
            >
              GIEO LẠI
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
