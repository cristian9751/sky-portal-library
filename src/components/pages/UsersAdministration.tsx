import { useRef, useState } from "react";
import { useApplicationContext } from "@/lib/ApplicationContext";
import { useI18n } from "@/lib/i18n";
import { ADMINISTRATION_PERMISSIONS, hasPermission } from "@/lib/administration-permissions";
import { PermissionSelector } from "@/components/ui/permission-selector";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MultiAirlinePermissionSelector } from "@/components/ui/multi-airline-permission-selector";
import type { AdministrationPermission } from "@/components/ui/permission-selector";
import { Button } from "@/components/ui/button";
import { RoleSelector, type AssignableRole } from "@/components/ui/role-selector";
import {
  airlineScopedPermissions,
  globalAdministrationPermissions,
  getAirlinePermissions,
  getGlobalAdministrationPermissions,
  updateAirlinePermissions,
  updateGlobalAdministrationPermissions,
  type AdministrationUser,
} from "./users-administration-permissions";
import { AdministrationTable } from "@/components/ui/table";
import type { Airline } from "./AirlinesAdministration";

export type { AdministrationUser } from "./users-administration-permissions";

export type UsersAdministrationProps = {
  users: AdministrationUser[];
  airlines: Airline[];
  roles?: readonly AssignableRole[];
  /** Returns the user's complete permission list, including grants for other scopes. */
  getUserPermissions?: (userId: string) => string[] | Promise<string[]>;
  onUpdateUserPermissions?: (userId: string, permissions: string[]) => void | Promise<void>;
  onAssignUserRole?: (userId: string, roleId: string) => void | Promise<void>;
};

export function DashboardUsersAdministration({
  users,
  airlines,
  roles = [],
  getUserPermissions,
  onUpdateUserPermissions,
  onAssignUserRole,
}: UsersAdministrationProps) {
  const { t } = useI18n();
  const { user: currentUser } = useApplicationContext();
  const [selectedUser, setSelectedUser] = useState<AdministrationUser>();
  const [selectedRoleUser, setSelectedRoleUser] = useState<AdministrationUser>();
  const [selectedAirlineIds, setSelectedAirlineIds] = useState<string[]>([]);
  const [airlinePermissionSelections, setAirlinePermissionSelections] = useState<
    Record<string, AdministrationPermission[]>
  >({});
  const [selectedGlobalPermissions, setSelectedGlobalPermissions] = useState<
    AdministrationPermission[]
  >([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [permissionsLoadError, setPermissionsLoadError] = useState("");
  const permissionRequestId = useRef(0);

  const canManageUsers = hasPermission(
    currentUser?.permissions,
    ADMINISTRATION_PERMISSIONS.userPermissionsEdit,
    "*",
  );
  const manageableAirlines = airlines.filter((airline) =>
    hasPermission(
      currentUser?.permissions,
      ADMINISTRATION_PERMISSIONS.userPermissionsEdit,
      airline.id,
    ),
  );

  const loadUserPermissions = async (target: AdministrationUser) => {
    if (!getUserPermissions) {
      return;
    }

    const requestId = ++permissionRequestId.current;
    setIsLoadingPermissions(true);
    setPermissionsLoadError("");
    setSaveError("");

    try {
      const permissions = await getUserPermissions(target.id);
      if (requestId !== permissionRequestId.current) {
        return;
      }

      const userWithPermissions = { ...target, permissions };
      setSelectedUser((currentUser) =>
        currentUser?.id === target.id ? userWithPermissions : currentUser,
      );
      setAirlinePermissionSelections(
        Object.fromEntries(
          manageableAirlines.map(({ id: airlineId }) => [
            airlineId,
            getAirlinePermissions(userWithPermissions, airlineId),
          ]),
        ),
      );
      setSelectedGlobalPermissions(getGlobalAdministrationPermissions(userWithPermissions));
    } catch (error) {
      if (requestId === permissionRequestId.current) {
        setPermissionsLoadError(error instanceof Error ? error.message : String(error));
      }
    } finally {
      if (requestId === permissionRequestId.current) {
        setIsLoadingPermissions(false);
      }
    }
  };

  const openPermissionEditor = (target: AdministrationUser) => {
    setSelectedUser(target);
    const initialAirlineIds = manageableAirlines[0] ? [manageableAirlines[0].id] : [];
    setSelectedAirlineIds(initialAirlineIds);
    setAirlinePermissionSelections(
      Object.fromEntries(
        manageableAirlines.map(({ id: airlineId }) => [
          airlineId,
          getAirlinePermissions(target, airlineId),
        ]),
      ),
    );
    setSelectedGlobalPermissions(getGlobalAdministrationPermissions(target));
    setSaveError("");
    setPermissionsLoadError("");
    void loadUserPermissions(target);
  };

  const handleSavePermissions = async () => {
    if (
      !selectedUser ||
      !onUpdateUserPermissions ||
      isLoadingPermissions ||
      permissionsLoadError ||
      !canManageUsers ||
      selectedAirlineIds.some(
        (airlineId) =>
          !hasPermission(
            currentUser?.permissions,
            ADMINISTRATION_PERMISSIONS.userPermissionsEdit,
            airlineId,
          ),
      )
    ) {
      return;
    }

    setSaveError("");
    setIsSaving(true);
    try {
      const airlinePermissions = selectedAirlineIds.reduce(
        (permissions, airlineId) =>
          updateAirlinePermissions(
            permissions,
            airlinePermissionSelections[airlineId] ?? [],
            airlineId,
          ),
        selectedUser.permissions ?? [],
      );
      await onUpdateUserPermissions(
        selectedUser.id,
        updateGlobalAdministrationPermissions(airlinePermissions, selectedGlobalPermissions),
      );
      setSelectedUser(undefined);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsSaving(false);
    }
  };

  if (!canManageUsers) {
    return (
      <div className="alert alert-danger" role="alert">
        {t.dashboard.admin.noPermission}
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h4 className="card-title mb-0">{t.dashboard.admin.usersTitle}</h4>
        </div>
        <div className="card-body">
          {users.length === 0 ? (
            <p className="mb-0">{t.dashboard.admin.noUsers}</p>
          ) : (
            <AdministrationTable
              headers={[
                t.dashboard.admin.name,
                t.dashboard.admin.email,
                t.dashboard.admin.role,
                t.dashboard.admin.actions,
              ]}
              rows={users.map((target) => {
                const canEditPermissions =
                  Boolean(onUpdateUserPermissions || getUserPermissions) && canManageUsers;

                return {
                  id: target.id,
                  cells: [
                    target.name,
                    target.email,
                    target.role?.length ? target.role.join(", ") : "—",
                  ],
                  actions: (
                    <div className="d-flex gap-2">
                      {canEditPermissions && (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => openPermissionEditor(target)}
                        >
                          {t.dashboard.admin.editPermissions}
                        </button>
                      )}
                      {onAssignUserRole && (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setSelectedRoleUser(target)}
                        >
                          {t.dashboard.admin.editRoles}
                        </button>
                      )}
                      {!canEditPermissions && !onAssignUserRole && <span>—</span>}
                    </div>
                  ),
                };
              })}
            />
          )}
        </div>
      </div>
      <Dialog
        open={selectedUser !== undefined}
        onOpenChange={(open) => {
          if (!open && !isSaving) {
            permissionRequestId.current += 1;
            setSelectedUser(undefined);
            setIsLoadingPermissions(false);
            setSelectedAirlineIds([]);
            setAirlinePermissionSelections({});
            setSelectedGlobalPermissions([]);
            setSaveError("");
            setPermissionsLoadError("");
          }
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {t.dashboard.admin.editPermissions}: {selectedUser?.name}
            </DialogTitle>
            <DialogDescription>{selectedUser?.email}</DialogDescription>
          </DialogHeader>
          {saveError && (
            <div className="alert alert-danger mb-0" role="alert">
              {saveError}
            </div>
          )}
          {permissionsLoadError && (
            <div className="alert alert-danger mb-0" role="alert">
              {permissionsLoadError}
            </div>
          )}
          {manageableAirlines.length === 0 && (
            <div className="alert alert-warning mb-0" role="status">
              {t.dashboard.admin.noManageableAirlines}
            </div>
          )}
          {selectedUser && (
            <div className="space-y-4">
              <MultiAirlinePermissionSelector
                airlines={manageableAirlines}
                selectedAirlineIds={selectedAirlineIds}
                onSelectedAirlineIdsChange={(airlineIds) => {
                  setSelectedAirlineIds(airlineIds);
                  if (selectedUser) {
                    setAirlinePermissionSelections((current) => ({
                      ...current,
                      ...Object.fromEntries(
                        airlineIds.map((airlineId) => [
                          airlineId,
                          current[airlineId] ?? getAirlinePermissions(selectedUser, airlineId),
                        ]),
                      ),
                    }));
                  }
                }}
                permissionsByAirline={airlinePermissionSelections}
                onPermissionsChange={(airlineId, permissions) =>
                  setAirlinePermissionSelections((current) => ({
                    ...current,
                    [airlineId]: permissions,
                  }))
                }
                availablePermissions={airlineScopedPermissions}
                airlineLabel={t.dashboard.admin.airline}
                selectAirlineLabel={t.dashboard.admin.selectAirline}
                permissionTitle={t.dashboard.admin.userPermissionsTitle}
                permissionDescription={t.dashboard.admin.userPermissionsDescription}
                idPrefix={`user-${selectedUser.id}`}
                disabled={
                  isSaving ||
                  isLoadingPermissions ||
                  !onUpdateUserPermissions ||
                  Boolean(permissionsLoadError)
                }
              />
              <PermissionSelector
                idPrefix={`user-${selectedUser.id}-global-permission`}
                availablePermissions={globalAdministrationPermissions}
                globalPermissions={globalAdministrationPermissions}
                globalPermissionsLabel={t.dashboard.admin.globalPermissions}
                permissionLabels={{
                  [ADMINISTRATION_PERMISSIONS.airlineCreate]: t.dashboard.admin.createAirline,
                }}
                selectedPermissions={selectedGlobalPermissions}
                onSelectionChange={setSelectedGlobalPermissions}
                title={t.dashboard.admin.userPermissionsTitle}
                description={t.dashboard.admin.userPermissionsDescription}
                disabled={
                  isSaving ||
                  isLoadingPermissions ||
                  !onUpdateUserPermissions ||
                  Boolean(permissionsLoadError)
                }
                allowEmptySelection
                showAssignButton={false}
              />
              <div className="flex justify-end">
                <Button
                  type="button"
                  disabled={
                    isSaving ||
                    isLoadingPermissions ||
                    !onUpdateUserPermissions ||
                    Boolean(permissionsLoadError)
                  }
                  onClick={() => void handleSavePermissions()}
                >
                  {isSaving ? t.dashboard.admin.saving : t.dashboard.admin.save}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={selectedRoleUser !== undefined}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedRoleUser(undefined);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t.dashboard.admin.editRoles}: {selectedRoleUser?.name}
            </DialogTitle>
            <DialogDescription>{selectedRoleUser?.email}</DialogDescription>
          </DialogHeader>
          {selectedRoleUser && onAssignUserRole && (
            <RoleSelector
              roles={roles}
              onAssign={(roleId) => onAssignUserRole(selectedRoleUser.id, roleId)}
              onAssigned={() => setSelectedRoleUser(undefined)}
              selectRoleLabel={t.dashboard.admin.selectRole}
              assignLabel={t.dashboard.admin.assignRole}
              assigningLabel={t.dashboard.admin.saving}
              assignmentErrorLabel={t.dashboard.admin.roleAssignmentFailed}
              noAvailableRolesLabel={t.dashboard.admin.noAvailableRoles}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
