"use client";

import Link from "next/link";
import Container from "@/components/layout/Container";
import { useCart } from "@/components/cart/CartProvider";
import styles from "./cart.module.css";

export default function CartPage() {
  /**
   * Cart screen: buyers can review items, adjust quantity, and remove items.
   * Cart is stored in localStorage and is not tied to the database yet.
   */
  const { items, itemCount, total, removeItem, increment, decrement, clear } = useCart();

  return (
    <Container>
      <header className={styles.header}>
        <h1 className={styles.title}>Cart</h1>
        <p className={styles.sub}>Items: {itemCount}</p>
      </header>

      {items.length === 0 ? (
        <section className={styles.empty}>
          <p>Your cart is empty.</p>
          <Link className={styles.link} href="/products">
            Browse products
          </Link>
        </section>
      ) : (
        <section className={styles.grid}>
          {items.map((item) => (
            <article className={styles.row} key={item.productId}>
              <div className={styles.meta}>
                <p className={styles.name}>{item.name}</p>
                <p className={styles.muted}>By {item.makerName}</p>
                <p className={styles.muted}>${item.price.toFixed(2)}</p>
              </div>

              <div className={styles.controls}>
                <div className={styles.qtyStepper} aria-label={`Quantity for ${item.name}`}>
                  <button
                    className={styles.stepBtn}
                    type="button"
                    onClick={() => decrement(item.productId)}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className={styles.qtyValue} aria-label="Quantity value">
                    {item.quantity}
                  </span>
                  <button
                    className={styles.stepBtn}
                    type="button"
                    onClick={() => increment(item.productId)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <button className={styles.remove} type="button" onClick={() => removeItem(item.productId)}>
                  Remove
                </button>
              </div>
            </article>
          ))}

          <footer className={styles.footer}>
            <div className={styles.totalRow}>
              <span>Total</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
            <div className={styles.footerButtons}>
              <button className={styles.secondary} type="button" onClick={clear}>
                Clear cart
              </button>
              <Link className={styles.primary} href="/checkout">
                Checkout
              </Link>
            </div>
          </footer>
        </section>
      )}
    </Container>
  );
}
