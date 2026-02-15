import { Permission, ROLE_PERMISSIONS, Role } from "./roles";

export type User = {
  id: string;
  name: string;
  role: Role;

  /* SC: Optional field used for OAuth-based stable cart key */
  email?: string | null;
  /* SC: end */
};

export const hasPermission = (role: Role, permission: Permission) =>
  ROLE_PERMISSIONS[role].includes(permission);

export const userHasPermission = (user: User | null, permission: Permission) =>
  user ? hasPermission(user.role, permission) : false;

export const userHasAnyPermission = (user: User | null, permissions: Permission[]) =>
  user ? permissions.some((permission) => hasPermission(user.role, permission)) : false;
