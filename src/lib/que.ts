// Mỗi quẻ là 1 ảnh thiết kế sẵn dạng banner ngang, bo tròn 2 đầu (tiêu đề +
// lời giải đã nằm trong ảnh), không cần xoay khi hiển thị — nên data ở đây
// chỉ cần trỏ đúng file, không tách riêng tên/nội dung như cards.ts.
// 02-03 là 2 quẻ mẫu đầu tiên; sẽ bổ sung dần tới đủ 78 quẻ (khớp số lượng
// in trên vỏ hộp box-que.png).
export const queSticks = [
  { id: "02", file: "que/que-ht-02.png" },
  { id: "03", file: "que/que-ht-03.png" },
] as const;

export type QueStick = (typeof queSticks)[number];

// Mặt sau — dùng chung cho mọi que, hiện khi que còn nằm trong ống lúc lắc
// (chưa biết kết quả là quẻ nào), cùng dáng banner bo tròn với mặt trước.
export const QUE_BACK = "que/que-ht-back.png";

// Que ló ra khỏi ống — lệch trái/phải, xoay và dài ngắn khác nhau để trông
// như một bó que thật xếp lộn xộn, không đều tăm tắp. Thân que thon dài cho
// giống que gỗ thật. Dùng trong GieoQueExperience (hiện ở cả trang chủ và
// trang /gieo-que).
// `smH` = chiều cao (px) ở breakpoint sm, dùng để tính khung xoay ảnh mặt
// sau (vốn vẽ theo chiều ngang) — lấy mốc sm (lớn hơn) làm khung xoay an
// toàn cho mọi kích thước màn hình, ảnh sẽ crop khít hơn ở màn nhỏ chứ
// không hở viền.
export const PEEK_STICKS = [
  { x: -24, rotate: 9, height: "h-36 sm:h-40", smH: 160 },
  { x: -8, rotate: -6, height: "h-32 sm:h-36", smH: 144 },
  { x: 8, rotate: -13, height: "h-40 sm:h-44", smH: 176 },
  { x: 24, rotate: 4, height: "h-32 sm:h-36", smH: 144 },
] as const;

// Chiều rộng que ở breakpoint sm (khớp class sm:w-8 khi dùng PEEK_STICKS).
export const STICK_W_SM = 32;
