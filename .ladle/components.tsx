import type { GlobalProvider } from "@ladle/react";
import { LangProvider } from "../src/lib/i18n";
import { useEffect, type ReactNode } from "react";
import { SiteLayout } from "../src/components/SiteLayout";
import ApplicationContextProvider, { useApplicationContext } from "../src/lib/ApplicationContext";
import { AirportsProvider } from "../src/lib/AirportContext";
import "../src/styles.css";
import "../src/custom-adminlte.scss";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function DashboardMockUser({ children }: { children: ReactNode }) {
  const { setUser } = useApplicationContext();

  useEffect(() => {
    setUser({
      name: "Usuario",
      surname: "De prueba",
      email: "usuario@example.com",
      countryID: "209",
      profileLink: { onClick: () => {} },
      permissions: [
        "edit.webpage.images.*",
        "edit.webpage.rules.*",
        "manage.aircrafts.buy.*",
        "manage.aircrafts.edit.*",
        "manage.aircrafts.sell.*",
        "manage.airlines.create.*",
        "manage.airlines.delete.*",
        "manage.airlines.edit.*",
        "manage.routes.create.*",
        "manage.routes.delete.*",
        "manage.routes.edit.*",
        "manage.users.deactivate.*",
        "manage.users.permissions.*",
      ],
      memberSince: "2024",
    });
  }, [setUser]);

  return children;
}

export const Provider: GlobalProvider = ({ children }: { children: ReactNode }) => {
  const params = new URLSearchParams(window.location.search);
  const story = params.get("story");
  const isDashboard = story?.startsWith("dashboard");
  const isLandingPage = story?.startsWith("landing-pages-preview");

  const storyContent = isLandingPage ? <SiteLayout>{children}</SiteLayout> : children;

  return (
    <ApplicationContextProvider>
      <LangProvider>
        <AirportsProvider airports={["LEMD", "LEBL", "LEMG", "GCLP"]}>
          {isDashboard ? <DashboardMockUser>{storyContent}</DashboardMockUser> : storyContent}
        </AirportsProvider>
      </LangProvider>
    </ApplicationContextProvider>
  );
};
