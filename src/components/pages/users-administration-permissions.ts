import { ADMINISTRATION_PERMISSIONS, hasPermission } from "@/lib/administration-permissions";
import type { AdministrationPermission } from "@/components/ui/permission-selector";

export type AdministrationUser = {
  id: string;
  name: string;
  email: string;
  role?: string[] | null;
  permissions?: string[];
};

export const airlineScopedPermissions = [
  ADMINISTRATION_PERMISSIONS.airlineEdit,
  ADMINISTRATION_PERMISSIONS.airlineDelete,
  ADMINISTRATION_PERMISSIONS.routeCreate,
  ADMINISTRATION_PERMISSIONS.routeEdit,
  ADMINISTRATION_PERMISSIONS.routeDelete,
] satisfies AdministrationPermission[];

export const globalAdministrationPermissions = [
  ADMINISTRATION_PERMISSIONS.airlineCreate,
  ADMINISTRATION_PERMISSIONS.userPermissionsEdit,
] satisfies AdministrationPermission[];

export function getAirlinePermissions(
  user: AdministrationUser,
  airlineId: string,
): AdministrationPermission[] {
  return airlineScopedPermissions.filter((permission) =>
    hasPermission(user.permissions, permission, airlineId),
  );
}

export function getGlobalAdministrationPermissions(
  user: AdministrationUser,
): AdministrationPermission[] {
  return globalAdministrationPermissions.filter((permission) =>
    permission === ADMINISTRATION_PERMISSIONS.airlineCreate
      ? user.permissions?.some((granted) => granted.startsWith(`${permission}.`))
      : user.permissions?.includes(`${permission}.*`),
  );
}

export function updateAirlinePermissions(
  existingPermissions: readonly string[] | undefined,
  selectedPermissions: readonly AdministrationPermission[],
  airlineId: string,
): string[] {
  const existing = existingPermissions ?? [];
  const permissionsForOtherScopes = existing.filter(
    (granted) =>
      !airlineScopedPermissions.some((permission) => granted === `${permission}.${airlineId}`),
  );
  const selectedGrants = selectedPermissions
    .filter((permission) => !existing.includes(`${permission}.*`))
    .map((permission) => `${permission}.${airlineId}`);

  return [...permissionsForOtherScopes, ...selectedGrants];
}

export function updateGlobalAdministrationPermissions(
  existingPermissions: readonly string[],
  selectedPermissions: readonly AdministrationPermission[],
): string[] {
  const preservedPermissions = existingPermissions.filter(
    (granted) =>
      !globalAdministrationPermissions.some((permission) => granted.startsWith(`${permission}.`)),
  );
  const selectedGrants = selectedPermissions
    .filter((permission) =>
      globalAdministrationPermissions.some((globalPermission) => globalPermission === permission),
    )
    .map((permission) => `${permission}.*`);

  return [...preservedPermissions, ...selectedGrants];
}
