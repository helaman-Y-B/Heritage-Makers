import { sql } from "@vercel/postgres";
import { ProductRow } from "@/types/product";

type GetProductsOptions = {
  ownerUserId?: number;
};

export default async function getProducts(options?: GetProductsOptions): Promise<ProductRow[]> {
  /**
   * Fetches products and optionally scopes results to a single maker.
   * We use this to ensure a logged-in seller only sees their own listings,
   * while admins and buyers can still browse all listings.
   */
  const ownerUserId = options?.ownerUserId;

  if (typeof ownerUserId === "number") {
    const { rows } = await sql`SELECT 
      users.firstname, 
      users.lastname, 
      p.id, 
      p.user_id,
      p.product_name, 
      p.product_description, 
      p.price, 
      p.category, 
      p.img_path, 
      p.rating, 
      p."reviewsCount", 
      p."inStock" 
      FROM products p INNER JOIN users ON p.user_id = users.user_id
      WHERE p.user_id = ${ownerUserId}`;

    return rows as ProductRow[];
  }

  const { rows } = await sql`SELECT 
    users.firstname, 
    users.lastname, 
    p.id, 
    p.user_id,
    p.product_name, 
    p.product_description, 
    p.price, 
    p.category, 
    p.img_path, 
    p.rating, 
    p."reviewsCount", 
    p."inStock" 
    FROM products p INNER JOIN users ON p.user_id = users.user_id`;

  return rows as ProductRow[];
}
