// Mỗi quẻ là 1 ảnh thiết kế sẵn dạng banner ngang, bo tròn 2 đầu (tiêu đề +
// lời giải đã nằm trong ảnh), không cần xoay khi hiển thị — nên data ở đây
// chỉ cần trỏ đúng file, không tách riêng tên/nội dung như cards.ts.
// Đủ 78 quẻ (khớp số lượng in trên vỏ hộp box-que.png), file gốc trong
// public/images/que-new/78artbroad-01.png .. 78artbroad-78.png.
export const queSticks = Array.from({ length: 78 }, (_, i) => {
  const numeral = String(i + 1).padStart(2, "0");
  return { id: numeral, file: `que-new/78artbroad-${numeral}.png` };
});

export type QueStick = (typeof queSticks)[number];

// Mặt sau — dùng chung cho mọi que, hiện khi que còn nằm trong ống lúc lắc
// (chưa biết kết quả là quẻ nào), cùng dáng banner bo tròn với mặt trước.
export const QUE_BACK = "que-new/back.png";

// Que ló ra khỏi ống — lệch trái/phải, xoay và dài ngắn khác nhau để trông
// như một bó que thật xếp lộn xộn, không đều tăm tắp. Thân que thon dài cho
// giống que gỗ thật. Dùng trong GieoQueExperience (hiện ở cả trang chủ và
// trang /gieo-que).
// `smH` = chiều cao (px) ở breakpoint sm, dùng để tính khung xoay ảnh mặt
// sau (vốn vẽ theo chiều ngang) — lấy mốc sm (lớn hơn) làm khung xoay an
// toàn cho mọi kích thước màn hình, ảnh sẽ crop khít hơn ở màn nhỏ chứ
// không hở viền.
// `x`/`xSm` là độ lệch ngang (px) riêng cho mobile/từ sm trở lên — que rộng
// hơn ở sm (w-8 so với w-6) nên cần dàn xa hơn tương ứng, nếu dùng chung 1
// giá trị thì trên desktop các que sẽ đè sát/lẫn vào nhau.
export const PEEK_STICKS = [
  { x: -24, xSm: -40, rotate: 9, height: "h-36 sm:h-40", smH: 160 },
  { x: -8, xSm: -13, rotate: -6, height: "h-32 sm:h-36", smH: 144 },
  { x: 8, xSm: 13, rotate: -13, height: "h-40 sm:h-44", smH: 176 },
  { x: 24, xSm: 40, rotate: 4, height: "h-32 sm:h-36", smH: 144 },
] as const;

// Chiều rộng que ở breakpoint sm (khớp class sm:w-8 khi dùng PEEK_STICKS).
export const STICK_W_SM = 32;
