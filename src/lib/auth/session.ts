import { cookies } from "next/headers";
import { Role } from "./roles";

export type User = {
  id: string;
  name: string;
  role: Role;
};

const ROLE_COOKIE = "hm_role";

function isRole(value: string | undefined): value is Role {
  return value === "admin" || value === "seller" || value === "buyer";
}

// Week 5: server-side mock user (reads role from cookie)
export async function getCurrentUser(): Promise<User> {
  const cookieStore = await cookies();
  const cookieRole = cookieStore.get(ROLE_COOKIE)?.value;
  const role: Role = isRole(cookieRole) ? cookieRole : "buyer";

  return {
    id: "demo-user",
    name: `Demo ${role[0].toUpperCase()}${role.slice(1)}`,
    role,
  };
}
