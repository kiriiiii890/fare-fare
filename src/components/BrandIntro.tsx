"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { withBasePath } from "@/lib/base-path";

function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C12 6 14 10 24 12C14 14 12 18 12 24C12 18 10 14 0 12C10 10 12 6 12 0Z" />
    </svg>
  );
}

// Nội dung thật từ design/gioi-thieu.md — xếp theo đúng thứ tự 1-4, từ ngoài
// vào trong quanh mặt trăng. Mỗi mục chia thành nhiều đoạn ngắn (thay vì 1
// khối dài) để dễ đọc hơn; "Giá trị cốt lõi" tách theo từng giá trị và in
// đậm từ khoá đầu dòng để dễ quét mắt.
const sections = [
  {
    title: "Định vị thương hiệu",
    desc: [
      "FAYE VIETNAM là thương hiệu chuyên nghiên cứu, thiết kế và sản xuất các sản phẩm sáng tạo trong lĩnh vực board game và các bộ bài huyền học như Tarot, Oracle và Lenormand. Với định hướng kết hợp giữa nghệ thuật, nội dung chuyên sâu và trải nghiệm tương tác, FAYE không ngừng phát triển những sản phẩm mang dấu ấn riêng, đáp ứng nhu cầu khám phá, giải trí và phát triển bản thân của người dùng hiện đại.",
      "Mỗi sản phẩm của FAYE được đầu tư kỹ lưỡng từ ý tưởng, thiết kế hình ảnh đến chất lượng sản xuất, nhằm mang đến những trải nghiệm vừa giàu tính thẩm mỹ vừa có giá trị ứng dụng.",
      "Đối với các bộ bài huyền học, thương hiệu hướng đến việc giúp người dùng tiếp cận Tarot, Oracle và Lenormand một cách gần gũi, trực quan và truyền cảm hứng. Trong lĩnh vực board game, FAYE tập trung xây dựng những trò chơi có tính kết nối, sáng tạo và tương tác cao, góp phần tạo nên những khoảnh khắc giải trí ý nghĩa giữa gia đình, bạn bè và cộng đồng.",
    ],
  },
  {
    title: "Tầm nhìn",
    desc: [
      "FAYE hướng đến trở thành thương hiệu tiên phong tại Việt Nam trong lĩnh vực sáng tạo các sản phẩm huyền học và board game mang giá trị nghệ thuật.",
      "Chúng tôi mong muốn xây dựng một hệ sinh thái nơi trực giác, sáng tạo và cảm hứng giao thoa, giúp mỗi sản phẩm không chỉ là một công cụ trải nghiệm mà còn là cầu nối đưa con người đến gần hơn với bản thân và những giá trị tinh thần tích cực.",
    ],
  },
  {
    title: "Sứ mệnh",
    desc: [
      "FAYE mang đến những bộ bài Tarot, Oracle, Lenormand, board game và các sản phẩm đồng hành được đầu tư chỉn chu về nội dung, thiết kế và chất lượng.",
      "Thông qua sự kết hợp giữa nghệ thuật đương đại và cảm hứng huyền học, chúng tôi tạo nên những trải nghiệm giàu cảm xúc, khơi gợi trực giác, nuôi dưỡng sự sáng tạo và lan tỏa những khoảnh khắc kết nối ý nghĩa trong cuộc sống.",
    ],
  },
  {
    title: "Giá trị cốt lõi",
    desc: [
      "**Sáng tạo** — nền tảng để FAYE không ngừng đổi mới.",
      "**Chất lượng** — cam kết trong từng chi tiết thiết kế và sản xuất.",
      "**Kết nối** — mỗi sản phẩm là một nhịp cầu gắn kết con người với bản thân và cộng đồng.",
      "**Truyền cảm hứng** — khuyến khích mỗi cá nhân khám phá trực giác, phát triển bản thân và tận hưởng vẻ đẹp cuộc sống.",
    ],
  },
];

// Hỗ trợ in đậm phần **...** trong nội dung (dùng cho từ khoá đầu dòng).
function renderInline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="text-gold-soft">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

// Xếp từ ngoài vào trong, chỉ số khớp với mảng `sections` ở trên.
const orbits = [
  {
    size: "h-[360px] w-[360px] sm:h-[420px] sm:w-[420px] 2xl:h-[560px] 2xl:w-[560px]",
    duration: 40,
    delay: -5,
    star: "h-5 w-5",
  },
  {
    size: "h-[320px] w-[320px] sm:h-[380px] sm:w-[380px] 2xl:h-[500px] 2xl:w-[500px]",
    duration: 32,
    delay: -18,
    star: "h-[15px] w-[15px]",
  },
  {
    size: "h-[280px] w-[280px] sm:h-[340px] sm:w-[340px] 2xl:h-[440px] 2xl:w-[440px]",
    duration: 24,
    delay: -9,
    star: "h-6 w-6",
  },
  {
    size: "h-[240px] w-[240px] sm:h-[300px] sm:w-[300px] 2xl:h-[380px] 2xl:w-[380px]",
    duration: 16,
    delay: -2,
    star: "h-[18px] w-[18px]",
  },
];

export default function BrandIntro() {
  const [active, setActive] = useState<number | null>(null);
  const [shown, setShown] = useState<number | null>(null);
  const [side, setSide] = useState<"left" | "right">("right");
  const paused = active !== null;
  const zoomed = shown !== null;

  const stageRef = useRef<HTMLDivElement>(null);
  const starRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const clear = (i: number) =>
    setActive((cur) => (cur === i ? null : cur));

  const reveal = (i: number) => {
    setActive(i);
    setShown(i);

    const starEl = starRefs.current[i];
    const stageEl = stageRef.current;
    if (!starEl || !stageEl) return;

    const starRect = starEl.getBoundingClientRect();
    const stageRect = stageEl.getBoundingClientRect();
    const dx =
      starRect.left + starRect.width / 2 - (stageRect.left + stageRect.width / 2);
    setSide(dx >= 0 ? "right" : "left");
  };

  const goBack = () => {
    setShown(null);
    setActive(null);
  };

  const activeSection = shown !== null ? sections[shown] : null;

  return (
    <section
      id="thuong-hieu"
      className="relative min-h-screen overflow-hidden"
    >
      <img
        src={withBasePath("/images/background/bg-star2-optimized.webp")}
        alt=""
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-background/40" />
      {/* Bóng mờ 2 mép trên/dưới để chuyển tiếp mượt sang section liền kề */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-background to-transparent sm:h-48" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-background to-transparent sm:h-48" />

      <p
        className={`absolute left-1/2 top-20 -translate-x-1/2 whitespace-nowrap text-center font-body text-xs tracking-[0.3em] text-muted transition-opacity duration-500 sm:top-28 ${
          zoomed ? "opacity-0" : "opacity-100"
        }`}
      >
        CHẠM VÀO TỪNG NGÔI SAO ĐỂ KHÁM PHÁ FAYE
      </p>

      {/* Vòng quỹ đạo — chỉ mờ dần đi, không đổi kích thước/vị trí */}
      <div
        ref={stageRef}
        className={`absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500 sm:h-[420px] sm:w-[420px] 2xl:h-[560px] 2xl:w-[560px] ${
          zoomed ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        {orbits.map((o, i) => (
          <div
            key={`ring-${i}`}
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold-soft/20 ${o.size}`}
          />
        ))}

        {orbits.map((o, i) => (
          <div
            key={`orbit-${i}`}
            style={{
              animationDuration: `${o.duration}s`,
              animationDelay: `${o.delay}s`,
              animationPlayState: paused ? "paused" : "running",
            }}
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full ${o.size}`}
          >
            <span
              style={{
                animationDuration: `${o.duration}s`,
                animationDelay: `${o.delay}s`,
                animationPlayState: paused ? "paused" : "running",
              }}
              className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 animate-spin [animation-direction:reverse]"
            >
              <button
                ref={(el) => {
                  starRefs.current[i] = el;
                }}
                type="button"
                aria-label={sections[i].title}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => clear(i)}
                onClick={() => reveal(i)}
                className="relative -m-3 cursor-pointer p-3"
              >
                <Sparkle
                  className={`transition-all duration-200 ${o.star} ${
                    active === i ? "scale-125 text-gold" : "text-gold-soft"
                  }`}
                />
                <span
                  className={`pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-md border border-gold/30 bg-background/90 px-2 py-1 font-body text-[10px] tracking-wide text-gold-soft transition-opacity duration-200 ${
                    active === i ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {sections[i].title}
                </span>
              </button>
            </span>
          </div>
        ))}
      </div>

      {/* Mặt trăng — cùng 1 phần tử, "to dần và dịch chuyển dần" từ hình tròn
          nhỏ ở giữa thành pa-nen nửa màn hình khi click vào 1 ngôi sao. */}
      <button
        type="button"
        onClick={zoomed ? goBack : undefined}
        aria-label={zoomed ? "Quay lại" : undefined}
        tabIndex={zoomed ? 0 : -1}
        className={`absolute top-1/2 overflow-hidden rounded-full shadow-[0_0_60px_14px_rgba(232,205,122,0.2)] transition-[width,height,top,left,transform] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          zoomed
            ? `h-[130vh] w-[130vh] -translate-y-1/2 cursor-pointer ${
                side === "left" ? "left-[8%] -translate-x-1/2" : "left-[92%] -translate-x-1/2"
              }`
            : "left-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 sm:h-[260px] sm:w-[260px] 2xl:h-[320px] 2xl:w-[320px]"
        }`}
      >
        <div
          style={{ animationDuration: "18s" }}
          className={`absolute inset-0 ${zoomed ? "animate-spin" : ""}`}
        >
          <Image
            src={withBasePath("/images/moon-end.png")}
            alt="FAYE"
            fill
            className="object-cover"
          />
        </div>
      </button>

      {/* Nội dung — hiện ở nửa còn lại khi mặt trăng đã "to" xong */}
      <div
        style={{ transitionDelay: zoomed ? "500ms" : "0ms" }}
        className={`absolute inset-y-0 flex w-full items-center justify-start overflow-y-auto pr-8 transition-opacity duration-500 sm:w-1/2 ${
          side === "left" ? "right-0 pl-8" : "left-0 pl-8 sm:pl-[calc(2rem+10%)]"
        } ${zoomed ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        {activeSection && (
          <div className="max-w-2xl py-24">
            <p className="font-display text-4xl uppercase tracking-wide text-gold-soft sm:text-5xl lg:text-6xl">
              {activeSection.title}
            </p>
            <div className="mt-8 space-y-4">
              {activeSection.desc.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-justify font-body text-base leading-relaxed text-muted sm:text-lg"
                >
                  {renderInline(paragraph)}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
