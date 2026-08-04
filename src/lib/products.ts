export type ProductItem = {
  name: string;
  desc: string;
  image: string;
  imageAlt: string;
};

export type Product = {
  slug: string;
  name: string;
  desc: string;
  image: string;
  imageAlt: string;
  // Đường dẫn sang trang trải nghiệm riêng (xem lá bài / gieo quẻ).
  experienceHref: string;
  experienceLabel: string;
  // Những gì có trong sản phẩm khi mua (bài, hộp, túi, cốc...) — sẽ bổ
  // sung thêm khi có hình ảnh thật.
  items: ProductItem[];
};

export const PRODUCTS: Product[] = [
  {
    slug: "spirit-lenormand",
    name: "Spirit Lenormand",
    desc: "37 lá bài minh họa thủ công, đồng hành cùng bạn trong hành trình chiêm nghiệm và kết nối trực giác.",
    image: "/images/item-product/item1.png",
    imageAlt: "Hộp bài Spirit Lenormand",
    experienceHref: "/bo-bai",
    experienceLabel: "Xem chi tiết từng lá bài",
    items: [
      {
        name: "Bộ Bài & Hộp Spirit Lenormand",
        desc: "37 lá bài minh họa thủ công cùng hộp đựng thiết kế riêng và sách hướng dẫn.",
        image: "/images/item-product/tarot-box.png",
        imageAlt: "Hộp bài Spirit Lenormand",
      },
      {
        name: "Khăn Trải Bài Spirit Lenormand",
        desc: "Khăn lụa in họa tiết bầu trời đêm, dùng khi trải bài hoặc để cất giữ bộ bài.",
        image: "/images/item-product/cloth.png",
        imageAlt: "Khăn trải bài Spirit Lenormand",
      },
      {
        name: "Túi Rút FAYE",
        desc: "Túi rút vải in logo FAYE, tiện mang bộ bài theo bên mình.",
        image: "/images/item-product/Bag.png",
        imageAlt: "Túi rút FAYE",
      },
      {
        name: "Cốc FAYE",
        desc: "Cốc sứ in logo FAYE, món quà nhỏ đồng hành cùng bộ bài.",
        image: "/images/item-product/cup.png",
        imageAlt: "Cốc FAYE",
      },
      {
        name: "Mũ FAYE",
        desc: "Mũ lưỡi trai thêu logo FAYE.",
        image: "/images/item-product/hat.png",
        imageAlt: "Mũ FAYE",
      },
      {
        name: "Áo Thun FAYE",
        desc: "Áo thun họa tiết bầu trời đêm cùng logo FAYE.",
        image: "/images/item-product/Shirt.png",
        imageAlt: "Áo thun FAYE",
      },
      {
        name: "Huy Hiệu FAYE",
        desc: "Huy hiệu cài áo in logo FAYE.",
        image: "/images/item-product/badge.png",
        imageAlt: "Huy hiệu FAYE",
      },
      {
        name: "Nến Thơm Noctiflora",
        desc: "Nến thơm hương Hoa Quỳnh - Việt Quất, giúp bạn thư giãn trước khi trải bài.",
        image: "/images/item-product/scented-candle.png",
        imageAlt: "Nến thơm Noctiflora FAYE",
      },
    ],
  },
  {
    slug: "fortune-ticks",
    name: "FAYE Fortune Ticks",
    desc: "78 quẻ xăm minh họa thủ công, giúp bạn lắng lòng và xin một lời gợi ý cho những băn khoăn thường nhật.",
    image: "/images/item-product/item2.png",
    imageAlt: "Ống quẻ FAYE Fortune Ticks",
    experienceHref: "/gieo-que",
    experienceLabel: "Trải nghiệm gieo quẻ",
    items: [
      {
        name: "Ống Quẻ Fortune Ticks",
        desc: "Ống gỗ đựng 78 que quẻ, thiết kế nhỏ gọn để mang theo bên mình.",
        image: "/images/box-que.png",
        imageAlt: "Ống quẻ Fortune Ticks FAYE",
      },
      {
        name: "Bộ Que Xăm",
        desc: "78 que xăm khắc biểu tượng minh họa thủ công, đi kèm sách giải nghĩa.",
        image: "/images/que/stick-1.png",
        imageAlt: "Que xăm Fortune Ticks FAYE",
      },
    ],
  },
];
