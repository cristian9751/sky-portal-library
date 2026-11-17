import { Controller } from "react-hook-form";
import { Field } from "../AuthShell";
import { FormContainer } from "../ui/form-container";
import AutocompleteInput from "../ui/autocomplete-input";
import { useI18n } from "@/lib/i18n";
import ReservationMap from "../ui/ReservationMap";
import type { AirportLocation } from "../ui/ReservationMap";
import { useAirports } from "@/lib/AirportContext";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export type RouteReservationProps = {
    fetchDestinations: (departureIcao : string ) => Promise<AirportLocation[]>,
    defaultDeparture: AirportLocation,
    onJumpseat?: (icao: string ) => void;
    onBidded : (departureIcao : string, arrivalIcao : string ) => void;
}
export default function RouteReservation(props: RouteReservationProps) {
    const { t } = useI18n();
    const airports = useAirports();
    const [departure, setDeparture] = useState<AirportLocation>(props.defaultDeparture);
    const [arrival, setArrival] = useState<AirportLocation | undefined>();
    const [destinations, setDestinations] = useState<AirportLocation[]>([]);

    useEffect(() => {
        setArrival(undefined);


        props
            .fetchDestinations(departure.icao)
            .then((result) => {
                setDestinations(result);
            })
            .catch(() => {
                 setDestinations([]);
            });
    }, [departure]);

    const destinationIcaos = useMemo(
        () => destinations.map((d) => d.icao),
        [destinations]
    );

    const handleArrivalChange = (icao: string) => {
        setArrival(destinations.find((d) => d.icao === icao));
    };

    const handleJumpseat = () => {
        let icao = arrival?.icao;
        if(!icao) return;
        if(!props.onJumpseat) return;
        setDeparture(destinations.find((a) => a.icao === icao) ?? props.defaultDeparture)
       props.onJumpseat(icao);
    }

    return (
        <section className="absolute inset-0 isolate">
            <div className="absolute inset-0">
                <ReservationMap className="h-full w-full" currentLocation={departure} destinations={destinations} selectedDestination={arrival} onSelectedDestination={(arrival : AirportLocation) => setArrival(arrival)} />
            </div>

            <div className="absolute left-4 top-4 z-[1000] w-[calc(100%-35rem)] max-w-sm md:left-15 md:top-4 opacity-90 ">
                <FormContainer title={t.dashboard.bid}>
                    <Field label={t.dashboard.admin.departure}>
                        <Input value={departure.icao} readOnly/>
                    </Field>    
                    <Field label={t.dashboard.admin.arrival}>
                        <AutocompleteInput
                            value={arrival?.icao ?? ""}
                            onChange={handleArrivalChange}
                            options={destinationIcaos}
                        />
                    </Field>
                    <div className={`grid md:gap-10 md:grid-cols-2  md:mt-10`}>
                        <Button onClick={(e) => {
                            e.preventDefault();
                            props.onBidded(departure.icao, arrival?.icao ? arrival.icao : "");

                        }}>{t.dashboard.bid}</Button>
                        {props.onJumpseat && (
                            <Button onClick={(e) => {
                                e.preventDefault()
                                handleJumpseat()
                            }}>{t.dashboard.jumpseat}</Button>
                        )}
                    </div>
                </FormContainer>
            </div>
        </section>
    );
}