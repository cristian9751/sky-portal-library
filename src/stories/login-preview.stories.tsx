import "../styles.css"
import { LangProvider, useI18n } from "@/lib/i18n";
import { AuthShell, Field, authField } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";

function LoginPreview() {
  const { t } = useI18n();
  const a = t.auth;

  return (
    <AuthShell eyebrow={a.lEyebrow} title={a.lTitle} image="https://air-spain.es/imagenes/portada/3.jpg">
      <form
        onSubmit={(event) => event.preventDefault()}
        className="space-y-5 rounded-xl border border-border bg-card p-8"
      >
        <div>
          <p className="text-sm text-muted-foreground">Air Spain · Demo preview</p>
          <h2 className="mt-1 text-2xl font-bold">Pilot access</h2>
        </div>
        <Field label={a.user}>
          <input name="usuario" autoComplete="username" placeholder="XSN000" className={authField} />
        </Field>
        <Field label={a.pass}>
          <input name="pass" type="password" autoComplete="current-password" placeholder="••••••••" className={authField} />
        </Field>
        <Button type="submit" className="w-full">{a.lSubmit}</Button>
        <p className="text-center text-sm text-muted-foreground">
          {a.noAcc} <a href="#register" className="font-semibold text-secondary hover:underline">{t.nav.register}</a>
        </p>
        <p className="text-center text-xs text-muted-foreground">
          Unicamente previsualización, este formulario no envia ningun tipo de credencial.
        </p>
      </form>
    </AuthShell>
  );
}

export const LoginPage = () => (
  <LangProvider>
    <LoginPreview />
  </LangProvider>
);
