
import { useState, type ReactNode } from "react";

export const BASE = "https://air-spain.es";

export type SiteLayoutProps = {
  children: ReactNode;

  /** Brand, logo o identidad visual proporcionada por el consumidor. */
  brand?: ReactNode;

  /** Menú completo definido por el consumidor. */
  navigation?: ReactNode;

  /** Acciones principales de cabecera. */
  actions?: ReactNode;

  /** Contenido opcional al inicio de la cabecera. */
  headerStart?: ReactNode;

  /** Contenido opcional al final de la cabecera. */
  headerEnd?: ReactNode;

  /** Contenido opcional del pie de página. */
  footer?: ReactNode;

  /** Clases adicionales para el contenedor principal. */
  className?: string;
};

export function SiteLayout({
  children,
  brand,
  navigation,
  actions,
  headerStart,
  headerEnd,
  footer,
  className = "",
}: SiteLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const hasNavigation = navigation != null;
  const hasMobileContent =
    actions != null || headerEnd != null;

  return (
    <div
      className={`flex min-h-screen flex-col bg-background font-sans text-foreground ${className}`}
    >
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          {headerStart != null && (
            <div>{headerStart}</div>
          )}

          {brand != null && (
            <div className="shrink-0">{brand}</div>
          )}

          {hasNavigation && (
            <div className="hidden flex-1 items-center justify-center lg:flex">
              {navigation}
            </div>
          )}

          <div className="hidden items-center gap-3 lg:flex">
            {actions}
            {headerEnd}
          </div>

          {(hasNavigation || hasMobileContent) && (
            <button
              type="button"
              aria-label={
                menuOpen ? "Close menu" : "Open menu"
              }
              aria-expanded={menuOpen}
              aria-controls="site-layout-mobile-menu"
              onClick={() =>
                setMenuOpen((open) => !open)
              }
              className="rounded-md p-2 hover:bg-muted lg:hidden"
            >
              <span className="block h-0.5 w-6 bg-foreground" />
              <span className="mt-1.5 block h-0.5 w-6 bg-foreground" />
              <span className="mt-1.5 block h-0.5 w-6 bg-foreground" />
            </button>
          )}
        </div>

        {menuOpen && (
          <div
            id="site-layout-mobile-menu"
            className="border-t border-border px-6 py-4 lg:hidden"
          >
            {hasNavigation && (
              <div className="min-w-0">
                {navigation}
              </div>
            )}

            {hasMobileContent && (
              <div className="mt-3 flex flex-wrap items-center gap-3">
                {actions}
                {headerEnd}
              </div>
            )}
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      {footer != null && (
        <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
          {footer}
        </footer>
      )}
    </div>
  );
}

export type PageHeaderProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className = "",
}: PageHeaderProps) {
  return (
    <section
      className={`border-b border-border bg-card ${className}`}
    >
      <div className="mx-auto max-w-7xl px-6 py-16">
        {eyebrow != null && (
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-secondary">
            {eyebrow}
          </p>
        )}

        <h1 className="font-display text-4xl font-extrabold md:text-6xl">
          {title}
        </h1>

        {description != null && (
          <div className="mt-4 max-w-3xl text-muted-foreground">
            {description}
          </div>
        )}

        {actions != null && (
          <div className="mt-6">{actions}</div>
        )}
      </div>
    </section>
  );
}
