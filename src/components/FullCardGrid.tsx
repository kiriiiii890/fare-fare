"use client";

import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import Image from "next/image";
import { withBasePath } from "@/lib/base-path";
import { cards } from "@/lib/cards";
import CardBack from "@/components/CardBack";

// Số cột theo bề rộng màn hình — khớp các mốc breakpoint sm/md/lg đang dùng
// ở phần còn lại của trang.
const COLUMN_BREAKPOINTS: { minWidth: number; columns: number }[] = [
  { minWidth: 1024, columns: 5 },
  { minWidth: 768, columns: 4 },
  { minWidth: 640, columns: 3 },
  { minWidth: 0, columns: 3 },
];
const DEFAULT_COLUMNS = 3;

// w-20 ở kích thước điện thoại để 3 cột vẫn vừa khít trong bề rộng màn hình
// hẹp (kể cả các máy ~320px), thay vì tràn ngang.
const CARD_WIDTH_CLASS = "w-20 sm:w-32 md:w-36 lg:w-44";

// Luôn có đúng ngần này lá đang úp cùng lúc; mỗi FACE_DOWN_CYCLE_INTERVAL sẽ
// đổi sang một bộ lá úp khác, không trùng với bộ đang úp hiện tại.
const FACE_DOWN_COUNT = 11;
const FACE_DOWN_CYCLE_INTERVAL = 10000;
const NON_ADJACENT_ATTEMPTS = 60;

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getColumnsForWidth(width: number) {
  return COLUMN_BREAKPOINTS.find((bp) => width >= bp.minWidth)?.columns ?? DEFAULT_COLUMNS;
}

// Chia `total` lá vào `columns` cột theo hình cánh cung: cột giữa nhiều lá
// nhất, thon dần ra hai bên — đúng dáng bố cục tham khảo (cụm lá phồng ở
// giữa, hẹp ở hai đầu) thay vì lưới đều tăm tắp.
function distributeTaper(total: number, columns: number): number[] {
  if (columns <= 1) return [total];

  const mid = (columns - 1) / 2;
  const weights = Array.from({ length: columns }, (_, c) => columns - Math.abs(c - mid));
  const weightSum = weights.reduce((a, b) => a + b, 0);
  const raw = weights.map((w) => (w / weightSum) * total);
  const sizes = raw.map(Math.floor);

  let remainder = total - sizes.reduce((a, b) => a + b, 0);
  const byFraction = raw
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac || Math.abs(a.i - mid) - Math.abs(b.i - mid));

  for (let k = 0; k < remainder; k++) sizes[byFraction[k].i] += 1;
  return sizes;
}

// Tinh chỉnh thủ công cho bố cục 5 cột: cột ngoài cùng (1 và 5) thêm 1 lá,
// cột chính giữa bớt 2 lá — làm dáng cụm bớt nhọn ở giữa, hai bên đầy hơn.
// Bố cục 3 cột (kích thước điện thoại) ép về 12-13-12 cho đều hơn thay vì
// dáng cánh cung 11-16-10 ban đầu.
function applyManualTweaks(sizes: number[]): number[] {
  const tweaked = [...sizes];
  if (tweaked.length === 5) {
    tweaked[0] += 1;
    tweaked[4] += 1;
    tweaked[2] -= 2;
  } else if (tweaked.length === 3) {
    tweaked[0] += 1;
    tweaked[1] -= 3;
    tweaked[2] += 2;
  }
  return tweaked;
}

function getColumnSizes(total: number, columns: number): number[] {
  return applyManualTweaks(distributeTaper(total, columns));
}

function buildColumnGroups(total: number, columns: number): number[][] {
  const sizes = getColumnSizes(total, columns);
  const groups: number[][] = [];
  let cursor = 0;
  for (const size of sizes) {
    groups.push(Array.from({ length: size }, (_, k) => cursor + k));
    cursor += size;
  }
  return groups;
}

type Position = { col: number; row: number };
type Layout = { positions: Map<number, Position>; lengths: number[] };

function buildLayout(groups: number[][]): Layout {
  const positions = new Map<number, Position>();
  groups.forEach((group, col) => {
    group.forEach((i, row) => positions.set(i, { col, row }));
  });
  return { positions, lengths: groups.map((g) => g.length) };
}

// Ngưỡng để coi hai lá ở hai cột liền kề là "gần nhau": hiệu số vị trí hàng
// sau khi quy đổi theo tâm mỗi cột (vì cột ngắn được căn giữa lệch đi so
// với cột dài) nhỏ hơn 1 hàng — tức lệch chéo/lệch ngang cũng bị tính là
// gần, không chỉ đứng thẳng hàng dọc trong cùng một cột.
const DIAGONAL_ADJACENT_THRESHOLD = 1;

function areLayoutAdjacent(a: number, b: number, layout: Layout) {
  const pa = layout.positions.get(a);
  const pb = layout.positions.get(b);
  if (!pa || !pb) return false;

  const colDiff = Math.abs(pa.col - pb.col);
  if (colDiff === 0) return Math.abs(pa.row - pb.row) === 1;
  if (colDiff === 1) {
    const centeredA = pa.row - (layout.lengths[pa.col] - 1) / 2;
    const centeredB = pb.row - (layout.lengths[pb.col] - 1) / 2;
    return Math.abs(centeredA - centeredB) < DIAGONAL_ADJACENT_THRESHOLD;
  }
  return false;
}

// Bốc ngẫu nhiên tối đa `count` chỉ số từ pool, đảm bảo không có hai chỉ số
// nào đứng gần nhau (cùng cột liền hàng, hoặc hai cột sát nhau lệch chéo ít
// hơn 1 hàng). Thử nhiều lần xáo trộn khác nhau và giữ lại kết quả tốt
// nhất, vì với `count` lớn không phải cách sắp xếp nào cũng đủ chỗ.
function pickNonAdjacent(pool: number[], count: number, layout: Layout) {
  let best: number[] = [];
  for (let attempt = 0; attempt < NON_ADJACENT_ATTEMPTS && best.length < count; attempt++) {
    const candidates: number[] = [];
    for (const idx of shuffle(pool)) {
      if (candidates.every((picked) => !areLayoutAdjacent(picked, idx, layout))) {
        candidates.push(idx);
        if (candidates.length === count) break;
      }
    }
    if (candidates.length > best.length) best = candidates;
  }
  return best;
}

export default function FullCardGrid({ activeIndex }: { activeIndex: number }) {
  // Mặc định khớp bố cục nhỏ nhất (SSR không biết bề rộng thật của trình
  // duyệt) — sau khi mount sẽ đo lại đúng bề rộng và cập nhật số cột.
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);
  const columnGroups = useMemo(() => buildColumnGroups(cards.length, columns), [columns]);
  const layoutRef = useRef<Layout>(buildLayout(columnGroups));

  // Đồng bộ layoutRef mỗi khi số cột đổi (kể cả do resize về sau), để
  // interval bên dưới luôn kiểm tra "kề nhau" theo đúng bố cục đang hiển thị.
  useEffect(() => {
    layoutRef.current = buildLayout(columnGroups);
  }, [columnGroups]);

  // Số nửa vòng lật đã quay của từng lá — lẻ là đang úp (mặt sau), chẵn là
  // đang ngửa (mặt trước). Dùng ref để luôn đọc được giá trị mới nhất khi
  // gọi flipCard liên tiếp, không bị trễ một nhịp render như khi đọc state.
  const rotationRef = useRef<Map<number, number>>(new Map());
  // Bộ chỉ số các lá đang úp theo chu kỳ tự động — tách riêng khỏi
  // rotationRef vì còn cần biết chính xác lá nào đang úp để loại khỏi lượt
  // bốc ngẫu nhiên kế tiếp, đảm bảo bộ 11 lá mới không trùng bộ cũ.
  const faceDownRef = useRef<Set<number>>(new Set());
  const [, forceRender] = useReducer((n: number) => n + 1, 0);
  // Việc chọn lá lật sẵn dùng Math.random nên phải chạy sau khi mount ở
  // client — nếu chọn ngay trong lúc render sẽ ra kết quả khác giữa SSR và
  // client, gây lỗi hydration mismatch. transitionsReady tắt hiệu ứng xoay
  // cho đúng lần "úp" đầu tiên đó, để nó xuất hiện tức khắc chứ không xoay
  // trước mắt người dùng.
  const [transitionsReady, setTransitionsReady] = useState(false);

  const getRotation = (i: number) => rotationRef.current.get(i) ?? 0;

  // Mỗi lượt lật chỉ xoay đúng một nửa vòng — lật úp nếu lá đang ngửa, lật
  // ngửa nếu lá đang úp, không xoay nhiều vòng liên tiếp.
  const flipCard = (i: number) => {
    rotationRef.current.set(i, getRotation(i) + 1);
    forceRender();
  };

  useEffect(() => {
    const allIndices = cards.map((_, i) => i);

    // Đo đúng bề rộng thật ngay khi mount rồi tính lại cột + vị trí tại chỗ
    // (không đọc layoutRef, vì effect đồng bộ nó ở trên có thể chưa kịp
    // chạy) để lượt bốc lá úp đầu tiên chuẩn theo bố cục thực tế sẽ hiển thị,
    // chứ không phải bố cục 2 cột mặc định dùng cho SSR.
    const actualColumns = getColumnsForWidth(window.innerWidth);
    const actualLayout = buildLayout(buildColumnGroups(cards.length, actualColumns));
    layoutRef.current = actualLayout;
    setColumns(actualColumns);

    // Bộ 11 lá úp ban đầu — snap thẳng vào mặt sau, chưa bật transition nên
    // không bị xoay trước mắt người dùng lúc trang vừa tải xong.
    const initialFaceDown = pickNonAdjacent(allIndices, FACE_DOWN_COUNT, actualLayout);
    initialFaceDown.forEach((i) => rotationRef.current.set(i, 1));
    faceDownRef.current = new Set(initialFaceDown);
    forceRender();

    // Đợi khung hình kế tiếp (sau khi bản snap ở trên đã render và vẽ xong
    // với transition tắt) mới bật transition cho các lượt lật về sau.
    const raf = requestAnimationFrame(() => setTransitionsReady(true));

    const interval = setInterval(() => {
      const previousFaceDown = faceDownRef.current;
      const pool = allIndices.filter((i) => !previousFaceDown.has(i));
      const nextFaceDown = pickNonAdjacent(pool, FACE_DOWN_COUNT, layoutRef.current);

      previousFaceDown.forEach(flipCard); // lật ngửa lại bộ cũ
      nextFaceDown.forEach(flipCard); // lật úp bộ mới
      faceDownRef.current = new Set(nextFaceDown);
    }, FACE_DOWN_CYCLE_INTERVAL);

    const handleResize = () => setColumns(getColumnsForWidth(window.innerWidth));
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderCard = (i: number) => {
    const c = cards[i];
    const rotation = getRotation(i);

    return (
      <div
        key={c.numeral}
        className={`relative aspect-[1890/3071] shrink-0 ${CARD_WIDTH_CLASS}`}
        style={
          {
            animation: `card-float ${5 + (i % 4) * 0.6}s ease-in-out infinite`,
            animationDelay: `${(i % 6) * -0.7}s`,
            "--card-tilt": i % 2 === 0 ? "1.2deg" : "-1.2deg",
          } as React.CSSProperties
        }
      >
        <button
          type="button"
          aria-label={`Lật lá ${c.name}`}
          onClick={() => flipCard(i)}
          className="block h-full w-full cursor-pointer [perspective:1200px]"
        >
          <div
            className={`relative h-full w-full [transform-style:preserve-3d] ${
              transitionsReady
                ? "transition-transform duration-[1100ms] [transition-timing-function:cubic-bezier(0.45,0,0.15,1)]"
                : ""
            }`}
            style={{ transform: `rotateY(${rotation * 180}deg)` }}
          >
            <div
              className={`absolute inset-0 overflow-hidden rounded-xl border bg-background-alt/90 [backface-visibility:hidden] sm:rounded-2xl ${
                i === activeIndex ? "border-gold shadow-lg shadow-gold/20" : "border-gold/30"
              }`}
            >
              <Image
                src={withBasePath(`/images/img-card/${c.file}`)}
                alt={c.name}
                fill
                draggable={false}
                className="pointer-events-none object-cover"
              />
            </div>

            {/* Cùng khung bo góc/viền với mặt trước để hai mặt khớp y hệt
                kích thước khi lật, không lệch to nhỏ. */}
            <div
              className={`absolute inset-0 overflow-hidden rounded-xl border [backface-visibility:hidden] [transform:rotateY(180deg)] sm:rounded-2xl ${
                i === activeIndex ? "border-gold shadow-lg shadow-gold/20" : "border-gold/30"
              }`}
            >
              <CardBack className="h-full w-full" />
            </div>
          </div>
        </button>
      </div>
    );
  };

  return (
    <section className="relative overflow-hidden px-6 py-28">
      <Image
        src={withBasePath("/images/background/bg-full-card.png")}
        alt=""
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background-alt/75 to-background/90" />

      <div className="relative mx-auto max-w-6xl text-center">
        <p className="font-display text-3xl text-foreground sm:text-4xl">
          Trọn Bộ 37 Lá Bài
        </p>
        <p className="mx-auto mt-4 max-w-2xl font-body text-sm leading-relaxed text-muted sm:text-base">
          Mỗi lá trong hệ thống Lenormand mang một biểu tượng và một thông
          điệp riêng.
        </p>
      </div>

      {/* Xếp theo cột thay vì lưới vuông vắn — các cột giữa dài hơn, hai bên
          ngắn dần, rồi được items-center căn giữa theo chiều dọc nên tự
          nhiên tạo dáng cụm hình oval mềm mại giống bản phác thảo tham
          khảo, thay vì để dư một lá lẻ loi ở hàng cuối như lưới cũ. */}
      <div className="relative mx-auto mt-16 flex max-w-6xl items-center justify-center gap-x-3 sm:gap-x-6 lg:gap-x-8">
        {columnGroups.map((group, colIdx) => {
          // Cột chính giữa (chỉ tồn tại khi số cột lẻ) được đẩy xuống thêm
          // một chút, để lá đầu cột không nhô cao ngang các cột kế bên và
          // tạo hình chóp nhọn ở phần đầu cụm bài.
          const isMiddleColumn = columnGroups.length % 2 === 1 && colIdx === (columnGroups.length - 1) / 2;

          return (
            <div
              key={colIdx}
              className={`flex flex-col gap-y-8 sm:gap-y-10 lg:gap-y-12 ${
                isMiddleColumn ? "mt-8 sm:mt-10 lg:mt-14" : ""
              }`}
            >
              {group.map((i) => renderCard(i))}
            </div>
          );
        })}
      </div>
    </section>
  );
}
