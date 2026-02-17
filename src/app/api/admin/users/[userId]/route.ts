import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { requireAdminSession } from "@/lib/auth/adminAccess";
import { ensureMakerApplicationsTable } from "@/lib/makerApplications";

type Params = {
  params: Promise<{ userId: string }>;
};

export async function DELETE(_req: Request, { params }: Params) {
  // Account deletion is restricted to admins.
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { userId: userIdParam } = await params;
  const userId = Number.parseInt(userIdParam, 10);
  if (!Number.isFinite(userId)) {
    return NextResponse.json({ error: "Invalid user id." }, { status: 400 });
  }

  if (userId === admin.userId) {
    // Prevent accidental lockout of the currently signed-in admin.
    return NextResponse.json({ error: "You cannot delete your own admin account." }, { status: 400 });
  }

  // Wrap cleanup + deletion in one transaction to avoid partial removal.
  await sql`BEGIN`;
  try {
    await ensureMakerApplicationsTable();

    const target = await sql<{ user_id: number; role: string }>`
      SELECT user_id, role
      FROM users
      WHERE user_id = ${userId}
      LIMIT 1
      FOR UPDATE
    `;

    if (!target.rows[0]) {
      await sql`ROLLBACK`;
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (target.rows[0].role === "admin") {
      // Admin-to-admin deletion is disabled by policy.
      await sql`ROLLBACK`;
      return NextResponse.json({ error: "Admins cannot delete other admin accounts." }, { status: 400 });
    }

    // Some schemas may enforce maker_applications.reviewed_by FK without ON DELETE SET NULL.
    await sql`UPDATE maker_applications SET reviewed_by = NULL WHERE reviewed_by = ${userId}`;
    await sql`DELETE FROM maker_applications WHERE user_id = ${userId}`;
    await sql`DELETE FROM products WHERE user_id = ${userId}`;
    await sql`DELETE FROM users WHERE user_id = ${userId}`;

    await sql`COMMIT`;
    return NextResponse.json({ deletedUserId: userId }, { status: 200 });
  } catch (error) {
    await sql`ROLLBACK`;
    const message = error instanceof Error ? error.message : "Failed to delete user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
