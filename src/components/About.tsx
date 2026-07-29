import CardFan from "./CardFan";

const features = [
  {
    title: "Minh họa thủ công",
    desc: "Từng lá bài được vẽ tay và số hóa tỉ mỉ, giữ trọn cảm xúc và chiều sâu biểu tượng.",
  },
  {
    title: "Chất liệu cao cấp",
    desc: "Giấy mờ dày dặn, phủ lớp hoàn thiện chống trầy, mực in không phai theo thời gian.",
  },
  {
    title: "Sổ tay hướng dẫn",
    desc: "Đi kèm cuốn hướng dẫn giải nghĩa 37 lá bài, phù hợp cho cả người mới bắt đầu.",
  },
];

export default function About() {
  return (
    <section
      id="gioi-thieu"
      className="relative flex min-h-screen flex-col justify-center bg-background-alt py-28 pt-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 font-display text-xs tracking-[0.4em] text-gold-soft">
            CÂU CHUYỆN
          </p>
          <h2 className="font-display text-3xl text-foreground sm:text-4xl">
            Giới thiệu về bộ bài
          </h2>
          <p className="mt-6 font-body leading-relaxed text-muted">
            FAYE ra đời từ mong muốn tạo ra một bộ bài Lenormand vừa đẹp về
            thẩm mỹ, vừa gần gũi trong cách đọc hiểu. Mỗi lá bài là một biểu
            tượng quen thuộc trong đời sống, kết hợp giữa hệ thống Lenormand
            truyền thống và nét vẽ đương đại, giúp bạn kết nối dễ dàng hơn với
            trực giác của chính mình.
          </p>
        </div>

        <CardFan />

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-gold/15 bg-background/60 p-8 text-center transition-colors hover:border-gold/40"
            >
              <h3 className="font-display text-lg text-gold-soft">
                {f.title}
              </h3>
              <p className="mt-3 font-body text-sm leading-relaxed text-muted">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
