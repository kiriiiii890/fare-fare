import type { Metadata } from "next";
import MuaHang from "@/components/MuaHang";

export const metadata: Metadata = {
  title: "Mua Hàng | FAYE",
  description: "Sở hữu bộ bài Lenormand và ống quẻ Fortune Ticks của FAYE.",
};

export default function MuaHangPage() {
  return (
    <main className="flex-1">
      <MuaHang />
    </main>
  );
}
