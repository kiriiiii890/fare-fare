"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/base-path";

// Bộ 36 lá Lenormand đầy đủ, khớp đúng tên file ảnh minh họa chính thức.
// Nội dung mô tả dựa theo ý nghĩa truyền thống phổ biến của hệ thống
// Lenormand, viết lại ngắn gọn theo giọng văn của FAYE.
const cards = [
  { numeral: "1", name: "Kỵ Sĩ", file: "1-rider.png", desc: "Tin tức mới đang trên đường tới. Một sự kiện, một cuộc gặp hay một cơ hội sắp xuất hiện, mang theo tốc độ và sự chuyển động." },
  { numeral: "2", name: "Cỏ Ba Lá", file: "2-clover.png", desc: "May mắn nhỏ, bất ngờ và ngắn ngủi. Một niềm vui thoáng qua nhắc bạn rằng điều tốt đẹp có thể đến từ những điều giản dị nhất." },
  { numeral: "3", name: "Con Tàu", file: "3-ship.png", desc: "Hành trình, sự xa xứ và khát vọng khám phá. Một chuyến đi hoặc một thay đổi lớn đang mở ra phía trước." },
  { numeral: "4", name: "Ngôi Nhà", file: "4-house.png", desc: "Sự ổn định, gia đình và một nền tảng vững chắc. Nơi bạn có thể trở về và cảm thấy an toàn." },
  { numeral: "5", name: "Cái Cây", file: "5-tree.png", desc: "Sức khỏe và sự phát triển bền lâu. Những gì bén rễ sâu sẽ cần thời gian để lớn lên, nhưng sẽ vững chãi." },
  { numeral: "6", name: "Đám Mây", file: "6-clouds.png", desc: "Sự mơ hồ, những cảm xúc thất thường và điều chưa rõ ràng. Rồi mây cũng sẽ tan, chỉ cần thêm chút kiên nhẫn." },
  { numeral: "7", name: "Con Rắn", file: "7-snake.png", desc: "Một đường vòng, một cám dỗ hoặc một người phức tạp xuất hiện. Hãy tỉnh táo trước những gì không như vẻ ngoài." },
  { numeral: "8", name: "Quan Tài", file: "8-coffin.png", desc: "Một kết thúc cần thiết để mở ra khởi đầu mới. Sự chuyển hóa thường bắt đầu từ việc buông bỏ." },
  { numeral: "9", name: "Bó Hoa", file: "9-bouquet.png", desc: "Vẻ đẹp, lời mời và niềm vui bất ngờ. Một món quà tinh thần đang được trao đến bạn." },
  { numeral: "10", name: "Lưỡi Hái", file: "10-scythe.png", desc: "Một quyết định nhanh, một sự cắt đứt đột ngột. Đôi khi phải dứt khoát mới có thể tiến về phía trước." },
  { numeral: "11", name: "Roi Da", file: "11-whip.png", desc: "Xung đột, tranh cãi hoặc một điều gì đó lặp đi lặp lại. Bài học được nhắc lại cho đến khi được thấu hiểu." },
  { numeral: "12", name: "Đàn Chim", file: "12-birds.png", desc: "Những cuộc trò chuyện, tin đồn và các mối quan hệ xã giao. Đôi khi chỉ là những lo lắng nhỏ thoáng qua." },
  { numeral: "13", name: "Đứa Trẻ", file: "13-child.png", desc: "Một khởi đầu non trẻ, sự ngây thơ và điều gì đó còn đang lớn lên. Hãy kiên nhẫn với những gì mới chớm nở." },
  { numeral: "14", name: "Con Cáo", file: "14-fox.png", desc: "Sự khôn khéo, cẩn trọng và tính toán trong công việc. Một người tinh ranh có thể đang ở gần bạn." },
  { numeral: "15", name: "Gấu", file: "15-bear.png", desc: "Sức mạnh, sự bảo vệ và quyền lực. Cũng có thể là lòng ghen tị cần được nhìn nhận thẳng thắn." },
  { numeral: "16", name: "Ngôi Sao", file: "16-stars.png", desc: "Hy vọng, sự soi sáng và định hướng rõ ràng. Một ước mơ đang dẫn lối cho bạn." },
  { numeral: "17", name: "Cò", file: "17-stork.png", desc: "Sự thay đổi và một khởi đầu đã được chờ đợi từ lâu. Chuyển giao là một phần tự nhiên của hành trình." },
  { numeral: "18", name: "Chó", file: "18-dog.png", desc: "Lòng trung thành, tình bạn chân thành. Một người bạn đáng tin cậy luôn ở bên cạnh bạn." },
  { numeral: "19", name: "Tòa Tháp", file: "19-tower.png", desc: "Sự cô lập, tổ chức hoặc khoảng cách cần thiết. Đôi khi đứng một mình lại là cách để nhìn rõ mọi thứ hơn." },
  { numeral: "20", name: "Khu Vườn", file: "20-garden.png", desc: "Cộng đồng, sự kiện công khai và các mối quan hệ xã hội. Nơi bạn được kết nối với nhiều người." },
  { numeral: "21", name: "Ngọn Núi", file: "21-mountain.png", desc: "Một trở ngại lớn, một thử thách cần vượt qua. Khó khăn hiện tại rồi cũng sẽ ở lại phía sau." },
  { numeral: "22", name: "Ngã Ba Đường", file: "22-crossroads.png", desc: "Một lựa chọn, nhiều khả năng cùng lúc. Đây là lúc để cân nhắc kỹ trước khi rẽ hướng." },
  { numeral: "23", name: "Chuột", file: "23-mice.png", desc: "Sự hao hụt, lo âu nhỏ nhặt mài mòn theo thời gian. Đừng để những điều vụn vặt cuốn đi năng lượng của bạn." },
  { numeral: "24", name: "Trái Tim", file: "24-heart.png", desc: "Tình yêu, cảm xúc chân thành và sự gắn kết sâu sắc. Trái tim luôn biết điều gì là thật." },
  { numeral: "25", name: "Chiếc Nhẫn", file: "25-ring.png", desc: "Cam kết, hợp đồng và một sự gắn bó lâu dài. Một vòng tròn đang khép lại trọn vẹn." },
  { numeral: "26", name: "Cuốn Sách", file: "26-book.png", desc: "Một bí mật, một tri thức chưa được tiết lộ. Câu trả lời có thể đang nằm ở nơi bạn chưa mở ra." },
  { numeral: "27", name: "Lá Thư", file: "27-letter.png", desc: "Tin tức, giấy tờ hoặc một thông điệp cần được chú ý. Hãy đọc kỹ những gì đang được gửi đến." },
  { numeral: "28", name: "Chàng Trai", file: "28-boy.png", desc: "Hình bóng một người nam trong câu chuyện của bạn, mang theo năng lượng chủ động và dứt khoát." },
  { numeral: "29", name: "Cô Gái", file: "29-girl.png", desc: "Hình bóng một người nữ trong câu chuyện của bạn, mang theo sự tinh tế và trực giác nhạy bén." },
  { numeral: "30", name: "Hoa Loa Kèn", file: "30-lily.png", desc: "Sự chín chắn, bình yên và đời sống gia đình. Một giai đoạn trưởng thành, an nhiên hơn." },
  { numeral: "31", name: "Mặt Trời", file: "31-sun.png", desc: "Thành công, năng lượng tích cực và niềm vui rạng rỡ. Mọi thứ đang sáng rõ trước mắt bạn." },
  { numeral: "32", name: "Mặt Trăng", file: "32-moon.png", desc: "Danh tiếng, trực giác và những cảm xúc nội tâm sâu kín. Hãy lắng nghe tiếng nói bên trong mình." },
  { numeral: "33", name: "Chiếc Chìa Khóa", file: "33-key.png", desc: "Lời giải, sự chắc chắn và một cánh cửa đang mở ra. Điều bạn tìm kiếm gần hơn bạn nghĩ." },
  { numeral: "34", name: "Cá", file: "34-fish.png", desc: "Tài chính, dòng chảy vật chất và sự dồi dào. Nguồn lực đang luân chuyển thuận lợi." },
  { numeral: "35", name: "Mỏ Neo", file: "35-anchor.png", desc: "Sự ổn định, gắn bó lâu dài và một công việc bền vững. Một điểm tựa chắc chắn giữa những biến động." },
  { numeral: "36", name: "Thánh Giá", file: "36-cross.png", desc: "Một gánh nặng, một thử thách tinh thần cần đối diện. Điều gì đến cũng mang theo một bài học." },
];

const SWIPE_THRESHOLD = 80;
const EXIT_DURATION = 400;

function CardBack({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex flex-col items-center justify-between overflow-hidden rounded-[28px] border border-gold/40 bg-gradient-to-b from-violet-soft/50 via-background-alt to-background p-4 ${className}`}
    >
      <span className="font-display text-sm text-gold-soft">«</span>
      <svg
        viewBox="0 0 24 24"
        className="h-10 w-10 text-gold-soft"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
      >
        <circle cx="12" cy="12" r="7" />
        <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      </svg>
      <span className="font-display text-sm text-gold-soft">»</span>
    </div>
  );
}

export default function CardCarousel() {
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const dragXRef = useRef(0);
  // Lưu hàm dọn dẹp listener gắn trên window, để gỡ khi component unmount
  // giữa chừng lúc đang kéo.
  const cleanupRef = useRef<(() => void) | null>(null);
  const card = cards[index];

  const prev = () => setIndex((i) => (i - 1 + cards.length) % cards.length);
  const next = () => setIndex((i) => (i + 1) % cards.length);

  const flyOutThenChange = (direction: 1 | -1, change: () => void) => {
    setDragging(false);
    setLeaving(true);
    // Bay hẳn ra khỏi rìa màn hình (không phải khoảng cách cố định), để cảm
    // giác lá bài thật sự bay đi khắp màn hình bất kể màn hình rộng hẹp.
    const distance = window.innerWidth;
    setDragX(direction * distance);
    setDragY(0);
    setTimeout(() => {
      change();
      setDragX(0);
      setLeaving(false);
    }, EXIT_DURATION);
  };

  // Gắn listener trực tiếp lên window thay vì dựa vào setPointerCapture —
  // cách này chắc chắn bắt được move/up dù con trỏ đi ra ngoài phần tử,
  // không phụ thuộc trình duyệt/thiết bị có hỗ trợ pointer capture tốt hay không.
  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setDragging(true);
    dragXRef.current = 0;
    startX.current = e.clientX;
    startY.current = e.clientY;

    const handleMove = (ev: PointerEvent) => {
      const x = ev.clientX - startX.current;
      dragXRef.current = x;
      setDragX(x);
      setDragY(ev.clientY - startY.current);
    };

    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
      cleanupRef.current = null;

      setDragging(false);
      const x = dragXRef.current;
      if (x > SWIPE_THRESHOLD) {
        flyOutThenChange(1, prev);
      } else if (x < -SWIPE_THRESHOLD) {
        flyOutThenChange(-1, next);
      } else {
        setDragX(0);
        setDragY(0);
      }
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleUp);
    cleanupRef.current = handleUp;
  };

  useEffect(() => {
    return () => {
      cleanupRef.current?.();
    };
  }, []);

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-28">
      <Image
        src={withBasePath("/images/background/backgroud-card.png")}
        alt=""
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-background/60" />

      <div className="relative flex h-[420px] w-full max-w-sm items-center justify-center sm:h-[500px]">
        <CardBack className="absolute aspect-[1890/3071] w-[160px] -translate-x-32 -rotate-[20deg] opacity-25 sm:w-[190px]" />
        <CardBack className="absolute aspect-[1890/3071] w-[190px] -translate-x-20 -rotate-[10deg] opacity-40 sm:w-[230px]" />
        <CardBack className="absolute aspect-[1890/3071] w-[190px] translate-x-20 rotate-[10deg] opacity-40 sm:w-[230px]" />
        <CardBack className="absolute aspect-[1890/3071] w-[160px] translate-x-32 rotate-[20deg] opacity-25 sm:w-[190px]" />

        <div
          style={{
            transform: `scale(${dragging ? 1.06 : 1})`,
            transition: "transform 200ms ease",
          }}
          className="relative z-10 aspect-[1890/3071] w-[220px] cursor-grab rounded-2xl active:cursor-grabbing sm:w-[270px]"
        >
          <div
            key={index}
            className="absolute inset-0 animate-[reveal-up_0.5s_ease-out_both]"
          >
            <div
              onPointerDown={onPointerDown}
              style={{
                transform: `translate(${dragX}px, ${dragY}px) rotate(${dragX / 12}deg)`,
                opacity: leaving ? 0 : 1,
                transition: dragging
                  ? "none"
                  : `transform ${EXIT_DURATION}ms ease, opacity ${EXIT_DURATION}ms ease`,
                touchAction: "none",
              }}
              className="absolute inset-0 overflow-hidden rounded-2xl bg-background-alt/90"
            >
              <Image
                src={withBasePath(`/images/img-card/${card.file}`)}
                alt={card.name}
                fill
                draggable={false}
                className="pointer-events-none object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      <p className="relative mt-6 font-body text-xs tracking-[0.3em] text-muted">
        VUỐT TRÁI / PHẢI ĐỂ XEM LÁ KHÁC
      </p>

      <div className="relative mt-8 max-w-xl text-center">
        <p className="font-display text-3xl text-foreground sm:text-4xl">
          {card.name}
        </p>
        <p className="mt-6 font-body text-sm leading-relaxed text-muted sm:text-base">
          {card.desc}
        </p>
      </div>
    </section>
  );
}
