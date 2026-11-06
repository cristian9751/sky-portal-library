import { useId, useState, type FormEvent } from "react";
import type { ComponentType } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import type { AppLinkProps } from "@/components/SiteLayout";
import { useApplicationContext } from "@/lib/ApplicationContext";
import { useI18n } from "@/lib/i18n";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ADMINISTRATION_PERMISSIONS,
  hasAnyPermission,
  hasPermission,
} from "@/lib/administration-permissions";
import type { Airline } from "./AirlinesAdministration";

export type Aircraft = {
  id: string;
  airlineId: string;
  aircraftTypeId: string;
  registration: string;
};

export type AircraftInput = Omit<Aircraft, "id">;

export type AircraftType = {
  id: string;
  name: string;
  purchasePrice: number;
};

export type AircraftsAdministrationProps = {
  airlines: Airline[];
  aircraftTypes: AircraftType[];
  aircrafts: Aircraft[];
  onBuyAircraft?: (aircraft: AircraftInput) => void | Promise<void>;
  onEditAircraft?: (id: string, aircraft: AircraftInput) => void | Promise<void>;
  onSellAircraft?: (id: string) => void | Promise<void>;
  linkComponent?: ComponentType<AppLinkProps>;
};

type AircraftFormProps = {
  aircraft?: Aircraft;
  airlines: Airline[];
  aircraftTypes: AircraftType[];
  submitLabel: string;
  onSubmit: (aircraft: AircraftInput) => void | Promise<void>;
  onCancel: () => void;
};

function AircraftForm({
  aircraft,
  airlines,
  aircraftTypes,
  submitLabel,
  onSubmit,
  onCancel,
}: AircraftFormProps) {
  const { t, lang } = useI18n();
  const formId = useId();
  const [selectedAircraftTypeId, setSelectedAircraftTypeId] = useState(
    aircraft?.aircraftTypeId ?? aircraftTypes[0]?.id ?? "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const selectedAircraftType = aircraftTypes.find(
    (aircraftType) => aircraftType.id === selectedAircraftTypeId,
  );
  const purchasePriceFormatter = new Intl.NumberFormat(lang, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError("");
    setIsSubmitting(true);

    try {
      await onSubmit({
        airlineId: String(formData.get("airlineId") ?? ""),
        aircraftTypeId: String(formData.get("aircraftTypeId") ?? ""),
        registration: String(formData.get("registration") ?? "").trim(),
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
        <label className="form-label" htmlFor={`${formId}-airline`}>
          {t.dashboard.admin.airline}
        </label>
        <select
          id={`${formId}-airline`}
          name="airlineId"
          className="form-select"
          defaultValue={aircraft?.airlineId ?? airlines[0]?.id ?? ""}
          required
        >
          {airlines.map((airline) => (
            <option key={airline.id} value={airline.id}>
              {airline.name}
            </option>
          ))}
        </select>
      </div>
      <div className="col-md-4">
        <label className="form-label" htmlFor={`${formId}-registration`}>
          {t.dashboard.admin.registration}
        </label>
        <input
          id={`${formId}-registration`}
          name="registration"
          className="form-control"
          defaultValue={aircraft?.registration}
          required
        />
      </div>
      <div className="col-md-4">
        <label className="form-label" htmlFor={`${formId}-model`}>
          {t.dashboard.admin.model}
        </label>
        <select
          id={`${formId}-model`}
          name="aircraftTypeId"
          className="form-select aircraft-model-select"
          value={selectedAircraftTypeId}
          onChange={(event) => setSelectedAircraftTypeId(event.currentTarget.value)}
          required
        >
          {aircraftTypes.map((aircraftType) => (
            <option key={aircraftType.id} value={aircraftType.id}>
              {aircraftType.name} — {purchasePriceFormatter.format(aircraftType.purchasePrice)}
            </option>
          ))}
        </select>
      </div>
      {selectedAircraftType && (
        <div className="col-12">
          <p className="mb-0">
            {t.dashboard.admin.purchasePrice}:{" "}
            <strong>{purchasePriceFormatter.format(selectedAircraftType.purchasePrice)}</strong>
          </p>
        </div>
      )}
      <div className="col-12 d-flex gap-2">
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

export function AircraftsAdministration({
  airlines,
  aircraftTypes,
  aircrafts,
  onBuyAircraft,
  onEditAircraft,
  onSellAircraft,
  linkComponent,
}: AircraftsAdministrationProps) {
  const { t, lang } = useI18n();
  const { user } = useApplicationContext();
  const permissions = user?.permissions;
  const [buying, setBuying] = useState(false);
  const [editingId, setEditingId] = useState<string>();
  const [sellingId, setSellingId] = useState<string>();
  const [aircraftToSell, setAircraftToSell] = useState<Aircraft>();
  const [actionError, setActionError] = useState("");

  const canAccess = hasAnyPermission(
    permissions,
    ADMINISTRATION_PERMISSIONS.aircraftBuy,
    ADMINISTRATION_PERMISSIONS.aircraftEdit,
    ADMINISTRATION_PERMISSIONS.aircraftSell,
  );
  const buyableAirlines = airlines.filter((airline) =>
    hasPermission(permissions, ADMINISTRATION_PERMISSIONS.aircraftBuy, airline.id),
  );
  const canBuy = Boolean(onBuyAircraft) && buyableAirlines.length > 0 && aircraftTypes.length > 0;

  const handleConfirmSell = async () => {
    if (!aircraftToSell || !onSellAircraft) return;
    setActionError("");
    setSellingId(aircraftToSell.id);
    try {
      await onSellAircraft(aircraftToSell.id);
      setAircraftToSell(undefined);
    } catch (sellError) {
      setActionError(sellError instanceof Error ? sellError.message : String(sellError));
    } finally {
      setSellingId(undefined);
    }
  };

  const getAirlineName = (airlineId: string) =>
    airlines.find((airline) => airline.id === airlineId)?.name ?? "—";
  const getAircraftTypeName = (aircraftTypeId: string) =>
    aircraftTypes.find((aircraftType) => aircraftType.id === aircraftTypeId)?.name ?? "—";
  const getAircraftTypePrice = (aircraftTypeId: string) => {
    const purchasePrice = aircraftTypes.find(
      (aircraftType) => aircraftType.id === aircraftTypeId,
    )?.purchasePrice;

    return purchasePrice === undefined
      ? "—"
      : new Intl.NumberFormat(lang, {
          style: "currency",
          currency: "EUR",
          maximumFractionDigits: 0,
        }).format(purchasePrice);
  };

  const page = (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h4 className="card-title mb-0">{t.dashboard.admin.aircraftsTitle}</h4>
        {canBuy && (
          <button type="button" className="btn btn-primary" onClick={() => setBuying(true)}>
            {t.dashboard.admin.buyAircraft}
          </button>
        )}
      </div>
      <div className="card-body">
        {actionError && !aircraftToSell && (
          <div className="alert alert-danger" role="alert">
            {actionError}
          </div>
        )}
        {aircraftTypes.length === 0 && (
          <div className="alert alert-info" role="status">
            {t.dashboard.admin.noAircraftTypes}
          </div>
        )}
        {buying && canBuy && onBuyAircraft && (
          <div className="mb-4">
            <AircraftForm
              airlines={buyableAirlines}
              aircraftTypes={aircraftTypes}
              submitLabel={t.dashboard.admin.buy}
              onSubmit={onBuyAircraft}
              onCancel={() => setBuying(false)}
            />
          </div>
        )}
        {aircrafts.length === 0 ? (
          <p className="mb-0">{t.dashboard.admin.noAircrafts}</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th scope="col">{t.dashboard.admin.registration}</th>
                  <th scope="col">{t.dashboard.admin.airline}</th>
                  <th scope="col">{t.dashboard.admin.model}</th>
                  <th scope="col">{t.dashboard.admin.purchasePrice}</th>
                  <th scope="col">{t.dashboard.admin.actions}</th>
                </tr>
              </thead>
              <tbody>
                {aircrafts.map((aircraft) => {
                  const canEdit =
                    Boolean(onEditAircraft) &&
                    hasPermission(
                      permissions,
                      ADMINISTRATION_PERMISSIONS.aircraftEdit,
                      aircraft.id,
                    );
                  const canSell =
                    Boolean(onSellAircraft) &&
                    hasPermission(
                      permissions,
                      ADMINISTRATION_PERMISSIONS.aircraftSell,
                      aircraft.id,
                    );

                  return (
                    <tr key={aircraft.id}>
                      {editingId === aircraft.id && canEdit && onEditAircraft ? (
                        <td colSpan={5}>
                          <AircraftForm
                            aircraft={aircraft}
                            airlines={airlines}
                            aircraftTypes={aircraftTypes}
                            submitLabel={t.dashboard.admin.save}
                            onSubmit={(input) => onEditAircraft(aircraft.id, input)}
                            onCancel={() => setEditingId(undefined)}
                          />
                        </td>
                      ) : (
                        <>
                          <td>{aircraft.registration}</td>
                          <td>{getAirlineName(aircraft.airlineId)}</td>
                          <td>{getAircraftTypeName(aircraft.aircraftTypeId)}</td>
                          <td>{getAircraftTypePrice(aircraft.aircraftTypeId)}</td>
                          <td>
                            <div className="d-flex gap-2">
                              {canEdit && (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => setEditingId(aircraft.id)}
                                >
                                  {t.dashboard.admin.edit}
                                </button>
                              )}
                              {canSell && (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => {
                                    setActionError("");
                                    setAircraftToSell(aircraft);
                                  }}
                                  disabled={sellingId === aircraft.id}
                                >
                                  {sellingId === aircraft.id
                                    ? t.dashboard.admin.saving
                                    : t.dashboard.admin.sell}
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
      title={t.dashboard.admin.aircrafts}
      crumbs={[{ label: t.dashboard.admin.title }, { label: t.dashboard.admin.aircrafts }]}
      linkComponent={linkComponent}
    >
      {canAccess ? (
        page
      ) : (
        <div className="alert alert-danger" role="alert">
          {t.dashboard.admin.noPermission}
        </div>
      )}
      <AlertDialog
        open={aircraftToSell !== undefined}
        onOpenChange={(open) => {
          if (!open && sellingId === undefined) {
            setAircraftToSell(undefined);
            setActionError("");
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.dashboard.admin.confirmSellAircraftTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.dashboard.admin.confirmSellAircraft}{" "}
              {aircraftToSell && <strong>{aircraftToSell.registration}</strong>}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {actionError && (
            <div className="alert alert-danger mb-0" role="alert">
              {actionError}
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={sellingId !== undefined}>
              {t.dashboard.admin.cancel}
            </AlertDialogCancel>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => void handleConfirmSell()}
              disabled={sellingId !== undefined}
            >
              {sellingId !== undefined ? t.dashboard.admin.saving : t.dashboard.admin.sell}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
