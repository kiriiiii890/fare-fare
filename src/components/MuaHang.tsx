import Image from "next/image";
import Link from "next/link";
import { withBasePath } from "@/lib/base-path";

const PRODUCTS = [
  {
    name: "FAYE Lenormand",
    desc: "37 lá bài minh họa thủ công, đồng hành cùng bạn trong hành trình chiêm nghiệm và kết nối trực giác.",
    image: "/images/box/open.png",
    imageAlt: "Bộ bài FAYE Lenormand",
    href: "/bo-bai",
  },
  {
    name: "FAYE Fortune Ticks",
    desc: "78 quẻ xăm minh họa thủ công, giúp bạn lắng lòng và xin một lời gợi ý cho những băn khoăn thường nhật.",
    image: "/images/box-que.png",
    imageAlt: "Ống quẻ FAYE Fortune Ticks",
    href: "/gieo-que",
  },
] as const;

// Chưa có link/kênh thật (Shopee, Zalo, Instagram, email) — chỉ liệt kê tên
// kênh, không gắn href "#" giả để tránh link chết trên site thật.
const CONTACT_CHANNELS = ["Shopee", "Zalo", "Instagram", "Email"] as const;

export default function MuaHang() {
  return (
    <section className="relative flex min-h-screen flex-col items-center overflow-hidden bg-gradient-to-b from-background via-background-alt to-background px-6 py-28">
      <div className="mx-auto w-full max-w-4xl text-center">
        <p className="mb-3 font-display text-xs tracking-[0.4em] text-gold-soft">
          MUA HÀNG
        </p>
        <h1 className="font-display text-3xl text-foreground sm:text-4xl">
          Sở Hữu FAYE
        </h1>
        <p className="mx-auto mt-4 max-w-xl font-body text-sm leading-relaxed text-muted">
          Hai người bạn đồng hành của FAYE — bộ bài Lenormand và ống quẻ
          Fortune Ticks. Giá bán và kênh mua hàng đang được cập nhật, mời bạn
          tìm hiểu thêm từng sản phẩm trong lúc chờ nhé.
        </p>
      </div>

      <div className="mx-auto mt-16 grid w-full max-w-4xl gap-8 sm:grid-cols-2">
        {PRODUCTS.map((product) => (
          <div
            key={product.name}
            className="flex flex-col items-center rounded-2xl border border-gold/20 bg-background-alt/60 px-6 py-10 text-center"
          >
            <div className="relative h-56 w-40 shrink-0">
              <Image
                src={withBasePath(product.image)}
                alt={product.imageAlt}
                fill
                className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
              />
            </div>

            <h2 className="mt-8 font-display text-2xl text-foreground">
              {product.name}
            </h2>
            <p className="mt-3 font-body text-sm leading-relaxed text-muted">
              {product.desc}
            </p>
            <p className="mt-4 font-body text-xs tracking-[0.2em] text-gold-soft">
              GIÁ: ĐANG CẬP NHẬT
            </p>

            <Link
              href={product.href}
              className="mt-6 rounded-full border border-gold/50 px-6 py-2 font-body text-xs tracking-[0.2em] text-gold-soft transition-colors hover:border-gold hover:text-gold"
            >
              TÌM HIỂU THÊM
            </Link>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-20 w-full max-w-xl text-center">
        <h2 className="font-display text-xl text-foreground">
          Kết Nối Với FAYE
        </h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-muted">
          Kênh mua hàng và liên hệ trực tiếp đang được cập nhật.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {CONTACT_CHANNELS.map((channel) => (
            <span
              key={channel}
              className="rounded-full border border-gold/20 px-5 py-2 font-body text-xs tracking-[0.2em] text-muted"
            >
              {channel}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
