// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth"; // SC: type to correctly type authOptions
import Google from "next-auth/providers/google";

// SC: Keep same config, ONLY add typing + export.
export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,

  // === SC START ===
  // SC: Do NOT call cookies().set here. In Next.js 16.1.x (Turbopack),
  // SC: cookies() is async and NextAuth callbacks are not a safe place to mutate cookies.
  // SC: We will set the custom "hm_user" cookie in a dedicated route after sign-in.
  // === SC END ===
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
