import L from "leaflet";
import { useMemo, useState } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import MapResizeHandler from "./MapResizeHandler";
import { leafletMarkerIcons, osmTileUrl } from "@/lib/assets";

export type AirportLocation = {
    Latitude : number,
    Longitude : number,
    icao: string,
}

 type ReservationMapProps = {
    currentLocation: AirportLocation;
    destinations : AirportLocation[];
    onSelectedDestination: (destination: AirportLocation) => void;
    selectedDestination?: AirportLocation
    className?: string
}

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({ ...leafletMarkerIcons });

const MAX_VISIBLE = 150;  // máximo de pines a la vez; por encima se reduce por rejilla
const CELL_PX = 40;       // separación mínima aproximada entre pines al reducir

type VisibleDestinationsProps = {
    destinations: AirportLocation[];
    selected: AirportLocation | null;
    onSelect: (d: AirportLocation) => void;
};

function VisibleDestinations({ destinations, selected, onSelect }: VisibleDestinationsProps) {
    const map = useMap();
    const [view, setView] = useState({ bounds: map.getBounds(), zoom: map.getZoom() });

    useMapEvents({
        moveend: () => setView({ bounds: map.getBounds(), zoom: map.getZoom() }),
    });

    const visible = useMemo(() => {
        const bounds = view.bounds.pad(0.25);
        const inView = destinations.filter((d) => bounds.contains([d.Latitude, d.Longitude]));
        if (inView.length <= MAX_VISIBLE) return inView;

        const cellDeg = (360 / Math.pow(2, view.zoom)) * (CELL_PX / 256);
        const seen = new Set<string>();
        const thinned: AirportLocation[] = [];
        for (const d of inView) {
            const key = `${Math.floor(d.Latitude / cellDeg)},${Math.floor(d.Longitude / cellDeg)}`;
            if (seen.has(key)) continue;
            seen.add(key);
            thinned.push(d);
        }
        return thinned;
    }, [destinations, view]);

    const toRender = useMemo(() => {
        if (selected && !visible.some((d) => d.icao === selected.icao)) return [...visible, selected];
        return visible;
    }, [visible, selected]);

    return (
        <>
            {toRender.map((dest) => (
                <Marker
                    key={dest.icao}
                    position={[dest.Latitude, dest.Longitude]}
                    eventHandlers={{
                        click: () => onSelect(dest),
                        mouseover: (event) => event.target.openPopup(),
                        mouseout: (event) => event.target.closePopup(),
                    }}
                >
                    <Popup>{dest.icao}</Popup>
                </Marker>
            ))}
        </>
    );
}

export default function ReservationMap(props : ReservationMapProps) {
    const currentLocationIcon = L.divIcon({
        html: `<i class="bi bi-house-fill"
              style="font-size: 28px; color: #0d6efd; line-height: 1;
                     display: flex; align-items: center; justify-content: center;
                     width: 100%; height: 100%;"></i>`,
        iconSize: [8, 8],
        iconAnchor: [4, 4],
    });


    const destination = props.selectedDestination ?? null;
   return (
    <MapContainer className={props.className} center={[destination?.Latitude ?? props.currentLocation.Latitude, destination?.Longitude ?? props.currentLocation.Longitude]} zoom={13} scrollWheelZoom={true}>
        <MapResizeHandler/>
        <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={osmTileUrl}
        />
        {destination && (
            <Polyline positions={[
                [props.currentLocation.Latitude, props.currentLocation.Longitude],
                [destination.Latitude, destination.Longitude]
            ]}/>
        )}
        <Marker icon={currentLocationIcon} position={[props.currentLocation.Latitude, props.currentLocation.Longitude]}>
        </Marker>
        <VisibleDestinations
            destinations={props.destinations}
            selected={destination}
            onSelect={async (dest) => {
                await props.onSelectedDestination(dest)
                props.onSelectedDestination(dest)
            }}
        />
    </MapContainer>
   )
}