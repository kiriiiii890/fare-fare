import { withBasePath } from "@/lib/base-path";

export default function CardBack({ className = "" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={withBasePath("/images/img-card/card-back.png")}
      alt="Mặt sau lá bài Spirit Lenormand"
      draggable={false}
      className={`pointer-events-none object-cover ${className}`}
    />
  );
}
