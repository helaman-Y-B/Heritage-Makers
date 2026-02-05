import { ROLE_PERMISSIONS, Role } from "./roles";

export type Permission = (typeof ROLE_PERMISSIONS)[Role][number];

export type User = {
  id: string;
  name: string;
  role: Role;
};

export const hasPermission = (role: Role, permission: Permission) =>
  ROLE_PERMISSIONS[role].includes(permission);

export const userHasPermission = (user: User | null, permission: Permission) =>
  user ? hasPermission(user.role, permission) : false;

export const userHasAnyPermission = (user: User | null, permissions: Permission[]) =>
  user ? permissions.some((permission) => hasPermission(user.role, permission)) : false;
