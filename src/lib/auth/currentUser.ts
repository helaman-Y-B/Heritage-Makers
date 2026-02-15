// src/lib/auth/currentUser.ts

import { getServerSession } from "next-auth"; // SC
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // SC: typed NextAuthOptions now

import type { Role } from "./roles";
import type { User as RbacUser } from "./rbac";

function inferRoleFromEmail(email: string | null | undefined): Role {
  // SC: Temporary deterministic role mapping. Replace with DB mapping later if needed.
  const e = (email ?? "").toLowerCase();
  if (e.endsWith("@heritagemakers.com")) return "admin" as Role; // SC
  return "buyer" as Role; // SC
}

export async function getCurrentUser(): Promise<RbacUser | null> {
  try {
    const session = await getServerSession(authOptions); // SC: now correctly typed
    const user = (session as any)?.user as any;
    if (!user) return null;

    const email = (user.email ?? null) as string | null;

    // SC: Ensure RBAC role always exists, even if your session doesn't include it.
    const role: Role =
      (user.role as Role | null) ?? inferRoleFromEmail(email);
    // SC: End role guarantee

    return {
      id: String(user.id ?? email ?? ""), // SC: RBAC expects string id
      name: String(user.name ?? "User"),
      role,
      email, // SC: keep for cart userKey
    };
  } catch {
    return null;
  }
}
