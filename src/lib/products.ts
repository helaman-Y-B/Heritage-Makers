import { Product } from "@/types/product";

// Legacy mock data placeholder (DB-backed now).
export const products: Product[] = [];

export function getProductById(id: number) {
  return products.find((p) => p.id === id);
}
