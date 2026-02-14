import Container from "@/components/layout/Container";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/currentUser";
import { userHasPermission } from "@/lib/auth/rbac";

export const metadata = {
  title: "Earnings | Heritage Makers",
};

export default async function EarningsPage() {
  /**
   * Earnings screen for makers (and admins when acting as maker).
   * This is placeholder UI until we add real order/payment data.
   */
  const currentUser = await getCurrentUser();
  const canViewEarnings = userHasPermission(currentUser, "view_earnings");

  if (!canViewEarnings) {
    return (
      <Container>
        <h1>Earnings</h1>
        <p>Not authorized to view earnings.</p>
        <Link href="/products">Back to products</Link>
      </Container>
    );
  }

  return (
    <Container>
      <h1>Earnings</h1>
      <p>
        Earnings dashboard is coming next. This page is wired and permission-protected for{" "}
        <strong>{currentUser?.role}</strong>.
      </p>
      <p>When we add real orders, this will show earnings for the signed-in maker only.</p>
      <Link href="/products">Back to products</Link>
    </Container>
  );
}
