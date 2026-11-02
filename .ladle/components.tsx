import type { GlobalProvider } from "@ladle/react";
import { LangProvider } from "../src/lib/i18n";
import { useEffect, type ReactNode } from "react";
import { SiteLayout } from "../src/components/SiteLayout";
import ApplicationContextProvider, { useApplicationContext } from "../src/lib/ApplicationContext";
import "../src/index";

function DashboardMockUser({ children }: { children: ReactNode }) {
    const { setUser } = useApplicationContext();

    useEffect(() => {
        setUser({
            name: "Usuario",
            surname: "De prueba",
            email: "usuario@example.com",
            countryID: "209",
            profileLink: { onClick: () => {} },
            role: "admin",
            memberSince: "2024",
        });
    }, [setUser]);

    return children;
}

export const Provider : GlobalProvider = ({children} : {children: ReactNode}) => {

        const params = new URLSearchParams(window.location.search);
        const story = params.get("story")
        const isDashboard = story?.startsWith("dashboard");

        const content = isDashboard ?
        (
            <LangProvider>
                {children}
            </LangProvider>
        )
        : (
            <LangProvider>
                <SiteLayout>{children}</SiteLayout>
            </LangProvider>
        )

        return (
            <ApplicationContextProvider>
                {isDashboard ? <DashboardMockUser>{content}</DashboardMockUser> : content}
            </ApplicationContextProvider>
        )

}