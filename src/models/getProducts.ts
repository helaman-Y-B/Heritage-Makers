import { sql } from "@vercel/postgres";
import { ProductRow } from "@/types/product";

export default async function getProducts(): Promise<ProductRow[]> {
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
