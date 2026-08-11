"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/base-path";

type Faces = {
  front?: string;
  back?: string;
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
};

// Một lá bài nằm phẳng bên trong hộp — hiện ra khi nắp mở, nằm đúng trong hệ
// toạ độ 3D của hộp nên xoay/kéo hộp thì bài cũng xoay theo, không bị "dán
// cứng" phẳng trên màn hình như một lớp overlay 2D thông thường.
type InnerCard = {
  file: string;
  rotate?: number;
  offsetX?: number;
  offsetY?: number;
  widthRatio?: number;
};

type Box3DProps = {
  width?: number;
  boxHeight?: number;
  lidHeight?: number;
  depth?: number;
  boxFaces: Faces;
  lidFaces: Faces;
  boxHiddenFaces?: (keyof Faces)[];
  lidHiddenFaces?: (keyof Faces)[];
  wallThickness?: number;
  edgeColor?: string;
  boxCards?: InnerCard[];
  className?: string;
  onTap?: (open: boolean) => void;
};

function Face({
  w,
  h,
  transform,
  src,
  alt,
  color,
}: {
  w: number;
  h: number;
  transform: string;
  src?: string;
  alt?: string;
  color: string;
}) {
  return (
    <div
      className="absolute overflow-hidden rounded-[3px]"
      style={{
        width: w,
        height: h,
        top: "50%",
        left: "50%",
        marginLeft: -w / 2,
        marginTop: -h / 2,
        transform,
        backgroundColor: color,
      }}
    >
      {src && (
        <Image
          src={withBasePath(src)}
          alt={alt ?? ""}
          fill
          draggable={false}
          className="pointer-events-none object-contain"
        />
      )}
    </div>
  );
}

// Viền dày của mép hở (khi mặt top/bottom bị ẩn) — 4 dải mỏng nằm ngang ở
// đúng độ cao của mặt bị ẩn, mô phỏng lát cắt bìa dày `thickness`, để mép hộp
// không trông phẳng dẹt như tờ giấy. `variant` quyết định dấu xoay X (top
// dùng rotateX(90deg), bottom dùng rotateX(-90deg)) khớp với Face gốc.
function Rim({
  width,
  depth,
  halfH,
  thickness,
  color,
  variant,
}: {
  width: number;
  depth: number;
  halfH: number;
  thickness: number;
  color: string;
  variant: "top" | "bottom";
}) {
  const halfW = width / 2;
  const halfD = depth / 2;
  const t = thickness;
  const rotateX = variant === "top" ? 90 : -90;
  // Với rotateX(90deg): local Y (trục h) ánh xạ thẳng sang world Z.
  // Với rotateX(-90deg): local Y ánh xạ ngược dấu sang world Z.
  const signZ = variant === "top" ? 1 : -1;
  const edgeZ = (halfD - t / 2) * signZ;

  return (
    <>
      <div
        className="absolute"
        style={{
          width,
          height: t,
          top: "50%",
          left: "50%",
          marginLeft: -width / 2,
          marginTop: -t / 2,
          transform: `rotateX(${rotateX}deg) translateZ(${halfH}px) translateY(${edgeZ}px)`,
          backgroundColor: color,
        }}
      />
      <div
        className="absolute"
        style={{
          width,
          height: t,
          top: "50%",
          left: "50%",
          marginLeft: -width / 2,
          marginTop: -t / 2,
          transform: `rotateX(${rotateX}deg) translateZ(${halfH}px) translateY(${-edgeZ}px)`,
          backgroundColor: color,
        }}
      />
      <div
        className="absolute"
        style={{
          width: t,
          height: depth,
          top: "50%",
          left: "50%",
          marginLeft: -t / 2,
          marginTop: -depth / 2,
          transform: `translateX(${halfW - t / 2}px) rotateX(${rotateX}deg) translateZ(${halfH}px)`,
          backgroundColor: color,
        }}
      />
      <div
        className="absolute"
        style={{
          width: t,
          height: depth,
          top: "50%",
          left: "50%",
          marginLeft: -t / 2,
          marginTop: -depth / 2,
          transform: `translateX(${-(halfW - t / 2)}px) rotateX(${rotateX}deg) translateZ(${halfH}px)`,
          backgroundColor: color,
        }}
      />
    </>
  );
}

// Bó bài nằm phẳng ngay dưới miệng hộp (mặt `top` đang để hở) — cùng mặt
// phẳng và cách xoay X như mặt `top` gốc, chỉ lùi vào trong (`inset`) một
// chút theo trục Z để trông như đang nằm lọt bên trong hộp chứ không nổi
// hẳn lên ngang miệng. Render bên trong hệ toạ độ cục bộ của hộp (trước khi
// cha xoay/kéo) nên xoay theo hộp là chuyện tự nhiên, không cần đồng bộ gì
// thêm.
// Độ dày lá bài (px, dọc theo trục Z cục bộ của mặt phẳng đáy hộp) — mặt ảnh
// được nâng lên `CARD_THICKNESS`, phía dưới lót thêm 1 lớp màu đặc cùng
// kích thước ở Z=0. Nhờ cảnh có `perspective` thật (không phải orthographic)
// nên 2 lớp lệch Z tạo ra viền dày nhìn thấy được ở mép, giống lá bài thật
// có độ dày thay vì 1 tờ giấy phẳng dán trong hộp.
const CARD_THICKNESS = 2;
const CARD_EDGE_COLOR = "#cba135";
// Khoảng cách giữa 2 lá liền kề trong chồng bài — thứ tự trong mảng `cards`
// chính là thứ tự xếp chồng (phần tử sau nằm cao hơn phần tử trước).
const CARD_STACK_GAP = 3;

function CardsInBox({
  width,
  depth,
  halfH,
  inset,
  cards,
  visible,
}: {
  width: number;
  depth: number;
  halfH: number;
  inset: number;
  cards: InnerCard[];
  visible: boolean;
}) {
  return (
    <div
      className="pointer-events-none absolute [transform-style:preserve-3d] transition-opacity duration-500"
      style={{
        width,
        height: depth,
        top: "50%",
        left: "50%",
        marginLeft: -width / 2,
        marginTop: -depth / 2,
        transform: `rotateX(90deg) translateZ(${halfH - inset}px)`,
        opacity: visible ? 1 : 0,
      }}
    >
      {cards.map((c, i) => {
        const w = width * (c.widthRatio ?? 0.22);
        const h = (w * 3.4) / 2;
        const stackZ = i * CARD_STACK_GAP;
        return (
          <div
            key={i}
            className="absolute [transform-style:preserve-3d]"
            style={{
              width: w,
              height: h,
              top: "50%",
              left: "50%",
              marginLeft: -w / 2 + (c.offsetX ?? 0),
              marginTop: -h / 2 + (c.offsetY ?? 0),
              transform: `rotate(${c.rotate ?? 0}deg)`,
            }}
          >
            {/* Đế — lớp màu đặc nằm sát Z=0, chỉ lộ ra thành viền mỏng quanh
                mép khi nhìn nghiêng, mô phỏng cạnh dày của lá bài. */}
            <div
              className="absolute inset-0 rounded-[4px]"
              style={{ backgroundColor: CARD_EDGE_COLOR, transform: `translateZ(${stackZ}px)` }}
            />
            {/* Mặt trước — ảnh lá bài, nâng lên đúng bằng độ dày (cộng thêm
                độ cao xếp chồng của riêng lá này trong bó). */}
            <div
              className="absolute inset-0 overflow-hidden rounded-[4px] shadow-[0_4px_10px_rgba(0,0,0,0.45)]"
              style={{ transform: `translateZ(${stackZ + CARD_THICKNESS}px)` }}
            >
              <Image
                src={withBasePath(`/images/img-card/${c.file}`)}
                alt=""
                fill
                draggable={false}
                className="pointer-events-none object-cover"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Một khối hộp chữ nhật 6 mặt, dịch theo trục Y (trong không gian cục bộ,
// trước khi cha xoay) để xếp hộp và nắp chồng lên nhau đúng vị trí.
function Cuboid({
  width,
  height,
  depth,
  faces,
  edgeColor,
  offsetX = 0,
  offsetY,
  hiddenFaces = [],
  wallThickness = 0,
  cards,
  cardsVisible = false,
  onPointerDown,
}: {
  width: number;
  height: number;
  depth: number;
  faces: Faces;
  edgeColor: string;
  offsetX?: number;
  offsetY: number;
  hiddenFaces?: (keyof Faces)[];
  wallThickness?: number;
  cards?: InnerCard[];
  cardsVisible?: boolean;
  onPointerDown?: (e: React.PointerEvent) => void;
}) {
  const halfW = width / 2;
  const halfH = height / 2;
  const halfD = depth / 2;

  return (
    <div
      onPointerDown={onPointerDown}
      className={`absolute left-1/2 top-1/2 [transform-style:preserve-3d] ${
        onPointerDown ? "pointer-events-auto cursor-grab touch-none active:cursor-grabbing" : ""
      }`}
      style={{
        width,
        height,
        transform: `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px)`,
        transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {!hiddenFaces.includes("front") && (
        <Face w={width} h={height} transform={`translateZ(${halfD}px)`} src={faces.front} color={edgeColor} />
      )}
      {!hiddenFaces.includes("back") && (
        <Face
          w={width}
          h={height}
          transform={`rotateY(180deg) translateZ(${halfD}px)`}
          src={faces.back}
          color={edgeColor}
        />
      )}
      {!hiddenFaces.includes("right") && (
        <Face
          w={depth}
          h={height}
          transform={`rotateY(90deg) translateZ(${halfW}px)`}
          src={faces.right}
          color={edgeColor}
        />
      )}
      {!hiddenFaces.includes("left") && (
        <Face
          w={depth}
          h={height}
          transform={`rotateY(-90deg) translateZ(${halfW}px)`}
          src={faces.left}
          color={edgeColor}
        />
      )}
      {!hiddenFaces.includes("top") && (
        <Face
          w={width}
          h={depth}
          transform={`rotateX(90deg) translateZ(${halfH}px)`}
          src={faces.top}
          color={edgeColor}
        />
      )}
      {!hiddenFaces.includes("bottom") && (
        <Face
          w={width}
          h={depth}
          transform={`rotateX(-90deg) translateZ(${halfH}px)`}
          src={faces.bottom}
          color={edgeColor}
        />
      )}
      {wallThickness > 0 && hiddenFaces.includes("top") && (
        <Rim width={width} depth={depth} halfH={halfH} thickness={wallThickness} color={edgeColor} variant="top" />
      )}
      {wallThickness > 0 && hiddenFaces.includes("bottom") && (
        <Rim width={width} depth={depth} halfH={halfH} thickness={wallThickness} color={edgeColor} variant="bottom" />
      )}
      {cards && cards.length > 0 && (
        <CardsInBox
          width={width}
          depth={depth}
          halfH={halfH}
          inset={height - wallThickness - 6}
          cards={cards}
          visible={cardsVisible}
        />
      )}
    </div>
  );
}

export default function Box3D({
  width = 200,
  boxHeight = 100,
  lidHeight = 190,
  depth = 40,
  boxFaces,
  lidFaces,
  boxHiddenFaces = [],
  lidHiddenFaces = [],
  wallThickness = 4,
  edgeColor = "#1D0E3E",
  boxCards,
  className = "",
  onTap,
}: Box3DProps) {
  const [rotation, setRotation] = useState({ x: -32, y: -28 });
  const [boxRotation, setBoxRotation] = useState(rotation);
  const [lidRotation, setLidRotation] = useState(rotation);
  const [dragging, setDragging] = useState(false);
  const [lidOpen, setLidOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [lidLifted, setLidLifted] = useState(false);
  const [lidSlid, setLidSlid] = useState(false);
  const [lidLowered, setLidLowered] = useState(false);
  const last = useRef({ x: 0, y: 0 });
  const moved = useRef(0);
  const lastBox = useRef({ x: 0, y: 0 });
  const movedBox = useRef(0);
  const lastLid = useRef({ x: 0, y: 0 });
  const movedLid = useRef(0);
  const autoRotate = useRef(true);

  // Trên desktop, khi nắp đã mở thì tách hộp và nắp thành 2 khối xoay độc
  // lập (mỗi cái nắm kéo riêng), thay vì cả cụm xoay chung. Đóng lại thì
  // gộp về lại, lấy góc xoay của hộp làm góc chung để không bị giật hình.
  const splitRotation = isDesktop && lidOpen;
  const wasSplit = useRef(false);
  useEffect(() => {
    if (splitRotation && !wasSplit.current) {
      setBoxRotation(rotation);
      setLidRotation(rotation);
    } else if (!splitRotation && wasSplit.current) {
      setRotation(boxRotation);
    }
    wasSplit.current = splitRotation;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [splitRotation]);

  // Màn desktop: nắp bật sang bên phải để không che phần text giới thiệu
  // nằm ngay phía trên hộp. Màn nhỏ hơn: nắp vẫn trượt thẳng lên như cũ.
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mql.matches);
    const handleChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  // Nắp mở trên desktop đi 3 nhịp: nâng thẳng lên -> trượt sang ngang (vẫn
  // giữ độ cao đã nâng) -> hạ xuống để nắp nằm ngang hàng với hộp. Đóng lại
  // thì làm ngược đúng thứ tự: nâng lên -> trượt về -> hạ xuống lồng vào hộp.
  useEffect(() => {
    if (!isDesktop) return;
    if (lidOpen) {
      setLidLifted(true);
      const t1 = window.setTimeout(() => setLidSlid(true), 450);
      const t2 = window.setTimeout(() => setLidLowered(true), 900);
      return () => {
        window.clearTimeout(t1);
        window.clearTimeout(t2);
      };
    }
    setLidLowered(false);
    const t1 = window.setTimeout(() => setLidSlid(false), 450);
    const t2 = window.setTimeout(() => setLidLifted(false), 900);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [lidOpen, isDesktop]);

  // Sau khi mở nắp trên desktop, cụm đã tách làm 2 (box/lidRotation) nên tự
  // quay chậm cũng phải cập nhật cả 2 state đó thay vì `rotation` chung.
  useEffect(() => {
    let raf: number;
    const tick = () => {
      if (autoRotate.current && !dragging) {
        if (splitRotation) {
          setBoxRotation((r) => ({ ...r, y: r.y + 0.15 }));
          setLidRotation((r) => ({ ...r, y: r.y + 0.15 }));
        } else {
          setRotation((r) => ({ ...r, y: r.y + 0.15 }));
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [dragging, splitRotation]);

  // Factory dùng chung cho cả chế độ xoay gộp (1 cụm) và tách riêng (hộp/nắp
  // nắm kéo độc lập trên desktop sau khi mở) — mỗi chế độ chỉ khác nhau ở
  // state xoay nào được cập nhật, ref theo dõi vị trí con trỏ nào được dùng,
  // và việc chạm (không kéo) thì làm gì.
  const makeDragHandler = (
    setRot: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>,
    lastRef: React.MutableRefObject<{ x: number; y: number }>,
    movedRef: React.MutableRefObject<number>,
    onTapToggle: () => void,
  ) => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
    autoRotate.current = false;
    movedRef.current = 0;
    lastRef.current = { x: e.clientX, y: e.clientY };

    const handleMove = (ev: PointerEvent) => {
      const dx = ev.clientX - lastRef.current.x;
      const dy = ev.clientY - lastRef.current.y;
      movedRef.current += Math.abs(dx) + Math.abs(dy);
      lastRef.current = { x: ev.clientX, y: ev.clientY };
      setRot((r) => ({
        x: Math.max(-70, Math.min(70, r.x - dy * 0.4)),
        y: r.y + dx * 0.4,
      }));
    };

    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      setDragging(false);
      if (movedRef.current < 6) {
        onTapToggle();
      }
      // Luôn cho tự quay chậm lại sau khi buông tay — kể cả khi chỉ chạm để
      // mở/đóng nắp — thay vì đứng yên vĩnh viễn sau tương tác đầu tiên.
      window.setTimeout(() => {
        autoRotate.current = true;
      }, 2000);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };

  const handlePointerDown = makeDragHandler(setRotation, last, moved, () => {
    const next = !lidOpen;
    setLidOpen(next);
    onTap?.(next);
  });

  const handleBoxPointerDown = makeDragHandler(setBoxRotation, lastBox, movedBox, () => {
    setLidOpen(false);
    onTap?.(false);
  });

  const handleLidPointerDown = makeDragHandler(setLidRotation, lastLid, movedLid, () => {
    setLidOpen(false);
    onTap?.(false);
  });

  // Nắp trùm gần hết hộp (chiều cao 2 phần xấp xỉ nhau) — khi đóng cả hai
  // lồng vào nhau, đáy thẳng hàng nên tâm mỗi khối chỉ lệch nhau đúng phần
  // chênh lệch chiều cao. Khi mở: màn nhỏ trượt thẳng lên; desktop nâng lên
  // -> trượt ngang -> hạ xuống lại (xem effect `lidLifted`/`lidSlid`/
  // `lidLowered` ở trên) để nắp kết thúc nằm ngang hàng với hộp.
  const totalHeight = Math.max(boxHeight, lidHeight);
  const boxOffsetY = (lidHeight - boxHeight) / 2;
  // Hộp và nắp tách đều 2 bên (mỗi bên nửa khoảng cách) để cả cụm vẫn căn
  // giữa màn hình, thay vì chỉ nắp chạy sang phải làm lệch tâm cả cụm.
  const splitGap = width + 40;
  const boxOffsetX = isDesktop && lidSlid ? -splitGap / 2 : 0;
  const lidOffsetX = isDesktop && lidSlid ? splitGap / 2 : 0;
  const lidOffsetY = isDesktop
    ? lidLifted && !lidLowered
      ? -lidHeight * 1.2
      : 0
    : lidOpen
      ? -lidHeight * 1.3
      : 0;

  return (
    <div
      className={`select-none [perspective:1400px] ${className}`}
      style={{ width, height: totalHeight }}
    >
      {splitRotation ? (
        <>
          {/* Tách vị trí và xoay thành 2 lớp riêng: lớp ngoài chỉ tịnh tiến
              tới đúng chỗ hộp/nắp đang đứng (không xoay), lớp trong xoay
              quanh tâm của chính nó tại vị trí đó — nhờ vậy khi kéo, nắp
              xoay quanh trục của bản thân nó thay vì trục cũ (tâm hộp). */}
          <div
            className="pointer-events-none absolute inset-0 [transform-style:preserve-3d]"
            style={{
              transform: `translate(${boxOffsetX}px, ${boxOffsetY}px)`,
              transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <div
              className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]"
              style={{
                transform: `translate(-50%, -50%) rotateX(${boxRotation.x}deg) rotateY(${boxRotation.y}deg)`,
                transition: dragging ? "none" : "transform 0.15s linear",
              }}
            >
              <Cuboid
                width={width}
                height={boxHeight}
                depth={depth}
                faces={boxFaces}
                edgeColor={edgeColor}
                offsetY={0}
                hiddenFaces={boxHiddenFaces}
                wallThickness={wallThickness}
                cards={boxCards}
                cardsVisible={lidOpen}
                onPointerDown={handleBoxPointerDown}
              />
            </div>
          </div>
          <div
            className="pointer-events-none absolute inset-0 [transform-style:preserve-3d]"
            style={{
              transform: `translate(${lidOffsetX}px, ${lidOffsetY}px)`,
              transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <div
              className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]"
              style={{
                transform: `translate(-50%, -50%) rotateX(${lidRotation.x}deg) rotateY(${lidRotation.y}deg)`,
                transition: dragging ? "none" : "transform 0.15s linear",
              }}
            >
              <Cuboid
                width={width + 4}
                height={lidHeight}
                depth={depth + 4}
                faces={lidFaces}
                edgeColor={edgeColor}
                offsetX={0}
                offsetY={0}
                hiddenFaces={lidHiddenFaces}
                wallThickness={wallThickness}
                onPointerDown={handleLidPointerDown}
              />
            </div>
          </div>
        </>
      ) : (
        <div
          onPointerDown={handlePointerDown}
          className="relative h-full w-full cursor-grab touch-none [transform-style:preserve-3d] active:cursor-grabbing"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transition: dragging ? "none" : "transform 0.15s linear",
          }}
        >
          <Cuboid
            width={width}
            height={boxHeight}
            depth={depth}
            faces={boxFaces}
            edgeColor={edgeColor}
            offsetY={boxOffsetY}
            hiddenFaces={boxHiddenFaces}
            wallThickness={wallThickness}
            cards={boxCards}
            cardsVisible={lidOpen}
          />
          <Cuboid
            width={width + 4}
            height={lidHeight}
            depth={depth + 4}
            faces={lidFaces}
            edgeColor={edgeColor}
            offsetX={lidOffsetX}
            offsetY={lidOffsetY}
            hiddenFaces={lidHiddenFaces}
            wallThickness={wallThickness}
          />
        </div>
      )}
    </div>
  );
}
