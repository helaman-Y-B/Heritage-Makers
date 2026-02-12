import { sql } from "@vercel/postgres";

export type DbUser = {
  user_id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: "buyer" | "seller" | "admin";
};

export default async function getUserByEmail(email: string): Promise<DbUser | undefined> {
  const { rows } = await sql`
    SELECT user_id, firstname, lastname, email, role
    FROM users
    WHERE email = ${email}
    LIMIT 1
  `;
  return rows[0] as DbUser | undefined;
}
