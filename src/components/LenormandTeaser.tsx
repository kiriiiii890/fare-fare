"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Box3D from "@/components/Box3D";
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
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden py-28"
    >
      <img
        src={withBasePath("/images/background/bg-4.png")}
        alt=""
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-background/40" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-background to-transparent sm:h-48" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-background to-transparent sm:h-48" />

      <div className="mx-auto w-full max-w-5xl px-6 text-center">
        <div>
          <p className="mb-3 font-display text-xs tracking-[0.4em] text-gold-soft">
            BỘ BÀI
          </p>
          <h2 className="font-display text-3xl text-foreground sm:text-4xl">
            Spirit Lenormand
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-sm leading-relaxed text-muted">
            37 lá bài minh họa thủ công, đồng hành cùng bạn trong hành trình
            chiêm nghiệm và kết nối trực giác. (nội dung tạm, sẽ cập nhật sau)
          </p>
        </div>

        <div className="relative mt-16 flex min-h-[420px] flex-col items-center justify-center gap-10 sm:mt-20">
          <div className="relative h-32 w-72 shrink-0 drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] sm:h-56 sm:w-[26rem]">
            {/* Tỉ lệ thật của hộp: Dài : Rộng : Cao = 25 : 16 : 10. */}
            <Box3D
              width={275}
              depth={176}
              boxHeight={110}
              lidHeight={114}
              boxFaces={{
                bottom: "/images/box/faces/box-back.png",
                front: "/images/box/faces/lid-left.png",
                back: "/images/box/faces/lid-right.png",
                left: "/images/box/faces/lid-top.png",
                right: "/images/box/faces/lid-back.png",
              }}
              boxHiddenFaces={["top"]}
              lidFaces={{
                top: "/images/box/faces/lid-front.png",
                front: "/images/box/faces/lid-left.png",
                back: "/images/box/faces/lid-right.png",
                left: "/images/box/faces/lid-top.png",
                right: "/images/box/faces/lid-back.png",
              }}
              lidHiddenFaces={["bottom"]}
              className="mx-auto scale-[0.6] sm:scale-100"
              onTap={(lidOpen) => setOpen(lidOpen)}
            />
          </div>

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
