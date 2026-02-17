import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { Role } from "@/lib/auth/roles";
import { isRoleAllowed } from "@/lib/auth/activeRole";

function parseRequestedRole(value: string | null): Role | null {
  /**
   * Parses the role requested by the pre-login selector.
   * Returns null for invalid inputs to avoid accepting arbitrary values.
   */
  if (value === "buyer" || value === "seller" || value === "admin") return value;
  return null;
}

export async function GET(req: Request) {
  /**
   * Post-auth callback route.
   * NextAuth redirects here after Google sign-in, then we validate whether the user
   * is authorized for the requested role. If authorized we store it in a cookie
   * and redirect into the app; otherwise we redirect back to /login with an error.
   */
  const url = new URL(req.url);
  const requested = parseRequestedRole(url.searchParams.get("as"));
  if (!requested) {
    return NextResponse.redirect(new URL("/login?error=missing_role", url.origin));
  }

  const session = await getServerSession(authOptions);
  const maxRole = session?.user?.role;
  if (!session?.user?.id || !maxRole) {
    return NextResponse.redirect(new URL("/login", url.origin));
  }

  if (!isRoleAllowed(maxRole, requested)) {
    return NextResponse.redirect(
      new URL(`/login?error=role_not_allowed&as=${encodeURIComponent(requested)}`, url.origin),
    );
  }

  const cookieStore = await cookies();
  cookieStore.set("hm_active_role", requested, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return NextResponse.redirect(new URL("/products", url.origin));
}

