import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, pageHead } from "@/components/SiteLayout";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/normative")({
  head: () => pageHead("Normative", "Air Spain rules: callsign, requirements, operations, privacy and leaving the airline."),
  component: Normative,
});

function Normative() {
  const { t } = useI18n();
  return (
    <>
      <PageHeader eyebrow={t.normative.eyebrow} title={t.normative.title} />
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="space-y-6">
          {t.normative.rules.map(([title, items], i) => (
            <div key={i} className="grid gap-4 rounded-xl border border-border bg-card p-8 md:grid-cols-[200px_1fr]">
              <div>
                <span className="font-display text-sm font-bold text-primary">0{i + 1}</span>
                <h2 className="font-display text-xl font-bold">{title}</h2>
              </div>
              <div className="space-y-3 text-muted-foreground">
                {items.map((p) => <p key={p}>{p}</p>)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
