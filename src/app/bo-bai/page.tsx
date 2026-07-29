import type { Metadata } from "next";
import BoBaiExperience from "@/components/BoBaiExperience";

export const metadata: Metadata = {
  title: "Về bộ bài | FAYE",
  description:
    "Khám phá chi tiết bộ bài Lenormand FAYE — 37 lá bài minh họa thủ công.",
};

export default function BoBaiPage() {
  return (
    <main className="flex-1">
      <BoBaiExperience />
    </main>
  );
}
