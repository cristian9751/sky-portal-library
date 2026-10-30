import { createContext, useContext, useState, type ComponentType, type ReactNode } from "react";
import { LangProvider, LANGS, useI18n } from "@/lib/i18n";
import { useApplicationContext } from "@/lib/ApplicationContext";

const hostname = window.location.hostname;
export const BASE = hostname == "localhost" ? "https://air-spain.es" : `${window.location.protocol}//${hostname}`;

/* ---------- Abstracción de enlaces (sin dependencia de router) ---------- */

export type AppLinkProps = {
  to: string;
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
};

/** Implementación por defecto: ancla HTML normal (navegación completa). */
export function DefaultLink({ to, ...rest }: AppLinkProps) {
  return <a href={to} {...rest} />;
}

const LinkContext = createContext<ComponentType<AppLinkProps>>(DefaultLink);
const useLink = () => useContext(LinkContext);

/*
 * Para usar un router, pasa un adaptador a <SiteLayout linkComponent={...}>:
 *
 *   // TanStack Router
 *   const RouterLink = ({ to, ...p }: AppLinkProps) => <Link to={to} {...p} />;
 *
 *   // React Router
 *   const RouterLink = ({ to, ...p }: AppLinkProps) => <NavLink to={to} {...p} />;
 *
 *   // Next.js
 *   const RouterLink = ({ to, ...p }: AppLinkProps) => <NextLink href={to} {...p} />;
 */

/* ---------- Navegación ---------- */

const NAV = [
  { key: "home", to: "/" },
  { key: "about", to: "/about" },
  { key: "normative", to: "/normative" },
  { key: "resources", to: "/resources" },
  { key: "staff", to: "/staff" },
  { key: "members", to: "/members" },
  { key: "contact", to: "/contact" },
  {key: "dashboard", to: "/dashboard"}
] as const;

const linkCls = "text-muted-foreground transition-colors hover:text-secondary";

function NavItem({
  item,
  className,
}: {
  item: (typeof NAV)[number];
  className: string;
}) {
  const { t } = useI18n();
  const Link = useLink();

  return (
    <Link to={item.to} className={className}>
      {t.nav[item.key]}
    </Link>
  );
}

/* ---------- Layout ---------- */

export function SiteLayout({
  children,
  linkComponent,
}: {
  children: ReactNode;
  /** Adaptador opcional al router de la app. Por defecto usa <a href>. */
  linkComponent?: ComponentType<AppLinkProps>;
}) {
  const [open, setOpen] = useState(false);
  const { t, lang, setLang } = useI18n();
  const Link = linkComponent ?? DefaultLink;
  const { isAuthenticated } = useApplicationContext()
  return (
    <LinkContext.Provider value={Link}>
      <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
        <div className="h-1.5 bg-flag" />
        <header className=" top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link to="/" className="font-display text-2xl font-extrabold tracking-tight">
              AIR<span className="text-primary">SPAIN</span>
            </Link>
            <nav className="hidden items-center gap-7 text-sm font-medium lg:flex">
              {NAV.map((i) => (
                <NavItem key={i.key} item={i} className={linkCls} />
              ))}
            </nav>
            <div className="hidden items-center gap-3 lg:flex">
              <div className="flex gap-1 text-xs uppercase">
                {LANGS.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    aria-pressed={lang === l}
                    className={`rounded px-1.5 py-1 uppercase hover:bg-muted ${lang === l ? "bg-muted text-secondary" : "text-muted-foreground"}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <Link to="/login" className="rounded-md px-4 py-2 text-sm font-semibold hover:bg-muted">
                {t.nav.login}
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                {t.nav.register}
              </Link>
            </div>
            <button
              aria-label="Menu"
              onClick={() => setOpen(!open)}
              className="rounded-md p-2 hover:bg-muted lg:hidden"
            >
              <span className="block h-0.5 w-6 bg-foreground" />
              <span className="mt-1.5 block h-0.5 w-6 bg-foreground" />
              <span className="mt-1.5 block h-0.5 w-6 bg-foreground" />
            </button>
          </div>
          {open && (
            <nav
              className="flex flex-col gap-1 border-t border-border px-6 py-4 lg:hidden"
              onClick={() => setOpen(false)}
            >
              {NAV.map((i) => (
                <NavItem key={i.key} item={i} className="rounded px-2 py-2 hover:bg-muted" />
              ))}
              {isAuthenticated && (
                <>
                  <Link to="/dashboard" className="rounded px-2 py-2 hover:bg-muted">
                      {t.nav.dashboard}
                  </Link>
                </>
              )}
              {isAuthenticated == false && (
                <>
                  <Link to="/login" className="rounded px-2 py-2 hover:bg-muted">
                    {t.nav.login}
                  </Link>
                  <Link to="/register" className="rounded px-2 py-2 hover:bg-muted">
                    {t.nav.register}
                  </Link>
                </>
              )}
              <div className="mt-2 flex gap-2" onClick={(e) => e.stopPropagation()}>
                {LANGS.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`rounded px-2 py-1 text-xs uppercase ${lang === l ? "bg-muted text-secondary" : "text-muted-foreground"}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </nav>
          )}
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
          Copyright © {new Date().getFullYear()} Air Spain. {t.footer}
        </footer>
      </div>
    </LinkContext.Provider>
  );
}

export function PageHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <section className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-secondary">
          {eyebrow}
        </p>
        <h1 className="font-display text-4xl font-extrabold md:text-6xl">{title}</h1>
      </div>
    </section>
  );
}

export function pageHead(title: string, vaName: string, description: string) {
  return {
    meta: [
      { title: `${title} | ${vaName}` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} | ${vaName}` },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}