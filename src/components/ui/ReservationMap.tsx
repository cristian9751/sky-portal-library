import L, { icon, Icon } from "leaflet";
import { useState } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMapEvents } from "react-leaflet";

export type Location = {
    Latitude : number,
    Longitude : number,
    name: string,
}

 type ReservationMapProps = {
    currentLocation: Location;
    destinations : Location[];
    onSelectedDestination: (destination: Location) => Promise<void>;

}


export default function ReservationMap(props : ReservationMapProps) {
    const currentLocationIcon = L.divIcon({
        html: `<i class="bi bi-house-fill"
              style="font-size: 28px; color: #0d6efd; line-height: 1;
                     display: flex; align-items: center; justify-content: center;
                     width: 100%; height: 100%;"></i>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
    });

    const [destination, setDestination] = useState<Location | null>(null)
   return (
    <MapContainer center={[destination?.Latitude ?? props.currentLocation.Latitude, destination?.Longitude ?? props.currentLocation.Longitude]} zoom={13} scrollWheelZoom={true}>
        <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {destination && (
            <Polyline positions={[
                [props.currentLocation.Latitude, props.currentLocation.Longitude],
                [destination.Latitude, destination.Longitude]
            ]}/>
        )}
        <Marker icon={currentLocationIcon} position={[props.currentLocation.Latitude, props.currentLocation.Longitude]}>
        </Marker>
        {props.destinations.map((destination, index) => (
            <Marker
             key={index} 
             position={[destination.Latitude, destination.Longitude]}
             eventHandlers={{
                click: async () => {
                    await props.onSelectedDestination(destination)
                    setDestination(destination)
                }
             }}
             >
            </Marker>
        ))}
    </MapContainer>
   )
}