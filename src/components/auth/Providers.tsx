"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/components/cart/CartProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  /**
   * Global client providers.
   * SessionProvider: NextAuth session access.
   * CartProvider: client-side cart storage (localStorage-backed).
   */
  return (
    <SessionProvider>
      <CartProvider>{children}</CartProvider>
    </SessionProvider>
  );
}
