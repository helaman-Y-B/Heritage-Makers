"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  /**
   * We store the minimum product snapshot needed to render a cart.
   * Cart state is client-only (localStorage) for this course project.
   */
  productId: number;
  name: string;
  price: number;
  imgPath: string;
  makerName: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
};

type CartApi = {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  increment: (productId: number) => void;
  decrement: (productId: number) => void;
  clear: () => void;
};

const STORAGE_KEY = "hm_cart_v1";

const CartContext = createContext<CartApi | null>(null);

function safeParseCart(raw: string | null): CartState {
  /**
   * Parses persisted cart state safely.
   * If localStorage contains unexpected data, we fall back to an empty cart.
   */
  if (!raw) return { items: [] };
  try {
    const parsed = JSON.parse(raw) as CartState;
    if (!parsed || !Array.isArray(parsed.items)) return { items: [] };
    return { items: parsed.items.filter(Boolean) };
  } catch {
    return { items: [] };
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  /**
   * Owns cart state and persists it to localStorage.
   * This stays entirely client-side until we add a real Orders backend.
   */
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Load cart on first client render.
    const state = safeParseCart(window.localStorage.getItem(STORAGE_KEY));
    setItems(state.items);
  }, []);

  useEffect(() => {
    // Persist cart on every change.
    const state: CartState = { items };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [items]);

  const api = useMemo<CartApi>(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    return {
      items,
      itemCount,
      total,
      addItem: (next) => {
        setItems((prev) => {
          const existing = prev.find((p) => p.productId === next.productId);
          if (existing) {
            return prev.map((p) =>
              p.productId === next.productId ? { ...p, quantity: p.quantity + 1 } : p,
            );
          }
          return [...prev, { ...next, quantity: 1 }];
        });
      },
      removeItem: (productId) => setItems((prev) => prev.filter((p) => p.productId !== productId)),
      setQuantity: (productId, quantity) =>
        setItems((prev) =>
          prev
            .map((p) => (p.productId === productId ? { ...p, quantity } : p))
            .filter((p) => p.quantity > 0),
        ),
      increment: (productId) =>
        setItems((prev) =>
          prev.map((p) => (p.productId === productId ? { ...p, quantity: p.quantity + 1 } : p)),
        ),
      decrement: (productId) =>
        setItems((prev) =>
          prev
            .map((p) =>
              p.productId === productId ? { ...p, quantity: Math.max(0, p.quantity - 1) } : p,
            )
            .filter((p) => p.quantity > 0),
        ),
      clear: () => setItems([]),
    };
  }, [items]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart(): CartApi {
  /**
   * Consumer hook for cart data/actions.
   */
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within <CartProvider>");
  }
  return ctx;
}
