// A single product type for our UI + (later) backend API
export type Product = {
  id: string;          // used for dynamic route: /products/[id]
  name: string;
  maker: string;
  price: number;       // store as number; format later
  category: "Textiles" | "Woodwork" | "Ceramics" | "Jewelry" | "Art";
  rating: number;      // 0 - 5
  reviewsCount: number;
  description: string;
  isSustainable: boolean;
  inStock: boolean;
};
