import { useAirports } from "@/lib/AirportContext"
import { Dialog } from "./dialog";
import AutocompleteInput from "./autocomplete-input";
import { useI18n } from "@/lib/i18n";
import { useState } from "react";
import { Button } from "./button";

type HubSelectorProps = {
    hubs?: string[]
    onSelected: (icao: string ) => void;
}
export default function HubSelector(props: HubSelectorProps) {
    const hubs = props.hubs ?? useAirports()
    const [hub, setHub] = useState<string>("")
    const [isOpen, setIsOpen] = useState<boolean>(true)
    const { t } = useI18n();
    return (
        <Dialog defaultOpen={true} open={isOpen}>
        <AutocompleteInput
            label={t.dashboard.selectHub}
            value={hub}
            onChange={(selectedHub : string ) => setHub(selectedHub)}
            options={hubs}
        />
        <div className="flex items-end">
            <Button className="" onClick={(e) => {
                e.preventDefault();
                props.onSelected(hub)
                setIsOpen(false)
            }}>{t.dashboard.confirm}</Button>
        </div>
    </Dialog>
    )
}