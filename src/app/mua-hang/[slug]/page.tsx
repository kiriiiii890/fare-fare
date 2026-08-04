import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { withBasePath } from "@/lib/base-path";
import { PRODUCTS } from "@/lib/products";

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

function getProduct(slug: string) {
  return PRODUCTS.find((product) => product.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};

  return {
    title: `${product.name} | FAYE`,
    description: product.desc,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return (
    <main className="flex-1">
      <section className="relative flex min-h-screen flex-col items-center overflow-hidden px-6 py-28">
        <img
          src={withBasePath("/images/background/bg-7.png")}
          alt=""
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-background/40" />
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-background to-transparent sm:h-48" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-background to-transparent sm:h-48" />

        <div className="mx-auto w-full max-w-4xl">
          <Link
            href="/mua-hang"
            className="font-body text-xs tracking-[0.2em] text-gold-soft transition-colors hover:text-gold"
          >
            ← MUA HÀNG
          </Link>

          <div className="mt-10 flex flex-col items-center text-center">
            <div className="relative h-64 w-44 shrink-0">
              <Image
                src={withBasePath(product.image)}
                alt={product.imageAlt}
                fill
                className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
              />
            </div>

            <p className="mt-8 font-display text-xs tracking-[0.4em] text-gold-soft">
              SẢN PHẨM
            </p>
            <h1 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
              {product.name}
            </h1>
            <p className="mx-auto mt-4 max-w-xl font-body text-sm leading-relaxed text-muted">
              {product.desc}
            </p>
            <p className="mt-4 font-body text-xs tracking-[0.2em] text-gold-soft">
              GIÁ: ĐANG CẬP NHẬT
            </p>

            <Link
              href={product.experienceHref}
              className="mt-6 rounded-full border border-gold/50 px-6 py-2 font-body text-xs tracking-[0.2em] text-gold-soft transition-colors hover:border-gold hover:text-gold"
            >
              {product.experienceLabel.toUpperCase()}
            </Link>
          </div>

          <div className="mt-16">
            <h2 className="text-center font-display text-xl text-foreground">
              Bộ Sản Phẩm Bao Gồm
            </h2>
            <p className="mx-auto mt-2 max-w-md text-center font-body text-xs leading-relaxed text-muted">
              Những gì bạn nhận được khi sở hữu trọn bộ {product.name}.
            </p>

            <div className="mt-8 grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {product.items.map((item) => (
                <div
                  key={item.name}
                  className="flex flex-col items-center rounded-xl border border-gold/10 bg-background-alt/60 p-6 text-center"
                >
                  <div className="relative h-56 w-44 shrink-0 overflow-hidden rounded-lg bg-white/90">
                    <Image
                      src={withBasePath(item.image)}
                      alt={item.imageAlt}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <h3 className="mt-4 font-display text-base text-foreground">
                    {item.name}
                  </h3>
                  <p className="mt-2 font-body text-xs leading-relaxed text-muted">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
