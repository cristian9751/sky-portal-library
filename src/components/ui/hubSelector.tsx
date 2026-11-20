import { normalizeAirports, useAirports } from "@/lib/AirportContext"
import AutocompleteInput from "./autocomplete-input";
import { useI18n } from "@/lib/i18n";
import { useMemo, useState } from "react";
import { Button } from "./button";

type HubSelectorProps = {
    hubs?: string[]
    onSelected: (icao: string ) => void;
}
export default function HubSelector(props: HubSelectorProps) {
    const airports = useAirports()

    const hubs = useMemo<string[]>(() => {
        const list: unknown[] = props.hubs ?? airports
        const clean = list
            .map((h: any) => (typeof h === "string" ? h : h?.icao ?? h?.label))
            .filter((h): h is string => typeof h === "string" && h.length > 0)
        return [...new Set(normalizeAirports(clean))]
    }, [props.hubs, airports])
    const [hub, setHub] = useState<string>("")
    const [isOpen, setIsOpen] = useState<boolean>(true)
    const { t } = useI18n();

    if (!isOpen) return null

    return (
        <div className="flex min-h-screen w-full items-center justify-center p-4">
            <div className="w-full max-w-md rounded-lg border border-gray-200 bg-muted p-6 shadow-lg">
                <h2 className="mb-6 text-center text-xl font-semibold">
                    {t.dashboard.selectHub}
                </h2>

                <div className="flex flex-col gap-6">
                    <AutocompleteInput
                        label={t.dashboard.selectHub}
                        value={hub}
                        onChange={(selectedHub : string ) => setHub(selectedHub)}
                        options={hubs}
                    />

                    <div className="flex justify-end">
                        <Button className="" onClick={(e) => {
                            e.preventDefault();
                            props.onSelected(hub)
                            setIsOpen(false)
                        }}>{t.dashboard.confirm}</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}