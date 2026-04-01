import type { User } from "@auth0/nextjs-auth0/types";

const NAMESPACE = "https://nextjs-auth0-sample.com";

export function getRoles(user: User): string[] {
  return (user[`${NAMESPACE}/roles`] as string[]) ?? [];
}

export function getPermissions(user: User): string[] {
  return (user[`${NAMESPACE}/permissions`] as string[]) ?? [];
}

export function hasRole(user: User, role: string): boolean {
  return getRoles(user).includes(role);
}

export function hasPermission(user: User, permission: string): boolean {
  return getPermissions(user).includes(permission);
}
