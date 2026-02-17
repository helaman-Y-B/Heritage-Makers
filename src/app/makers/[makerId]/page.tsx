import Link from "next/link";
import Container from "@/components/layout/Container";
import ProductCard from "@/components/products/ProductCard";
import { getCurrentUser } from "@/lib/auth/currentUser";
import { userHasPermission } from "@/lib/auth/rbac";
import getProducts from "@/models/getProducts";
import { Product } from "@/types/product";
import styles from "./maker-products.module.css";

type Props = {
  params: Promise<{ makerId: string }>;
};

export default async function MakerProductsPage({ params }: Props) {
  /**
   * Loads products for a single maker profile route.
   * This keeps maker pages isolated so users only see listings for the selected maker.
   */
  const { makerId } = await params;
  const parsedMakerId = Number.parseInt(makerId, 10);

  if (!Number.isFinite(parsedMakerId)) {
    return (
      <Container>
        <section className={styles.empty}>
          <h1 className={styles.title}>Maker not found</h1>
          <p className={styles.sub}>The maker id in this link is not valid.</p>
          <Link className={styles.link} href="/makers">
            Back to makers
          </Link>
        </section>
      </Container>
    );
  }

  const currentUser = await getCurrentUser();
  const canCreateOrder = userHasPermission(currentUser, "create_order");
  const canManageAnyProducts = userHasPermission(currentUser, "manage_products");
  const canManageOwnProducts = userHasPermission(currentUser, "manage_own_products");

  const products: Product[] = (await getProducts({ ownerUserId: parsedMakerId })).map((product) => ({
    ...product,
    isSustainable: Boolean(product.isSustainable),
  }));

  const makerName =
    products.length > 0
      ? `${products[0].firstname} ${products[0].lastname}`.trim()
      : `Maker #${parsedMakerId}`;

  return (
    <Container>
      <header className={styles.header}>
        <Link className={styles.link} href="/makers">
          Back to makers
        </Link>
        <h1 className={styles.title}>{makerName}</h1>
        <p className={styles.sub}>Only products from this maker are shown on this page.</p>
      </header>

      {products.length === 0 ? (
        <section className={styles.empty}>
          <p className={styles.sub}>No products found for this maker yet.</p>
        </section>
      ) : (
        <section className={styles.grid}>
          {products.map((product) => (
            <ProductCard
              key={`${product.id}-${product.user_id}`}
              product={product}
              canCreateOrder={canCreateOrder}
              canManageAny={canManageAnyProducts}
              canManageOwn={canManageOwnProducts}
              currentUserId={currentUser ? Number(currentUser.id) : undefined}
            />
          ))}
        </section>
      )}
    </Container>
  );
}
