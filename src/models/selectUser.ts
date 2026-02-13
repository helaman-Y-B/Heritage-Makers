import { sql } from "@vercel/postgres";

export default async function selectUser(email: string, password: string) {
    const { rows } = await sql`SELECT * FROM users WHERE email = ${email} AND password = ${password}`;
    return rows;
}