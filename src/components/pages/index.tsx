import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Air Spain — Virtual Airline | Home" },
      { name: "description", content: "Fly with Air Spain, a virtual airline on VATSIM and IVAO. Join our pilots today." },
      { property: "og:title", content: "Air Spain — Virtual Airline" },
      { property: "og:description", content: "Fly with Air Spain, a virtual airline on VATSIM and IVAO." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const BASE = "https://air-spain.es";
const SLIDES = Array.from({ length: 15 }, (_, i) => {
  const n = i + 1;
  return `${BASE}/imagenes/portada/${n}.${n === 3 || n === 12 ? "jpg" : "png"}`;
});
const PARTNERS = [
  ["VATSIM", `${BASE}/imagenes/VATSIM_LOGO.png`, "https://www.vatsim.net/"],
  ["IVAO", `${BASE}/imagenes/va.png`, "https://www.ivao.aero/"],
  ["SimBrief", `${BASE}/imagenes/simbrief2.png`, "https://www.simbrief.com/"],
];
function Index() {
  const [idx, setIdx] = useState(0);
  const { t } = useI18n();
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, [idx]);
  const go = (d: number) => setIdx((i) => (i + d + SLIDES.length) % SLIDES.length);

  return (
    <>
      <section className="relative h-[78vh] min-h-[480px] overflow-hidden">
        {SLIDES.map((src, i) => (
          <img key={src} src={src} alt={`Air Spain fleet ${i + 1}`} loading={i === 0 ? "eager" : "lazy"}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${i === idx ? "opacity-100" : "opacity-0"}`} />
        ))}
        <div className="absolute inset-0 bg-fade" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-16">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-secondary">{t.home.eyebrow}</p>
          <h1 className="max-w-3xl font-display text-5xl font-extrabold leading-[1.05] md:text-7xl">
            {t.home.title1}<span className="text-primary">{t.home.title2}</span>{t.home.title3}
          </h1>
          <div className="mt-8 flex gap-3">
            <a href="/register" className="rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90">{t.home.join}</a>
            <a href="/about" className="rounded-md border border-border bg-background/40 px-6 py-3 font-semibold backdrop-blur hover:bg-muted">{t.home.about}</a>
          </div>
        </div>
        <button aria-label="Previous" onClick={() => go(-1)} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/60 px-4 py-3 text-xl backdrop-blur hover:bg-primary">‹</button>
        <button aria-label="Next" onClick={() => go(1)} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/60 px-4 py-3 text-xl backdrop-blur hover:bg-primary">›</button>
        <div className="absolute bottom-6 right-6 flex gap-1.5">
          {SLIDES.map((_, i) => (
            <button key={i} aria-label={`Slide ${i + 1}`} onClick={() => setIdx(i)}
              className={`h-1.5 rounded-full transition-all ${i === idx ? "w-6 bg-secondary" : "w-1.5 bg-foreground/40"}`} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-xl border border-border bg-card p-8">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
            <h2 className="font-display text-2xl font-bold">{t.home.flights}</h2>
          </div>
          <p className="mt-3 text-muted-foreground">{t.home.noFlights}</p>
        </div>
      </section>

      <section className="border-t border-border py-14">
        <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">{t.home.flyingWith}</p>
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-12 px-6">
          {PARTNERS.map(([n, img, url]) => (
            <a key={n} href={url} target="_blank" rel="noreferrer" className="opacity-70 transition-opacity hover:opacity-100">
              <img src={img} alt={n} className="h-14 w-auto object-contain" />
            </a>
          ))}
        </div>
      </section>

    </>
  );
}
