import Card from '@/components/dashboard/Card';
import SmallBox from '@/components/dashboard/SmallBox';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useI18n } from '@/lib/i18n';

export type DashboardFlight = {
  id: string;
  flightNumber: string;
  aircraft: string;
  origin: string;
  destination: string;
};

export type DashboardEvent = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  imageAlt?: string;
};

type DashboardMainProps = {
  recentFlights?: DashboardFlight[];
  onFlightDetails?: (flightId: string) => void;
  events?: DashboardEvent[];
};

export function DashboardMain({
  recentFlights = [],
  onFlightDetails,
  events = [],
}: DashboardMainProps) {
  const { t } = useI18n();
  const statistics = [
    { label: t.dashboard.flightCount, icon: 'bi-airplane', variant: 'primary' },
    { label: t.dashboard.flightHours, icon: 'bi-clock-history', variant: 'secondary' },
    { label: t.dashboard.landingAverage, icon: 'bi-bullseye', variant: 'info' },
  ];
  const latestFlights = recentFlights.slice(0, 5);

  return (
    <div className="row">
      <div className="col-12">
        <div className="row g-3 g-lg-4 dashboard-statistics">
          {statistics.map((statistic) => (
            <div className="col-12 col-md-4" key={statistic.label}>
              <SmallBox
                label={statistic.label}
                value="—"
                icon={statistic.icon}
                variant={statistic.variant}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="col-12 mt-3">
        <Card title={t.dashboard.recentFlights} className="dashboard-recent-flights">
          <Table className="table table-hover align-middle mb-0">
            <TableHeader>
              <TableRow>
                <TableHead>{t.dashboard.flightNumber}</TableHead>
                <TableHead>{t.dashboard.aircraft}</TableHead>
                <TableHead>{t.dashboard.origin}</TableHead>
                <TableHead>{t.dashboard.destination}</TableHead>
                <TableHead className="text-end">{t.dashboard.details}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {latestFlights.length > 0 ? (
                latestFlights.map((flight) => (
                  <TableRow key={flight.id}>
                    <TableCell className="fw-semibold">{flight.flightNumber}</TableCell>
                    <TableCell>{flight.aircraft}</TableCell>
                    <TableCell>{flight.origin}</TableCell>
                    <TableCell>{flight.destination}</TableCell>
                    <TableCell className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        disabled={!onFlightDetails}
                        onClick={() => onFlightDetails?.(flight.id)}
                      >
                        {t.dashboard.details}
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="py-4 text-center text-muted">
                    {t.dashboard.noRecentFlights}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      <div className="col-12">
        <Card title={t.dashboard.events} className="dashboard-events">
          {events.length > 0 ? (
            <Carousel opts={{ loop: events.length > 1 }} className="dashboard-events-carousel">
              <CarouselContent>
                {events.map((event) => (
                  <CarouselItem key={event.id}>
                    <div className="row g-0 align-items-stretch dashboard-event-slide">
                      <div className="col-12 col-md-7 d-flex flex-column justify-content-center p-4">
                        <h4 className="mb-3">{event.name}</h4>
                        <p className="mb-0 text-muted">{event.description}</p>
                      </div>
                      <div className="col-12 col-md-5">
                        <img
                          src={event.imageUrl}
                          alt={event.imageAlt ?? event.name}
                          className="dashboard-event-image"
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {events.length > 1 && (
                <>
                  <CarouselPrevious
                    className="left-auto right-14 top-auto bottom-3 translate-y-0"
                    aria-label={t.dashboard.previousEvent}
                  />
                  <CarouselNext
                    className="right-3 top-auto bottom-3 translate-y-0"
                    aria-label={t.dashboard.nextEvent}
                  />
                </>
              )}
            </Carousel>
          ) : (
            <p className="mb-0 py-4 text-center text-muted">{t.dashboard.noEvents}</p>
          )}
        </Card>
      </div>
    </div>
  );
}
