"use client";

import { useEffect, useState } from "react";

// Theo dõi breakpoint `sm` (640px) của Tailwind — dùng để chọn giá trị JS
// (không thể set qua className) khớp với các class `sm:` đã dùng cho cùng
// phần tử, ví dụ `w-6 sm:w-8`.
export function useIsSmUp() {
  const [isSmUp, setIsSmUp] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 640px)");
    setIsSmUp(mql.matches);
    const handleChange = (e: MediaQueryListEvent) => setIsSmUp(e.matches);
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return isSmUp;
}
