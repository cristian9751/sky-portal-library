
import {BASE, SiteLayout } from "@/components/SiteLayout";
import { AuthShell, Field, authField } from "@/components/AuthShell";
import { useI18n } from "@/lib/i18n";
import { MouseEventHandler, useState } from "react";

type LoginProps = {
  handleLogin : (data: FormData) => Promise<void>;
  redirectToRegister : ()  => void;
}
export function Login({handleLogin, redirectToRegister} : LoginProps) {
  const { t } = useI18n();
  const a = t.auth;
  const [error, setError] = useState("");
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    handleLogin(d).catch(err => {
      err instanceof Error ? setError(err.message) : setError(String(err));
    })
  };
  return (
    <AuthShell eyebrow={a.lEyebrow} title={a.lTitle} image={`${BASE}/imagenes/portada/3.jpg`}>
      <form onSubmit={onSubmit} method="post" className="space-y-5 rounded-xl border border-border bg-card p-8">
        <Field label={a.user}>
          <input name="usuario" required autoComplete="username" placeholder="XSN000" className={authField} />
        </Field>
        <Field label={a.pass}>
          <input name="pass" type="password" required autoComplete="current-password" className={authField} />
        </Field>
        {error && <p role="alert" className="rounded-md bg-destructive/15 px-4 py-3 text-sm text-destructive">{a[error as keyof typeof a] ?? error}</p>}
        <button type="submit" className="w-full rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90">
          {a.lSubmit}
        </button>
        <p className="text-center text-sm text-muted-foreground">
          {a.noAcc}{" "}
          <a onClick={redirectToRegister} className="font-semibold text-secondary hover:underline">{t.nav.register}</a>
        </p>
      </form>
    </AuthShell>
  );
}
