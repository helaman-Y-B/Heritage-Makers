import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { requireAdminSession } from "@/lib/auth/adminAccess";
import { ensureMakerApplicationsTable } from "@/lib/makerApplications";

export async function GET() {
  // Only admins can review maker applications.
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  // Ensure review table exists before querying.
  await ensureMakerApplicationsTable();

  const { rows } = await sql`
    SELECT
      ma.application_id,
      ma.user_id,
      ma.studio_name,
      ma.craft_type,
      ma.story,
      ma.shop_link,
      ma.status,
      ma.submitted_at,
      ma.reviewed_at,
      ma.review_note,
      u.firstname,
      u.lastname,
      u.email
    FROM maker_applications ma
    INNER JOIN users u ON ma.user_id = u.user_id
    ORDER BY
      -- Pending first so admins can act quickly, then recently reviewed records.
      CASE ma.status WHEN 'pending' THEN 0 WHEN 'approved' THEN 1 ELSE 2 END,
      ma.submitted_at DESC
  `;

  return NextResponse.json({ applications: rows }, { status: 200 });
}
