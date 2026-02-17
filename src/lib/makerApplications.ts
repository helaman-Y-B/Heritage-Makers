import { sql } from "@vercel/postgres";

export type MakerApplicationStatus = "pending" | "approved" | "rejected";

export async function ensureMakerApplicationsTable() {
  /**
   * Creates maker application storage when missing so deployments can
   * use the review flow without a separate manual migration step.
   */
  await sql`
    CREATE TABLE IF NOT EXISTS maker_applications (
      application_id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
      studio_name VARCHAR(80) NOT NULL,
      craft_type VARCHAR(80) NOT NULL,
      story VARCHAR(1000) NOT NULL,
      shop_link TEXT,
      status VARCHAR(16) NOT NULL DEFAULT 'pending',
      submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      reviewed_at TIMESTAMPTZ,
      reviewed_by INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
      review_note TEXT,
      CONSTRAINT maker_applications_status_check
        CHECK (status IN ('pending', 'approved', 'rejected'))
    )
  `;

  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS maker_applications_one_pending_per_user_idx
    ON maker_applications (user_id) WHERE status = 'pending'
  `;
}
