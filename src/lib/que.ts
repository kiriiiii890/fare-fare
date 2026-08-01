// Mỗi quẻ là 1 ảnh thiết kế sẵn (tiêu đề + lời giải đã nằm trong ảnh），
// nên data ở đây chỉ cần trỏ đúng file — không tách riêng tên/nội dung như cards.ts.
// que-ht-01 hiện chưa có chữ (bản nháp), 02-03 là 2 quẻ mẫu đầu tiên; sẽ bổ sung
// dần tới đủ 78 quẻ (khớp số lượng in trên vỏ hộp box-que.png).
export const queSticks = [
  { id: "01", file: "que-ht-01.png" },
  { id: "02", file: "que-ht-02.png" },
  { id: "03", file: "que-ht-03.png" },
] as const;

export type QueStick = (typeof queSticks)[number];
