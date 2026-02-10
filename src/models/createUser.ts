import { sql } from "@vercel/postgres";

export default async function createUser(fname: string, lname: string, email: string) {
    const { rows } = await sql`INSERT INTO users (firstname, lastname, email) VALUES (${fname}, ${lname}, ${email}) RETURNING *`;
    return rows[0];
}