import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { requireAdminSession } from "@/lib/auth/adminAccess";

type Params = {
  params: Promise<{ userId: string }>;
};

const ALLOWED_ROLES = ["buyer", "seller", "admin"] as const;
type AllowedRole = (typeof ALLOWED_ROLES)[number];

function parseRole(value: unknown): AllowedRole | null {
  if (typeof value !== "string") return null;
  return ALLOWED_ROLES.includes(value as AllowedRole) ? (value as AllowedRole) : null;
}

export async function PATCH(req: Request, { params }: Params) {
  // Only admins can promote/demote user roles.
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { userId: userIdParam } = await params;
  const userId = Number.parseInt(userIdParam, 10);
  if (!Number.isFinite(userId)) {
    return NextResponse.json({ error: "Invalid user id." }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const role = parseRole(body?.role);
  if (!role) {
    return NextResponse.json({ error: "Invalid role value." }, { status: 400 });
  }

  const updated = await sql`
    UPDATE users
    SET role = ${role}
    WHERE user_id = ${userId}
    RETURNING user_id, role
  `;

  if (!updated.rows[0]) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  return NextResponse.json({ user: updated.rows[0] }, { status: 200 });
}
