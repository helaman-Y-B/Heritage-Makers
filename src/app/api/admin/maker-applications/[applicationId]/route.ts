import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { requireAdminSession } from "@/lib/auth/adminAccess";
import { ensureMakerApplicationsTable } from "@/lib/makerApplications";

type Params = {
  params: Promise<{ applicationId: string }>;
};

type Decision = "approve" | "reject";

function parseDecision(value: unknown): Decision | null {
  if (value === "approve" || value === "reject") return value;
  return null;
}

export async function PATCH(req: Request, { params }: Params) {
  // Approval/rejection is an admin-only action.
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { applicationId: applicationIdParam } = await params;
  const applicationId = Number.parseInt(applicationIdParam, 10);
  if (!Number.isFinite(applicationId)) {
    return NextResponse.json({ error: "Invalid application id." }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const decision = parseDecision(body?.decision);
  if (!decision) {
    return NextResponse.json({ error: "Decision must be approve or reject." }, { status: 400 });
  }

  const note = typeof body?.note === "string" ? body.note.trim() : "";
  const status = decision === "approve" ? "approved" : "rejected";

  // Transaction keeps status/role/maker changes consistent as one unit of work.
  await ensureMakerApplicationsTable();
  await sql`BEGIN`;
  try {
    const existing = await sql<{
      application_id: number;
      status: string;
      user_id: number;
      studio_name: string;
      craft_type: string;
      story: string;
      shop_link: string | null;
    }>`
      SELECT application_id, status, user_id, studio_name, craft_type, story, shop_link
      FROM maker_applications
      WHERE application_id = ${applicationId}
      LIMIT 1
      FOR UPDATE
    `;

    if (!existing.rows[0]) {
      await sql`ROLLBACK`;
      return NextResponse.json({ error: "Application not found." }, { status: 404 });
    }

    const application = existing.rows[0];
    if (application.status !== "pending") {
      await sql`ROLLBACK`;
      return NextResponse.json({ error: "Application has already been reviewed." }, { status: 409 });
    }

    // Mark application as reviewed (approved or rejected) with reviewer trace.
    await sql`
      UPDATE maker_applications
      SET status = ${status}, reviewed_at = NOW(), reviewed_by = ${admin.userId}, review_note = ${note || null}
      WHERE application_id = ${applicationId}
    `;

    if (decision === "approve") {
      // Approval grants maker access. Admin role stays admin if approving themselves/another admin.
      await sql`
        UPDATE users
        SET role = CASE WHEN role = 'admin' THEN role ELSE ${"seller"} END
        WHERE user_id = ${application.user_id}
      `;

      // Backfill `makers` profile for existing marketplace pages that still read this table.
      await sql`
        INSERT INTO makers (studio_name, craft_type, story, shop_link)
        SELECT ${application.studio_name}, ${application.craft_type}, ${application.story}, ${application.shop_link ?? ""}
        WHERE NOT EXISTS (
          SELECT 1 FROM makers WHERE studio_name = ${application.studio_name}
        )
      `;
    }

    await sql`COMMIT`;
    return NextResponse.json({ status }, { status: 200 });
  } catch (error) {
    await sql`ROLLBACK`;
    const message = error instanceof Error ? error.message : "Failed to review application";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
