import { useCallback, useRef, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import MustVerifyEmail from "@/components/pages/MustVerifyEmail";
import { DashboardMain } from "@/components/pages/DashboardMain";
import DashboardProfile from "@/components/pages/DashboardProfile";
import {
  AircraftsAdministration,
  type Aircraft,
  type AircraftInput,
  type AircraftType,
} from "@/components/pages/AircraftsAdministration";
import {
  AirlinesAdministration,
  type Airline,
  type AirlineInput,
} from "@/components/pages/AirlinesAdministration";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export const DashboardPreview = () => (
  <DashboardLayout title="Panel">
    <DashboardMain />
  </DashboardLayout>
);

export const MustVerifyEmailPreview = () => <MustVerifyEmail />;

export const UserProfilePreview = () => (
  <DashboardProfile handleUpdateProfile={async () => {}} handleChangePassword={async () => {}} />
);

export const AirlinesAdministrationPreview = () => {
  const nextId = useRef(3);
  const [airlines, setAirlines] = useState<Airline[]>([
    { id: "iberia", name: "Iberia", code: "IBE", isCharter: false },
    { id: "air-europa", name: "Air Europa", code: "AEA", isCharter: true },
  ]);

  const createAirline = (input: AirlineInput) => {
    setAirlines((current) => [...current, { ...input, id: `airline-${nextId.current++}` }]);
  };
  const editAirline = (id: string, input: AirlineInput) => {
    setAirlines((current) =>
      current.map((airline) => (airline.id === id ? { ...airline, ...input } : airline)),
    );
  };
  const deleteAirline = (id: string) => {
    setAirlines((current) => current.filter((airline) => airline.id !== id));
  };

  return (
    <AirlinesAdministration
      airlines={airlines}
      onCreateAirline={createAirline}
      onEditAirline={editAirline}
      onDeleteAirline={deleteAirline}
    />
  );
};

export const AircraftsAdministrationPreview = () => {
  const nextId = useRef(4);
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([
    {
      id: "aircraft-1",
      name: "Iberia One",
      airlineId: "iberia",
      aircraftTypeId: "a320",
      registration: "EC-ABC",
    },
    {
      id: "aircraft-2",
      name: "Iberia Two",
      airlineId: "iberia",
      aircraftTypeId: "a350-900",
      registration: "EC-DEF",
    },
    {
      id: "aircraft-3",
      name: "Europa One",
      airlineId: "air-europa",
      aircraftTypeId: "b737-800",
      registration: "EC-GHI",
    },
  ]);
  const aircraftsRef = useRef(aircrafts);
  const getAircrafts = useCallback(() => aircraftsRef.current, []);
  const updateAircrafts = (update: (current: Aircraft[]) => Aircraft[]) => {
    setAircrafts((current) => {
      const next = update(current);
      aircraftsRef.current = next;
      return next;
    });
  };
  const airlines: Airline[] = [
    { id: "iberia", name: "Iberia", code: "IBE", isCharter: false },
    { id: "air-europa", name: "Air Europa", code: "AEA", isCharter: true },
  ];
  const aircraftTypes: AircraftType[] = [
    { id: "a320", name: "Airbus A320", purchasePrice: 98000000 },
    { id: "a350-900", name: "Airbus A350-900", purchasePrice: 317000000 },
    { id: "b737-800", name: "Boeing 737-800", purchasePrice: 106000000 },
    { id: "b787-9", name: "Boeing 787-9", purchasePrice: 292000000 },
  ];

  const buyAircraft = (input: AircraftInput) => {
    updateAircrafts((current) => [...current, { ...input, id: `aircraft-${nextId.current++}` }]);
  };
  const editAircraft = (id: string, input: AircraftInput) => {
    updateAircrafts((current) =>
      current.map((aircraft) => (aircraft.id === id ? { ...aircraft, ...input } : aircraft)),
    );
  };
  const sellAircraft = (id: string) => {
    updateAircrafts((current) => current.filter((aircraft) => aircraft.id !== id));
  };

  return (
    <DashboardLayout title="Aviones" crumbs={[{ label: "Administración" }, { label: "Aviones" }]}>
      <AircraftsAdministration
        airlines={airlines}
        aircraftTypes={aircraftTypes}
        getAircrafts={getAircrafts}
        onBuyAircraft={buyAircraft}
        onEditAircraft={editAircraft}
        onSellAircraft={sellAircraft}
      />
    </DashboardLayout>
  );
};
