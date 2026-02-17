// src/lib/cart.ts
// src/lib/cart.ts
export type CartItem = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  qty: number;
};

/* SC: Added per-user cart key support to avoid sharing carts across accounts */
const CART_KEY_PREFIX = "cart:";

function getCartKey(userKey?: string) {
  const key = userKey ? String(userKey) : "guest";
  return `${CART_KEY_PREFIX}${key}`;
}
/* SC: End per-user cart key support */

function safeParse<T>(value: string | null, fallback: T): T {
  try {
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function getCart(userKey?: string): CartItem[] {
  if (typeof window === "undefined") return [];
  return safeParse<CartItem[]>(localStorage.getItem(getCartKey(userKey)), []);
}

export function saveCart(cart: CartItem[], userKey?: string) {
  localStorage.setItem(getCartKey(userKey), JSON.stringify(cart));
}

export function addToCart(
  item: Omit<CartItem, "qty">,
  qtyToAdd = 1,
  userKey?: string
): CartItem[] {
  const cart = getCart(userKey);
  const existing = cart.find((p) => p.id === item.id);

  if (existing) {
    existing.qty += qtyToAdd;
  } else {
    cart.push({ ...item, qty: qtyToAdd });
  }

  saveCart(cart, userKey);
  return cart;
}

export function removeFromCart(id: string, userKey?: string): CartItem[] {
  const cart = getCart(userKey).filter((p) => p.id !== id);
  saveCart(cart, userKey);
  return cart;
}

export function updateQty(id: string, qty: number, userKey?: string): CartItem[] {
  const cart = getCart(userKey).map((p) =>
    p.id === id ? { ...p, qty: Math.max(1, qty) } : p
  );
  saveCart(cart, userKey);
  return cart;
}

export function clearCart(userKey?: string) {
  saveCart([], userKey);
}

/* SC: If items were added as guest before login, migrate them to the logged-in user's cart */
export function migrateGuestCartToUser(userKey: string) {
  if (typeof window === "undefined") return;

  const guestStorageKey = getCartKey(undefined); // cart:guest
  const userStorageKey = getCartKey(userKey);

  const guestCart = safeParse<CartItem[]>(localStorage.getItem(guestStorageKey), []);
  if (guestCart.length === 0) return;

  const userCart = safeParse<CartItem[]>(localStorage.getItem(userStorageKey), []);

  // Merge by product id
  const merged: CartItem[] = [...userCart];
  for (const g of guestCart) {
    const existing = merged.find((x) => x.id === g.id);
    if (existing) existing.qty += g.qty;
    else merged.push(g);
  }

  localStorage.setItem(userStorageKey, JSON.stringify(merged));
  localStorage.removeItem(guestStorageKey);
}
/* SC: End guest->user cart migration */
