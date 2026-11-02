import { BASE, PageHeader } from "@/components/SiteLayout";
import { useI18n } from "@/lib/i18n";

export type StaffAttributes = {
  flag: string;
  name: string;
  position: string;
  email: string;
};
export type StaffParams = {
  Staff?: StaffAttributes[];
};
export function Staff({ Staff }: StaffParams) {
  const { t } = useI18n();
  return (
    <>
      <PageHeader eyebrow={t.staffTable.eyebrow} title={t.staffTable.title} />
      {Staff && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  {t.staffTable.cols.map((h) => (
                    <th key={h} className="px-5 py-4 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Staff.map((member) => (
                  <tr key={`${member.email}-${member.position}`} className="border-b border-border last:border-0 hover:bg-muted">
                    <td className="px-5 py-4">
                      <img src={`${BASE}/imagenes/flags/${member.flag}.png`} alt={t.staffTable.flagAlt} className="h-4 w-auto" />
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-3">
                        {member.name}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {member.position}
                    </td>
                    <td className="px-5 py-4">
                      <a href={`mailto:${member.email}`} className="hover:text-secondary">{member.email}</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}
