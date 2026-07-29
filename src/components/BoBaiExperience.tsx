"use client";

import { useState } from "react";
import CardCarousel from "@/components/CardCarousel";
import FullCardGrid from "@/components/FullCardGrid";

export default function BoBaiExperience() {
  const [index, setIndex] = useState(0);
  // Chỉ tô sáng lá tương ứng trong lưới bên dưới sau khi người dùng thật sự
  // thao tác với carousel — mặc định index=0 không có nghĩa lá đầu tiên
  // đang "được chọn", nên chưa tương tác thì chưa lá nào cần highlight.
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleIndexChange = (next: number) => {
    setHasInteracted(true);
    setIndex(next);
  };

  return (
    <>
      <CardCarousel index={index} onIndexChange={handleIndexChange} />
      <FullCardGrid activeIndex={hasInteracted ? index : -1} />
    </>
  );
}
