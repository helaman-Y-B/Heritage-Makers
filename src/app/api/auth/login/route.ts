import { NextResponse } from "next/server";

export async function POST() {
  /**
   * Legacy credentials endpoint is intentionally disabled.
   * Authentication now runs exclusively through Google OAuth/NextAuth.
   */
  return NextResponse.json(
    { error: "Credentials login is disabled. Please sign in with Google." },
    { status: 410 },
  );
}
