// Week 4: role definitions only (Week 5 adds real auth + route protection)
export type Role = "admin" | "seller" | "buyer";

export const ALL_PERMISSIONS = [
  "manage_products",
  "manage_users",
  "view_orders",
  "approve_makers",
  "manage_categories",
  "view_reports",
  "manage_own_products",
  "view_own_orders",
  "edit_own_profile",
  "view_earnings",
  "browse_products",
  "create_order",
  "manage_own_profile",
  "leave_review",
  "save_favorites",
] as const;

export type Permission = (typeof ALL_PERMISSIONS)[number];

export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  admin: [
    "manage_products",
    "manage_users",
    "view_orders",
    "approve_makers",
    "manage_categories",
    "view_reports",
  ],
  seller: [
    "manage_own_products",
    "view_own_orders",
    "edit_own_profile",
    "view_earnings",
  ],
  buyer: [
    "browse_products",
    "create_order",
    "manage_own_profile",
    "leave_review",
    "save_favorites",
  ],
};
