import type { Metadata } from "next";
import BoBaiExperience from "@/components/BoBaiExperience";

export const metadata: Metadata = {
  title: "Về bộ bài | FAYE",
  description:
    "Khám phá chi tiết bộ bài Spirit Lenormand — 37 lá bài minh họa thủ công.",
};

export default function BoBaiPage() {
  return (
    <main className="flex-1">
      <BoBaiExperience />
    </main>
  );
}
