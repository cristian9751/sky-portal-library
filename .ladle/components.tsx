import type { GlobalProvider } from "@ladle/react";
import { LangProvider } from "../src/lib/i18n";
import { ReactNode } from "react";
import { SiteLayout} from "../src/components/SiteLayout"

export const Provider : GlobalProvider = ({children} : {children: ReactNode}) => {
    return (
        <LangProvider>
            <SiteLayout>
                {children}
            </SiteLayout>
        </LangProvider>
    )
}