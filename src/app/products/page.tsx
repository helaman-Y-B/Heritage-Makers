import Container from "@/components/layout/Container";
import ProductCard from "@/components/products/ProductCard";
import { CURRENT_USER } from "@/lib/auth/currentUser";
import { userHasAnyPermission, userHasPermission } from "@/lib/auth/rbac";
import { products } from "@/lib/products";
import styles from "./products.module.css";

export const metadata = {
  title: "Products | Heritage Makers",
};

export default function ProductsPage() {
  const canCreateOrder = userHasPermission(CURRENT_USER, "create_order");
  const canManageProducts = userHasAnyPermission(CURRENT_USER, [
    "manage_products",
    "manage_own_products",
  ]);
  const canViewOrders = userHasAnyPermission(CURRENT_USER, [
    "view_orders",
    "view_own_orders",
  ]);
  const canManageUsers = userHasPermission(CURRENT_USER, "manage_users");
  const canApproveMakers = userHasPermission(CURRENT_USER, "approve_makers");
  const canManageCategories = userHasPermission(CURRENT_USER, "manage_categories");
  const canViewReports = userHasPermission(CURRENT_USER, "view_reports");
  const canViewEarnings = userHasPermission(CURRENT_USER, "view_earnings");
  const showRoleTools =
    canManageProducts ||
    canViewOrders ||
    canManageUsers ||
    canApproveMakers ||
    canManageCategories ||
    canViewReports ||
    canViewEarnings;

  return (
    <Container>
      <header className={styles.header}>
        <h1 className={styles.title}>Products</h1>
        <p className={styles.sub}>
          Browse heritage-inspired handmade pieces from local makers.
        </p>
      </header>

      {/* Week 4: UI-only "search" (not functional yet). We'll wire it in Week 4/5 */}
      <div className={styles.toolbar}>
        <input
          className={styles.input}
          placeholder="Search products (Week 4 UI)..."
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
              <button className={styles.toolButton} type="button">
                View orders
              </button>
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
          <ProductCard key={p.id} product={p} canCreateOrder={canCreateOrder} />
        ))}
      </section>
    </Container>
  );
}
