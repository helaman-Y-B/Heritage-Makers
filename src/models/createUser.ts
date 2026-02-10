import { sql } from "@vercel/postgres";

export default async function createUser(
  fname: string,
  lname: string,
  email: string,
  role: "buyer" | "seller" | "admin",
) {
  const { rows } = await sql`
    INSERT INTO users (firstname, lastname, email, role)
    VALUES (${fname}, ${lname}, ${email}, ${role})
    RETURNING *
  `;
  return rows[0];
}
