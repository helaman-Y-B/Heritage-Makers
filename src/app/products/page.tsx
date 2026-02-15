// src/app/products/page.tsx
import Container from "@/components/layout/Container";
import ProductCard from "@/components/products/ProductCard";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/currentUser";
import { userHasAnyPermission, userHasPermission } from "@/lib/auth/rbac";
import getProducts from "@/models/getProducts";
import { Product } from "@/types/product";
import AddProductForm from "@/components/products/AddProductForm";
import styles from "./products.module.css";
import { ErrorBoundary } from "react-error-boundary";

export const metadata = {
  title: "Products | Heritage Makers",
};

export default async function ProductsPage() {
  const currentUser = await getCurrentUser();

  /* SC: stable userKey (email preferred) to keep cart consistent across Products/Orders */
  const userKey =
    (currentUser as any)?.email ?? (currentUser?.id ? String(currentUser.id) : undefined);
  /* SC: end */

  const canCreateOrder = userHasPermission(currentUser, "create_order");
  const canManageProducts = userHasAnyPermission(currentUser, [
    "manage_products",
    "manage_own_products",
  ]);
  const canViewOrders = userHasAnyPermission(currentUser, [
    "view_orders",
    "view_own_orders",
  ]);
  const canManageUsers = userHasPermission(currentUser, "manage_users");
  const canApproveMakers = userHasPermission(currentUser, "approve_makers");
  const canManageCategories = userHasPermission(currentUser, "manage_categories");
  const canViewReports = userHasPermission(currentUser, "view_reports");
  const canViewEarnings = userHasPermission(currentUser, "view_earnings");
  const showRoleTools =
    canManageProducts ||
    canViewOrders ||
    canManageUsers ||
    canApproveMakers ||
    canManageCategories ||
    canViewReports ||
    canViewEarnings;
  const canManageOwnProducts = userHasPermission(currentUser, "manage_own_products");
  const canManageAnyProducts = userHasPermission(currentUser, "manage_products");

  let products: Product[] = [];
  try {
    products = (await getProducts()).map((p) => ({
      ...p,
      isSustainable: Boolean(p.isSustainable),
    }));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("missing_connection_string") || message.includes("POSTGRES_URL")) {
      return (
        <Container>
          <header className={styles.header}>
            <h1 className={styles.title}>Products</h1>
            <p className={styles.sub}>
              Database connection is missing. Set POSTGRES_URL in your .env.local.
            </p>
          </header>
        </Container>
      );
    }
    throw error;
  }

  return (
    <Container>
      <header className={styles.header}>
        <h1 className={styles.title}>Products</h1>
        <p className={styles.sub}>
          Browse heritage-inspired handmade pieces from local makers.
        </p>
      </header>

      <AddProductForm enabled={canManageAnyProducts || canManageOwnProducts} />

      {/* Week 4: UI-only "search" (not functional yet). We'll wire it in Week 4/5 */}
      <div className={styles.toolbar}>
        <input
          className={styles.input}
          placeholder="Search products" // This is not working, we don't a search engine.
          aria-label="Search products"
        />
        {showRoleTools && (
          <div className={styles.roleTools}>
            <span className={styles.roleLabel}>Role tools</span>
            {canManageProducts && (
              <button className={styles.toolButton} type="button">
                Add product
              </button>
            )}
            {canViewOrders && (
              <Link href="/orders" className={styles.toolButton}>
                View orders
              </Link>
            )}

            {canViewEarnings && (
              <button className={styles.toolButton} type="button">
                View earnings
              </button>
            )}
            {canManageUsers && (
              <button className={styles.toolButton} type="button">
                Manage users
              </button>
            )}
            {canApproveMakers && (
              <button className={styles.toolButton} type="button">
                Approve makers
              </button>
            )}
            {canManageCategories && (
              <button className={styles.toolButton} type="button">
                Manage categories
              </button>
            )}
            {canViewReports && (
              <button className={styles.toolButton} type="button">
                View reports
              </button>
            )}
          </div>
        )}
      </div>

      <section className={styles.grid}>
        {products.map((p) => (
          /* SC: Added key to the top-level element returned by map to fix React key warning */
          <ErrorBoundary
            key={`${p.id}-${p.firstname}`}
            fallback={<article className={styles.cardError}>Failed to load product.</article>}
          >
            <ProductCard
              product={p}
              canCreateOrder={canCreateOrder}
              canManageAny={canManageAnyProducts}
              canManageOwn={canManageOwnProducts}
              currentUserId={undefined}
              userKey={userKey} /* SC: pass stable key for per-user cart */
            />
          </ErrorBoundary>
          /* SC: End key fix */
        ))}
      </section>
    </Container>
  );
}
