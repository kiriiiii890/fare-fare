import type { Metadata } from "next";
import CardCarousel from "@/components/CardCarousel";

export const metadata: Metadata = {
  title: "Về bộ bài | FAYE",
  description:
    "Khám phá chi tiết bộ bài Lenormand FAYE — 36 lá bài minh họa thủ công.",
};

export default function BoBaiPage() {
  return (
    <main className="flex-1">
      <CardCarousel />
    </main>
  );
}
