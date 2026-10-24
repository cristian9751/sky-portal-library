import type { GlobalProvider } from "@ladle/react";
import { LangProvider } from "../src/lib/i18n";
import { ReactNode } from "react";

export const Provider : GlobalProvider = ({children} : {children: ReactNode}) => {
    return (
        <LangProvider>
            {children }
        </LangProvider>
    )
}