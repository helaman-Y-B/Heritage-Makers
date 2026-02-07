import { sql } from "@vercel/postgres";

export default async function selectAll() {
    const { rows } = await sql`SELECT * FROM users`;
    return rows;
}