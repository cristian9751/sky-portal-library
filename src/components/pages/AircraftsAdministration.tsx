import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useApplicationContext } from "@/lib/ApplicationContext";
import { useI18n } from "@/lib/i18n";
import { AdministrationConfirmDialog } from "@/components/ui/administration-confirm-dialog";
import {
  ADMINISTRATION_PERMISSIONS,
  hasAnyPermission,
  hasPermission,
} from "@/lib/administration-permissions";
import { AdministrationTable } from "@/components/ui/table";
import type { Airline } from "./AirlinesAdministration";

export type Aircraft = {
  id: string;
  name: string;
  airlineId: string;
  aircraftTypeId: string;
  registration: string;
};


export type AircraftType = {
  id: string;
  name: string;
  purchasePrice: number;
};

export type AircraftsAdministrationProps = {
  airlines: Airline[];
  aircraftTypes: AircraftType[];
  getAircrafts: () => Aircraft[] | Promise<Aircraft[]>;
  onBuyAircraft?: (aircraft: Aircraft) => void | Promise<void>;
  onEditAircraft?: (aircraft: Aircraft) => void | Promise<void>;
  onSellAircraft?: (aircraft: Aircraft) => void | Promise<void>;
};

type AircraftFormProps = {
  aircraft?: Aircraft;
  airlines: Airline[];
  aircraftTypes: AircraftType[];
  submitLabel: string;
  onSubmit: (aircraft: Aircraft) => void | Promise<void>;
  onCancel: () => void;
};

const buildAircraftFormSchema = (requiredMessage: string, invalidRegistrationMessage: string) =>
  z.object({
    name: z.string().trim().min(1, requiredMessage),
    airlineId: z.string(),
    aircraftTypeId: z.string(),
    registration: z
      .string()
      .trim()
      .regex(/^[A-Z]{2}-[A-Z]{3}$/, invalidRegistrationMessage),
  });

type AircraftFormValues = z.infer<ReturnType<typeof buildAircraftFormSchema>>;

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
  const [error, setError] = useState("");
  const schema = useMemo(
    () => buildAircraftFormSchema(t.auth.required, t.dashboard.admin.invalidRegistration),
    [t.auth.required, t.dashboard.admin.invalidRegistration],
  );
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AircraftFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: aircraft?.name ?? "",
      airlineId: aircraft?.airlineId ?? airlines[0]?.id ?? "",
      aircraftTypeId: aircraft?.aircraftTypeId ?? aircraftTypes[0]?.id ?? "",
      registration: aircraft?.registration ?? "",
    },
  });
  const selectedAircraftTypeId = watch("aircraftTypeId");
  const selectedAircraftType = aircraftTypes.find(
    (aircraftType) => aircraftType.id === selectedAircraftTypeId,
  );
  const purchasePriceFormatter = new Intl.NumberFormat(lang, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });

  const onValid = async (values: AircraftFormValues) => {
    setError("");

    try {
      await onSubmit({
        ...values,
        id : String(aircraft?.id)
      });
      onCancel();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : String(submitError));
    }
  };

  return (
    <form className="row g-2 align-items-end" onSubmit={handleSubmit(onValid)} noValidate>
      <div className="col-md-3">
        <label className="form-label" htmlFor={`${formId}-name`}>
          {t.dashboard.admin.name}
        </label>
        <input
          {...register("name")}
          id={`${formId}-name`}
          className={`form-control${errors.name ? " is-invalid" : ""}`}
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && (
          <div className="invalid-feedback" role="alert">
            {errors.name.message}
          </div>
        )}
      </div>
      <div className="col-md-3">
        <label className="form-label" htmlFor={`${formId}-airline`}>
          {t.dashboard.admin.airline}
        </label>
        <select {...register("airlineId")} id={`${formId}-airline`} className="form-select">
          {airlines.map((airline) => (
            <option key={airline.id} value={airline.id}>
              {airline.name}
            </option>
          ))}
        </select>
      </div>
      <div className="col-md-3">
        <label className="form-label" htmlFor={`${formId}-registration`}>
          {t.dashboard.admin.registration}
        </label>
        <input
          {...register("registration")}
          id={`${formId}-registration`}
          className={`form-control${errors.registration ? " is-invalid" : ""}`}
          aria-invalid={Boolean(errors.registration)}
        />
        {errors.registration && (
          <div className="invalid-feedback" role="alert">
            {errors.registration.message}
          </div>
        )}
      </div>
      <div className="col-md-3">
        <label className="form-label" htmlFor={`${formId}-model`}>
          {t.dashboard.admin.model}
        </label>
        <select
          {...register("aircraftTypeId")}
          id={`${formId}-model`}
          className="form-select aircraft-model-select"
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

export function DashboardAircraftsAdministration({
  airlines,
  aircraftTypes,
  getAircrafts,
  onBuyAircraft,
  onEditAircraft,
  onSellAircraft,
}: AircraftsAdministrationProps) {
  const { t, lang } = useI18n();
  const { user } = useApplicationContext();
  const permissions = user?.permissions;
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([]);
  const [isLoadingAircrafts, setIsLoadingAircrafts] = useState(true);
  const [aircraftsError, setAircraftsError] = useState("");
  const [buying, setBuying] = useState(false);
  const [editingId, setEditingId] = useState<string>();
  const [sellingId, setSellingId] = useState<string>();
  const [aircraftToSell, setAircraftToSell] = useState<Aircraft>();
  const [actionError, setActionError] = useState("");
  const getAircraftsRef = useRef(getAircrafts);
  getAircraftsRef.current = getAircrafts;
  const permissionsRef = useRef(permissions);
  permissionsRef.current = permissions;

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

  const loadAircrafts = useCallback(async () => {
    setIsLoadingAircrafts(true);
    setAircraftsError("");

    try {
      const fetchedAircrafts = await getAircraftsRef.current();
      setAircrafts(
        fetchedAircrafts.filter(
          (aircraft) =>
            hasPermission(
              permissionsRef.current,
              ADMINISTRATION_PERMISSIONS.aircraftBuy,
              aircraft.airlineId,
            ) ||
            hasPermission(
              permissionsRef.current,
              ADMINISTRATION_PERMISSIONS.aircraftEdit,
              aircraft.airlineId,
            ) ||
            hasPermission(
              permissionsRef.current,
              ADMINISTRATION_PERMISSIONS.aircraftSell,
              aircraft.airlineId,
            ),
        ),
      );
    } catch (loadError) {
      setAircraftsError(loadError instanceof Error ? loadError.message : String(loadError));
      throw loadError;
    } finally {
      setIsLoadingAircrafts(false);
    }
  }, []);

  useEffect(() => {
    if (!canAccess) return;
    void loadAircrafts().catch(() => {
      // The error is shown through aircraftsError.
    });
  }, [canAccess, loadAircrafts]);

  const handleBuyAircraft = async (aircraft: Aircraft) => {
    if (!onBuyAircraft) return;
    await onBuyAircraft(aircraft);
    await loadAircrafts();
  };

  const handleEditAircraft = async (aircraft: Aircraft) => {
    if (!onEditAircraft) return;
    await onEditAircraft(aircraft);
    await loadAircrafts();
  };

  const handleConfirmSell = async () => {
    if (!aircraftToSell || !onSellAircraft) return;
    setActionError("");
    setSellingId(aircraftToSell.id);
    try {
      await onSellAircraft(aircraftToSell);
      await loadAircrafts();
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
        {aircraftsError && (
          <div className="alert alert-danger" role="alert">
            {aircraftsError}
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
              onSubmit={handleBuyAircraft}
              onCancel={() => setBuying(false)}
            />
          </div>
        )}
        {isLoadingAircrafts ? (
          <p role="status">{t.dashboard.admin.loadingAircrafts}</p>
        ) : aircrafts.length === 0 && !aircraftsError ? (
          <p className="mb-0">{t.dashboard.admin.noAircrafts}</p>
        ) : aircrafts.length > 0 ? (
          <AdministrationTable
            headers={[
              t.dashboard.admin.name,
              t.dashboard.admin.registration,
              t.dashboard.admin.airline,
              t.dashboard.admin.model,
              t.dashboard.admin.purchasePrice,
              t.dashboard.admin.actions,
            ]}
            rows={aircrafts.map((aircraft) => {
              const canEdit =
                Boolean(onEditAircraft) &&
                hasPermission(
                  permissions,
                  ADMINISTRATION_PERMISSIONS.aircraftEdit,
                  aircraft.airlineId,
                );
              const canSell =
                Boolean(onSellAircraft) &&
                hasPermission(
                  permissions,
                  ADMINISTRATION_PERMISSIONS.aircraftSell,
                  aircraft.airlineId,
                );

              return {
                id: aircraft.id,
                cells: [
                  aircraft.name,
                  aircraft.registration,
                  getAirlineName(aircraft.airlineId),
                  getAircraftTypeName(aircraft.aircraftTypeId),
                  getAircraftTypePrice(aircraft.aircraftTypeId),
                ],
                editContent:
                  editingId === aircraft.id && canEdit && onEditAircraft ? (
                    <AircraftForm
                      aircraft={aircraft}
                      airlines={airlines}
                      aircraftTypes={aircraftTypes}
                      submitLabel={t.dashboard.admin.save}
                      onSubmit={(input) =>
                        handleEditAircraft({
                          ...input,
                        })
                      }
                      onCancel={() => setEditingId(undefined)}
                    />
                  ) : undefined,
                actions: (
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
                ),
              };
            })}
          />
        ) : null}
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
        open={aircraftToSell !== undefined}
        onOpenChange={(open) => {
          if (!open && sellingId === undefined) {
            setAircraftToSell(undefined);
            setActionError("");
          }
        }}
        title={t.dashboard.admin.confirmSellAircraftTitle}
        description={
          <>
            {t.dashboard.admin.confirmSellAircraft}{" "}
            {aircraftToSell && <strong>{aircraftToSell.registration}</strong>}
          </>
        }
        error={actionError}
        isPending={sellingId !== undefined}
        cancelLabel={t.dashboard.admin.cancel}
        confirmLabel={t.dashboard.admin.sell}
        pendingLabel={t.dashboard.admin.saving}
        onConfirm={() => void handleConfirmSell()}
      />
    </>
  );
}
