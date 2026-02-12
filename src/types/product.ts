// A single product type for our UI + (later) backend API
export type Product = {
  id: number;          // used for dynamic route: /products/[id]
  product_name: string;
  img_path: string;           // path to product image (relative to /public)
  firstname: string;
  lastname: string;
  user_id: number;
  price: number;       // store as number; format later
  category: "Textiles" | "Woodwork" | "Ceramics" | "Jewelry" | "Art";
  rating: number;      // 0 - 5
  reviewsCount: number;
  product_description: string;
  isSustainable: boolean;
  inStock: boolean;
};

export type ProductRow = Omit<Product, "isSustainable"> & {
  isSustainable?: boolean;
};
