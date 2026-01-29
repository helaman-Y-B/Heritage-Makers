// Week 4: role definitions only (Week 5 adds real auth + route protection)
export type Role = "admin" | "seller" | "buyer";

export const ROLE_PERMISSIONS = {
  admin: ["manage_products", "manage_users", "view_orders"],
  seller: ["manage_own_products", "view_own_orders"],
  buyer: ["browse_products", "create_order"],
} as const;
