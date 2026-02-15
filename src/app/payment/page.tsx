"use client";

import Container from "@/components/layout/Container";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import styles from "./payment.module.css";
import { useMemo, useState } from "react";

type PaymentForm = {
  nameOnCard: string;
  cardNumber: string;
  expiry: string; // MM/YY
  cvc: string;
  zip: string;
};

type FieldErrors = Partial<Record<keyof PaymentForm, string>> & { form?: string };

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function luhnValid(cardNumberDigits: string): boolean {
  /**
   * Validates card numbers using the Luhn checksum.
   * This is only client-side validation for a fake payment form.
   */
  let sum = 0;
  let shouldDouble = false;
  for (let i = cardNumberDigits.length - 1; i >= 0; i -= 1) {
    let digit = Number(cardNumberDigits[i]);
    if (Number.isNaN(digit)) return false;
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

function validatePayment(form: PaymentForm): FieldErrors {
  /**
   * Performs basic, realistic payment input validation.
   * This does not charge money, but ensures the order is "correct" format-wise.
   */
  const errors: FieldErrors = {};

  if (!form.nameOnCard.trim()) errors.nameOnCard = "Name on card is required.";

  const digits = onlyDigits(form.cardNumber);
  if (digits.length < 13 || digits.length > 19) {
    errors.cardNumber = "Card number must be 13 to 19 digits.";
  } else if (!luhnValid(digits)) {
    errors.cardNumber = "Card number is not valid.";
  }

  const exp = form.expiry.trim();
  const match = exp.match(/^(\d{2})\/(\d{2})$/);
  if (!match) {
    errors.expiry = "Expiry must be in MM/YY format.";
  } else {
    const mm = Number(match[1]);
    const yy = Number(match[2]);
    if (mm < 1 || mm > 12) {
      errors.expiry = "Expiry month must be between 01 and 12.";
    } else {
      // Compare against current month/year.
      const now = new Date();
      const curYY = now.getFullYear() % 100;
      const curMM = now.getMonth() + 1;
      const expired = yy < curYY || (yy === curYY && mm < curMM);
      if (expired) errors.expiry = "Card is expired.";
    }
  }

  const cvcDigits = onlyDigits(form.cvc);
  if (cvcDigits.length < 3 || cvcDigits.length > 4) {
    errors.cvc = "CVC must be 3 or 4 digits.";
  }

  const zipDigits = onlyDigits(form.zip);
  if (zipDigits.length !== 5) {
    errors.zip = "ZIP must be 5 digits.";
  }

  return errors;
}

export default function PaymentPage() {
  /**
   * Payment page: accepts input (fake) and only completes the order after validation.
   * On success we clear the cart and show an order confirmation.
   */
  const { items, total, clear } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [form, setForm] = useState<PaymentForm>({
    nameOnCard: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
    zip: "",
  });

  const orderId = useMemo(() => `HM-${Date.now()}`, []);

  function updateField<K extends keyof PaymentForm>(key: K, value: string) {
    /**
     * Updates a single payment field and clears its error.
     */
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined, form: undefined }));
  }

  function handleSubmit(e: React.FormEvent) {
    /**
     * Validates payment fields, then "places" the order by clearing the cart.
     */
    e.preventDefault();

    if (items.length === 0) {
      setErrors({ form: "Your cart is empty. Add items before paying." });
      return;
    }

    const nextErrors = validatePayment(form);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    // Payment accepted (fake). We clear cart to finalize order.
    clear();
    setSubmitted(true);
  }

  return (
    <Container>
      <header className={styles.header}>
        <h1 className={styles.title}>Payment</h1>
        <p className={styles.sub}>Enter payment details to place your order.</p>
      </header>

      {submitted ? (
        <section className={styles.panel}>
          <h2 className={styles.h2}>Payment accepted</h2>
          <p className={styles.muted}>
            Order <strong>{orderId}</strong> is confirmed.
          </p>
          <Link className={styles.link} href="/products">
            Back to products
          </Link>
        </section>
      ) : (
        <section className={styles.grid}>
          <section className={styles.panel}>
            <h2 className={styles.h2}>Order summary</h2>
            {items.length === 0 ? (
              <p className={styles.muted}>Your cart is empty.</p>
            ) : (
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
            )}

            <div className={styles.totalRow}>
              <span>Total</span>
              <strong>${total.toFixed(2)}</strong>
            </div>

            <div className={styles.actions}>
              <Link className={styles.secondary} href="/checkout">
                Back to checkout
              </Link>
            </div>
          </section>

          <section className={styles.panel}>
            <h2 className={styles.h2}>Card details</h2>
            {errors.form ? <p className={styles.error}>{errors.form}</p> : null}
            <form className={styles.form} onSubmit={handleSubmit}>
              <label className={styles.label}>
                Name on card
                <input
                  className={styles.input}
                  value={form.nameOnCard}
                  onChange={(e) => updateField("nameOnCard", e.target.value)}
                  autoComplete="cc-name"
                  required
                />
                {errors.nameOnCard ? <p className={styles.error}>{errors.nameOnCard}</p> : null}
              </label>

              <label className={styles.label}>
                Card number
                <input
                  className={styles.input}
                  value={form.cardNumber}
                  onChange={(e) => updateField("cardNumber", e.target.value)}
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="1234 5678 9012 3456"
                  required
                />
                {errors.cardNumber ? <p className={styles.error}>{errors.cardNumber}</p> : null}
              </label>

              <div className={styles.row}>
                <label className={styles.label}>
                  Expiry (MM/YY)
                  <input
                    className={styles.input}
                    value={form.expiry}
                    onChange={(e) => updateField("expiry", e.target.value)}
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="02/28"
                    required
                  />
                  {errors.expiry ? <p className={styles.error}>{errors.expiry}</p> : null}
                </label>
                <label className={styles.label}>
                  CVC
                  <input
                    className={styles.input}
                    value={form.cvc}
                    onChange={(e) => updateField("cvc", e.target.value)}
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="123"
                    required
                  />
                  {errors.cvc ? <p className={styles.error}>{errors.cvc}</p> : null}
                </label>
                <label className={styles.label}>
                  ZIP
                  <input
                    className={styles.input}
                    value={form.zip}
                    onChange={(e) => updateField("zip", e.target.value)}
                    inputMode="numeric"
                    autoComplete="postal-code"
                    placeholder="83702"
                    required
                  />
                  {errors.zip ? <p className={styles.error}>{errors.zip}</p> : null}
                </label>
              </div>

              <button className={styles.primary} type="submit" disabled={items.length === 0}>
                Pay ${total.toFixed(2)}
              </button>
            </form>
          </section>
        </section>
      )}
    </Container>
  );
}

