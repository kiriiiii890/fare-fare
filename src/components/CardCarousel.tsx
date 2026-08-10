"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/base-path";
import { cards } from "@/lib/cards";
import CardBack from "@/components/CardBack";

const SWIPE_THRESHOLD = 80;
const EXIT_DURATION = 400;
// Khoảng cách kéo cần để lá phía dưới hiện trọn vẹn — lớn hơn hẳn
// SWIPE_THRESHOLD để lá chỉ thật sự hiện rõ khi đã kéo gần sát sang một bên,
// còn phần lớn quãng kéo trước đó lá vẫn còn mờ.
const REVEAL_DISTANCE = 220;

export default function CardCarousel({
  index,
  onIndexChange,
}: {
  index: number;
  onIndexChange: (index: number) => void;
}) {
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const dragXRef = useRef(0);
  // Lưu hàm dọn dẹp listener gắn trên window, để gỡ khi component unmount
  // giữa chừng lúc đang kéo.
  const cleanupRef = useRef<(() => void) | null>(null);
  const card = cards[index];
  const prevIndex = (index - 1 + cards.length) % cards.length;
  const nextIndex = (index + 1) % cards.length;
  // Kéo sang phải sẽ thả ra ở lá trước đó, kéo sang trái sẽ thả ra ở lá kế
  // tiếp — nên lá "sắp hiện ra" phía dưới phải khớp đúng hướng kéo.
  const upcomingCard = dragX > 0 ? cards[prevIndex] : dragX < 0 ? cards[nextIndex] : null;
  const revealLinear = Math.min(Math.abs(dragX) / REVEAL_DISTANCE, 1);
  // Ease-in bậc hai: mờ trong phần lớn quãng kéo, rồi hiện nhanh hẳn lên khi
  // gần chạm ngưỡng REVEAL_DISTANCE (tức kéo sát sang bên).
  const revealProgress = revealLinear * revealLinear;

  const prev = () => onIndexChange(prevIndex);
  const next = () => onIndexChange(nextIndex);

  const flyOutThenChange = (direction: 1 | -1, change: () => void) => {
    setDragging(false);
    setLeaving(true);
    // Bay hẳn ra khỏi rìa màn hình (không phải khoảng cách cố định), để cảm
    // giác lá bài thật sự bay đi khắp màn hình bất kể màn hình rộng hẹp.
    const distance = window.innerWidth;
    setDragX(direction * distance);
    setDragY(0);
    setTimeout(() => {
      change();
      setDragX(0);
      setLeaving(false);
    }, EXIT_DURATION);
  };

  // Gắn listener trực tiếp lên window thay vì dựa vào setPointerCapture —
  // cách này chắc chắn bắt được move/up dù con trỏ đi ra ngoài phần tử,
  // không phụ thuộc trình duyệt/thiết bị có hỗ trợ pointer capture tốt hay không.
  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setDragging(true);
    dragXRef.current = 0;
    startX.current = e.clientX;
    startY.current = e.clientY;

    const handleMove = (ev: PointerEvent) => {
      const x = ev.clientX - startX.current;
      dragXRef.current = x;
      setDragX(x);
      setDragY(ev.clientY - startY.current);
    };

    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
      cleanupRef.current = null;

      setDragging(false);
      const x = dragXRef.current;
      if (x > SWIPE_THRESHOLD) {
        flyOutThenChange(1, prev);
      } else if (x < -SWIPE_THRESHOLD) {
        flyOutThenChange(-1, next);
      } else {
        setDragX(0);
        setDragY(0);
      }
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleUp);
    cleanupRef.current = handleUp;
  };

  useEffect(() => {
    return () => {
      cleanupRef.current?.();
    };
  }, []);

  return (
    <section
      id="chi-tiet-la-bai"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-28"
    >
      <Image
        src={withBasePath("/images/background/backgroud-card.png")}
        alt=""
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-background/60" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent sm:h-48" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent sm:h-48" />

      <div className="relative flex h-[420px] w-full max-w-sm items-center justify-center sm:h-[500px]">
        <CardBack className="absolute aspect-[1890/3071] w-[125px] -translate-x-[95px] rounded-[28px] border border-gold/40 opacity-25 sm:w-[190px] sm:-translate-x-40" />
        <CardBack className="absolute aspect-[1890/3071] w-[145px] -translate-x-[48px] rounded-[28px] border border-gold/40 opacity-40 sm:w-[230px] sm:-translate-x-20" />
        <CardBack className="absolute aspect-[1890/3071] w-[145px] translate-x-[48px] rounded-[28px] border border-gold/40 opacity-40 sm:w-[230px] sm:translate-x-20" />
        <CardBack className="absolute aspect-[1890/3071] w-[125px] translate-x-[95px] rounded-[28px] border border-gold/40 opacity-25 sm:w-[190px] sm:translate-x-40" />

        {upcomingCard && (
          <div
            style={{
              opacity: revealProgress,
              transform: `scale(${0.92 + 0.08 * revealProgress}) translateY(${(1 - revealProgress) * 10}px)`,
              transition: dragging
                ? "none"
                : `opacity ${EXIT_DURATION}ms ease, transform ${EXIT_DURATION}ms ease`,
            }}
            className="absolute aspect-[1890/3071] w-[170px] overflow-hidden rounded-2xl bg-background-alt/90 sm:w-[270px]"
          >
            <Image
              src={withBasePath(`/images/img-card/${upcomingCard.file}`)}
              alt={upcomingCard.name}
              fill
              draggable={false}
              className="pointer-events-none object-contain"
            />
          </div>
        )}

        <div
          style={{
            transform: `scale(${dragging ? 1.06 : 1})`,
            transition: "transform 200ms ease",
          }}
          className="relative z-10 aspect-[1890/3071] w-[170px] cursor-grab rounded-2xl active:cursor-grabbing sm:w-[270px]"
        >
          <div
            key={index}
            onPointerDown={onPointerDown}
            style={{
              transform: `translate(${dragX}px, ${dragY}px) rotate(${dragX / 12}deg)`,
              // Mờ dần đúng theo nhịp revealProgress của lá kế tiếp phía dưới
              // — kéo càng xa, lá hiện tại càng mờ và lá sắp tới càng rõ,
              // tạo cảm giác chuyển cảnh mượt thay vì đứng hình cho tới lúc
              // thả tay.
              opacity: leaving ? 0 : 1 - revealProgress,
              transition: dragging
                ? "none"
                : `transform ${EXIT_DURATION}ms ease, opacity ${EXIT_DURATION}ms ease`,
              touchAction: "none",
            }}
            className="absolute inset-0 overflow-hidden rounded-2xl bg-background-alt/90"
          >
            <Image
              src={withBasePath(`/images/img-card/${card.file}`)}
              alt={card.name}
              fill
              draggable={false}
              className="pointer-events-none object-contain"
            />
          </div>
        </div>
      </div>

      <p className="relative mt-6 font-body text-xs tracking-[0.3em] text-muted">
        VUỐT TRÁI / PHẢI ĐỂ XEM LÁ KHÁC
      </p>

      <div className="relative mt-8 max-w-xl text-center">
        <p className="font-display text-3xl text-foreground sm:text-4xl">
          {card.name}
        </p>
        <p className="mt-6 min-h-[92px] font-body text-sm leading-relaxed text-muted sm:min-h-[78px] sm:text-base">
          {card.desc}
        </p>
      </div>
    </section>
  );
}
