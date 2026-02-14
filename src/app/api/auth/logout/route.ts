import { NextResponse } from "next/server";

export async function POST() {
  /**
   * Legacy logout endpoint retained for backward compatibility.
   * NextAuth sign-out should be used from the client (`signOut()`).
   */
  return NextResponse.json(
    { error: "Use NextAuth signOut for logout." },
    { status: 410 },
  );
}
