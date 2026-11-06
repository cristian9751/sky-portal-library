import { useId, useState, type FormEvent } from "react";
import type { ComponentType } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import type { AppLinkProps } from "@/components/SiteLayout";
import { useApplicationContext } from "@/lib/ApplicationContext";
import { useI18n } from "@/lib/i18n";
import {
  ADMINISTRATION_PERMISSIONS,
  hasAnyPermission,
  hasPermission,
} from "@/lib/administration-permissions";

export type Airline = {
  id: string;
  name: string;
  code?: string;
};

export type AirlineInput = Omit<Airline, "id">;

export type AirlinesAdministrationProps = {
  airlines: Airline[];
  onCreateAirline?: (airline: AirlineInput) => void | Promise<void>;
  onEditAirline?: (id: string, airline: AirlineInput) => void | Promise<void>;
  onDeleteAirline?: (id: string) => void | Promise<void>;
  linkComponent?: ComponentType<AppLinkProps>;
};

type AirlineFormProps = {
  airline?: Airline;
  submitLabel: string;
  onSubmit: (airline: AirlineInput) => void | Promise<void>;
  onCancel: () => void;
};

function AirlineForm({ airline, submitLabel, onSubmit, onCancel }: AirlineFormProps) {
  const { t } = useI18n();
  const formId = useId();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError("");
    setIsSubmitting(true);

    try {
      await onSubmit({
        name: String(formData.get("name") ?? "").trim(),
        code: String(formData.get("code") ?? "").trim() || undefined,
      });
      onCancel();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : String(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="row g-2 align-items-end" onSubmit={handleSubmit}>
      <div className="col-md-5">
        <label className="form-label" htmlFor={`${formId}-name`}>
          {t.dashboard.admin.name}
        </label>
        <input
          id={`${formId}-name`}
          name="name"
          className="form-control"
          defaultValue={airline?.name}
          required
        />
      </div>
      <div className="col-md-3">
        <label className="form-label" htmlFor={`${formId}-code`}>
          {t.dashboard.admin.code}
        </label>
        <input
          id={`${formId}-code`}
          name="code"
          className="form-control"
          defaultValue={airline?.code}
        />
      </div>
      <div className="col-md-4 d-flex gap-2">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
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
      {error && (
        <div className="col-12">
          <div className="alert alert-danger mb-0" role="alert">
            {error}
          </div>
        </div>
      )}
    </form>
  );
}

export function AirlinesAdministration({
  airlines,
  onCreateAirline,
  onEditAirline,
  onDeleteAirline,
  linkComponent,
}: AirlinesAdministrationProps) {
  const { t } = useI18n();
  const { user } = useApplicationContext();
  const permissions = user?.permissions;
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string>();
  const [deletingId, setDeletingId] = useState<string>();
  const [actionError, setActionError] = useState("");

  const canAccess = hasAnyPermission(
    permissions,
    ADMINISTRATION_PERMISSIONS.airlineCreate,
    ADMINISTRATION_PERMISSIONS.airlineDelete,
    ADMINISTRATION_PERMISSIONS.airlineEdit,
  );
  const canCreate =
    Boolean(onCreateAirline) &&
    hasPermission(permissions, ADMINISTRATION_PERMISSIONS.airlineCreate, "*");

  const handleDelete = async (airline: Airline) => {
    if (!onDeleteAirline || !window.confirm(t.dashboard.admin.confirmDeleteAirline)) return;

    setActionError("");
    setDeletingId(airline.id);
    try {
      await onDeleteAirline(airline.id);
    } catch (deleteError) {
      setActionError(deleteError instanceof Error ? deleteError.message : String(deleteError));
    } finally {
      setDeletingId(undefined);
    }
  };

  const page = (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h4 className="card-title mb-0">{t.dashboard.admin.airlinesTitle}</h4>
        {canCreate && (
          <button type="button" className="btn btn-primary" onClick={() => setCreating(true)}>
            {t.dashboard.admin.createAirline}
          </button>
        )}
      </div>
      <div className="card-body">
        {actionError && (
          <div className="alert alert-danger" role="alert">
            {actionError}
          </div>
        )}
        {creating && canCreate && onCreateAirline && (
          <div className="mb-4">
            <AirlineForm
              submitLabel={t.dashboard.admin.create}
              onSubmit={onCreateAirline}
              onCancel={() => setCreating(false)}
            />
          </div>
        )}
        {airlines.length === 0 ? (
          <p className="mb-0">{t.dashboard.admin.noAirlines}</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th scope="col">{t.dashboard.admin.name}</th>
                  <th scope="col">{t.dashboard.admin.code}</th>
                  <th scope="col">{t.dashboard.admin.actions}</th>
                </tr>
              </thead>
              <tbody>
                {airlines.map((airline) => {
                  const canEdit =
                    Boolean(onEditAirline) &&
                    hasPermission(permissions, ADMINISTRATION_PERMISSIONS.airlineEdit, airline.id);
                  const canDelete =
                    Boolean(onDeleteAirline) &&
                    hasPermission(
                      permissions,
                      ADMINISTRATION_PERMISSIONS.airlineDelete,
                      airline.id,
                    );

                  return (
                    <tr key={airline.id}>
                      {editingId === airline.id && canEdit && onEditAirline ? (
                        <td colSpan={3}>
                          <AirlineForm
                            airline={airline}
                            submitLabel={t.dashboard.admin.save}
                            onSubmit={(input) => onEditAirline(airline.id, input)}
                            onCancel={() => setEditingId(undefined)}
                          />
                        </td>
                      ) : (
                        <>
                          <td>{airline.name}</td>
                          <td>{airline.code || "—"}</td>
                          <td>
                            <div className="d-flex gap-2">
                              {canEdit && (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => setEditingId(airline.id)}
                                >
                                  {t.dashboard.admin.edit}
                                </button>
                              )}
                              {canDelete && (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => void handleDelete(airline)}
                                  disabled={deletingId === airline.id}
                                >
                                  {deletingId === airline.id
                                    ? t.dashboard.admin.saving
                                    : t.dashboard.admin.delete}
                                </button>
                              )}
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <DashboardLayout
      title={t.dashboard.admin.airlines}
      crumbs={[{ label: t.dashboard.admin.title }, { label: t.dashboard.admin.airlines }]}
      linkComponent={linkComponent}
    >
      {canAccess ? (
        page
      ) : (
        <div className="alert alert-danger" role="alert">
          {t.dashboard.admin.noPermission}
        </div>
      )}
    </DashboardLayout>
  );
}
