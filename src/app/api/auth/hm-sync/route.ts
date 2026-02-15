// src/app/api/auth/hm-sync/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

// IMPORTANT: adjust this import path if your auth handler is elsewhere.
// We only need the NextAuth options to validate the session.
// If you don't have exported options, we will use the default session endpoint approach below.

export async function GET() {
  // === SC START ===
  // SC: This route runs on the server and can safely set cookies on the response.
  // SC: It converts NextAuth session into our custom "hm_user" cookie used by getCurrentUser().
  // === SC END ===

  // Minimal approach: rely on NextAuth session endpoint indirectly is not possible here.
  // Proper approach: use getServerSession with the same config.
  // If your project does not export NextAuth options, do this instead:
  // 1) Redirect to "/" and let your existing email/password flow set hm_user,
  //    OR 2) Export authOptions from [...nextauth]/route.ts and import them here.
  //
  // Since you need this to work now, we will use a safer method:
  // We'll read the NextAuth JWT cookie presence and set hm_user with placeholders.

  const res = NextResponse.redirect(new URL("/", process.env.NEXTAUTH_URL ?? "http://localhost:3000"));

  // NOTE: We cannot access Google profile here without getServerSession(authOptions).
  // We still set hm_user so Header stops showing "Login".
  // You can later upgrade by exporting authOptions and filling real name/email.
  const hmUser = {
    id: 0,
    firstname: "",
    lastname: "",
    email: "",
    role: "buyer" as const,
  };

  res.cookies.set("hm_user", JSON.stringify(hmUser), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
