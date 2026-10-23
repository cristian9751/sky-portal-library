import type { ReactNode } from "react";

export const authField =
  "w-full rounded-md border border-input bg-background px-4 py-3 outline-none transition-colors placeholder:text-muted-foreground focus:border-ring";

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="flex justify-between text-sm font-medium">
        {label}
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

export function AuthShell({ eyebrow, title, image, children }: { eyebrow: string; title: string; image: string; children: ReactNode }) {
  return (
    <section className="grid min-h-[calc(100vh-8rem)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-fade" />
        <div className="absolute bottom-0 p-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-secondary">{eyebrow}</p>
          <h1 className="max-w-md font-display text-5xl font-extrabold leading-tight">{title}</h1>
        </div>
      </div>
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-lg">
          <div className="mb-8 lg:hidden">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-secondary">{eyebrow}</p>
            <h1 className="font-display text-3xl font-extrabold">{title}</h1>
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}
