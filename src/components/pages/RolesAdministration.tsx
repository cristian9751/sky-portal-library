import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useApplicationContext } from "@/lib/ApplicationContext";
import { ADMINISTRATION_PERMISSIONS, hasPermission } from "@/lib/administration-permissions";
import { AdministrationTable } from "@/components/ui/table";
import { AdministrationConfirmDialog } from "@/components/ui/administration-confirm-dialog";
import { Input } from "@/components/ui/input";
import type { Airline } from "@/components/pages/AirlinesAdministration";
import { MultiAirlinePermissionSelector } from "@/components/ui/multi-airline-permission-selector";
import type { AdministrationPermission } from "@/components/ui/permission-selector";

export type AdministrationRole = {
  id: string;
  name: string;
  permissions: string[];
};

export type AdministrationRoleInput = Omit<AdministrationRole, "id">;

export type RolesAdministrationProps = {
  roles: AdministrationRole[];
  airlines: Airline[];
  onCreateRole?: (role: AdministrationRoleInput) => void | Promise<void>;
  onEditRole?: (id: string, role: AdministrationRoleInput) => void | Promise<void>;
  onDeleteRole?: (id: string) => void | Promise<void>;
};

type RoleFormProps = {
  role?: AdministrationRole;
  airlines: Airline[];
  submitLabel: string;
  onSubmit: (role: AdministrationRoleInput) => void | Promise<void>;
  onCancel: () => void;
};

const permissionNodes: AdministrationPermission[] = Object.values(ADMINISTRATION_PERMISSIONS);

function getPermissionsForScope(
  permissions: readonly string[],
  scope: string,
): AdministrationPermission[] {
  return permissionNodes.filter((permission) => permissions.includes(`${permission}.${scope}`));
}

function updatePermissionsForScope(
  existingPermissions: readonly string[],
  selectedPermissions: readonly AdministrationPermission[],
  scope: string,
): string[] {
  const permissionsInScope = new Set(permissionNodes.map((permission) => `${permission}.${scope}`));
  return [
    ...existingPermissions.filter((permission) => !permissionsInScope.has(permission)),
    ...selectedPermissions.map((permission) => `${permission}.${scope}`),
  ];
}

function RoleForm({ role, airlines, submitLabel, onSubmit, onCancel }: RoleFormProps) {
  const { t } = useI18n();
  const rolePermissions = role?.permissions ?? [];
  const [selectedAirlineIds, setSelectedAirlineIds] = useState<string[]>(() => {
    const roleAirlines =
      role &&
      airlines
        .filter((airline) => getPermissionsForScope(role.permissions, airline.id).length > 0)
        .map((airline) => airline.id);
    return roleAirlines?.length ? roleAirlines : airlines[0] ? [airlines[0].id] : [];
  });
  const [name, setName] = useState(role?.name ?? "");
  const [permissionsByAirline, setPermissionsByAirline] = useState<
    Record<string, AdministrationPermission[]>
  >(() =>
    Object.fromEntries(
      selectedAirlineIds.map((airlineId) => [
        airlineId,
        getPermissionsForScope(rolePermissions, airlineId),
      ]),
    ),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError(t.dashboard.admin.roleNameRequired);
      return;
    }
    if (selectedAirlineIds.length === 0) {
      setError(t.dashboard.admin.roleScopeRequired);
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      const nextRolePermissions = selectedAirlineIds.reduce(
        (permissions, airlineId) =>
          updatePermissionsForScope(permissions, permissionsByAirline[airlineId] ?? [], airlineId),
        rolePermissions,
      );
      await onSubmit({
        name: trimmedName,
        permissions: nextRolePermissions,
      });
      onCancel();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : String(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="form-label" htmlFor={`role-name-${role?.id ?? "new"}`}>
          {t.dashboard.admin.roleName}
        </label>
        <Input
          id={`role-name-${role?.id ?? "new"}`}
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
          disabled={isSubmitting}
          aria-invalid={Boolean(error && !name.trim())}
        />
      </div>
      <div className="space-y-2">
        <p className="form-label mb-0">{t.dashboard.admin.rolePermissionScope}</p>
        {airlines.length === 0 && <p className="mb-0 text-muted">{t.dashboard.admin.noAirlines}</p>}
      </div>
      {error && (
        <div className="alert alert-danger mb-0" role="alert">
          {error}
        </div>
      )}
      <MultiAirlinePermissionSelector
        airlines={airlines}
        selectedAirlineIds={selectedAirlineIds}
        onSelectedAirlineIdsChange={(airlineIds) => {
          setSelectedAirlineIds(airlineIds);
          setPermissionsByAirline((current) => ({
            ...current,
            ...Object.fromEntries(
              airlineIds.map((airlineId) => [
                airlineId,
                current[airlineId] ?? getPermissionsForScope(rolePermissions, airlineId),
              ]),
            ),
          }));
          setError("");
        }}
        permissionsByAirline={permissionsByAirline}
        onPermissionsChange={(airlineId, permissions) =>
          setPermissionsByAirline((current) => ({ ...current, [airlineId]: permissions }))
        }
        availablePermissions={permissionNodes}
        airlineLabel={t.dashboard.admin.rolePermissionScope}
        selectAirlineLabel={t.dashboard.admin.selectAirline}
        permissionTitle={t.dashboard.admin.rolePermissions}
        permissionDescription={t.dashboard.admin.rolePermissionsDescription}
        idPrefix={`role-${role?.id ?? "new"}`}
        disabled={isSubmitting}
      />
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => void handleSubmit()}
        disabled={isSubmitting || airlines.length === 0}
      >
        {isSubmitting ? t.dashboard.admin.saving : submitLabel}
      </button>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        {t.dashboard.admin.cancel}
      </button>
    </div>
  );
}

export function DashboardRolesAdministration({
  roles,
  airlines,
  onCreateRole,
  onEditRole,
  onDeleteRole,
}: RolesAdministrationProps) {
  const { t } = useI18n();
  const { user } = useApplicationContext();
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string>();
  const [roleToDelete, setRoleToDelete] = useState<AdministrationRole>();
  const [deletingId, setDeletingId] = useState<string>();
  const [deleteError, setDeleteError] = useState("");
  const canAccess = hasPermission(
    user?.permissions,
    ADMINISTRATION_PERMISSIONS.userPermissionsEdit,
    "*",
  );

  const handleDelete = async () => {
    if (!roleToDelete || !onDeleteRole) return;

    setDeleteError("");
    setDeletingId(roleToDelete.id);
    try {
      await onDeleteRole(roleToDelete.id);
      setRoleToDelete(undefined);
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : String(error));
    } finally {
      setDeletingId(undefined);
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
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h4 className="card-title mb-0">{t.dashboard.admin.rolesTitle}</h4>
        {onCreateRole && !creating && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setEditingId(undefined);
              setCreating(true);
            }}
          >
            {t.dashboard.admin.createRole}
          </button>
        )}
      </div>
      <div className="card-body">
        {creating && onCreateRole && (
          <div className="mb-4">
            <RoleForm
              airlines={airlines}
              submitLabel={t.dashboard.admin.createRole}
              onSubmit={onCreateRole}
              onCancel={() => setCreating(false)}
            />
          </div>
        )}
        {roles.length === 0 ? (
          <p className="mb-0">{t.dashboard.admin.noRoles}</p>
        ) : (
          <AdministrationTable
            headers={[
              t.dashboard.admin.roleName,
              t.dashboard.admin.rolePermissions,
              t.dashboard.admin.actions,
            ]}
            rows={roles.map((role) => ({
              id: role.id,
              cells: [role.name, role.permissions.length > 0 ? role.permissions.join(", ") : "—"],
              editContent:
                editingId === role.id && onEditRole ? (
                  <RoleForm
                    role={role}
                    airlines={airlines}
                    submitLabel={t.dashboard.admin.saveRole}
                    onSubmit={(input) => onEditRole(role.id, input)}
                    onCancel={() => setEditingId(undefined)}
                  />
                ) : undefined,
              actions: (
                <div className="d-flex gap-2">
                  {onEditRole && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => {
                        setCreating(false);
                        setEditingId(role.id);
                      }}
                    >
                      {t.dashboard.admin.edit}
                    </button>
                  )}
                  {onDeleteRole && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => {
                        setDeleteError("");
                        setRoleToDelete(role);
                      }}
                      disabled={deletingId === role.id}
                    >
                      {deletingId === role.id ? t.dashboard.admin.saving : t.dashboard.admin.delete}
                    </button>
                  )}
                  {!onEditRole && !onDeleteRole && <span>—</span>}
                </div>
              ),
            }))}
          />
        )}
      </div>
      <AdministrationConfirmDialog
        open={roleToDelete !== undefined}
        onOpenChange={(open) => {
          if (!open && deletingId === undefined) {
            setRoleToDelete(undefined);
            setDeleteError("");
          }
        }}
        title={t.dashboard.admin.confirmDeleteRole}
        description={roleToDelete?.name}
        error={deleteError}
        isPending={deletingId !== undefined}
        cancelLabel={t.dashboard.admin.cancel}
        confirmLabel={t.dashboard.admin.delete}
        pendingLabel={t.dashboard.admin.saving}
        onConfirm={() => void handleDelete()}
      />
    </div>
  );
}
