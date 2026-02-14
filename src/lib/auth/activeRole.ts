import { Role } from "./roles";

export function allowedRolesFor(maxRole: Role): Role[] {
  /**
   * Defines a simple role hierarchy for "act as" behavior.
   * Admin can act as any role, seller can act as seller/buyer, buyer can only act as buyer.
   */
  if (maxRole === "admin") return ["buyer", "seller", "admin"];
  if (maxRole === "seller") return ["buyer", "seller"];
  return ["buyer"];
}

export function isRoleAllowed(maxRole: Role, requested: Role): boolean {
  /**
   * Checks whether a user with `maxRole` is allowed to act as `requested`.
   */
  return allowedRolesFor(maxRole).includes(requested);
}

