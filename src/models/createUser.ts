import { sql } from "@vercel/postgres";
import { hashPassword } from "../hooks/hashPassword";

export default async function createUser(
  fname: string,
  lname: string,
  email: string,
  role: "buyer" | "seller" | "admin",
  password: string
) {
  // Hash the password before storing it in the database
  const hashedPassword = await hashPassword(password);
  const validatedEmail = await sql`SELECT * FROM users WHERE email = ${email}`;
  if (validatedEmail.rows.length > 0) {
    throw new Error("Email already in use");
  }
  const { rows } = await sql`
    INSERT INTO users (firstname, lastname, email, role, password)
    VALUES (${fname}, ${lname}, ${email}, ${role}, ${hashedPassword})
    RETURNING *
  `;
  return rows[0];
}
