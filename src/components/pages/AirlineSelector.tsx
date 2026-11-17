import { useState } from "react";
import { Button } from "../ui/button";
import { Airline } from "./AirlinesAdministration";
import { useI18n } from "@/lib/i18n";



export type AirlineSelectPageProps = {
    airlines: Airline[];
    onSelect: (airline: Airline) => void;
    defaultSelectedCode?: string;
};

export default function AirlineSelectPage({
    airlines,
    onSelect,
    defaultSelectedCode,
}: AirlineSelectPageProps) {
    const [selectedId, setSelectedId] = useState<string | undefined>(
        airlines.find((a) => a.code === defaultSelectedCode)?.id
    );
    let selected = airlines.find((a) => a.id === selectedId)
    const { t } = useI18n();

    return (
        <div className="flex min-h-[calc(100vh-8rem)] w-full items-start justify-center md:items-center md:p-6">
            <section
                className="
                    flex w-full flex-col
                    md:max-w-md md:rounded-lg md:border md:border-border
                    md:bg-card md:text-card-foreground md:shadow-lg
                "
            >
                <h2 className="px-4 py-4 text-xl font-semibold md:px-6 md:pt-6">{t.dashboard.admin.selectAirline}</h2>

                <fieldset className="min-h-0 flex-1 md:max-h-[60vh] md:overflow-y-auto md:px-4">
                    <legend className="sr-only">{t.dashboard.admin.selectAirline}</legend>

                    {airlines.length === 0 ? (
                        <p className="px-4 py-8 text-center text-muted-foreground">
                            -
                        </p>
                    ) : (
                        <ul className="divide-y divide-border md:divide-y-0 md:space-y-2">
                            {airlines.map((airline) => (
                                <li key={airline.id}>
                                    <label
                                        className="
                                            flex cursor-pointer items-center gap-3 px-4 py-3
                                            transition-colors hover:bg-accent
                                            has-checked:bg-primary/10 has-checked:text-primary
                                            has-focus-visible:ring-2 has-focus-visible:ring-primary
                                            md:rounded-md md:border md:border-border
                                            md:has-checked:border-primary
                                        "
                                    >
                                        <input
                                            type="radio"
                                            name="airline"
                                            value={airline.code}
                                            checked={airline.id === selectedId}
                                            onChange={() => setSelectedId(airline.id)}
                                            className="sr-only"
                                        />

                                        <span className="flex h-8 w-12 shrink-0 items-center justify-center rounded bg-muted text-xs font-bold">
                                            {airline.code ? airline.code.toUpperCase() : airline.name.toLowerCase()}
                                        </span>

                                        <span className="min-w-0 flex-1 truncate font-medium">
                                            {airline.name}
                                        </span>

                                        <i
                                            className={`bi bi-check-lg text-lg ${
                                                airline.id === selectedId ? "opacity-100" : "opacity-0"
                                            }`}
                                            aria-hidden="true"
                                        />
                                    </label>
                                </li>
                            ))}
                        </ul>
                    )}
                </fieldset>

                <div className="sticky bottom-0 border-t border-border bg-background p-4 md:static md:border-0 md:bg-transparent md:p-6">
                    <Button
                        className="w-full"
                        disabled={!selected}
                        onClick={(e) => {
                            e.preventDefault();
                            if (selected) onSelect(selected);
                        }}
                    >
                        {t.dashboard.confirm}
                    </Button>
                </div>
            </section>
        </div>
    );
}