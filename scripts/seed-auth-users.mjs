/**
 * Seeds Google-auth users into the `users` table with the correct roles.
 *
 * Important:
 * - This does NOT create Google accounts. It only creates DB rows.
 * - A person can only log in if they actually sign in with Google using the same email.
 * - New/unknown Google emails default to role `buyer` in our NextAuth callback.
 *
 * Usage:
 * - Default emails (edit below), or override with env vars:
 *   HM_SEED_MAKER_EMAILS="olakunle@maker.com,sergio@maker.com,helama@maker.com"
 *   HM_SEED_ADMIN_EMAIL="olakunle@admin.com"
 *
 * Run:
 *   node scripts/seed-auth-users.mjs
 */

import fs from "fs";
import path from "path";

function loadEnvLocal() {
  // Loads .env.local into process.env so @vercel/postgres can connect in local dev.
  const dotenvPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(dotenvPath)) return;

  const txt = fs.readFileSync(dotenvPath, "utf8");
  for (const line of txt.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const k = m[1];
    let v = m[2];
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (!(k in process.env)) process.env[k] = v;
  }
}

function parseCsv(value) {
  return String(value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

loadEnvLocal();

const defaultMakerEmails = [
  // Team makers already present in the DB from existing products.
  // If you want real Google emails here, override with HM_SEED_MAKER_EMAILS.
  "olakunle@maker.com",
  "sergio@maker.com",
  "helama@maker.com",
];

const makerEmails = parseCsv(process.env.HM_SEED_MAKER_EMAILS);
const adminEmail = normalizeEmail(process.env.HM_SEED_ADMIN_EMAIL || "olakunle@admin.com");

const finalMakerEmails = (makerEmails.length ? makerEmails : defaultMakerEmails).map(normalizeEmail);

const { sql } = await import("@vercel/postgres");

async function upsertUser({ email, role, firstname, lastname }) {
  /**
   * Creates a user row if missing, otherwise updates role + name.
   * Password remains null because auth is handled via Google/NextAuth.
   */
  await sql`
    INSERT INTO users (firstname, lastname, email, role, password)
    VALUES (${firstname}, ${lastname}, ${email}, ${role}, ${null})
    ON CONFLICT (email)
    DO UPDATE SET
      firstname = EXCLUDED.firstname,
      lastname = EXCLUDED.lastname,
      role = EXCLUDED.role
  `;
}

async function main() {
  console.log("Seeding makers:", finalMakerEmails);
  for (let i = 0; i < finalMakerEmails.length; i += 1) {
    const email = finalMakerEmails[i];
    await upsertUser({
      email,
      role: "seller",
      firstname: `Maker${i + 1}`,
      lastname: "Seed",
    });
  }

  console.log("Seeding admin:", adminEmail);
  await upsertUser({
    email: adminEmail,
    role: "admin",
    firstname: "Admin",
    lastname: "Seed",
  });

  const { rows } = await sql`
    SELECT user_id, email, role
    FROM users
    WHERE email = ANY(${[...finalMakerEmails, adminEmail]})
    ORDER BY user_id
  `;

  console.log("Seeded/updated users:");
  console.table(rows);
}

main().catch((err) => {
  console.error("SEED_FAILED");
  console.error(err);
  process.exit(1);
});
