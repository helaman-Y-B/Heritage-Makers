import Container from "@/components/layout/Container";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/currentUser";
import { userHasAnyPermission } from "@/lib/auth/rbac";

export const metadata = {
  title: "Orders | Heritage Makers",
};

export default async function OrdersPage() {
  /**
   * Maker/admin orders screen (placeholder for now).
   * This is scoped by role:
   * - Maker: will eventually show orders that include the maker's products.
   * - Admin: will eventually show all orders across the marketplace.
   */
  const currentUser = await getCurrentUser();
  const canViewOrders = userHasAnyPermission(currentUser, ["view_orders", "view_own_orders"]);

  if (!canViewOrders) {
    return (
      <Container>
        <h1>Orders</h1>
        <p>Not authorized to view orders.</p>
        <Link href="/products">Back to products</Link>
      </Container>
    );
  }

  return (
    <Container>
      <h1>Orders</h1>
      <p>
        Orders dashboard is coming next. This page is wired and permission-protected for{" "}
        <strong>{currentUser?.role}</strong>.
      </p>
      <p>
        {currentUser?.role === "seller"
          ? "When we add real orders, you will only see orders for your products."
          : "When we add real orders, you will see marketplace-wide orders."}
      </p>
      <Link href="/products">Back to products</Link>
    </Container>
  );
}
