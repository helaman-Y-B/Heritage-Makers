// src/app/orders/page.tsx
import Container from "@/components/layout/Container";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/currentUser";
import { userHasAnyPermission, userHasPermission } from "@/lib/auth/rbac";
import OrdersClient from "./OrdersClient";

export const metadata = {
  title: "Orders | Heritage Makers",
};

export default async function OrdersPage() {
  const currentUser = await getCurrentUser();

  // Permisos "admin/maker" para dashboard de orders
  const canViewOrdersDashboard = userHasAnyPermission(currentUser, ["view_orders"]);

  // Permiso para que un buyer vea SU order/cart
  const canUseCart = userHasPermission(currentUser, "create_order");

  // Si no puede ver dashboard NI usar cart, entonces sí bloquea
  if (!canViewOrdersDashboard && !canUseCart) {
    return (
      <Container>
        <h1>Orders</h1>
        <p>Not authorized to view orders.</p>
        <Link href="/products">Back to products</Link>
      </Container>
    );
  }

  // Per-user key para OrdersClient (email preferido)
  const userKey =
    (currentUser as any)?.email ?? (currentUser?.id ? String(currentUser.id) : undefined);

  return (
    <Container>
      <h1>Orders</h1>

      {/* Buyer cart / per-user order */}
      <OrdersClient userKey={userKey} />

      <div style={{ marginTop: 16 }}>
        <Link href="/products">Back to products</Link>
      </div>
    </Container>
  );
}
