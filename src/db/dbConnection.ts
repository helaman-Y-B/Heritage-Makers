import { sql } from "@vercel/postgres";

export default async function db() {
    const { rows } = await sql`SELECT * FROM users`;
    return rows;
}