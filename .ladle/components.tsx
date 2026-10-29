import type { GlobalProvider } from "@ladle/react";
import { LangProvider } from "../src/lib/i18n";
import { ReactNode } from "react";
import { SiteLayout} from "../src/components/SiteLayout"
import "../src/index"
export const Provider : GlobalProvider = ({children} : {children: ReactNode}) => {

        const params = new URLSearchParams(window.location.search);
        const story = params.get("story")
        if(story == "dashboard--dashboard-preview") {
            return (
                <LangProvider>
                    {children}
                </LangProvider>
            )
        } else {
            return(
            <LangProvider>
                <SiteLayout>
                    {children}
                </SiteLayout>
            </LangProvider>
            )
        }
}