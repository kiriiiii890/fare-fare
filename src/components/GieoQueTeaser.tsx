"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { withBasePath } from "@/lib/base-path";

const SHAKE_DURATION = 700;

export default function GieoQueTeaser() {
  const [open, setOpen] = useState(false);
  const [shaking, setShaking] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleOpen = () => {
    if (open) return;
    setShaking(true);
    timerRef.current = setTimeout(() => {
      setShaking(false);
      setOpen(true);
    }, SHAKE_DURATION);
  };

  return (
    <section
      id="gioi-thieu-gieo-que"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background-alt to-background py-28"
    >
      <div className="mx-auto w-full max-w-5xl px-6 text-center">
        <div
          style={{ transitionDelay: open ? "150ms" : "0ms" }}
          className={`transition-all duration-700 ${
            open
              ? "opacity-100"
              : "pointer-events-none -translate-y-4 opacity-0"
          }`}
        >
          <p className="mb-3 font-display text-xs tracking-[0.4em] text-gold-soft">
            BỘ QUẺ
          </p>
          <h2 className="font-display text-3xl text-foreground sm:text-4xl">
            FAYE Fortune Ticks
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-sm leading-relaxed text-muted">
            78 quẻ xăm minh họa thủ công, giúp bạn lắng lòng trong giây lát và
            xin một lời gợi ý cho những băn khoăn thường nhật. (nội dung tạm,
            sẽ cập nhật sau)
          </p>
        </div>

        <div className="relative mt-10 flex min-h-[420px] flex-col items-center justify-center gap-10">
          <button
            type="button"
            onClick={handleOpen}
            aria-label={open ? "Đã mở ống quẻ" : "Mở ống quẻ"}
            className="group flex flex-col items-center"
          >
            {!open && (
              <div
                style={{
                  animation: shaking
                    ? `box-shake ${SHAKE_DURATION}ms ease-in-out`
                    : undefined,
                }}
                className="flex w-32 flex-col items-center transition-transform duration-300 group-hover:-translate-y-1 sm:w-40"
              >
                <div
                  style={{
                    animation: shaking
                      ? "lid-pop 400ms ease-in forwards"
                      : undefined,
                  }}
                  className="relative z-20 w-full aspect-[672/716] drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                >
                  <Image
                    src={withBasePath("/images/nap.png")}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="relative z-10 -mt-3 aspect-[1254/2348] w-full sm:-mt-4">
                  <Image
                    src={withBasePath("/images/box-que.png")}
                    alt="Ống quẻ FAYE Fortune"
                    fill
                    className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                  />
                </div>
              </div>
            )}

            {open && (
              <div
                style={{ animation: "reveal-up 0.6s ease-out both" }}
                className="w-32 sm:w-40"
              >
                <div className="relative aspect-[1254/2348] w-full">
                  <Image
                    src={withBasePath("/images/box-que.png")}
                    alt="Ống quẻ FAYE Fortune"
                    fill
                    className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                  />
                </div>
              </div>
            )}
          </button>

          {!open && (
            <span className="font-body text-xs tracking-[0.3em] text-muted">
              CHẠM ĐỂ MỞ ỐNG QUẺ
            </span>
          )}

          {open && (
            <Link
              href="/gieo-que"
              style={{ animation: "reveal-up 0.6s ease-out both", animationDelay: "200ms" }}
              className="rounded-full border border-gold/50 px-6 py-2 font-body text-xs tracking-[0.2em] text-gold-soft opacity-0 transition-colors hover:border-gold hover:text-gold"
            >
              XEM CHI TIẾT
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
