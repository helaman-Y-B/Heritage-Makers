// src/app/orders/OrdersClient.tsx
// src/app/orders/OrdersClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getCart,
  removeFromCart,
  updateQty,
  clearCart,
  migrateGuestCartToUser, // SC: import guest->user cart migration
  type CartItem,
} from "@/lib/cart";

/* SC: Client Orders page reads cart per userKey to avoid sharing across accounts */
type Props = { userKey?: string };

export default function OrdersClient({ userKey }: Props) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    /* SC: If user just logged in, migrate guest cart so items don't "disappear" */
    if (userKey) migrateGuestCartToUser(userKey);
    /* SC: End migration */
    setCart(getCart(userKey));
  }, [userKey]);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart]
  );

  return (
    <main style={{ padding: 24 }}>
      <h1>Your Order</h1>

      {cart.length === 0 ? (
        <p>Your order is empty.</p>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {cart.map((item) => (
              <li
                key={item.id}
                /* SC: Added basic layout and product image rendering in Orders list */
                style={{
                  marginBottom: 16,
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  borderBottom: "1px solid #ddd",
                  paddingBottom: 12,
                }}
              >
                <div style={{ width: 90, height: 70, position: "relative", flex: "0 0 auto" }}>
                  {/* Using img to avoid Next/Image domain config issues (SC) */}
                  <img
                    src={item.imageUrl || "/productsImg/placeHolder.png"}
                    alt={item.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/productsImg/placeHolder.png";
                    }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <strong>{item.name}</strong>
                  <div>Price: ${item.price}</div>

                  <div style={{ display: "flex", gap: 8, marginTop: 6, alignItems: "center" }}>
                    <button onClick={() => setCart(updateQty(item.id, item.qty - 1, userKey))}>-</button>
                    <span>Qty: {item.qty}</span>
                    <button onClick={() => setCart(updateQty(item.id, item.qty + 1, userKey))}>+</button>
                    <button onClick={() => setCart(removeFromCart(item.id, userKey))}>Remove</button>
                  </div>
                </div>
                {/* SC: End Orders list layout/image */}
              </li>
            ))}
          </ul>

          <h3>Total: ${total.toFixed(2)}</h3>

          <button
            onClick={() => {
              clearCart(userKey);
              setCart([]);
            }}
          >
            Clear order
          </button>
        </>
      )}
    </main>
  );
}
/* SC: End per-user Orders client */
