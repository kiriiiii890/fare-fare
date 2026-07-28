import FlipCard from "./FlipCard";

const fan = [
  { name: "Kỵ Sĩ", numeral: "1", rotate: -18, lift: 14, width: "w-12 sm:w-20 md:w-28" },
  { name: "Bó Hoa", numeral: "9", rotate: -9, lift: 28, width: "w-14 sm:w-24 md:w-32" },
  { name: "Trái Tim", numeral: "24", rotate: 0, lift: -8, width: "z-10 w-16 sm:w-28 md:w-36" },
  { name: "Chiếc Nhẫn", numeral: "25", rotate: 9, lift: 28, width: "w-14 sm:w-24 md:w-32" },
  { name: "Chiếc Chìa Khóa", numeral: "33", rotate: 18, lift: 14, width: "w-12 sm:w-20 md:w-28" },
];

export default function CardFan() {
  return (
    <div className="mt-16">
      <div className="mx-auto flex max-w-2xl items-end justify-center gap-1 sm:gap-2 md:gap-3">
        {fan.map((c) => (
          <FlipCard
            key={c.name}
            name={c.name}
            numeral={c.numeral}
            rotate={c.rotate}
            lift={c.lift}
            className={c.width}
          />
        ))}
      </div>
      <p className="mt-8 text-center font-body text-xs tracking-wide text-muted">
        Di chuột vào từng lá bài để xem hiệu ứng lật bài.
      </p>
    </div>
  );
}
