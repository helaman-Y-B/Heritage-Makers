import { sql } from "@vercel/postgres";
import { ensureMakerApplicationsTable } from "@/lib/makerApplications";

export default async function submitMaker(
  /**
   * Stores a new maker application in `pending` status.
   * Admin review later decides approval/rejection and role promotion.
   */
  userId: number,
  studioName: string,
  craftType: string,
  story: string,
  shopLink?: string
) {
  // Makes the flow resilient on fresh environments where migrations
  // may not have been executed yet.
  await ensureMakerApplicationsTable();

  // One pending application per user keeps admin queues clean and avoids duplicates.
  const duplicatePending = await sql`
    SELECT application_id
    FROM maker_applications
    WHERE user_id = ${userId} AND status = ${"pending"}
    LIMIT 1
  `;

  if (duplicatePending.rowCount && duplicatePending.rowCount > 0) {
    throw new Error("You already have a pending maker application.");
  }

  // Application starts as pending; role updates happen only in admin approval route.
  const inserted = await sql`
    INSERT INTO maker_applications (user_id, studio_name, craft_type, story, shop_link, status)
    VALUES (${userId}, ${studioName}, ${craftType}, ${story}, ${shopLink ?? null}, ${"pending"})
    RETURNING application_id, status
  `;

  return inserted.rows[0];
}
