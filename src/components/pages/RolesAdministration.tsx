import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { AdministrationTable } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  PermissionSelector,
  type AdministrationPermission,
} from "@/components/ui/permission-selector";

export type AdministrationRole = {
  id: string;
  name: string;
  permissions: AdministrationPermission[];
};

export type AdministrationRoleInput = Omit<AdministrationRole, "id">;

export type RolesAdministrationProps = {
  roles: AdministrationRole[];
  onCreateRole?: (role: AdministrationRoleInput) => void | Promise<void>;
  onEditRole?: (id: string, role: AdministrationRoleInput) => void | Promise<void>;
};

type RoleFormProps = {
  role?: AdministrationRole;
  submitLabel: string;
  onSubmit: (role: AdministrationRoleInput) => void | Promise<void>;
  onCancel: () => void;
};

function RoleForm({ role, submitLabel, onSubmit, onCancel }: RoleFormProps) {
  const { t } = useI18n();
  const [name, setName] = useState(role?.name ?? "");
  const [selectedPermissions, setSelectedPermissions] = useState<AdministrationPermission[]>(() => [
    ...(role?.permissions ?? []),
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (permissions: AdministrationPermission[]) => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError(t.dashboard.admin.roleNameRequired);
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      await onSubmit({ name: trimmedName, permissions });
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
      {error && (
        <div className="alert alert-danger mb-0" role="alert">
          {error}
        </div>
      )}
      <PermissionSelector
        selectedPermissions={selectedPermissions}
        onSelectionChange={setSelectedPermissions}
        onAssign={(permissions) => void handleSubmit(permissions)}
        title={t.dashboard.admin.rolePermissions}
        description={t.dashboard.admin.rolePermissionsDescription}
        assignLabel={isSubmitting ? t.dashboard.admin.saving : submitLabel}
        disabled={isSubmitting}
        allowEmptySelection
      />
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
  onCreateRole,
  onEditRole,
}: RolesAdministrationProps) {
  const { t } = useI18n();
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string>();

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h4 className="card-title mb-0">{t.dashboard.admin.rolesTitle}</h4>
        {onCreateRole && !creating && (
          <button type="button" className="btn btn-primary" onClick={() => setCreating(true)}>
            {t.dashboard.admin.createRole}
          </button>
        )}
      </div>
      <div className="card-body">
        {creating && onCreateRole && (
          <div className="mb-4">
            <RoleForm
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
                    submitLabel={t.dashboard.admin.saveRole}
                    onSubmit={(input) => onEditRole(role.id, input)}
                    onCancel={() => setEditingId(undefined)}
                  />
                ) : undefined,
              actions: onEditRole ? (
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
              ) : (
                <span>—</span>
              ),
            }))}
          />
        )}
      </div>
    </div>
  );
}
