import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useAirports } from "@/lib/AirportContext";
import AutocompleteInput from "../ui/autocomplete-input";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { AirportLocation } from "../ui/ReservationMap";
import type { Aircraft, AircraftType } from "./AircraftsAdministration";

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
  /** Se llama al pulsar Dispatch con la aeronave y los alternativos elegidos (0 a 2). */
  onDispatch: (aircraftId: string, alternates: string[]) => void | Promise<void>;
  /** Tema del widget de METAR. Por defecto "dark". */
  metarTheme?: MetarTheme;
  /** Alto en px de cada iframe de METAR. Por defecto 420. */
  metarHeight?: number;
  className?: string;
};

type MetarTheme = "light" | "dark";

const MAX_ALTERNATES = 2;

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

export default function FlightDispatch({
  departure,
  arrival,
  aircrafts,
  aircraftTypes = [],
  defaultAircraftId,
  alternateOptions,
  defaultAlternates = [],
  onDispatch,
  metarTheme = "dark",
  metarHeight = 420,
  className,
}: FlightDispatchProps) {
  const { t } = useI18n();
  const labels = t.dashboard.flightDispatch;
  const [aircraftId, setAircraftId] = useState(defaultAircraftId ?? "");
  const [dispatching, setDispatching] = useState(false);
  const [alternateTexts, setAlternateTexts] = useState<string[]>(() =>
    Array.from({ length: MAX_ALTERNATES }, (_, i) => defaultAlternates[i] ?? ""),
  );

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

  const handleDispatch = async () => {
    if (!aircraftId || dispatching || hasInvalidAlternate) return;
    setDispatching(true);
    try {
      await onDispatch(aircraftId, selectedAlternates);
    } finally {
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
            {labels.dispatch}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}