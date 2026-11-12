export const ADMINISTRATION_PERMISSIONS = {
  airlineCreate: "manage.airlines.create",
  airlineDelete: "manage.airlines.delete",
  airlineEdit: "manage.airlines.edit",
  aircraftBuy: "manage.aircrafts.buy",
  aircraftEdit: "manage.aircrafts.edit",
  aircraftSell: "manage.aircrafts.sell",
  routeCreate: "manage.routes.create",
  routeDelete: "manage.routes.delete",
  routeEdit: "manage.routes.edit",
  userPermissionsEdit: "manage.users.permissions",
} as const;

export const ADMINISTRATION_ROUTES = {
  airlines: "/dashboard/administration/airlines",
  aircrafts: "/dashboard/administration/aircrafts",
  routes: "/dashboard/administration/routes",
  users: "/dashboard/administration/users",
  roles: "/dashboard/administration/roles",
} as const;

/**
 * A missing scope checks whether any scope grants the action. Passing a scope
 * requires that scope or `*`; callers use airline IDs for aircraft purchases
 * and record IDs for edits and deletions.
 */
export function hasPermission(
  permissions: readonly string[] | undefined,
  permission: string,
  scope?: string,
): boolean {
  const expectedParts = permission.split(".");
  if (expectedParts.length !== 3 || expectedParts.some((part) => part.length === 0)) {
    return false;
  }

  return (
    permissions?.some((granted) => {
      const grantedParts = granted.split(".");
      const grantedScope = grantedParts[3];
      if (
        grantedParts.length !== 4 ||
        grantedParts.slice(0, 3).some((part, index) => part !== expectedParts[index]) ||
        !grantedScope
      ) {
        return false;
      }

      return scope === undefined || grantedScope === "*" || grantedScope === scope;
    }) ?? false
  );
}

export function hasAnyPermission(
  permissions: readonly string[] | undefined,
  ...permissionNodes: string[]
): boolean {
  return permissionNodes.some((permission) => hasPermission(permissions, permission));
}
