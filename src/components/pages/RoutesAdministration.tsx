import { useId, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import * as XLSX from "xlsx";
import { useAirports } from "@/lib/AirportContext";
import { useI18n } from "@/lib/i18n";
import { AdministrationTable } from "@/components/ui/table";
import { AdministrationConfirmDialog } from "@/components/ui/administration-confirm-dialog";
import type { Airline } from "./AirlinesAdministration";

export type AirlineRoute = {
  id: string;
  airlineId: string;
  departure: string;
  arrival: string;
  number: string;
  distance: number;
  flightMinutes: number;
  isActive: boolean;
};

export type AirlineRouteInput = Omit<AirlineRoute, "id">;

export type RoutesAdministrationProps = {
  routes: AirlineRoute[];
  airlines: Airline[];
  onCreateRoute?: (route: AirlineRouteInput) => void | Promise<void>;
  onEditRoute?: (id: string, route: AirlineRouteInput) => void | Promise<void>;
  onDeleteRoute?: (id: string) => void | Promise<void>;
};

type ExcelRouteField =
  | "number"
  | "airline"
  | "departure"
  | "arrival"
  | "distance"
  | "flightMinutes"
  | "isActive";

const EXCEL_ROUTE_HEADERS: Record<ExcelRouteField, string[]> = {
  number: ["code", "codigo", "number", "numero", "route number", "numero de ruta"],
  airline: ["airline", "aerolinea", "fluggesellschaft", "compagnie aerienne", "airlineid"],
  departure: ["departure", "salida", "abflug", "depart"],
  arrival: ["arrival", "llegada", "ankunft", "arrivee"],
  distance: ["distance", "distancia", "entfernung"],
  flightMinutes: [
    "flight minutes",
    "flightminutes",
    "minutos de vuelo",
    "flugminuten",
    "minutes de vol",
  ],
  isActive: ["active", "activa", "aktiv"],
};

const normalizeExcelText = (value: unknown) =>
  String(value ?? "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();

const getExcelCell = (row: unknown[], column: number | undefined) =>
  column === undefined ? "" : String(row[column] ?? "").trim();

type RouteFormProps = {
  route?: AirlineRoute;
  airlines: Airline[];
  airports: string[];
  submitLabel: string;
  onSubmit: (route: AirlineRouteInput) => void | Promise<void>;
  onCancel: () => void;
};

function RouteForm({ route, airlines, airports, submitLabel, onSubmit, onCancel }: RouteFormProps) {
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
        airlineId: String(formData.get("airlineId") ?? ""),
        departure: String(formData.get("departure") ?? "")
          .trim()
          .toUpperCase(),
        arrival: String(formData.get("arrival") ?? "")
          .trim()
          .toUpperCase(),
        number: String(formData.get("number") ?? "").trim(),
        distance: Number(formData.get("distance")),
        flightMinutes: Number(formData.get("flightMinutes")),
        isActive: formData.has("isActive"),
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
          {t.dashboard.admin.code}
        </label>
        <input
          id={`${formId}-name`}
          name="number"
          className="form-control"
          defaultValue={route?.number}
          required
        />
      </div>
      <div className="col-md-4">
        <label className="form-label" htmlFor={`${formId}-airline`}>
          {t.dashboard.admin.airline}
        </label>
        <select
          id={`${formId}-airline`}
          name="airlineId"
          className="form-select route-select"
          defaultValue={route?.airlineId ?? airlines[0]?.id ?? ""}
          required
        >
          <option value="" disabled>
            {t.dashboard.admin.selectAirline}
          </option>
          {airlines.map((airline) => (
            <option key={airline.id} value={airline.id}>
              {airline.name}
            </option>
          ))}
        </select>
      </div>
      <div className="col-md-2">
        <label className="form-label" htmlFor={`${formId}-departure`}>
          {t.dashboard.admin.departure}
        </label>
        <select
          id={`${formId}-departure`}
          name="departure"
          className="form-select route-select"
          defaultValue={route?.departure ?? ""}
          required
        >
          <option value="" disabled>
            {t.dashboard.admin.selectAirport}
          </option>
          {airports.map((airport) => (
            <option key={airport} value={airport}>
              {airport}
            </option>
          ))}
        </select>
      </div>
      <div className="col-md-2">
        <label className="form-label" htmlFor={`${formId}-arrival`}>
          {t.dashboard.admin.arrival}
        </label>
        <select
          id={`${formId}-arrival`}
          name="arrival"
          className="form-select route-select"
          defaultValue={route?.arrival ?? ""}
          required
        >
          <option value="" disabled>
            {t.dashboard.admin.selectAirport}
          </option>
          {airports.map((airport) => (
            <option key={airport} value={airport}>
              {airport}
            </option>
          ))}
        </select>
      </div>
      <div className="col-md-3">
        <label className="form-label" htmlFor={`${formId}-distance`}>
          {t.dashboard.admin.distance}
        </label>
        <input
          id={`${formId}-distance`}
          name="distance"
          type="number"
          className="form-control"
          defaultValue={route?.distance}
          min="1"
          step="any"
          required
        />
      </div>
      <div className="col-md-3">
        <label className="form-label" htmlFor={`${formId}-flight-minutes`}>
          {t.dashboard.admin.flightMinutes}
        </label>
        <input
          id={`${formId}-flight-minutes`}
          name="flightMinutes"
          type="number"
          className="form-control"
          defaultValue={route?.flightMinutes}
          min="1"
          step="1"
          required
        />
      </div>
      <div className="col-md-3">
        <div className="form-check">
          <input
            id={`${formId}-is-active`}
            name="isActive"
            type="checkbox"
            className="form-check-input"
            defaultChecked={route?.isActive ?? true}
          />
          <label className="form-check-label" htmlFor={`${formId}-is-active`}>
            {t.dashboard.admin.active}
          </label>
        </div>
      </div>
      <div className="col-md-3 d-flex gap-2">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting || airlines.length === 0 || airports.length === 0}
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

export function DashboardRoutesAdministration({
  routes,
  airlines,
  onCreateRoute,
  onEditRoute,
  onDeleteRoute,
}: RoutesAdministrationProps) {
  const { t } = useI18n();
  const airports = useAirports();
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string>();
  const [deletingId, setDeletingId] = useState<string>();
  const [actionError, setActionError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [routeToDelete, setRouteToDelete] = useState<AirlineRoute>();
  const [importSuccess, setImportSuccess] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadImportTemplate = () => {
    const worksheet = XLSX.utils.aoa_to_sheet([
      [
        t.dashboard.admin.code,
        t.dashboard.admin.airline,
        t.dashboard.admin.departure,
        t.dashboard.admin.arrival,
        t.dashboard.admin.distance,
        t.dashboard.admin.flightMinutes,
        t.dashboard.admin.active,
      ],
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Routes");
    XLSX.writeFile(workbook, "routes-template.xlsx");
  };

  const handleImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (!file || !onCreateRoute) return;

    const input = event.currentTarget;
    setActionError("");
    setImportSuccess("");
    setIsImporting(true);

    try {
      if (!/\.(xlsx|xls)$/i.test(file.name)) {
        throw new Error(t.dashboard.admin.invalidExcelFile);
      }

      const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      if (!firstSheetName) throw new Error(t.dashboard.admin.emptyExcelFile);

      const worksheet = workbook.Sheets[firstSheetName];
      if (!worksheet) throw new Error(t.dashboard.admin.emptyExcelFile);
      const sheetRows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
        header: 1,
        defval: "",
        raw: true,
      });
      const headerRow = sheetRows[0];
      if (!headerRow) throw new Error(t.dashboard.admin.emptyExcelFile);

      const columns: Partial<Record<ExcelRouteField, number>> = {};
      headerRow.forEach((header, index) => {
        const normalizedHeader = normalizeExcelText(header);
        for (const [field, aliases] of Object.entries(EXCEL_ROUTE_HEADERS) as [
          ExcelRouteField,
          string[],
        ][]) {
          if (columns[field] === undefined && aliases.includes(normalizedHeader)) {
            columns[field] = index;
          }
        }
      });

      const requiredFields: ExcelRouteField[] = [
        "number",
        "airline",
        "departure",
        "arrival",
        "distance",
        "flightMinutes",
      ];
      const missingHeaders = requiredFields
        .filter((field) => columns[field] === undefined)
        .map((field) => {
          const labels: Record<ExcelRouteField, string> = {
            number: t.dashboard.admin.code,
            airline: t.dashboard.admin.airline,
            departure: t.dashboard.admin.departure,
            arrival: t.dashboard.admin.arrival,
            distance: t.dashboard.admin.distance,
            flightMinutes: t.dashboard.admin.flightMinutes,
            isActive: t.dashboard.admin.active,
          };
          return labels[field];
        });
      if (missingHeaders.length > 0) {
        throw new Error(`${t.dashboard.admin.missingExcelColumns} ${missingHeaders.join(", ")}`);
      }

      const routeRows = sheetRows
        .slice(1)
        .flatMap((row, index) =>
          row.some((cell) => String(cell ?? "").trim() !== "")
            ? [{ row, rowNumber: index + 2 }]
            : [],
        );
      if (routeRows.length === 0) throw new Error(t.dashboard.admin.emptyExcelFile);

      const parsedRoutes: { rowNumber: number; route: AirlineRouteInput }[] = [];
      const rowErrors: string[] = [];

      for (const { row, rowNumber } of routeRows) {
        const number = getExcelCell(row, columns.number);
        const airlineValue = getExcelCell(row, columns.airline);
        const departure = getExcelCell(row, columns.departure).toUpperCase();
        const arrival = getExcelCell(row, columns.arrival).toUpperCase();
        const distance = Number(getExcelCell(row, columns.distance));
        const flightMinutes = Number(getExcelCell(row, columns.flightMinutes));
        const activeValue = normalizeExcelText(getExcelCell(row, columns.isActive));
        const errors: string[] = [];

        const airlineById = airlines.find((item) => item.id === airlineValue);
        const matchingAirlines = airlines.filter(
          (item) =>
            normalizeExcelText(item.name) === normalizeExcelText(airlineValue) ||
            normalizeExcelText(item.code) === normalizeExcelText(airlineValue),
        );
        const airline =
          airlineById ?? (matchingAirlines.length === 1 ? matchingAirlines[0] : undefined);
        if (!number) errors.push(t.dashboard.admin.code);
        if (!airline) errors.push(t.dashboard.admin.invalidExcelAirline);
        if (!/^[A-Z]{4}$/.test(departure) || !airports.includes(departure)) {
          errors.push(t.dashboard.admin.departure);
        }
        if (!/^[A-Z]{4}$/.test(arrival) || !airports.includes(arrival)) {
          errors.push(t.dashboard.admin.arrival);
        }
        if (!Number.isFinite(distance) || distance <= 0) errors.push(t.dashboard.admin.distance);
        if (!Number.isInteger(flightMinutes) || flightMinutes <= 0) {
          errors.push(t.dashboard.admin.flightMinutes);
        }
        if (
          columns.isActive !== undefined &&
          ![
            "true",
            "false",
            "yes",
            "no",
            "si",
            "oui",
            "non",
            "ja",
            "nein",
            "1",
            "0",
            "active",
            "activa",
            "activo",
            "aktiv",
            "inactive",
            "inactiva",
            "inactivo",
          ].includes(activeValue)
        ) {
          errors.push(t.dashboard.admin.active);
        }

        if (errors.length > 0 || !airline) {
          rowErrors.push(`${t.dashboard.admin.excelRow} ${rowNumber}: ${errors.join(", ")}`);
          continue;
        }

        parsedRoutes.push({
          rowNumber,
          route: {
            number,
            airlineId: airline.id,
            departure,
            arrival,
            distance,
            flightMinutes,
            isActive:
              columns.isActive === undefined ||
              [
                "true",
                "yes",
                "si",
                "oui",
                "ja",
                "1",
                "active",
                "activa",
                "activo",
                "aktiv",
              ].includes(activeValue),
          },
        });
      }

      if (rowErrors.length > 0) {
        throw new Error(`${t.dashboard.admin.excelValidationError}\n${rowErrors.join("\n")}`);
      }

      const importErrors: string[] = [];
      let importedCount = 0;
      for (const { rowNumber, route } of parsedRoutes) {
        try {
          await onCreateRoute(route);
          importedCount += 1;
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          importErrors.push(`${t.dashboard.admin.excelRow} ${rowNumber}: ${message}`);
        }
      }

      if (importErrors.length > 0) {
        setActionError(
          `${t.dashboard.admin.excelImportPartial} ${importedCount}.\n${importErrors.join("\n")}`,
        );
      } else {
        setImportSuccess(`${t.dashboard.admin.excelImportSuccess} ${importedCount}.`);
      }
    } catch (importError) {
      setActionError(importError instanceof Error ? importError.message : String(importError));
    } finally {
      input.value = "";
      setIsImporting(false);
    }
  };

  const handleDelete = async () => {
    if (!routeToDelete || !onDeleteRoute) return;

    setDeleteError("");
    setDeletingId(routeToDelete.id);
    try {
      await onDeleteRoute(routeToDelete.id);
      setRouteToDelete(undefined);
    } catch (deleteError) {
      setDeleteError(deleteError instanceof Error ? deleteError.message : String(deleteError));
    } finally {
      setDeletingId(undefined);
    }
  };

  const getAirlineName = (airlineId: string) =>
    airlines.find((airline) => airline.id === airlineId)?.name ?? "—";

  return (
    <>
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="card-title mb-0">{t.dashboard.admin.routesTitle}</h4>
          {onCreateRoute && (
            <div className="d-flex flex-wrap gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                className="d-none"
                onChange={(event) => void handleImportFile(event)}
                aria-label={t.dashboard.admin.uploadRoutesExcel}
              />
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={downloadImportTemplate}
                disabled={isImporting}
              >
                {t.dashboard.admin.downloadRoutesTemplate}
              </button>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
              >
                {isImporting
                  ? t.dashboard.admin.importingRoutes
                  : t.dashboard.admin.uploadRoutesExcel}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setCreating(true)}
                disabled={isImporting}
              >
                {t.dashboard.admin.createRoute}
              </button>
            </div>
          )}
        </div>
        <div className="card-body">
          {onCreateRoute && <p className="small text-muted">{t.dashboard.admin.excelImportHelp}</p>}
          {actionError && (
            <div className="alert alert-danger" role="alert" style={{ whiteSpace: "pre-line" }}>
              {actionError}
            </div>
          )}
          {importSuccess && (
            <div className="alert alert-success" role="status">
              {importSuccess}
            </div>
          )}
          {creating && onCreateRoute && (
            <div className="mb-4">
              <RouteForm
                airlines={airlines}
                airports={airports}
                submitLabel={t.dashboard.admin.create}
                onSubmit={onCreateRoute}
                onCancel={() => setCreating(false)}
              />
            </div>
          )}
          {routes.length === 0 ? (
            <p className="mb-0">{t.dashboard.admin.noRoutes}</p>
          ) : (
            <AdministrationTable
              headers={[
                t.dashboard.admin.code,
                t.dashboard.admin.airline,
                t.dashboard.admin.departure,
                t.dashboard.admin.arrival,
                t.dashboard.admin.distance,
                t.dashboard.admin.flightMinutes,
                t.dashboard.admin.active,
                t.dashboard.admin.actions,
              ]}
              rows={routes.map((route) => ({
                id: route.id,
                cells: [
                  route.number,
                  getAirlineName(route.airlineId),
                  route.departure,
                  route.arrival,
                  route.distance,
                  route.flightMinutes,
                  route.isActive ? t.dashboard.admin.yes : t.dashboard.admin.no,
                ],
                editContent:
                  editingId === route.id && onEditRoute ? (
                    <RouteForm
                      route={route}
                      airlines={airlines}
                      airports={airports}
                      submitLabel={t.dashboard.admin.save}
                      onSubmit={(input) => onEditRoute(route.id, input)}
                      onCancel={() => setEditingId(undefined)}
                    />
                  ) : undefined,
                actions: (
                  <div className="d-flex gap-2">
                    {onEditRoute && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setEditingId(route.id)}
                      >
                        {t.dashboard.admin.edit}
                      </button>
                    )}
                    {onDeleteRoute && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => {
                          setDeleteError("");
                          setRouteToDelete(route);
                        }}
                        disabled={deletingId === route.id}
                      >
                        {deletingId === route.id
                          ? t.dashboard.admin.saving
                          : t.dashboard.admin.delete}
                      </button>
                    )}
                  </div>
                ),
              }))}
            />
          )}
        </div>
      </div>
      <AdministrationConfirmDialog
        open={routeToDelete !== undefined}
        onOpenChange={(open) => {
          if (!open && deletingId === undefined) {
            setRouteToDelete(undefined);
            setDeleteError("");
          }
        }}
        title={t.dashboard.admin.confirmDeleteRoute}
        description={routeToDelete?.number}
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
