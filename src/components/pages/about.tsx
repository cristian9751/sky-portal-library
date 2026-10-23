
import { BASE, PageHeader, pageHead } from "@/components/SiteLayout";
import { useI18n } from "@/lib/i18n";


function About() {
  const { t } = useI18n();
  const a = t.about;
  return (
    <>
      <PageHeader eyebrow={a.eyebrow} title={a.title} />
      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="max-w-3xl text-xl leading-relaxed text-muted-foreground">{a.intro}</p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {a.points.map(([title, d], i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-8">
              <span className="font-display text-sm font-bold text-primary">0{i + 1}</span>
              <h2 className="mt-2 font-display text-xl font-bold">{title}</h2>
              <p className="mt-3 text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-6 rounded-xl bg-primary p-8 text-primary-foreground">
          <p className="font-display text-2xl font-bold">{a.welcome}</p>
          <a href="/register" className="rounded-md bg-secondary px-6 py-3 font-semibold text-secondary-foreground hover:bg-secondary/90">{a.join}</a>
        </div>
      </section>
    </>
  );
}
