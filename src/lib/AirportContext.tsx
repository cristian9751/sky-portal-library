import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";

const DEFAULT_AIRPORTS = ["LEMD", "LEBL"];

export const normalizeAirports = (list: string[]) =>
  list.map((a) => a.trim().toUpperCase()).filter(Boolean);

// null = "no hay Provider por encima"
const AirportsContext = createContext<string[]>(DEFAULT_AIRPORTS);

export function AirportsProvider({
  airports,
  children,
}: {
  airports: string[];
  children: ReactNode;
}) {
  const value = useMemo(() => normalizeAirports(airports), [airports]);
  return <AirportsContext.Provider value={value}>{children}</AirportsContext.Provider>;
}

export const useAirports = () => useContext(AirportsContext);