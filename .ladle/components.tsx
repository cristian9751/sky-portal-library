import type { GlobalProvider } from "@ladle/react";
import { LangProvider } from "../src/lib/i18n";
import { ReactNode } from "react";
import { SiteLayout} from "../src/components/SiteLayout"
import ApplicationContextProvider from "../src/lib/ApplicationContext"
import "../src/index"
export const Provider : GlobalProvider = ({children} : {children: ReactNode}) => {

        const params = new URLSearchParams(window.location.search);
        const story = params.get("story")


        const content = story?.startsWith("dashboard") ?
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
                {content}
            </ApplicationContextProvider>
        )

}