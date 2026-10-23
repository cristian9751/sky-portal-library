import { createFileRoute, Link } from "@tanstack/react-router";
import { BASE, pageHead } from "@/components/SiteLayout";
import { AuthShell, Field, authField } from "@/components/AuthShell";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/login")({
  head: () => pageHead("Login", "Sign in to your Air Spain pilot account."),
  component: Login,
});

function Login() {
  const { t } = useI18n();
  const a = t.auth;
  return (
    <AuthShell eyebrow={a.lEyebrow} title={a.lTitle} image={`${BASE}/imagenes/portada/3.jpg`}>
      {/* Posts to the existing air-spain.es login system */}
      <form action={`${BASE}/login/comprobar.php`} method="post" className="space-y-5 rounded-xl border border-border bg-card p-8">
        <Field label={a.user}>
          <input name="usuario" required autoComplete="username" placeholder="XSN000" className={authField} />
        </Field>
        <Field label={a.pass}>
          <input name="pass" type="password" required autoComplete="current-password" className={authField} />
        </Field>
        <input type="hidden" name="enviar" value="Enviar" />
        <button type="submit" className="w-full rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90">
          {a.lSubmit}
        </button>
        <p className="text-center text-sm text-muted-foreground">
          {a.noAcc}{" "}
          <Link to="/register" className="font-semibold text-secondary hover:underline">{t.nav.register}</Link>
        </p>
      </form>
    </AuthShell>
  );
}
