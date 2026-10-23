
import { BASE, PageHeader, pageHead } from "@/components/SiteLayout";
import { MEMBERS } from "@/data/members";
import { useI18n } from "@/lib/i18n";


function Members() {
  const { t } = useI18n();
  return (
    <>
      <PageHeader eyebrow={t.members.eyebrow} title={t.members.title} />
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                {t.members.cols.map((h) => (
                  <th key={h} className="px-5 py-4 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MEMBERS.map((m) => (
                <tr key={m.callsign} className="border-b border-border last:border-0 hover:bg-muted">
                  <td className="px-5 py-4 font-display font-bold text-secondary">{m.callsign}</td>
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-3">
                      <img src={`${BASE}/imagenes/flags/${m.flag}.png`} alt={m.flag} className="h-4 w-auto" />
                      {m.name}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {m.ivao ? <a href={`https://ivao.aero/Member.aspx?Id=${m.ivao}`} target="_blank" rel="noreferrer" className="hover:text-secondary">{m.ivao}</a> : <span className="text-muted-foreground">—</span>}
                  </td>
                  <td className="px-5 py-4">{m.vatsim || <span className="text-muted-foreground">—</span>}</td>
                  <td className="px-5 py-4">
                    {m.badge && <img src={`${BASE}/imagenes/logros/${m.badge}.png`} alt={`${m.badge.split("-")[0]} ${t.members.hours}`} className="h-8 w-auto" />}
                  </td>
                  <td className="px-5 py-4 font-mono">{m.base}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
