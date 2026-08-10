"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { withBasePath } from "@/lib/base-path";
import { QUE_BACK, PEEK_STICKS, STICK_W_SM } from "@/lib/que";

const SHAKE_DURATION = 1700;

type Phase = "closed" | "shaking" | "open";

export default function GieoQueIntro() {
  const [phase, setPhase] = useState<Phase>("closed");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleShake = () => {
    if (phase !== "closed") return;
    setPhase("shaking");
    timerRef.current = setTimeout(() => setPhase("open"), SHAKE_DURATION);
  };

  return (
    <section
      id="gioi-thieu-gieo-que"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-28"
    >
      <img
        src={withBasePath("/images/background/bg-5.png")}
        alt=""
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-background/40" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-background to-transparent sm:h-48" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-background to-transparent sm:h-48" />

      <div className="mx-auto w-full max-w-2xl text-center sm:max-w-4xl">
        <p className="mb-3 font-display text-xs tracking-[0.4em] text-gold-soft">
          BỘ QUẺ
        </p>
        <h2 className="font-display text-3xl text-foreground sm:text-4xl">
          Fortune Ticks
        </h2>
        <p className="mx-auto mt-4 max-w-md font-body text-base leading-relaxed text-muted sm:max-w-4xl sm:text-lg">
          FAYE Fortune Ticks là bộ 78 quẻ xăm minh họa thủ công, lấy cảm hứng
          từ hình thức xin xăm truyền thống nhưng khoác lên một diện mạo hiện
          đại, gần gũi. Mỗi quẻ là một lời nhắn ngắn — không phán xét, không
          phức tạp — chỉ đơn giản là một khoảnh khắc để bạn dừng lại, lắng
          nghe trực giác và tìm một gợi ý cho những băn khoăn thường nhật, dù
          là chuyện tình cảm, công việc hay những quyết định nhỏ trong cuộc
          sống.
        </p>

        <div className="relative mx-auto mt-16 flex min-h-[360px] w-full flex-col items-center justify-end">
          {/* "Hộp" = nắp + ống xếp chồng trực tiếp lên nhau (không overlay đè
              vào nhau) — cả cụm cùng chịu hiệu ứng rung khi lắc. Luôn
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
            {/* Nắp — chiều ngang khớp đúng chiều ngang ống, nằm ngay trên
                đỉnh ống, bật ra khi bấm lắc. Luôn giữ trong layout (chỉ đổi
                opacity/transform, không unmount) để chiều cao cụm nắp+ống
                không đổi giữa các phase, tránh ống bị nhảy vị trí. */}
            <div
              style={
                phase === "shaking"
                  ? { animation: "lid-pop 500ms ease-in forwards" }
                  : phase === "open"
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
                className="object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.55)]"
              />

              {/* Lớp 2: que — luôn hiện mặt sau, xếp lệch + dài ngắn khác
                  nhau cho giống một bó que thật xếp lộn xộn. Nằm trên lớp
                  thân ống nhưng dưới lớp mặt trước ống (lớp 3) nên phần
                  chân que bị che khuất, chỉ thấy đoạn thò ra khỏi miệng
                  ống. Khi mở hộp, cả bó trồi lên khỏi miệng ống. */}
              {PEEK_STICKS.map((s, i) => (
                <div
                  key={i}
                  style={{
                    left: "50%",
                    bottom: phase === "open" ? "90%" : "50%",
                    transform: `translateX(calc(-50% + ${s.x}px)) rotate(${s.rotate}deg)`,
                    transition:
                      phase === "open"
                        ? "bottom 900ms cubic-bezier(0.22,1,0.36,1)"
                        : "bottom 300ms ease",
                  }}
                  className={`absolute z-10 w-6 origin-bottom overflow-hidden rounded-t-full sm:w-8 ${s.height}`}
                >
                  {/* Lớp rung riêng cho từng que — mỗi que một hướng
                      (theo phía lệch trái/phải so với tâm) và một vận tốc
                      (duration khác nhau) để trông như que thật xóc lộn xộn
                      trong ống, không đơ đồng loạt theo cụm hộp. */}
                  <div
                    style={
                      phase === "shaking"
                        ? {
                            animation: `${
                              s.x < 0 ? "stick-shake-a" : "stick-shake-b"
                            } ${260 + i * 45}ms ease-in-out infinite`,
                          }
                        : undefined
                    }
                    className="absolute inset-0"
                  >
                    {/* Ảnh mặt sau vẽ theo chiều ngang, khung que theo chiều
                        đứng — xoay 90° rồi mới object-cover để lấp đầy khung,
                        thay vì chỉ crop 1 lát dọc hẹp. */}
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
            onClick={handleShake}
            disabled={phase !== "closed"}
            aria-label="Lắc ống quẻ"
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
              CHẠM VÀO ỐNG QUẺ ĐỂ LẮC
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
          {phase === "open" && (
            <Link
              href="/gieo-que"
              style={{ animation: "message-fade 600ms ease-out both" }}
              className="rounded-full border border-gold/50 px-6 py-2 font-body text-xs tracking-[0.2em] text-gold-soft transition-colors hover:border-gold hover:text-gold"
            >
              XEM CHI TIẾT
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
