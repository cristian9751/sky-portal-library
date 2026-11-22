import { useI18n } from "@/lib/i18n";
import { FlightDispatchLabels, SimbriefOfp } from "../pages/FlightDispatch";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";

function pdfUrl(ofp: SimbriefOfp): string | null {
  const directory = ofp.files?.directory;
  const link = ofp.files?.pdf?.link;
  return typeof directory === "string" && typeof link === "string" ? directory + link : null;
}
/** Los valores del XML llegan como texto; los elementos vacíos, como []. */
const text = (value: unknown): string =>
  typeof value === "string" || typeof value === "number" ? String(value) : "—";

/** Segundos → "h:mm". */
function formatDuration(value: unknown): string {
  const seconds = Number(value);
  if (!Number.isFinite(seconds) || seconds <= 0) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}:${String(m).padStart(2, "0")}`;
}



function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export default  function SimbriefPlanCard({
  ofp,

}: {
  ofp: SimbriefOfp;
}) {
  const { t } = useI18n();  
  const url = pdfUrl(ofp);
  const route = ofp.general?.route;
const labels = t.dashboard.flightDispatch as FlightDispatchLabels;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{labels.simbriefPlan}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-1.5">
            <Row label={labels.flightNumber} value={`${text(ofp.general?.icao_airline)}${text(ofp.general?.flight_number)}`} />
            <Row label={labels.runwayDeparture} value={text(ofp.origin?.plan_rwy)} />
            <Row label={labels.runwayArrival} value={text(ofp.destination?.plan_rwy)} />
            <Row label={labels.altitude} value={text(ofp.general?.initial_altitude)} />
            <Row label={labels.distance} value={text(ofp.general?.route_distance)} />
            <Row label={labels.enrouteTime} value={formatDuration(ofp.times?.est_time_enroute)} />
          </div>
          <div className="space-y-1.5">
            <Row label={labels.fuelRamp} value={text(ofp.fuel?.plan_ramp)} />
            <Row label={labels.fuelTaxi} value={text(ofp.fuel?.taxi)} />
            <Row label={labels.fuelBurn} value={text(ofp.fuel?.enroute_burn)} />
            <Row label={labels.fuelReserve} value={text(ofp.fuel?.reserve)} />
          </div>
          <div className="space-y-1.5">
            <Row label={labels.oew} value={text(ofp.weights?.oew)} />
            <Row label={labels.payload} value={text(ofp.weights?.payload)} />
            <Row label={labels.zfw} value={text(ofp.weights?.est_zfw)} />
            <Row label={labels.tow} value={text(ofp.weights?.est_tow)} />
            <Row label={labels.ldw} value={text(ofp.weights?.est_ldw)} />
          </div>
        </div>

        {typeof route === "string" && route && (
          <div className="space-y-1">
            <div className="text-xs uppercase text-muted-foreground">{labels.route}</div>
            <p className="break-words font-mono text-sm">{route}</p>
          </div>
        )}

        {url && (
          <div>
            <Button asChild variant="outline">
              <a href={url} target="_blank" rel="noopener noreferrer">
                {labels.openPdf}
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}