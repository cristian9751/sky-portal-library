import FlightDispatch from "@/components/pages/FlightDispatch";
import type { Aircraft, AircraftType } from "@/components/pages/AircraftsAdministration";
import type { AirportLocation } from "@/components/ui/ReservationMap";

const departure: AirportLocation = { icao: "LEVC", Latitude: 39.4893, Longitude: -0.4816 };
const arrival: AirportLocation = { icao: "LEBL", Latitude: 41.2974, Longitude: 2.0833 };

const aircraftTypes: AircraftType[] = [
  { id: "t1", name: "A21N", purchasePrice: 95000000 },
  { id: "t2", name: "B738", purchasePrice: 80000000 },
];

const aircrafts: Aircraft[] = [
  {
    id: "1",
    name: "Ciudad de Valencia",
    airlineId: "a1",
    aircraftTypeId: "t1",
    registration: "EC-BQS",
  },
  {
    id: "2",
    name: "Ciudad de Barcelona",
    airlineId: "a1",
    aircraftTypeId: "t1",
    registration: "EC-NXA",
  },
  {
    id: "3",
    name: "Ciudad de Madrid",
    airlineId: "a1",
    aircraftTypeId: "t2",
    registration: "EC-MJK",
  },
];

export const FlightDispatchPreview = () => (
  <FlightDispatch
    departure={departure}
    arrival={arrival}
    aircrafts={aircrafts}
    aircraftTypes={aircraftTypes}
    defaultAircraftId="1"
    onDispatch={async (id) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log("dispatched with aircraft", id);
    }}
  />
);

export const FlightDispatchNoAircraftSelected = () => (
  <FlightDispatch
    departure={departure}
    arrival={arrival}
    aircrafts={aircrafts}
    aircraftTypes={aircraftTypes}
    onDispatch={(id) => console.log("dispatched with aircraft", id)}
  />
);