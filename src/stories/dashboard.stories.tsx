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
  type AircraftType,
} from "@/components/pages/AircraftsAdministration";
import {
  DashboardAirlinesAdministration as AirlinesAdministration,
  type Airline,
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
import {
  DashboardRolesAdministration as RolesAdministration,
  type AdministrationRole,
} from "@/components/pages/RolesAdministration";
import { ADMINISTRATION_PERMISSIONS } from "@/lib/administration-permissions";
import { demoImages } from "@/lib/assets";
import ApplicationContextProvider, { useApplicationContext } from "@/lib/ApplicationContext";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import RouteReservation, { RouteReservationProps } from "@/components/pages/RouteReservation";
import { AirportLocation } from "@/components/ui/ReservationMap";
import AirlineSelectPage from "@/components/pages/AirlineSelector";

import HubSelector from "@/components/ui/hubSelector";

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
      demoImages.airplaneWindow,
    imageAlt: "Vista desde la ventanilla de un avión sobre las nubes",
  },
  {
    id: "event-barcelona",
    name: "Encuentro de pilotos en Barcelona",
    description:
      "Conecta con otros pilotos de la comunidad y participa en un vuelo grupal con destino a Barcelona-El Prat.",
    imageUrl:
      demoImages.barcelonaAerial,
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

  const createAirline = (input: Airline) => {
    setAirlines((current) => [...current, { ...input, id: `airline-${nextId.current++}` }]);
  };
  const editAirline = (id: string, input: Airline) => {
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

  const buyAircraft = (input: Aircraft) => {
    updateAircrafts((current) => [...current, { ...input, id: `aircraft-${nextId.current++}` }]);
  };
  const editAircraft = (aircraft: Aircraft) => {
    updateAircrafts((current) =>
      current.map((currentAircraft) =>
        currentAircraft.id === aircraft.id ? aircraft : currentAircraft,
      ),
    );
  };
  const sellAircraft = (aircraft : Aircraft) => {
    updateAircrafts((current) => current.filter((a) => aircraft !== a));
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

export const RolesAdministrationPreview = () => {
  const airlines: Airline[] = [
    { id: "iberia", name: "Iberia", code: "IBE", isCharter: false },
    { id: "air-europa", name: "Air Europa", code: "AEA", isCharter: true },
  ];
  const [roles, setRoles] = useState<AdministrationRole[]>([
    {
      id: "flight-operations",
      name: "Flight Operations",
      permissions: [
        `${ADMINISTRATION_PERMISSIONS.airlineEdit}.iberia`,
        `${ADMINISTRATION_PERMISSIONS.aircraftBuy}.iberia`,
        `${ADMINISTRATION_PERMISSIONS.routeCreate}.iberia`,
      ],
    },
    {
      id: "route-manager",
      name: "Route Manager",
      permissions: [
        `${ADMINISTRATION_PERMISSIONS.routeCreate}.air-europa`,
        `${ADMINISTRATION_PERMISSIONS.routeEdit}.air-europa`,
      ],
    },
  ]);
  const nextId = useRef(1);

  const createRole = (role: Omit<AdministrationRole, "id">) => {
    setRoles((current) => [...current, { ...role, id: `role-${nextId.current++}` }]);
  };
  const editRole = (id: string, role: Omit<AdministrationRole, "id">) => {
    setRoles((current) =>
      current.map((existing) => (existing.id === id ? { ...existing, ...role } : existing)),
    );
  };
  const deleteRole = (id: string) => {
    setRoles((current) => current.filter((role) => role.id !== id));
  };

  return (
    <DashboardLayout title="Roles" crumbs={[{ label: "Administración" }, { label: "Roles" }]}>
      <RolesAdministration
        roles={roles}
        airlines={airlines}
        onCreateRole={createRole}
        onEditRole={editRole}
        onDeleteRole={deleteRole}
      />
    </DashboardLayout>
  );
};

// ---------- ROUTE RESERVATION (MOCKS) ----------
const MOCK_AIRPORTS = {
  LEVC: { icao: "LEVC", Latitude: 39.4893, Longitude: -0.4816 },
  LEMD: { icao: "LEMD", Latitude: 40.4719, Longitude: -3.5626 },
  LEBL: { icao: "LEBL", Latitude: 41.2974, Longitude: 2.0833 },
  LEPA: { icao: "LEPA", Latitude: 39.5517, Longitude: 2.7388 },
  LEAL: { icao: "LEAL", Latitude: 38.2822, Longitude: -0.5582 },
  LEZL: { icao: "LEZL", Latitude: 37.418, Longitude: -5.8931 },
} satisfies Record<string, AirportLocation>;

type MockIcao = keyof typeof MOCK_AIRPORTS;

// Rutas disponibles por origen
const MOCK_ROUTES: Record<MockIcao, MockIcao[]> = {
  LEVC: ["LEMD", "LEBL", "LEPA", "LEZL"],
  LEMD: ["LEVC", "LEBL", "LEPA", "LEAL"],
  LEBL: ["LEVC", "LEMD", "LEPA"],
  LEPA: ["LEVC", "LEMD", "LEBL"],
  LEAL: ["LEMD"],
  LEZL: ["LEVC"],
};

const isMockIcao = (icao: string): icao is MockIcao => icao in MOCK_AIRPORTS;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockFetchDestinations: RouteReservationProps["fetchDestinations"] = async (icao) => {
  await delay(400);
  if (!isMockIcao(icao)) return [];
  return MOCK_ROUTES[icao].map((code) => MOCK_AIRPORTS[code]);
};


export const DashboardRouteReservationMock = () => {
  return (
    <DashboardLayout fullSize={true}>
      <RouteReservation
      defaultDeparture={MOCK_AIRPORTS.LEVC}
      fetchDestinations={mockFetchDestinations}

      onJumpseat={(icao : string ) => {alert(`Has heccho click en jumpseat ${icao}`)}}
      onBidded={(departureIcao: string, arrivalIcao: string ) => {alert(`Departure: ${departureIcao} \n Arrival: ${arrivalIcao}`)}}
    />
    </DashboardLayout>
  );
};
const mockAirlines: Airline[] = [
  { name: "XSN Virtual Airlines", code: "XSN", id: "1", isCharter: false },
  { name: "Iberia Virtual", code: "IBE",id: "12", isCharter: false },
  { name: "Vueling Virtual", code: "VLG", id: "123", isCharter: false },
  { name: "Air Europa Virtual", code: "AEA", id: "1234", isCharter: false },
  { name: "Binter Virtual", code: "NTR", id: "12345", isCharter: false },
  { name: "Ryanair Virtual", code: "RYR", id: "123456", isCharter: false },
];

export const DashboardAirlineSelectorPreview = () => {
  return (
    <DashboardLayout title="Aerolíneas" crumbs={[]}>
      <AirlineSelectPage
        airlines={mockAirlines}
        defaultSelectedCode="XSN"
        onSelect={(airline) => console.log("Aerolínea seleccionada:", airline)}
      />
    </DashboardLayout>
  );
};

export const HubSelectorPreview = () => {
  <HubSelector onSelected={(icao: string )=> alert(`Has seleccionado el hub ${icao}`)}></HubSelector>
}