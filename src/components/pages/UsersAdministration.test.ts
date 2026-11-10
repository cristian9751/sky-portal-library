import { describe, expect, it } from "vitest";
import {
  getAirlinePermissions,
  getGlobalAdministrationPermissions,
  updateAirlinePermissions,
  updateGlobalAdministrationPermissions,
  type AdministrationUser,
} from "./users-administration-permissions";
import { ADMINISTRATION_PERMISSIONS } from "@/lib/administration-permissions";

describe("airline-scoped user permissions", () => {
  it("only selects airline and route permissions granted to the chosen airline", () => {
    const user: AdministrationUser = {
      id: "pilot-1",
      name: "Alex",
      email: "alex@example.com",
      permissions: [
        `${ADMINISTRATION_PERMISSIONS.airlineEdit}.iberia`,
        `${ADMINISTRATION_PERMISSIONS.routeCreate}.air-europa`,
        `${ADMINISTRATION_PERMISSIONS.aircraftBuy}.iberia`,
        `${ADMINISTRATION_PERMISSIONS.userPermissionsEdit}.iberia`,
      ],
    };

    expect(getAirlinePermissions(user, "iberia")).toEqual([ADMINISTRATION_PERMISSIONS.airlineEdit]);
  });

  it("replaces grants for one airline and preserves grants for other scopes", () => {
    const permissions = updateAirlinePermissions(
      [
        `${ADMINISTRATION_PERMISSIONS.airlineEdit}.iberia`,
        `${ADMINISTRATION_PERMISSIONS.routeCreate}.air-europa`,
        `${ADMINISTRATION_PERMISSIONS.aircraftBuy}.iberia`,
        "profile.read",
      ],
      [ADMINISTRATION_PERMISSIONS.airlineDelete, ADMINISTRATION_PERMISSIONS.routeEdit],
      "iberia",
    );

    expect(permissions).toEqual([
      `${ADMINISTRATION_PERMISSIONS.routeCreate}.air-europa`,
      `${ADMINISTRATION_PERMISSIONS.aircraftBuy}.iberia`,
      "profile.read",
      `${ADMINISTRATION_PERMISSIONS.airlineDelete}.iberia`,
      `${ADMINISTRATION_PERMISSIONS.routeEdit}.iberia`,
    ]);
  });

  it("does not override global grants when updating one airline", () => {
    const permissions = updateAirlinePermissions(
      [`${ADMINISTRATION_PERMISSIONS.routeCreate}.*`],
      [],
      "iberia",
    );

    expect(permissions).toEqual([`${ADMINISTRATION_PERMISSIONS.routeCreate}.*`]);
  });

  it("selects the users permission only when it is granted globally", () => {
    const user: AdministrationUser = {
      id: "pilot-1",
      name: "Alex",
      email: "alex@example.com",
      permissions: [
        `${ADMINISTRATION_PERMISSIONS.userPermissionsEdit}.iberia`,
        `${ADMINISTRATION_PERMISSIONS.userPermissionsEdit}.*`,
      ],
    };

    expect(getGlobalAdministrationPermissions(user)).toEqual([
      ADMINISTRATION_PERMISSIONS.userPermissionsEdit,
    ]);
  });

  it("adds or removes the users permission globally, not for an airline scope", () => {
    expect(
      updateGlobalAdministrationPermissions(
        [`${ADMINISTRATION_PERMISSIONS.userPermissionsEdit}.iberia`, "profile.read"],
        [ADMINISTRATION_PERMISSIONS.userPermissionsEdit],
      ),
    ).toEqual(["profile.read", `${ADMINISTRATION_PERMISSIONS.userPermissionsEdit}.*`]);

    expect(
      updateGlobalAdministrationPermissions(
        [`${ADMINISTRATION_PERMISSIONS.userPermissionsEdit}.*`, "profile.read"],
        [],
      ),
    ).toEqual(["profile.read"]);
  });
});
