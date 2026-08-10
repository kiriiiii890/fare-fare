"use client";

import { useEffect, useRef } from "react";

const SECTION_IDS = [
  "hero",
  "thuong-hieu",
  "thong-diep",
  "gioi-thieu-lenormand",
  "gioi-thieu-gieo-que",
];
// Chỉ tự động hoàn tất sang trang kế tiếp khi đã cuộn qua ngưỡng này (8/10 trang).
const ADVANCE_THRESHOLD = 0.8;
const DURATION = 700;
// Chỉ tự động khít khung hình sau khi người dùng dừng cuộn 3s, tránh làm
// gián đoạn lúc họ vẫn đang chủ động cuộn/đọc nội dung.
const IDLE_DELAY = 3000;

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function ScrollSnapController() {
  const animating = useRef(false);
  const lastY = useRef(0);
  const goingDown = useRef(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Section đã kích hoạt tự động chuyển trang rồi, tránh kích hoạt lặp lại.
  const triggeredIndex = useRef<number | null>(null);

  useEffect(() => {
    lastY.current = window.scrollY;

    const getSections = () =>
      SECTION_IDS.map((id) => document.getElementById(id)).filter(
        (el): el is HTMLElement => el !== null,
      );

    const scrollToY = (target: number) => {
      const start = window.scrollY;
      const distance = target - start;
      if (Math.abs(distance) < 1) return;

      animating.current = true;
      const startTime = performance.now();

      const step = (now: number) => {
        const progress = Math.min((now - startTime) / DURATION, 1);
        window.scrollTo(0, start + distance * easeInOutCubic(progress));
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          animating.current = false;
        }
      };
      requestAnimationFrame(step);
    };

    const check = () => {
      if (animating.current || !goingDown.current) return;

      const sections = getSections();
      const y = window.scrollY;

      let index = -1;
      for (let i = sections.length - 1; i >= 0; i--) {
        if (y >= sections[i].offsetTop - 4) {
          index = i;
          break;
        }
      }
      if (index === -1 || index + 1 >= sections.length) return;
      if (triggeredIndex.current === index) return;

      const section = sections[index];
      const progress = (y - section.offsetTop) / section.offsetHeight;

      if (progress >= ADVANCE_THRESHOLD) {
        triggeredIndex.current = index;
        scrollToY(sections[index + 1].offsetTop);
      }
    };

    const onScroll = () => {
      const y = window.scrollY;
      goingDown.current = y > lastY.current;
      lastY.current = y;

      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(check, IDLE_DELAY);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  return null;
}
