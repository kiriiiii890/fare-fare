"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { withBasePath } from "@/lib/base-path";
import {
  queSticks,
  QUE_BACK,
  PEEK_STICKS,
  STICK_W_SM,
  type QueStick,
} from "@/lib/que";

const DRAWABLE: readonly QueStick[] = queSticks;

const SHAKE_DURATION = 1700;

// Ảnh que đã thiết kế sẵn theo chiều ngang (banner bo tròn 2 đầu), không cần
// xoay khi hiển thị. Tỉ lệ ~12.6:1 nên chiều rộng được ràng buộc theo
// viewport (CSS var --banner-w) để luôn vừa khít màn hình, chiều cao suy ra
// theo đúng tỉ lệ gốc của ảnh.
const BANNER_RATIO = 2245 / 178;

type Phase = "closed" | "shaking" | "revealed";

export default function GieoQueExperience() {
  const [phase, setPhase] = useState<Phase>("closed");
  const [result, setResult] = useState(DRAWABLE[0]);
  // Quẻ hiện mặt úp trước, người dùng chạm vào mới lật ra mặt trước (kết quả).
  const [flipped, setFlipped] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDraw = () => {
    if (phase !== "closed") return;
    setResult(DRAWABLE[Math.floor(Math.random() * DRAWABLE.length)]);
    setFlipped(false);
    setPhase("shaking");
    timerRef.current = setTimeout(() => setPhase("revealed"), SHAKE_DURATION);
  };

  const reset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setFlipped(false);
    setPhase("closed");
  };

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-28">
      <img
        src={withBasePath("/images/background/bg-6.png")}
        alt=""
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-background/40" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-background to-transparent sm:h-48" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-background to-transparent sm:h-48" />

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

        <div className="relative mx-auto mt-28 flex min-h-[360px] w-full flex-col items-center justify-end">
          {/* "Hộp" = nắp + ống xếp chồng trực tiếp lên nhau (không overlay đè
              vào nhau) — cả cụm cùng chịu hiệu ứng rung khi lắc quẻ. Luôn
              `relative` và giữ nguyên chiều cao ở mọi phase (nắp chỉ ẩn bằng
              opacity, không unmount) nên vị trí hộp không bao giờ bị nhảy. */}
          <div
            style={{
              animation:
                phase === "shaking"
                  ? `box-shake ${SHAKE_DURATION}ms ease-in-out`
                  : undefined,
            }}
            className="relative flex w-28 flex-col items-center sm:w-40"
          >
            {/* Quẻ gieo ra — định vị `absolute` phía trên cụm nắp+ống nên
                không đẩy layout, tránh làm hộp bị dịch chuyển khi xuất hiện.
                Hiện mặt úp trước, chạm vào mới lật sang mặt trước (kết quả). */}
            {phase === "revealed" && (
              <button
                type="button"
                onClick={() => setFlipped(true)}
                aria-label={flipped ? `Quẻ số ${result.id}` : "Lật quẻ"}
                className="absolute left-1/2 -translate-x-1/2 [perspective:1200px]"
                style={
                  {
                    bottom: "calc(100% + 35px)",
                    animation: "message-fade 600ms ease-out both",
                    "--banner-w": "min(92vw, 676px)",
                    width: "var(--banner-w)",
                    height: `calc(var(--banner-w) / ${BANNER_RATIO})`,
                    cursor: flipped ? "default" : "pointer",
                  } as React.CSSProperties
                }
              >
                <div
                  className="relative h-full w-full [transform-style:preserve-3d] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ transform: flipped ? "rotateX(180deg)" : "rotateX(0deg)" }}
                >
                  {/* Mặt úp */}
                  <div className="absolute inset-0 [backface-visibility:hidden]">
                    <Image
                      src={withBasePath(`/images/${QUE_BACK}`)}
                      alt=""
                      fill
                      className="object-contain"
                    />
                  </div>
                  {/* Mặt trước — kết quả thật */}
                  <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateX(180deg)]">
                    <Image
                      src={withBasePath(`/images/${result.file}`)}
                      alt={`Quẻ số ${result.id}`}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </button>
            )}

            {/* Nắp — chiều ngang khớp đúng chiều ngang ống, nằm ngay trên
                đỉnh ống, bật ra khi bấm gieo quẻ. Luôn giữ trong layout (chỉ
                đổi opacity/transform, không unmount) để chiều cao cụm
                nắp+ống không đổi giữa các phase, tránh ống bị nhảy vị trí. */}
            <div
              style={
                phase === "shaking"
                  ? { animation: "lid-pop 500ms ease-in forwards" }
                  : phase === "revealed"
                    ? {
                        opacity: 0,
                        transform: "translateY(-70px) rotate(-24deg)",
                        pointerEvents: "none",
                      }
                    : undefined
              }
              className="relative z-20 w-full aspect-[672/716]"
            >
              <Image
                src={withBasePath("/images/que/nap.png")}
                alt=""
                fill
                className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]"
              />
            </div>

            {/* Ống quẻ — kéo âm lên vài px để miệng ống (phần elip lõm vào,
                sâu ~5% chiều cao ống) chui khuất sau nắp, tránh lộ khe hở
                giữa 2 ảnh vốn được vẽ riêng, không khớp tuyệt đối đường cong. */}
            <div className="relative z-10 -mt-5 aspect-[1254/2348] w-full overflow-visible sm:-mt-7">
              {/* Lớp 1: thân ống (nền) — có cả miệng ống hình elip ở đỉnh. */}
              <Image
                src={withBasePath("/images/que/box-que.png")}
                alt="Ống quẻ FAYE Fortune"
                fill
                priority
                className="object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.55)]"
              />

              {/* Lớp 2: que gieo — luôn hiện mặt sau (chung cho mọi que, chưa
                  lộ kết quả), xếp lệch + dài ngắn khác nhau cho giống một bó
                  que thật xếp lộn xộn. Nằm trên lớp thân ống nhưng dưới lớp
                  mặt trước ống (lớp 3) nên phần chân que bị che khuất, chỉ
                  thấy đoạn thò ra khỏi miệng ống. Khi có kết quả, cả bó trồi
                  hẳn lên rồi banner mặt trước hiện riêng bên trên. */}
              {PEEK_STICKS.map((s, i) => (
                <div
                  key={i}
                  style={{
                    left: "50%",
                    bottom: phase === "revealed" ? "90%" : "50%",
                    transform: `translateX(calc(-50% + ${s.x}px)) rotate(${s.rotate}deg)`,
                    transition:
                      phase === "revealed"
                        ? "bottom 900ms cubic-bezier(0.22,1,0.36,1)"
                        : "bottom 300ms ease",
                  }}
                  className={`absolute z-10 w-6 origin-bottom overflow-hidden rounded-t-full sm:w-8 ${s.height}`}
                >
                  {/* Ảnh que trong project vẽ theo chiều ngang, còn khung que
                      ở đây theo chiều đứng — xoay 90° rồi mới object-cover
                      để lấp đầy khung, thay vì chỉ crop 1 lát dọc hẹp. */}
                  <div
                    className="absolute left-1/2 top-1/2"
                    style={{
                      width: s.smH,
                      height: STICK_W_SM,
                      transform: "translate(-50%, -50%) rotate(90deg)",
                    }}
                  >
                    <Image
                      src={withBasePath(`/images/${QUE_BACK}`)}
                      alt=""
                      fill
                      className="object-cover object-center"
                    />
                  </div>
                </div>
              ))}

              {/* Lớp 3: mặt trước ống — cùng ảnh với lớp 1 nhưng cắt bỏ phần
                  miệng ống (khớp pixel khi phóng theo đúng tỉ lệ, lệch top
                  60/2348 ≈ 2.56% so với lớp 1). Che phần chân que, chỉ để lộ
                  miệng ống ở đỉnh — nhìn như que đang nằm bên trong ống. */}
              <div
                className="absolute inset-x-0 z-20"
                style={{ top: "2.5554%", height: "97.4446%" }}
              >
                <Image
                  src={withBasePath("/images/que/box-que-2.png")}
                  alt=""
                  fill
                  className="object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.55)]"
                />
              </div>
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
          {phase === "revealed" && !flipped && (
            <span
              style={{ animation: "message-fade 500ms ease-out both" }}
              className="font-body text-xs tracking-[0.3em] text-muted"
            >
              CHẠM VÀO QUẺ ĐỂ XEM KẾT QUẢ
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
