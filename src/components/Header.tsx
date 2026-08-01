"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/base-path";

const AUTO_HIDE_DELAY = 3000;
const REVEAL_ZONE = 60;

const NAV_LINKS = [
  { href: "/#hero", label: "Trang chủ" },
  { href: "/bo-bai", label: "Về bộ bài" },
  { href: "/gieo-que", label: "Gieo quẻ" },
  { href: "/mua-hang", label: "Mua hàng" },
];

export default function Header() {
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const lastY = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoveredRef = useRef(false);
  const menuOpenRef = useRef(false);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    lastY.current = window.scrollY;

    const scheduleAutoHide = () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => {
        if (!hoveredRef.current && !menuOpenRef.current) setHidden(true);
      }, AUTO_HIDE_DELAY);
    };

    // Tự ẩn sau 3s kể từ khi vào trang, dù chưa cuộn gì.
    scheduleAutoHide();

    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastY.current;

      if (goingDown && y > 80 && !hoveredRef.current && !menuOpenRef.current) {
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

  // Header không được tự ẩn trong lúc menu mobile đang mở, không thì dropdown
  // gắn theo header sẽ bị cuộn khuất theo.
  useEffect(() => {
    menuOpenRef.current = menuOpen;
    if (menuOpen && hideTimer.current) {
      clearTimeout(hideTimer.current);
      setHidden(false);
    }
  }, [menuOpen]);

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 z-50 w-full border-b border-white/5 bg-black/20 backdrop-blur-sm transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {/* Mobile: logo bên trái, nút mở list bên phải — hai layout tách hẳn
          nhau (thay vì dùng chung 1 lưới rồi ẩn/hiện từng ô) vì thứ tự
          logo/nav trên mobile và desktop ngược nhau, không thể chỉ ẩn-hiện
          phần tử mà giữ nguyên một cấu trúc lưới duy nhất. */}
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:hidden">
        <Link href="/" className="flex items-center">
          <Image
            src={withBasePath("/images/logo/main-logo.png")}
            alt="FAYE"
            width={200}
            height={244}
            className="h-14 w-auto"
            priority
          />
        </Link>

        <button
          type="button"
          aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5"
        >
          <span
            className={`h-px w-6 bg-muted transition-transform duration-200 ${
              menuOpen ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-6 bg-muted transition-opacity duration-200 ${
              menuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`h-px w-6 bg-muted transition-transform duration-200 ${
              menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Desktop: nav trái - logo giữa - nav phải, đối xứng quanh logo. */}
      <div className="mx-auto hidden max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-4 lg:grid">
        <nav className="flex justify-end gap-6 font-body text-base tracking-wide text-muted">
          <Link href="/#hero" className="transition-colors hover:text-gold-soft">
            Trang chủ
          </Link>
          <Link href="/bo-bai" className="transition-colors hover:text-gold-soft">
            Về bộ bài
          </Link>
        </nav>

        <Link href="/" className="flex items-center justify-self-center">
          <Image
            src={withBasePath("/images/logo/main-logo.png")}
            alt="FAYE"
            width={200}
            height={244}
            className="h-14 w-auto"
            priority
          />
        </Link>

        <div className="flex justify-start gap-6 font-body text-base tracking-wide text-muted">
          <Link href="/gieo-que" className="transition-colors hover:text-gold-soft">
            Gieo quẻ
          </Link>
          <Link href="/mua-hang" className="transition-colors hover:text-gold-soft">
            Mua hàng
          </Link>
        </div>
      </div>

      {/* Menu đầy đủ cho mobile — trước đây "Về bộ quẻ" và nav bên trái chỉ
          hiện từ lg trở lên nên trên điện thoại thiếu hẳn 3/4 mục, giờ gom
          lại vào đây để bấm nút hamburger là thấy đủ. */}
      <div
        className={`overflow-hidden border-t border-white/5 bg-black/40 backdrop-blur-sm transition-[max-height] duration-300 lg:hidden ${
          menuOpen ? "max-h-72" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col gap-1 px-6 py-4 font-body text-base tracking-wide text-muted">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={closeMenu}
              className="rounded-lg px-2 py-3 transition-colors hover:text-gold-soft"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
