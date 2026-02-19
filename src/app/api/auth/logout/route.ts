import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true }, { status: 200 });

  // 1) Clear your custom cookie
  res.cookies.set("hm_user", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });
  res.cookies.set("hm_active_role", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });

  // 2) Clear NextAuth cookies (JWT strategy)
  // Depending on http/https and env, NextAuth may use one or more of these names.
  const nextAuthCookieNames = [
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
    "next-auth.csrf-token",
    "__Host-next-auth.csrf-token",
    "next-auth.callback-url",
    "__Secure-next-auth.callback-url",
  ];

  for (const name of nextAuthCookieNames) {
    res.cookies.set(name, "", {
      path: "/",
      expires: new Date(0),
    });
  }

  return res;
}
