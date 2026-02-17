"use client";

import Link from "next/link";
import Container from "@/components/layout/Container";
import { useCart } from "@/components/cart/CartProvider";
import styles from "./checkout.module.css";

export default function CheckoutPage() {
  /**
   * Checkout review screen.
   * This page confirms the order summary and then routes the buyer to /payment
   * for entering payment details (fake but validated).
   */
  const { items, total } = useCart();

  return (
    <Container>
      <header className={styles.header}>
        <h1 className={styles.title}>Checkout</h1>
        <p className={styles.sub}>Review your items, then continue to payment.</p>
      </header>

      {items.length === 0 ? (
        <section className={styles.panel}>
          <p className={styles.muted}>Your cart is empty.</p>
          <Link className={styles.link} href="/products">
            Browse products
          </Link>
        </section>
      ) : (
        <section className={styles.panel}>
          <ul className={styles.list}>
            {items.map((item) => (
              <li className={styles.item} key={item.productId}>
                <span>
                  {item.name} <span className={styles.muted}>x{item.quantity}</span>
                </span>
                <strong>${(item.price * item.quantity).toFixed(2)}</strong>
              </li>
            ))}
          </ul>

          <div className={styles.totalRow}>
            <span>Total</span>
            <strong>${total.toFixed(2)}</strong>
          </div>

          <div className={styles.actions}>
            <Link className={styles.secondary} href="/cart">
              Back to cart
            </Link>
            <Link className={styles.primary} href="/payment">
              Continue to payment
            </Link>
          </div>
        </section>
      )}
    </Container>
  );
}

