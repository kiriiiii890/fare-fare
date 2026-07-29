"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/base-path";

const AUTO_HIDE_DELAY = 3000;
const REVEAL_ZONE = 60;

export default function Header() {
  const [hidden, setHidden] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const lastY = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoveredRef = useRef(false);

  useEffect(() => {
    lastY.current = window.scrollY;

    const scheduleAutoHide = () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => {
        if (!hoveredRef.current) setHidden(true);
      }, AUTO_HIDE_DELAY);
    };

    // Tự ẩn sau 3s kể từ khi vào trang, dù chưa cuộn gì.
    scheduleAutoHide();

    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastY.current;

      if (goingDown && y > 80 && !hoveredRef.current) {
        setHidden(true);
        if (hideTimer.current) clearTimeout(hideTimer.current);
      } else if (!goingDown) {
        setHidden(false);
        scheduleAutoHide();
      }

      lastY.current = y;
    };

    // Dùng toạ độ chuột so với vị trí thật của header (thay vì onMouseEnter/Leave
    // đặt trực tiếp trên header) vì header đang di chuyển bằng CSS transform khi
    // ẩn/hiện, khiến các sự kiện enter/leave trên chính nó bắn ra không ổn định
    // trong lúc animation đang chạy.
    const onMouseMove = (e: MouseEvent) => {
      const rect = headerRef.current?.getBoundingClientRect();
      const overHeader =
        !!rect &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom &&
        e.clientX >= rect.left &&
        e.clientX <= rect.right;
      const nearTop = e.clientY <= REVEAL_ZONE;

      if (overHeader || nearTop) {
        hoveredRef.current = true;
        setHidden(false);
        if (hideTimer.current) clearTimeout(hideTimer.current);
      } else if (hoveredRef.current) {
        hoveredRef.current = false;
        scheduleAutoHide();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 z-50 w-full border-b border-white/5 bg-black/20 backdrop-blur-sm transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-2 items-center gap-4 px-6 py-4 lg:grid-cols-[1fr_auto_1fr]">
        <nav className="hidden gap-6 font-body text-sm tracking-wide text-muted lg:flex">
          <Link href="/#hero" className="transition-colors hover:text-gold-soft">
            Trang chủ
          </Link>
          <Link
            href="/#thuong-hieu"
            className="transition-colors hover:text-gold-soft"
          >
            Về chúng tôi
          </Link>
          <Link
            href="/bo-bai"
            className="transition-colors hover:text-gold-soft"
          >
            Về bộ bài
          </Link>
        </nav>

        <Link href="/" className="flex items-center lg:justify-self-center">
          <Image
            src={withBasePath("/images/logo/main-logo.png")}
            alt="FAYE"
            width={200}
            height={244}
            className="h-14 w-auto"
            priority
          />
        </Link>

        <div className="flex items-center justify-end gap-5 font-body text-sm tracking-wide text-muted">
          <a href="#" className="transition-colors hover:text-gold-soft">
            Mua hàng
          </a>
        </div>
      </div>
    </header>
  );
}
