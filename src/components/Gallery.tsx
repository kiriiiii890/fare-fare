import TarotCard from "./TarotCard";

const cards = [
  { name: "Kỵ Sĩ", numeral: "1" },
  { name: "Cỏ Ba Lá", numeral: "2" },
  { name: "Con Tàu", numeral: "3" },
  { name: "Ngôi Nhà", numeral: "4" },
  { name: "Bó Hoa", numeral: "9" },
  { name: "Ngôi Sao", numeral: "16" },
  { name: "Trái Tim", numeral: "24" },
  { name: "Thánh Giá", numeral: "36" },
];

export default function Gallery() {
  return (
    <section
      id="bo-bai"
      className="relative flex min-h-screen flex-col justify-center py-28 pt-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 font-display text-xs tracking-[0.4em] text-gold-soft">
            XEM TRƯỚC
          </p>
          <h2 className="font-display text-3xl text-foreground sm:text-4xl">
            Một vài lá bài trong bộ
          </h2>
          <p className="mt-6 font-body leading-relaxed text-muted">
            37 lá bài Lenormand mang ý nghĩa biểu tượng riêng. Dưới đây là một
            số lá bài tiêu biểu trong bộ FAYE.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {cards.map((c) => (
            <TarotCard key={c.name} name={c.name} numeral={c.numeral} />
          ))}
        </div>
      </div>
    </section>
  );
}
