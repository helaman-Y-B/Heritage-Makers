import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { requireAdminSession } from "@/lib/auth/adminAccess";

export async function GET() {
  // User directory is admin-only because it exposes role-management data.
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { rows } = await sql`
    SELECT user_id, firstname, lastname, email, role
    FROM users
    ORDER BY
      -- Keep admin tools predictable: admins first, then makers, then buyers.
      CASE role
        WHEN 'admin' THEN 0
        WHEN 'seller' THEN 1
        ELSE 2
      END,
      firstname ASC,
      lastname ASC,
      user_id ASC
  `;

  return NextResponse.json({ users: rows, currentAdminId: admin.userId }, { status: 200 });
}
