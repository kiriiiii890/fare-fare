"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { withBasePath } from "@/lib/base-path";

const previewCards = [
  { name: "Kỵ Sĩ", file: "1-rider.png", rotate: -12 },
  { name: "Cỏ Ba Lá", file: "2-clover.png", rotate: -6 },
  { name: "Con Tàu", file: "3-ship.png", rotate: 0 },
  { name: "Ngôi Nhà", file: "4-house.png", rotate: 6 },
  { name: "Bó Hoa", file: "9-bouquet.png", rotate: 12 },
];

export default function LenormandTeaser() {
  const [open, setOpen] = useState(false);

  return (
    <section
      id="gioi-thieu-lenormand"
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
            BỘ BÀI
          </p>
          <h2 className="font-display text-3xl text-foreground sm:text-4xl">
            FAYE Lenormand
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-sm leading-relaxed text-muted">
            37 lá bài minh họa thủ công, đồng hành cùng bạn trong hành trình
            chiêm nghiệm và kết nối trực giác. (nội dung tạm, sẽ cập nhật sau)
          </p>
        </div>

        <div className="relative mt-10 flex min-h-[420px] flex-col items-center justify-center gap-10">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="group relative h-64 w-40 shrink-0 cursor-pointer sm:h-80 sm:w-48"
            aria-label={open ? "Đóng hộp bài" : "Mở hộp bài"}
          >
            <Image
              src={withBasePath("/images/box/closed.png")}
              alt="Hộp bài Lenormand FAYE"
              fill
              className={`object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-opacity duration-500 group-hover:-translate-y-1 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <Image
              src={withBasePath("/images/box/open.png")}
              alt="Hộp bài Lenormand FAYE đã mở"
              fill
              className={`object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-opacity duration-500 ${
                open ? "opacity-100" : "opacity-0"
              }`}
            />
          </button>

          {!open && (
            <span className="font-body text-xs tracking-[0.3em] text-muted">
              CHẠM ĐỂ MỞ HỘP BÀI
            </span>
          )}

          {open && (
            <>
              <div className="flex flex-wrap items-end justify-center gap-3 sm:gap-4">
                {previewCards.map((c, i) => (
                  <div
                    key={c.name}
                    style={{ animationDelay: `${300 + i * 180}ms` }}
                    className="w-16 origin-bottom animate-[reveal-up_0.6s_ease-out_both] opacity-0 sm:w-24 md:w-28"
                  >
                    <div
                      style={
                        { "--card-rotate": `${c.rotate}deg` } as React.CSSProperties
                      }
                      className="group relative origin-bottom rotate-[var(--card-rotate)] transition-transform duration-300 ease-out hover:z-10 hover:-translate-y-3 hover:scale-110 hover:rotate-0"
                    >
                      <div className="relative aspect-[2/3.4] overflow-hidden rounded-lg border border-gold/40 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] transition-shadow duration-300 group-hover:border-gold group-hover:shadow-[0_18px_40px_-8px_rgba(203,161,53,0.5)]">
                        <Image
                          src={withBasePath(`/images/img-card/${c.file}`)}
                          alt={c.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="mt-2 text-center font-display text-[10px] tracking-wide text-gold-soft transition-colors duration-300 group-hover:text-gold">
                        {c.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/bo-bai"
                style={{
                  animationDelay: `${300 + previewCards.length * 180 + 200}ms`,
                }}
                className="animate-[reveal-up_0.6s_ease-out_both] rounded-full border border-gold/50 px-6 py-2 font-body text-xs tracking-[0.2em] text-gold-soft opacity-0 transition-colors hover:border-gold hover:text-gold"
              >
                XEM CHI TIẾT
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
