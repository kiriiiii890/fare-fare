import type { Metadata } from "next";
import GieoQueExperience from "@/components/GieoQueExperience";

export const metadata: Metadata = {
  title: "Gieo Quẻ | FAYE",
  description: "Gieo một quẻ từ ống quẻ FAYE Fortune để nhận lời nhắn cho riêng bạn.",
};

export default function GieoQuePage() {
  return (
    <main className="flex-1">
      <GieoQueExperience />
    </main>
  );
}
