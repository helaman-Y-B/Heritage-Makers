import { Product } from "@/types/product";

// Week 4: mock data (later replaced by DB/API in Week 5)
export const products: Product[] = [
  {
    id: "ankara-tote",
    name: "Ankara Heritage Tote Bag",
    maker: "Ayo Textiles",
    price: 28,
    image: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Tote_bag.jpg",
    category: "Textiles",
    rating: 4.7,
    reviewsCount: 58,
    description:
      "Handmade tote bag made with durable Ankara fabric. Great for daily shopping and travel.",
    isSustainable: true,
    inStock: true,
  },
  {
    id: "carved-wood-bowl",
    name: "Carved Wooden Bowl",
    maker: "Olu Woodcraft",
    price: 34,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/c/c6/Bowl_made_of_Ambrosia_Maple%2C_turned_on_wood_lathe.jpg",
    category: "Woodwork",
    rating: 4.6,
    reviewsCount: 41,
    description:
      "Smooth hand-carved bowl made from responsibly sourced hardwood with a natural finish.",
    isSustainable: true,
    inStock: true,
  },
  {
    id: "clay-mug-set",
    name: "Clay Mug Set (2pcs)",
    maker: "Heritage Ceramics",
    price: 22,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/e/e1/Ceramic_mug_antisky_ceramic.jpg",
    category: "Ceramics",
    rating: 4.5,
    reviewsCount: 29,
    description:
      "Two handcrafted clay mugs with a rustic glaze. Microwave-safe and durable.",
    isSustainable: true,
    inStock: false,
  },
  {
    id: "beaded-bracelet",
    name: "Beaded Bracelet",
    maker: "Kemi Jewelry",
    price: 12,
    image: "https://upload.wikimedia.org/wikipedia/commons/4/43/Rose_Quartz_Bracelet.jpg",
    category: "Jewelry",
    rating: 4.4,
    reviewsCount: 17,
    description:
      "Hand-beaded bracelet inspired by traditional patterns. Lightweight and comfortable.",
    isSustainable: false,
    inStock: true,
  },
  {
    id: "heritage-wall-art",
    name: "Heritage Wall Art Print",
    maker: "Zion Studio",
    price: 18,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/0/06/%C3%89mile_Hurtr%C3%A9%2C_Design_for_a_Wall_Decoration%2C_1896-1898.jpg",
    category: "Art",
    rating: 4.8,
    reviewsCount: 73,
    description:
      "Minimal wall art print celebrating heritage-inspired motifs. Looks great in modern spaces.",
    isSustainable: true,
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
