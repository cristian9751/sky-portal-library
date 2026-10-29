import Card from '@/components/dashboard/Card';
import { useI18n } from '@/lib/i18n';

const partners = ['VATSIM', 'IVAO', 'SimBrief'];

export default function DashboardMain() {
  const { t } = useI18n();
  const statistics = [
    { label: t.dashboard.flightCount, icon: 'bi-airplane', variant: 'primary' },
    { label: t.dashboard.flightHours, icon: 'bi-clock-history', variant: 'secondary' },
    { label: t.dashboard.landingAverage, icon: 'bi-bullseye', variant: 'info' },
  ];

  return (
    <div className="row">
      <div className="col-12">
        <div className="row">
          {statistics.map((statistic) => (
            <div className="col-md-4" key={statistic.label}>
              <div className={`card h-100 text-bg-${statistic.variant}`}>
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div>
                    <p className="mb-1">{statistic.label}</p>
                    <h2 className="mb-0">—</h2>
                  </div>
                  <i className={`bi ${statistic.icon} fs-1`} aria-hidden="true" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="col-12">
        <h1>{t.dashboard.contentTitle}</h1>
        <p>{t.dashboard.contentText}</p>
      </div>
    </div>
  );
}
