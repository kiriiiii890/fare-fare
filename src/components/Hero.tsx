import Image from "next/image";
import { withBasePath } from "@/lib/base-path";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden pt-24"
    >
      <Image
        src={withBasePath("/images/hero-bg.png")}
        alt=""
        fill
        priority
        className="object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-background/10" />
      {/* Bóng mờ ở mép dưới để chuyển tiếp mượt sang section kế tiếp */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent sm:h-48" />

      <Image
        src={withBasePath("/images/text-page1-full.png")}
        alt="Welcome to Faye — Nơi trực giác hóa thành lời đáp"
        fill
        className="object-contain"
      />
    </section>
  );
}
