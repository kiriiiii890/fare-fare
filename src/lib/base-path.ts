// Phải khớp với `basePath` trong next.config.ts. Chỉ áp dụng khi build production
// (next build/export cho GitHub Pages) — lúc `next dev` vẫn chạy ở root như bình thường.
export const basePath =
  process.env.NODE_ENV === "production" ? "/fare-fare" : "";

export function withBasePath(path: string) {
  return `${basePath}${path}`;
}
