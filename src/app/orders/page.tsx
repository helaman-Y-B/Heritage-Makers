// src/app/orders/page.tsx
import { getCurrentUser } from "@/lib/auth/currentUser";
import OrdersClient from "./OrdersClient";

/* SC: Server wrapper passes authenticated user key to OrdersClient for per-user cart */
export default async function OrdersPage() {
  const currentUser = await getCurrentUser();

  /* SC: Use stable userKey (email preferred) */
  const userKey =
    (currentUser as any)?.email ?? (currentUser?.id ? String(currentUser.id) : undefined);
  /* SC: End */

  return <OrdersClient userKey={userKey} />;
}
/* SC: End server wrapper */
