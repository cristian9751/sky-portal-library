import AircraftMap, { MapAircraft } from '@/components/ui/AircraftMap';
import ReservationMap from '@/components/ui/ReservationMap';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { osmTileUrl } from '@/lib/assets';

export const mapTestPreview = () => (
  <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url={osmTileUrl}
    />
    <Marker position={[51.505, -0.09]}>
      <Popup>
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
    </Marker>
  </MapContainer>
);
export const ReservationMapPreview = () => {
  const currentLocation = {
    Latitude: 40.4168,
    Longitude: -3.7038,
    icao: "Madrid"
  };
  const destinations = [
    {
      Latitude: 48.8566,
      Longitude: 2.3522,
      icao: "LFPG"
    },
    {
      Latitude: 51.5074,
      Longitude: -0.1278,
      icao: "EGGL"
    }
  ];
  return (
    <ReservationMap currentLocation={currentLocation} destinations={destinations} onSelectedDestination={(destination) => alert(`Clicked on ${destination.icao}`)} />
  );
}
const MOCK_AIRCRAFT: MapAircraft[] = [
    { id: "IBE3201", Latitude: 40.4168, Longitude: -3.7038, heading: 45, label: "IBE3201 · MAD → CDG" },
    { id: "AFR1301", Latitude: 48.8566, Longitude: 2.3522, heading: 200, label: "AFR1301 · CDG → MAD" },
    { id: "BAW459", Latitude: 51.5074, Longitude: -0.1278, heading: 135, label: "BAW459 · LHR → BCN" },
    { id: "VLG8012", Latitude: 41.3874, Longitude: 2.1686, heading: 315, label: "VLG8012 · BCN → LHR" },
    { id: "XSN001", Latitude: 45.0, Longitude: -1.5, heading: 270, label: "XSN001 · Virtual" },
];
const STEP_DEG = 0.02;
function advance(a: MapAircraft): MapAircraft {
    const rad = (a.heading * Math.PI) / 180;
    return {
        ...a,
        Latitude: a.Latitude + Math.cos(rad) * STEP_DEG,
        Longitude: a.Longitude + (Math.sin(rad) * STEP_DEG) / Math.cos((a.Latitude * Math.PI) / 180),
    };
}
export const AircraftMapPreview = () => {
    const [aircraft, setAircraft] = useState<MapAircraft[]>(MOCK_AIRCRAFT);
    const [highlightedId, setHighlightedId] = useState<string | null>("IBE3201");

    useEffect(() => {
        const timer = setInterval(() => setAircraft((prev) => prev.map(advance)), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div style={{ height: 600 }}>
            <AircraftMap
                className="h-100"
                aircraft={aircraft}
                highlightedId={highlightedId}
                onSelectAircraft={(a) => setHighlightedId(a.id)}
                followHighlighted
                defaultCenter={[45, 0]}
                defaultZoom={5}
            />
        </div>
    );
};
