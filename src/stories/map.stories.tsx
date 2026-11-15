import ReservationMap from '@/components/ui/ReservationMap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export const mapTestPreview = () => (
  <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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