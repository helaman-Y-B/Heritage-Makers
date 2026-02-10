import { cookies } from "next/headers";
import { User } from "./rbac";

type CookieUser = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: User["role"];
};

export async function getCurrentUser(): Promise<User | null> {
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
