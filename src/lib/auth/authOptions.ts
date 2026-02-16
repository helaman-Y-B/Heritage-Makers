import { sql } from "@vercel/postgres";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { Role } from "./roles";

type DbUserRow = {
  user_id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: string | null;
};

function normalizeDbRole(role: string | null | undefined): Role {
  /**
   * Normalizes database/user-provider role values into the app RBAC role union.
   * This keeps legacy `maker` values compatible with `seller` permissions.
   */
  if (role === "admin") return "admin";
  if (role === "seller" || role === "maker") return "seller";
  return "buyer";
}

async function getOrCreateGoogleUser(email: string, name?: string | null) {
  /**
   * Ensures a Google-authenticated user has a local DB record.
   * Existing users keep their role; new users are created as `buyer` by default.
   */
  const existing = await sql<DbUserRow>`
    SELECT user_id, firstname, lastname, email, role
    FROM users
    WHERE email = ${email}
    LIMIT 1
  `;

  if (existing.rows[0]) {
    const row = existing.rows[0];
    return {
      id: row.user_id,
      name: `${row.firstname} ${row.lastname}`.trim(),
      role: normalizeDbRole(row.role),
    };
  }

  const fallbackName = (name ?? "").trim();
  const [first = "Google", ...rest] = fallbackName.split(/\s+/);
  const last = rest.join(" ") || "User";

  const created = await sql<DbUserRow>`
    INSERT INTO users (firstname, lastname, email, role, password)
    VALUES (${first}, ${last}, ${email}, ${"buyer"}, ${null})
    RETURNING user_id, firstname, lastname, email, role
  `;

  const row = created.rows[0];
  return {
    id: row.user_id,
    name: `${row.firstname} ${row.lastname}`.trim(),
    role: normalizeDbRole(row.role),
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user }) {
      /**
       * Resolves the authenticated Google account into a local app user.
       * We attach app-specific id/role fields for downstream authorization.
       */
      if (!user.email) return false;
      const dbUser = await getOrCreateGoogleUser(user.email, user.name);
      (user as { id: string; role: Role }).id = String(dbUser.id);
      (user as { id: string; role: Role }).role = dbUser.role;
      user.name = dbUser.name;
      return true;
    },
    async jwt({ token, user }) {
      /**
       * Persists app user identity/role in JWT so server routes can authorize requests.
       * On subsequent requests (no `user` object), we refresh role from DB so
       * admin role changes take effect without requiring the user to recreate account.
       */
      if (user) {
        token.uid = (user as { id?: string }).id;
        token.role = (user as { role?: Role }).role;
        token.name = user.name;
      } else if (typeof token.uid === "string" && token.uid) {
        // Keep JWT role in sync with DB so role upgrades take effect without re-registering users.
        const latest = await sql<{ role: string | null }>`
          SELECT role
          FROM users
          WHERE user_id = ${Number.parseInt(token.uid, 10)}
          LIMIT 1
        `;
        const latestRole = latest.rows[0]?.role;
        if (latestRole) {
          token.role = normalizeDbRole(latestRole);
        }
      }
      return token;
    },
    async session({ session, token }) {
      /**
       * Exposes id + role in the session object for server and client authorization checks.
       */
      if (session.user) {
        session.user.id = String(token.uid ?? "");
        session.user.role = normalizeDbRole(
          typeof token.role === "string" ? token.role : undefined,
        );
        if (typeof token.name === "string") {
          session.user.name = token.name;
        }
      }
      return session;
    },
  },
};
