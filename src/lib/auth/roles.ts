// Week 4: role definitions only (Week 5 adds real auth + route protection)
export type Role = "admin" | "seller" | "buyer";

export const ROLE_PERMISSIONS = {
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
} as const;
