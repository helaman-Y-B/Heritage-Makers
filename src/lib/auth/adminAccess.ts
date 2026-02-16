import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";

export async function requireAdminSession() {
  /**
   * Guards admin-only routes/pages by checking the authenticated session role.
   */
  const session = await getServerSession(authOptions);
  const userId = Number.parseInt(session?.user?.id ?? "", 10);
  if (!Number.isFinite(userId) || session?.user?.role !== "admin") {
    return null;
  }

  return { userId };
}
