// Week 5: shared role + permission definitions (single source of truth)
export type Role = "admin" | "seller" | "buyer";

export const ROLE_PERMISSIONS = {
  admin: ["manage_products", "manage_users", "view_orders"],
  seller: ["manage_own_products", "view_own_orders"],
  buyer: ["browse_products", "create_order"],
} as const;

export type Permission = (typeof ROLE_PERMISSIONS)[Role][number];

export function getRolePermissions(role: Role) {
  return ROLE_PERMISSIONS[role];
}

export function hasPermission(role: Role, permission: Permission) {
  return getRolePermissions(role).includes(permission);
}
