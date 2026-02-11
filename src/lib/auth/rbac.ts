import { ROLE_PERMISSIONS, Role, Permission } from "./roles";

// Represents a user in the system
// This information will come from the database or authentication service
export type User = {
  id: string;
  name: string;
  role: Role;
};

// Checks if a given role has a specific permission
export const hasPermission = (role: Role, permission: Permission) => {
  // Tells TypeScript that the array contains Permission types
  const permissions = ROLE_PERMISSIONS[role] as Permission[];
  return permissions.includes(permission);
}

// Checks if a user has a specific permission
export const userHasPermission = (user: User | null, permission: Permission) =>
  user ? hasPermission(user.role, permission) : false;

// Checks if a user has any of the specified permissions
export const userHasAnyPermission = (user: User | null, permissions: Permission[]) =>
  user ? permissions.some((permission) => hasPermission(user.role, permission)) : false;
