import { NextResponse } from "next/server";

type Role = "admin" | "seller" | "buyer";

function isRole(value: unknown): value is Role {
  return value === "admin" || value === "seller" || value === "buyer";
}

export async function POST(req: Request) {
  const body = await req.json();
  const role = body?.role;

  if (!isRole(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true, role });
  res.cookies.set("hm_role", role, { path: "/" });
  return res;
}
