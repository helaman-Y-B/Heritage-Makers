import { Product } from "@/types/product";

// Week 4: mock data (later replaced by DB/API in Week 5)
export const products: Product[] = [
  {
    id: "carved-wood-bowl",
    name: "Carved Wooden Bowl",
    maker: "Olu Woodcraft",
    price: 34,
    category: "Woodwork",
    rating: 4.6,
    reviewsCount: 41,
    description:
      "Smooth hand-carved bowl made from responsibly sourced hardwood with a natural finish.",
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Bowl%20made%20of%20Ambrosia%20Maple,%20turned%20on%20wood%20lathe.jpg",
    imageAlt: "Hand-turned wooden bowl with warm natural grain.",
    isSustainable: true,
    inStock: true,
  },
  {
    id: "clay-mug-set",
    name: "Ceramic Mug and Saucer",
    maker: "Heritage Ceramics",
    price: 22,
    category: "Ceramics",
    rating: 4.5,
    reviewsCount: 29,
    description:
      "Hand-painted ceramic mug and saucer inspired by traditional motifs.",
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Ceramic%20mug%20and%20saucer%20with%20Uzbek%20national%20patterns01.jpg",
    imageAlt: "Ceramic mug and saucer with traditional pattern.",
    isSustainable: true,
    inStock: false,
  },
  {
    id: "mud-built-vase",
    name: "Mud-Built Clay Vase",
    maker: "Adara Studio",
    price: 30,
    category: "Ceramics",
    rating: 4.7,
    reviewsCount: 36,
    description:
      "Handbuilt clay vase shaped and finished by hand for earthy, organic texture.",
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Ceramic%20Vase%20%2815405728946%29.jpg",
    imageAlt: "Handbuilt ceramic vase with a soft matte finish.",
    isSustainable: true,
    inStock: true,
  },
  {
    id: "wire-wrapped-ring",
    name: "Wire-Wrapped Pendant",
    maker: "Kemi Jewelry",
    price: 16,
    category: "Jewelry",
    rating: 4.6,
    reviewsCount: 21,
    description:
      "Hand-wrapped wire pendant featuring a polished stone centerpiece.",
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Wire%20wrapped%20jewelry%20by%20Gemhenge.jpg",
    imageAlt: "Handmade wire-wrapped pendant with a polished stone.",
    isSustainable: false,
    inStock: true,
  },
  {
    id: "beaded-bracelet",
    name: "Beaded Bracelet",
    maker: "Kemi Jewelry",
    price: 12,
    category: "Jewelry",
    rating: 4.4,
    reviewsCount: 17,
    description:
      "Hand-beaded bracelet using lapis stones with a simple clasp.",
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Lapis%20Lazuli%20Beaded%20Bracelet.jpg",
    imageAlt: "Lapis lazuli beaded bracelet with a clasp.",
    isSustainable: false,
    inStock: true,
  },
];

// Small helpers (keeps UI code clean)
export function getProductById(id: string) {
  return products.find((p) => p.id === id);
}

export function formatPrice(value: number) {
  // Week 4: simple formatting; later can use locale/currency settings
  return `£${value.toFixed(2)}`;
}
