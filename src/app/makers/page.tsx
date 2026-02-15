import Link from "next/link";
import Container from "@/components/layout/Container";
import getProducts from "@/models/getProducts";
import styles from "./makers.module.css";

export const metadata = {
  title: "Meet the Makers | Heritage Makers",
};

export default async function MakersPage() {
  /**
   * Builds a unique list of makers from current product records.
   * Each maker card links to a dedicated page that shows only that maker's products.
   */
  const products = await getProducts();
  const makers = Array.from(
    new Map(
      products.map((product) => [
        product.user_id,
        {
          id: product.user_id,
          name: `${product.firstname} ${product.lastname}`.trim(),
          productCount: 0,
        },
      ]),
    ).values(),
  );

  const makerCount = new Map<number, number>();
  products.forEach((product) => {
    makerCount.set(product.user_id, (makerCount.get(product.user_id) ?? 0) + 1);
  });

  const makersWithCounts = makers.map((maker) => ({
    ...maker,
    productCount: makerCount.get(maker.id) ?? 0,
  }));

  return (
    <Container>
      <header className={styles.header}>
        <h1 className={styles.title}>Meet the Makers</h1>
        <p className={styles.sub}>Open a maker profile to view only their products.</p>
      </header>

      <section className={styles.grid}>
        {makersWithCounts.map((maker) => (
          <article className={styles.card} key={maker.id}>
            <h2 className={styles.name}>{maker.name}</h2>
            <p className={styles.count}>
              {maker.productCount} {maker.productCount === 1 ? "product" : "products"}
            </p>
            <Link className={styles.link} href={`/makers/${maker.id}`}>
              View maker products
            </Link>
          </article>
        ))}
      </section>
    </Container>
  );
}
