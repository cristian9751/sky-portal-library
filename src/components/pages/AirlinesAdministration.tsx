import { useId, useState, type FormEvent } from "react";
import { useApplicationContext } from "@/lib/ApplicationContext";
import { useI18n } from "@/lib/i18n";
import {
  ADMINISTRATION_PERMISSIONS,
  hasAnyPermission,
  hasPermission,
} from "@/lib/administration-permissions";
import { AdministrationTable } from "@/components/ui/table";
import { AdministrationConfirmDialog } from "@/components/ui/administration-confirm-dialog";

export type Airline = {
  id: string;
  name: string;
  code?: string;
  isCharter: boolean;
};



export type AirlinesAdministrationProps = {
  airlines: Airline[];
  onCreateAirline?: (airline: Airline) => void | Promise<void>;
  onEditAirline?: (id: string, airline: Airline) => void | Promise<void>;
  onDeleteAirline?: (id: string) => void | Promise<void>;
};

type AirlineFormProps = {
  airline?: Airline;
  submitLabel: string;
  onSubmit: (airline: Airline) => void | Promise<void>;
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
        id : String(airline?.id),
        name: String(formData.get("name") ?? "").trim(),
        code: String(formData.get("code") ?? "").trim() || undefined,
        isCharter: formData.has("isCharter"),
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
      <div className="col-md-4">
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
      <div className="col-md-2">
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
      <div className="col-md-3">
        <div className="form-check">
          <input
            id={`${formId}-is-charter`}
            name="isCharter"
            type="checkbox"
            className="form-check-input"
            defaultChecked={airline?.isCharter ?? false}
          />
          <label className="form-check-label" htmlFor={`${formId}-is-charter`}>
            {t.dashboard.admin.isCharter}
          </label>
        </div>
      </div>
      <div className="col-md-3 d-flex gap-2">
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

export function DashboardAirlinesAdministration({
  airlines,
  onCreateAirline,
  onEditAirline,
  onDeleteAirline,
}: AirlinesAdministrationProps) {
  const { t } = useI18n();
  const { user } = useApplicationContext();
  const permissions = user?.permissions;
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string>();
  const [deletingId, setDeletingId] = useState<string>();
  const [deleteError, setDeleteError] = useState("");
  const [airlineToDelete, setAirlineToDelete] = useState<Airline>();

  const canAccess = hasAnyPermission(
    permissions,
    ADMINISTRATION_PERMISSIONS.airlineCreate,
    ADMINISTRATION_PERMISSIONS.airlineDelete,
    ADMINISTRATION_PERMISSIONS.airlineEdit,
  );
  const canCreate =
    Boolean(onCreateAirline) &&
    hasPermission(permissions, ADMINISTRATION_PERMISSIONS.airlineCreate, "*");

  const handleDelete = async () => {
    if (!airlineToDelete || !onDeleteAirline) return;

    setDeleteError("");
    setDeletingId(airlineToDelete.id);
    try {
      await onDeleteAirline(airlineToDelete.id);
      setAirlineToDelete(undefined);
    } catch (deleteError) {
      setDeleteError(deleteError instanceof Error ? deleteError.message : String(deleteError));
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
          <AdministrationTable
            headers={[t.dashboard.admin.name, t.dashboard.admin.code, t.dashboard.admin.actions]}
            rows={airlines.map((airline) => {
              const canEdit =
                Boolean(onEditAirline) &&
                hasPermission(permissions, ADMINISTRATION_PERMISSIONS.airlineEdit, airline.id);
              const canDelete =
                Boolean(onDeleteAirline) &&
                hasPermission(permissions, ADMINISTRATION_PERMISSIONS.airlineDelete, airline.id);

              return {
                id: airline.id,
                cells: [airline.name, airline.code || "—"],
                editContent:
                  editingId === airline.id && canEdit && onEditAirline ? (
                    <AirlineForm
                      airline={airline}
                      submitLabel={t.dashboard.admin.save}
                      onSubmit={(input) => onEditAirline(airline.id, input)}
                      onCancel={() => setEditingId(undefined)}
                    />
                  ) : undefined,
                actions: (
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
                        onClick={() => {
                          setDeleteError("");
                          setAirlineToDelete(airline);
                        }}
                        disabled={deletingId === airline.id}
                      >
                        {deletingId === airline.id
                          ? t.dashboard.admin.saving
                          : t.dashboard.admin.delete}
                      </button>
                    )}
                  </div>
                ),
              };
            })}
          />
        )}
      </div>
    </div>
  );

  return (
    <>
      {canAccess ? (
        page
      ) : (
        <div className="alert alert-danger" role="alert">
          {t.dashboard.admin.noPermission}
        </div>
      )}
      <AdministrationConfirmDialog
        open={airlineToDelete !== undefined}
        onOpenChange={(open) => {
          if (!open && deletingId === undefined) {
            setAirlineToDelete(undefined);
            setDeleteError("");
          }
        }}
        title={t.dashboard.admin.confirmDeleteAirline}
        description={airlineToDelete?.name}
        error={deleteError}
        isPending={deletingId !== undefined}
        cancelLabel={t.dashboard.admin.cancel}
        confirmLabel={t.dashboard.admin.delete}
        pendingLabel={t.dashboard.admin.saving}
        onConfirm={() => void handleDelete()}
      />
    </>
  );
}
