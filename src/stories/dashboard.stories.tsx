import { useCallback, useEffect, useRef, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import MustVerifyEmail from "@/components/pages/MustVerifyEmail";
import {
  DashboardMain,
  type DashboardEvent,
  type DashboardFlight,
} from "@/components/pages/DashboardMain";
import DashboardProfile from "@/components/pages/DashboardProfile";
import {
  DashboardAircraftsAdministration as AircraftsAdministration,
  type Aircraft,
  type AircraftInput,
  type AircraftType,
} from "@/components/pages/AircraftsAdministration";
import {
  DashboardAirlinesAdministration as AirlinesAdministration,
  type Airline,
  type AirlineInput,
} from "@/components/pages/AirlinesAdministration";
import {
  DashboardRoutesAdministration as RoutesAdministration,
  type AirlineRoute,
  type AirlineRouteInput,
} from "@/components/pages/RoutesAdministration";
import {
  DashboardUsersAdministration as UsersAdministration,
  type AdministrationUser,
} from "@/components/pages/UsersAdministration";
import ApplicationContextProvider, { useApplicationContext } from "@/lib/ApplicationContext";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const dashboardFlights: DashboardFlight[] = [
  {
    id: "flight-ibe204",
    flightNumber: "IBE204",
    aircraft: "Airbus A320",
    origin: "LEMD",
    destination: "LEBL",
  },
  {
    id: "flight-ibe512",
    flightNumber: "IBE512",
    aircraft: "Airbus A350-900",
    origin: "LEMD",
    destination: "GCTS",
  },
  {
    id: "flight-ibe731",
    flightNumber: "IBE731",
    aircraft: "Airbus A320neo",
    origin: "LEBL",
    destination: "LEMD",
  },
];

const dashboardEvents: DashboardEvent[] = [
  {
    id: "event-canarias",
    name: "Tour por las Islas Canarias",
    description:
      "Acompáñanos en un recorrido especial por el archipiélago, con salidas desde Madrid y escalas en las principales islas.",
    imageUrl:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Vista desde la ventanilla de un avión sobre las nubes",
  },
  {
    id: "event-barcelona",
    name: "Encuentro de pilotos en Barcelona",
    description:
      "Conecta con otros pilotos de la comunidad y participa en un vuelo grupal con destino a Barcelona-El Prat.",
    imageUrl:
      "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Vista aérea de Barcelona",
  },
];

export const DashboardPreview = () => (
  <DashboardLayout title="Panel">
    <DashboardMain
      recentFlights={dashboardFlights}
      events={dashboardEvents}
      onFlightDetails={(flightId) => {}}
    />
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
    <DashboardLayout
      title="Aerolíneas"
      crumbs={[{ label: "Administración" }, { label: "Aerolíneas" }]}
    >
      <AirlinesAdministration
        airlines={airlines}
        onCreateAirline={createAirline}
        onEditAirline={editAirline}
        onDeleteAirline={deleteAirline}
      />
    </DashboardLayout>
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
  const editAircraft = (aircraft: Aircraft) => {
    updateAircrafts((current) =>
      current.map((currentAircraft) =>
        currentAircraft.id === aircraft.id ? aircraft : currentAircraft,
      ),
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

export const RoutesAdministrationPreview = () => {
  const nextId = useRef(3);
  const [routes, setRoutes] = useState<AirlineRoute[]>([
    {
      id: "route-1",
      airlineId: "iberia",
      departure: "LEMD",
      arrival: "LEBL",
      number: "IBE204",
      distance: 484,
      flightMinutes: 75,
      isActive: true,
    },
    {
      id: "route-2",
      airlineId: "air-europa",
      departure: "LEMD",
      arrival: "LEMG",
      number: "AEA510",
      distance: 431,
      flightMinutes: 70,
      isActive: true,
    },
  ]);
  const airlines: Airline[] = [
    { id: "iberia", name: "Iberia", code: "IBE", isCharter: false },
    { id: "air-europa", name: "Air Europa", code: "AEA", isCharter: true },
  ];

  const createRoute = (input: AirlineRouteInput) => {
    setRoutes((current) => [...current, { ...input, id: `route-${nextId.current++}` }]);
  };
  const editRoute = (id: string, input: AirlineRouteInput) => {
    setRoutes((current) =>
      current.map((route) => (route.id === id ? { ...route, ...input } : route)),
    );
  };
  const deleteRoute = (id: string) => {
    setRoutes((current) => current.filter((route) => route.id !== id));
  };

  return (
    <DashboardLayout title="Rutas" crumbs={[{ label: "Administración" }, { label: "Rutas" }]}>
      <RoutesAdministration
        routes={routes}
        airlines={airlines}
        onCreateRoute={createRoute}
        onEditRoute={editRoute}
        onDeleteRoute={deleteRoute}
      />
    </DashboardLayout>
  );
};

const administrationUsers: AdministrationUser[] = [
  {
    id: "pilot-1",
    name: "Alex García",
    email: "alex.garcia@example.com",
    permissions: ["manage.airlines.edit.iberia", "manage.routes.create.air-europa"],
  },
  {
    id: "pilot-2",
    name: "Lucía Martín",
    email: "lucia.martin@example.com",
    permissions: ["manage.aircrafts.buy.iberia"],
  },
];

const UsersAdministrationPreviewContent = () => {
  const { setUser } = useApplicationContext();
  const [users, setUsers] = useState(administrationUsers);

  useEffect(() => {
    setUser({
      name: "Sky Portal Administrator",
      email: "admin@example.com",
      permissions: ["manage.users.permissions.*"],
      profileLink: { onClick: () => {} },
    });
  }, [setUser]);

  const updatePermissions = (userId: string, permissions: string[]) => {
    setUsers((current) =>
      current.map((user) => (user.id === userId ? { ...user, permissions } : user)),
    );
  };

  return (
    <DashboardLayout title="Usuarios" crumbs={[{ label: "Administración" }, { label: "Usuarios" }]}>
      <UsersAdministration
        users={users}
        airlines={[
          { id: "iberia", name: "Iberia", code: "IBE", isCharter: false },
          { id: "air-europa", name: "Air Europa", code: "AEA", isCharter: true },
        ]}
        onUpdateUserPermissions={updatePermissions}
      />
    </DashboardLayout>
  );
};

export const UsersAdministrationPreview = () => (
  <ApplicationContextProvider>
    <UsersAdministrationPreviewContent />
  </ApplicationContextProvider>
);
