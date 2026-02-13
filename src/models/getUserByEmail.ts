import { sql } from "@vercel/postgres";
import { verifyPassword } from "@/hooks/hashPassword";

export type DbUser = {
  user_id: number;
  firstname: string;
  lastname: string;
  email: string;
  password?: string; // Optional, only used for authentication
  role: "buyer" | "seller" | "admin";
};

export default async function getUserByEmail(email: string, password: string): Promise<DbUser | undefined> {
  /**
   * This function retrieves a user from the database based on the provided email and password.
   * It executes a SQL query to find a user with the matching email and password, 
   * and returns the user information if found.
   * If no user is found, it returns undefined.
   */
  try {
    const { rows } = await sql`SELECT password FROM users WHERE email = ${email}`;
    const isPasswordValid = await verifyPassword(rows[0]?.password || "", password);
    if (!isPasswordValid) {
      return undefined;
    } else {
      const { rows } = await sql`
      SELECT user_id, firstname, lastname, email, role
      FROM users
      WHERE email = ${email}
      LIMIT 1
      `;
      return rows[0] as DbUser | undefined;
    }
  } catch (err) {
    console.error("Error fetching user by email:", err);
    return undefined;
  }
}
