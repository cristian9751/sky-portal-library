import { useState } from "react";
import { useApplicationContext } from "@/lib/ApplicationContext";
import { useI18n } from "@/lib/i18n";
import {
  ADMINISTRATION_PERMISSIONS,
  hasAnyPermission,
  hasPermission,
} from "@/lib/administration-permissions";
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
import { AdministrationTable } from "@/components/ui/table";

export type AdministrationUser = {
  id: string;
  name: string;
  email: string;
  permissions?: string[];
};

export type UsersAdministrationProps = {
  users: AdministrationUser[];
  onUpdateUserPermissions?: (userId: string, permissions: string[]) => void | Promise<void>;
};

const administrationPermissionValues = Object.values(ADMINISTRATION_PERMISSIONS);

function getSelectedPermissions(user: AdministrationUser): AdministrationPermission[] {
  return administrationPermissionValues.filter((permission) =>
    hasPermission(user.permissions, permission),
  );
}

function updateAdministrationPermissions(
  existingPermissions: readonly string[] | undefined,
  selectedPermissions: readonly AdministrationPermission[],
): string[] {
  const existing = existingPermissions ?? [];
  const unrelatedPermissions = existing.filter(
    (granted) =>
      !administrationPermissionValues.some((permission) => granted.startsWith(`${permission}.`)),
  );
  const selectedGrants = selectedPermissions.flatMap((permission) => {
    const existingGrants = existing.filter((granted) => granted.startsWith(`${permission}.`));
    return existingGrants.length > 0 ? existingGrants : [`${permission}.*`];
  });

  return [...unrelatedPermissions, ...selectedGrants];
}

export function DashboardUsersAdministration({
  users,
  onUpdateUserPermissions,
}: UsersAdministrationProps) {
  const { t } = useI18n();
  const { user: currentUser } = useApplicationContext();
  const [selectedUser, setSelectedUser] = useState<AdministrationUser>();
  const [selectedPermissions, setSelectedPermissions] = useState<AdministrationPermission[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const canAccess = hasAnyPermission(
    currentUser?.permissions,
    ADMINISTRATION_PERMISSIONS.userPermissionsEdit,
  );

  const openPermissionEditor = (target: AdministrationUser) => {
    setSelectedUser(target);
    setSelectedPermissions(getSelectedPermissions(target));
    setSaveError("");
  };

  const handleSavePermissions = async (permissions: AdministrationPermission[]) => {
    if (!selectedUser || !onUpdateUserPermissions) return;

    setSaveError("");
    setIsSaving(true);
    try {
      await onUpdateUserPermissions(
        selectedUser.id,
        updateAdministrationPermissions(selectedUser.permissions, permissions),
      );
      setSelectedUser(undefined);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsSaving(false);
    }
  };

  if (!canAccess) {
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
                  Boolean(onUpdateUserPermissions) &&
                  hasPermission(
                    currentUser?.permissions,
                    ADMINISTRATION_PERMISSIONS.userPermissionsEdit,
                    target.id,
                  );

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
            setSelectedUser(undefined);
            setSaveError("");
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
          {selectedUser && (
            <PermissionSelector
              selectedPermissions={selectedPermissions}
              onSelectionChange={setSelectedPermissions}
              onAssign={(permissions) => void handleSavePermissions(permissions)}
              title={t.dashboard.admin.userPermissionsTitle}
              description={t.dashboard.admin.userPermissionsDescription}
              assignLabel={isSaving ? t.dashboard.admin.saving : t.dashboard.admin.save}
              disabled={isSaving}
              allowEmptySelection
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
