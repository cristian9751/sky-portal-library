import { useRef, useState } from "react";
import { useApplicationContext } from "@/lib/ApplicationContext";
import { useI18n } from "@/lib/i18n";
import { ADMINISTRATION_PERMISSIONS, hasPermission } from "@/lib/administration-permissions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  PermissionSelector,
  type AdministrationPermission,
} from "@/components/ui/permission-selector";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Airline } from "./AirlinesAdministration";

export type { AdministrationUser } from "./users-administration-permissions";

export type UsersAdministrationProps = {
  users: AdministrationUser[];
  airlines: Airline[];
  /** Returns the user's complete permission list, including grants for other scopes. */
  getUserPermissions?: (userId: string) => string[] | Promise<string[]>;
  onUpdateUserPermissions?: (userId: string, permissions: string[]) => void | Promise<void>;
};

export function DashboardUsersAdministration({
  users,
  airlines,
  getUserPermissions,
  onUpdateUserPermissions,
}: UsersAdministrationProps) {
  const { t } = useI18n();
  const { user: currentUser } = useApplicationContext();
  const [selectedUser, setSelectedUser] = useState<AdministrationUser>();
  const [selectedAirlineId, setSelectedAirlineId] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<AdministrationPermission[]>([]);
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

  const loadUserPermissions = async (target: AdministrationUser, airlineId: string) => {
    if (!getUserPermissions) {
      return;
    }

    const requestId = ++permissionRequestId.current;
    setSelectedPermissions([]);
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
      setSelectedPermissions([
        ...getAirlinePermissions(userWithPermissions, airlineId),
        ...getGlobalAdministrationPermissions(userWithPermissions),
      ]);
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
    const firstAirlineId = manageableAirlines[0]?.id ?? "";
    setSelectedAirlineId(firstAirlineId);
    setSelectedPermissions([
      ...(firstAirlineId ? getAirlinePermissions(target, firstAirlineId) : []),
      ...getGlobalAdministrationPermissions(target),
    ]);
    setSaveError("");
    setPermissionsLoadError("");
    void loadUserPermissions(target, firstAirlineId);
  };

  const handleSavePermissions = async (permissions: AdministrationPermission[]) => {
    if (
      !selectedUser ||
      !onUpdateUserPermissions ||
      isLoadingPermissions ||
      permissionsLoadError ||
      !canManageUsers ||
      (selectedAirlineId !== "" &&
        !hasPermission(
          currentUser?.permissions,
          ADMINISTRATION_PERMISSIONS.userPermissionsEdit,
          selectedAirlineId,
        ))
    ) {
      return;
    }

    setSaveError("");
    setIsSaving(true);
    try {
      const selectedAirlinePermissions = permissions.filter((permission) =>
        airlineScopedPermissions.some((scopedPermission) => scopedPermission === permission),
      );
      const selectedGlobalPermissions = permissions.filter((permission) =>
        globalAdministrationPermissions.some((globalPermission) => globalPermission === permission),
      );
      const airlinePermissions = selectedAirlineId
        ? updateAirlinePermissions(
            selectedUser.permissions,
            selectedAirlinePermissions,
            selectedAirlineId,
          )
        : (selectedUser.permissions ?? []);
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
              headers={[t.dashboard.admin.name, t.dashboard.admin.email, t.dashboard.admin.actions]}
              rows={users.map((target) => {
                const canEditPermissions =
                  Boolean(onUpdateUserPermissions || getUserPermissions) && canManageUsers;

                return {
                  id: target.id,
                  cells: [target.name, target.email],
                  actions: canEditPermissions ? (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => openPermissionEditor(target)}
                    >
                      {t.dashboard.admin.editPermissions}
                    </button>
                  ) : (
                    <span>—</span>
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
          <div className="space-y-2">
            <Label htmlFor="user-permission-airline">{t.dashboard.admin.airline}</Label>
            <Select
              value={selectedAirlineId}
              onValueChange={(airlineId) => {
                setSelectedAirlineId(airlineId);
                const globalPermissions = selectedPermissions.filter((permission) =>
                  globalAdministrationPermissions.some(
                    (globalPermission) => globalPermission === permission,
                  ),
                );
                setSelectedPermissions([
                  ...(selectedUser ? getAirlinePermissions(selectedUser, airlineId) : []),
                  ...globalPermissions,
                ]);
              }}
              disabled={isSaving || manageableAirlines.length === 0}
            >
              <SelectTrigger id="user-permission-airline">
                <SelectValue placeholder={t.dashboard.admin.selectAirline} />
              </SelectTrigger>
              <SelectContent>
                {manageableAirlines.map((airline) => (
                  <SelectItem key={airline.id} value={airline.id}>
                    {airline.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
            <PermissionSelector
              availablePermissions={[
                ...airlineScopedPermissions,
                ...globalAdministrationPermissions,
              ]}
              globalPermissions={globalAdministrationPermissions}
              globalPermissionsLabel={t.dashboard.admin.globalPermissions}
              disabledPermissions={selectedAirlineId === "" ? airlineScopedPermissions : []}
              selectedPermissions={selectedPermissions}
              onSelectionChange={setSelectedPermissions}
              onAssign={(permissions) => void handleSavePermissions(permissions)}
              title={t.dashboard.admin.userPermissionsTitle}
              description={t.dashboard.admin.userPermissionsDescription}
              assignLabel={isSaving ? t.dashboard.admin.saving : t.dashboard.admin.save}
              disabled={
                isSaving ||
                isLoadingPermissions ||
                !onUpdateUserPermissions ||
                Boolean(permissionsLoadError)
              }
              allowEmptySelection
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
