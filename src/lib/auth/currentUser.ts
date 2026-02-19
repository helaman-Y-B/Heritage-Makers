import { getServerSession } from "next-auth";
import { User } from "./rbac";
import { authOptions } from "./authOptions";
import { cookies } from "next/headers";
import { Role } from "./roles";
import { isRoleAllowed } from "./activeRole";

type CookieUser = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: User["role"];
};

export async function getCurrentUser(): Promise<User | null> {
  /**
   * Reads the authenticated user from NextAuth session and returns
   * the normalized RBAC payload used throughout the app.
   */
  /*const session = await getServerSession(authOptions);
  const sessionUser = session?.user;
  if (!sessionUser?.id || !sessionUser.role) return null;

  const cookieStore = await cookies();
  const requestedRole = cookieStore.get("hm_active_role")?.value as Role | undefined;
  const role =
    requestedRole && isRoleAllowed(sessionUser.role, requestedRole)
      ? requestedRole
      : sessionUser.role;*/

  const cookieStore = await cookies();
  const raw = cookieStore.get("hm_user")?.value;
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as CookieUser;
    return {
      id: String(parsed.id),
      name: `${parsed.firstname} ${parsed.lastname}`.trim(),
      role: parsed.role,
    };
  } catch {
    return null;
  }
}


