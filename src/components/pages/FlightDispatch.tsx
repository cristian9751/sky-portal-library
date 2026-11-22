import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useAirports } from "@/lib/AirportContext";
import AutocompleteInput from "../ui/autocomplete-input";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { AirportLocation } from "../ui/ReservationMap";
import type { Aircraft, AircraftType } from "./AircraftsAdministration";
import SimbriefPlanCard from "../ui/SimbriefPlanCard";

/** Respuesta de POST /dispatch: lo necesario para pedir el plan a SimBrief. */
export type DispatchableData = {
  loader_url: string;
  ofp_id: string;
  fields: Record<string, string | number>;
};

/**
 * Plan de vuelo de SimBrief (XML convertido a JSON por el servidor).
 * Todos los valores llegan como texto y los elementos vacíos como [].
 * Los campos son opcionales: ajusta el tipo a lo que realmente devuelva tu servidor.
 */
export type SimbriefOfp = {
  general?: {
    icao_airline?: unknown;
    flight_number?: unknown;
    route?: unknown;
    initial_altitude?: unknown;
    route_distance?: unknown;
  };
  origin?: { icao_code?: unknown; plan_rwy?: unknown };
  destination?: { icao_code?: unknown; plan_rwy?: unknown };
  times?: { est_time_enroute?: unknown };
  fuel?: {
    taxi?: unknown;
    enroute_burn?: unknown;
    reserve?: unknown;
    plan_ramp?: unknown;
  };
  weights?: {
    oew?: unknown;
    payload?: unknown;
    est_zfw?: unknown;
    est_tow?: unknown;
    est_ldw?: unknown;
  };
  files?: { directory?: unknown; pdf?: { link?: unknown } };
};

export type FlightDispatchProps = {
  departure: AirportLocation;
  arrival: AirportLocation;
  aircrafts: Aircraft[];
  aircraftTypes?: AircraftType[];
  /** Aeronave preseleccionada, si la hay. */
  defaultAircraftId?: string;
  /**
   * Aeropuertos (ICAO) que se pueden elegir como alternativos.
   * Por defecto, la lista del AirportsProvider.
   */
  alternateOptions?: string[];
  /** Alternativos preseleccionados (máximo 2). */
  defaultAlternates?: string[];
  /**
   * Pide al servidor los datos firmados (primer paso). La respuesta vuelve a este
   * componente por la prop `dispatchableData`. Debe rechazar la promesa si falla.
   */
  onDispatch: (aircraftId: string, alternates: string[]) => void | Promise<void>;
  /** Datos firmados recibidos del servidor. Al llegar, se lanza la petición a SimBrief. */
  dispatchableData?: DispatchableData | null;
  /**
   * Se llama cuando se cierra el popup de SimBrief con el id del plan.
   * El padre debe pedir el plan al servidor y devolverlo por la prop `ofp`.
   */
  onFetchOfp?: (ofpId: string) => void | Promise<void>;
  /** Plan generado por SimBrief, si ya existe. */
  ofp?: SimbriefOfp | null;
  /** Tema del widget de METAR. Por defecto "dark". */
  metarTheme?: MetarTheme;
  /** Alto en px de cada iframe de METAR. Por defecto 420. */
  metarHeight?: number;
  className?: string;
  onDeleteBid?: () => void | Promise<void>;
};

type MetarTheme = "light" | "dark";

const MAX_ALTERNATES = 2;
const POPUP_NAME = "SBworker";
const POPUP_FEATURES = "width=600,height=315";
const POPUP_POLL_MS = 500;

const normalizeIcao = (value: string) => value.trim().toUpperCase();

/**
 * Valida los textos de los dos alternativos: cada uno debe estar en la lista,
 * no ser la salida ni la llegada y no repetirse. Si el primero y el segundo
 * coinciden, el segundo es el inválido.
 */
function validateAlternates(texts: string[], allowed: Set<string>) {
  const taken = new Set<string>();
  return texts.map((text) => {
    const icao = normalizeIcao(text);
    if (!icao) return { icao: "", invalid: false };
    if (!allowed.has(icao) || taken.has(icao)) return { icao: "", invalid: true };
    taken.add(icao);
    return { icao, invalid: false };
  });
}

const EARTH_RADIUS_NM = 3440.065;

/** Distancia ortodrómica en millas náuticas, solo para ajustar el zoom del mapa. */
function distanceNm(a: AirportLocation, b: AirportLocation) {
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = rad(b.Latitude - a.Latitude);
  const dLon = rad(b.Longitude - a.Longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.Latitude)) * Math.cos(rad(b.Latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_NM * Math.asin(Math.sqrt(h));
}

function zoomForDistance(nm: number) {
  if (nm < 150) return 7;
  if (nm < 400) return 6;
  if (nm < 900) return 5;
  if (nm < 2000) return 4;
  return 3;
}

/** Mapa de Windy embebido por iframe: no requiere API key ni consumir su API. */
function buildWindyUrl(departure: AirportLocation, arrival: AirportLocation) {
  const lat = ((departure.Latitude + arrival.Latitude) / 2).toFixed(3);
  const lon = ((departure.Longitude + arrival.Longitude) / 2).toFixed(3);
  const params = new URLSearchParams({
    lat,
    lon,
    detailLat: lat,
    detailLon: lon,
    zoom: String(zoomForDistance(distanceNm(departure, arrival))),
    level: "surface",
    overlay: "wind",
    product: "ecmwf",
    menu: "",
    message: "true",
    marker: "",
    calendar: "now",
    type: "map",
    location: "coordinates",
    detail: "",
    metricWind: "kt",
    metricTemp: "°C",
    radarRange: "-1",
  });
  return `https://embed.windy.com/embed2.html?${params.toString()}`;
}

/**
 * METAR vía iframe del decodificador gratuito de Rotatepilot (sin API key).
 * Requisito de su licencia: mantener visible su enlace "Powered by Rotatepilot".
 * aviationweather.gov no sirve: prohíbe el iframe (frame-ancestors) y CORS.
 * Para cambiar de proveedor, basta con modificar esta función.
 */
function buildMetarUrl(icao: string, theme: MetarTheme) {
  const params = new URLSearchParams({ theme, icao });
  return `https://rotatepilot.com/embed/metar-decoder?${params.toString()}`;
}

function AirportMetar({
  label,
  icao,
  theme,
  height,
}: {
  label: string;
  icao: string;
  theme: MetarTheme;
  height: number;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="text-xs uppercase text-muted-foreground">{label}</div>
        <CardTitle className="text-2xl">{icao}</CardTitle>
      </CardHeader>
      <CardContent>
        <iframe
          title={`METAR ${icao}`}
          src={buildMetarUrl(icao, theme)}
          loading="lazy"
          referrerPolicy="origin-when-cross-origin"
          style={{ height }}
          className="w-full max-w-full rounded-md border-0"
        />
      </CardContent>
    </Card>
  );
}


export type FlightDispatchLabels = {
  simbriefPlan: string;
  flightNumber: string;
  runwayDeparture: string;
  runwayArrival: string;
  altitude: string;
  distance: string;
  enrouteTime: string;
  fuelRamp: string;
  fuelTaxi: string;
  fuelBurn: string;
  fuelReserve: string;
  oew: string;
  payload: string;
  zfw: string;
  tow: string;
  ldw: string;
  route: string;
  openPdf: string;
  popupBlocked: string;
  waitingSimbrief: string;
  aircraft: string;
  selectAircraft: string;
  weatherMap: string;
  dispatch: string;
  alternates: string;
  alternate: string;
  alternatesHint: string;
  invalidAlternate: string;
  deleteBid: string;
  deleteBidConfirm: string;
  deleteBidConfirmAction: string;
  deleteBidCancel: string;
  deletingBid: string;
  deleteBidFailed: string;
};


export default function FlightDispatch({
  departure,
  arrival,
  onDeleteBid,
  aircrafts,
  aircraftTypes = [],
  defaultAircraftId,
  alternateOptions,
  defaultAlternates = [],
  onDispatch,
  dispatchableData,
  onFetchOfp,
  ofp,
  metarTheme = "dark",
  metarHeight = 420,
  className,
}: FlightDispatchProps) {
  const { t } = useI18n();
  const labels = t.dashboard.flightDispatch as FlightDispatchLabels;
  const [aircraftId, setAircraftId] = useState(defaultAircraftId ?? "");
  const [dispatching, setDispatching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alternateTexts, setAlternateTexts] = useState<string[]>(() =>
    Array.from({ length: MAX_ALTERNATES }, (_, i) => defaultAlternates[i] ?? ""),
  );
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const handleDeleteBid = async () => {
  if (!onDeleteBid || deleting || dispatching) return;
  setDeleteError(null);
  setDeleting(true);
  try {
    await onDeleteBid();
  } catch {
    setDeleteError(labels.deleteBidFailed);
  } finally {
    setDeleting(false);
    setConfirmingDelete(false);
  }
};

  /** Popup de SimBrief, abierto de forma síncrona con el click para que no lo bloquee el navegador. */
  const popupRef = useRef<Window | null>(null);
  const pollRef = useRef<number | null>(null);
  /** ofp_id ya enviado a SimBrief y pendiente de recoger al cerrarse el popup. */
  const pendingOfpId = useRef<string | null>(null);
  /** Último ofp_id procesado, para no reenviar el mismo formulario en un re-render. */
  const handledOfpId = useRef<string | null>(null);
  /** Siempre apunta al callback actual, sin reiniciar el intervalo. */
  const onFetchOfpRef = useRef(onFetchOfp);
  onFetchOfpRef.current = onFetchOfp;

  const airports = useAirports();
  const candidateIcaos = useMemo(
    () => Array.from(new Set((alternateOptions ?? airports).map(normalizeIcao).filter(Boolean))),
    [alternateOptions, airports],
  );

  const allowedAlternates = useMemo(() => {
    const excluded = new Set([normalizeIcao(departure.icao), normalizeIcao(arrival.icao)]);
    return new Set(candidateIcaos.filter((icao) => !excluded.has(icao)));
  }, [candidateIcaos, departure.icao, arrival.icao]);

  const alternateState = useMemo(
    () => validateAlternates(alternateTexts, allowedAlternates),
    [alternateTexts, allowedAlternates],
  );
  const selectedAlternates = alternateState.map((a) => a.icao).filter(Boolean);
  const hasInvalidAlternate = alternateState.some((a) => a.invalid);

  const handleAlternateChange = (index: number, value: string) => {
    const next = alternateTexts.map((text, i) => (i === index ? normalizeIcao(value) : text));
    setAlternateTexts(next);
  };

  /** Opciones del desplegable de cada hueco: sin salida, llegada ni el otro alternativo. */
  const optionsFor = (index: number) => {
    const other = alternateState[index === 0 ? 1 : 0]?.icao;
    return Array.from(allowedAlternates).filter((icao) => icao !== other);
  };

  const typeNames = useMemo(
    () => new Map(aircraftTypes.map((type) => [type.id, type.name])),
    [aircraftTypes],
  );

  const windyUrl = useMemo(() => buildWindyUrl(departure, arrival), [departure, arrival]);

  const handleAircraftChange = (value: string) => {
    setAircraftId(value);
  };

  const stopWatching = useCallback(() => {
    if (pollRef.current !== null) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const closePopup = useCallback(() => {
    stopWatching();
    popupRef.current?.close();
    popupRef.current = null;
    pendingOfpId.current = null;
  }, [stopWatching]);

  /** Vigila el popup: al cerrarse, recoge el plan (si se llegó a enviar el formulario). */
  const startWatching = useCallback(() => {
    stopWatching();
    pollRef.current = window.setInterval(() => {
      if (!popupRef.current?.closed) return;

      stopWatching();
      popupRef.current = null;
      const ofpId = pendingOfpId.current;
      pendingOfpId.current = null;

      if (!ofpId) {
        setDispatching(false);
        return;
      }
      Promise.resolve(onFetchOfpRef.current?.(ofpId)).finally(() => setDispatching(false));
    }, POPUP_POLL_MS);
  }, [stopWatching]);

  /** Paso 2: envía a SimBrief, dentro del popup, los datos firmados por el servidor. */
  const dispatch = useCallback((data: DispatchableData) => {
    const popup = popupRef.current;
    if (!popup || popup.closed) {
      setDispatching(false);
      return;
    }

    const form = document.createElement("form");
    form.method = "GET";
    form.action = data.loader_url;
    form.target = POPUP_NAME;

    for (const [name, value] of Object.entries(data.fields)) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = String(value);
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
    form.remove();

    pendingOfpId.current = data.ofp_id;
  }, []);

  // Cuando el servidor devuelve los datos firmados, se lanza la petición a SimBrief.
  useEffect(() => {
    if (!dispatchableData || handledOfpId.current === dispatchableData.ofp_id) return;
    handledOfpId.current = dispatchableData.ofp_id;
    dispatch(dispatchableData);
  }, [dispatchableData, dispatch]);

  // Al desmontar, se limpia el intervalo y se cierra el popup.
  useEffect(() => closePopup, [closePopup]);

  /** Paso 1: abre el popup (síncrono con el click) y pide los datos firmados. */
  const handleDispatch = async () => {
    if (!aircraftId || dispatching || hasInvalidAlternate) return;
    setError(null);

    const popup = window.open("about:blank", POPUP_NAME, POPUP_FEATURES);
    if (!popup) {
      setError(labels.popupBlocked);
      return;
    }
    popupRef.current = popup;
    setDispatching(true);
    startWatching();

    try {
      await onDispatch(aircraftId, selectedAlternates);
    } catch {
      closePopup();
      setDispatching(false);
    }
  };

  return (
    <div className={`grid gap-4 ${className ?? ""}`}>
      <div className="grid gap-4 md:grid-cols-2">
        <AirportMetar
          label={t.dashboard.admin.departure}
          icao={departure.icao}
          theme={metarTheme}
          height={metarHeight}
        />
        <AirportMetar
          label={t.dashboard.admin.arrival}
          icao={arrival.icao}
          theme={metarTheme}
          height={metarHeight}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{labels.weatherMap}</CardTitle>
        </CardHeader>
        <CardContent>
          <iframe
            title="Windy"
            src={windyUrl}
            loading="lazy"
            className="h-[420px] w-full rounded-md border-0"
          />
        </CardContent>
      </Card>

      

      {!ofp && (
        <>
        <Card>
        <CardHeader>
          <CardTitle>{labels.alternates}</CardTitle>
          <p className="text-sm text-muted-foreground">{labels.alternatesHint}</p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {alternateState.map((alternate, index) => (
            <div key={index} className="min-w-0 space-y-1.5">
              <label className="text-sm font-medium" htmlFor={`dispatch-alternate-${index}`}>
                {labels.alternate} {index + 1}
              </label>
              <AutocompleteInput
                id={`dispatch-alternate-${index}`}
                value={alternateTexts[index]}
                onChange={(value) => handleAlternateChange(index, value)}
                options={optionsFor(index)}
                placeholder="ICAO"
                maxLength={4}
                aria-invalid={alternate.invalid}
              />
              {alternate.invalid && (
                <p className="text-sm text-destructive">{labels.invalidAlternate}</p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
          <CardHeader>
            <CardTitle>{labels.aircraft}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="min-w-0 flex-1">
              <Select value={aircraftId} onValueChange={handleAircraftChange}>
                <SelectTrigger>
                  <SelectValue placeholder={labels.selectAircraft} />
                </SelectTrigger>
                <SelectContent>
                  {aircrafts.length === 0 ? (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      {t.dashboard.admin.noAircrafts}
                    </div>
                  ) : (
                    aircrafts.map((aircraft) => {
                      const typeName = typeNames.get(aircraft.aircraftTypeId);
                      return (
                        <SelectItem key={aircraft.id} value={aircraft.id}>
                          {aircraft.registration}
                          {typeName ? ` · ${typeName}` : ""}
                        </SelectItem>
                      );
                    })
                  )}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleDispatch}
              disabled={!aircraftId || dispatching || hasInvalidAlternate}
            >
              {dispatching ? labels.waitingSimbrief : labels.dispatch}
            </Button>
          </CardContent>
          {error && (
            <CardContent className="pt-0">
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          )}
        </Card>
        </>
        
      )}

      {ofp && <SimbriefPlanCard ofp={ofp} />}
      {onDeleteBid && (
  <Card>
    <CardContent className="flex flex-col gap-3 pt-6 md:flex-row md:items-center md:justify-between">
      {confirmingDelete ? (
        <>
          <p className="text-sm">{labels.deleteBidConfirm}</p>
          <div className="flex gap-2">
            <Button variant="destructive" onClick={handleDeleteBid} disabled={deleting}>
              {deleting ? labels.deletingBid : labels.deleteBidConfirmAction}
            </Button>
            <Button
              variant="outline"
              onClick={() => setConfirmingDelete(false)}
              disabled={deleting}
            >
              {labels.deleteBidCancel}
            </Button>
          </div>
        </>
      ) : (
        <Button
          variant="destructive"
          onClick={() => setConfirmingDelete(true)}
          disabled={dispatching}
        >
          {labels.deleteBid}
        </Button>
      )}
      {deleteError && <p className="text-sm text-destructive">{deleteError}</p>}
    </CardContent>
  </Card>
)}
    </div>
  );
}