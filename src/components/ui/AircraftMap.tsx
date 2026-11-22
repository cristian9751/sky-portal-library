import L from "leaflet";
import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import MapResizeHandler from "./MapResizeHandler";
import { osmTileUrl } from "@/lib/assets";

export type Aircraft = {
    id: string;
    Latitude: number;
    Longitude: number;
    /** Rumbo en grados: 0 = norte, 90 = este, 180 = sur, 270 = oeste */
    heading: number;
    /** Texto del popup (callsign, ruta...). Si no se pasa se usa el id */
    label?: string;
};

type AircraftMapProps = {
    aircraft: Aircraft[];
    /** id del avión destacado */
    highlightedId?: string | null;
    onSelectAircraft?: (aircraft: Aircraft) => void;
    /** Si es true, el mapa sigue al avión destacado cuando se mueve */
    followHighlighted?: boolean;
    defaultCenter?: [number, number];
    defaultZoom?: number;
    className?: string;
};

const COLOR_NORMAL = "#0d6efd";
const COLOR_HIGHLIGHT = "#dc3545";

// Icono de avión apuntando hacia arriba (norte); se rota con CSS según el rumbo
const PLANE_PATH =
    "M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z";

const iconCache = new Map<string, L.DivIcon>();

function getPlaneIcon(heading: number, highlighted: boolean): L.DivIcon {
    const rounded = Math.round((((heading % 360) + 360) % 360)); // normaliza a 0-359
    const key = `${rounded}-${highlighted}`;
    const cached = iconCache.get(key);
    if (cached) return cached;

    const size = highlighted ? 40 : 26;
    const color = highlighted ? COLOR_HIGHLIGHT : COLOR_NORMAL;
    const ring = highlighted
        ? `<div style="position:absolute;inset:-6px;border-radius:50%;
                       border:2px solid ${color};opacity:.6;"></div>`
        : "";

    const icon = L.divIcon({
        className: "", // evita el estilo por defecto de divIcon (fondo blanco/borde)
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2],
        html: `
            <div style="position:relative;width:${size}px;height:${size}px;">
                ${ring}
                <svg viewBox="0 0 24 24" width="${size}" height="${size}"
                     style="transform:rotate(${rounded}deg);transform-origin:50% 50%;
                            filter:drop-shadow(0 1px 2px rgba(0,0,0,.6));">
                    <path d="${PLANE_PATH}" fill="${color}" stroke="#fff" stroke-width="0.8"/>
                </svg>
            </div>`,
    });
    iconCache.set(key, icon);
    return icon;
}

function FollowAircraft({ target }: { target: Aircraft | null }) {
    const map = useMap();
    useEffect(() => {
        if (target) map.panTo([target.Latitude, target.Longitude], { animate: true });
    }, [map, target?.Latitude, target?.Longitude]); // eslint-disable-line react-hooks/exhaustive-deps
    return null;
}

export default function AircraftMap({
    aircraft,
    highlightedId = null,
    onSelectAircraft,
    followHighlighted = false,
    defaultCenter = [40.4168, -3.7038],
    defaultZoom = 6,
    className,
}: AircraftMapProps) {
    const highlighted = useMemo(
        () => aircraft.find((a) => a.id === highlightedId) ?? null,
        [aircraft, highlightedId]
    );

    const firstAircraft = aircraft[0];
    const initialCenter: [number, number] = highlighted
        ? [highlighted.Latitude, highlighted.Longitude]
        : firstAircraft
            ? [firstAircraft.Latitude, firstAircraft.Longitude]
            : defaultCenter;

    return (
        <MapContainer
            className={className}
            center={initialCenter}
            zoom={defaultZoom}
            scrollWheelZoom={true}
        >
            <MapResizeHandler />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url={osmTileUrl}
            />

            {aircraft.map((a) => {
                const isHighlighted = a.id === highlightedId;
                return (
                    <Marker
                        key={a.id}
                        position={[a.Latitude, a.Longitude]}
                        icon={getPlaneIcon(a.heading, isHighlighted)}
                        zIndexOffset={isHighlighted ? 1000 : 0} // el destacado siempre encima
                        eventHandlers={{
                            click: () => onSelectAircraft?.(a),
                            mouseover: (e) => e.target.openPopup(),
                            mouseout: (e) => e.target.closePopup(),
                        }}
                    >
                        <Popup>{a.label ?? a.id}</Popup>
                    </Marker>
                );
            })}

            {followHighlighted && <FollowAircraft target={highlighted} />}
        </MapContainer>
    );
}