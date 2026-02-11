
/*  Creates a type for all possible permissions
    So that other files can import Permission type
    Without this ROLE_PERMISSIONS[role].includes(permission) code would not work correctly
    Since TS would not be able to identify the literal types of the strings in the arrays, returining as never[] */

/*  Error without this:
    Type error: Argument of type '"manage_products" | "manage_users" | "view_orders" | "approve_makers" | "manage_categories" | "view_reports" | "manage_own_products" | "view_own_orders" | "edit_own_profile" | ... 5 more ... | "save_favorites"' is not assignable to parameter of type 'never'.
    Type '"manage_products"' is not assignable to type 'never'. */
export type Permission = 
  | "manage_products" | "manage_users" | "view_orders" | "approve_makers" 
  | "manage_categories" | "view_reports" | "manage_own_products" 
  | "view_own_orders" | "edit_own_profile" | "view_earnings" 
  | "browse_products" | "create_order" | "manage_own_profile" 
  | "leave_review" | "save_favorites";

// Week 4: role definitions only (Week 5 adds real auth + route protection)
export type Role = "admin" | "seller" | "buyer";

// Maps roles to their permissions
// Use 'as const' to make the arrays readonly and their contents literal types
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
} as const;
