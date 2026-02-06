import { sql } from "@vercel/postgres";

export default async function getProducts() {
    const { rows } = await sql`SELECT * FROM products`;
    return rows;
}