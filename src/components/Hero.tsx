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

      <Image
        src={withBasePath("/images/text-page1-full.png")}
        alt="Welcome to Faye — Nơi trực giác hóa thành lời đáp"
        fill
        className="object-contain"
      />
    </section>
  );
}
