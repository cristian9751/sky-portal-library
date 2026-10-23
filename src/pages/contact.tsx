import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, pageHead } from "@/components/SiteLayout";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  head: () => pageHead("Contact", "Get in touch with the Air Spain virtual airline team."),
  component: Contact,
});

const EMAIL = "info@air-spain.es";
const field = "w-full rounded-md border border-input bg-background px-4 py-3 outline-none focus:border-ring";

function Contact() {
  const { t } = useI18n();
  const c = t.contact;
  const [f, setF] = useState({ name: "", subject: "", message: "" });
  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `${f.message}\n\n— ${f.name}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(f.subject)}&body=${encodeURIComponent(body)}`;
  };
  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={c.title} />
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[1fr_1.4fr]">
        <div className="rounded-xl border border-border bg-card p-8">
          <h2 className="font-display text-xl font-bold">{c.emailUs}</h2>
          <p className="mt-3 text-muted-foreground">{c.emailText}</p>
          <a href={`mailto:${EMAIL}`} className="mt-6 inline-block font-display text-lg font-bold text-secondary hover:underline">{EMAIL}</a>
        </div>
        <form onSubmit={send} className="space-y-4 rounded-xl border border-border bg-card p-8">
          <input required placeholder={c.name} className={field} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          <input required placeholder={c.subject} className={field} value={f.subject} onChange={(e) => setF({ ...f, subject: e.target.value })} />
          <textarea required rows={6} placeholder={c.message} className={field} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} />
          <button type="submit" className="rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90">{c.send}</button>
        </form>
      </section>
    </>
  );
}
