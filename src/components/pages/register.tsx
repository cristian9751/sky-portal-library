
import { MouseEventHandler, useState, type FormEvent } from "react";
import { BASE } from "@/components/SiteLayout";
import { AuthShell, Field, authField } from "@/components/AuthShell";
import { COUNTRIES } from "@/data/countries";
import { useI18n } from "@/lib/i18n";

type RegisterProps = {
  handleRegistration : (data: FormData) => Promise<void>;
  redirectToLogin :  () => MouseEventHandler<HTMLAnchorElement>;
}
export function Register({handleRegistration, redirectToLogin} : RegisterProps) {
  const { t } = useI18n();
  const a = t.auth;
  const [error, setError] = useState("");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    if (d.get("email_1") !== d.get("email_2")) { e.preventDefault(); setError(a.emailMismatch); return; }
    if (d.get("pass_1") !== d.get("pass_2")) { e.preventDefault(); setError(a.passMismatch); return; }
    setError("");
    handleRegistration(d).catch(err => {
      setError(err instanceof Error ? err.message : String(err));
    })
  };

  const section = "font-display text-xs font-bold uppercase tracking-[0.25em] text-primary";
  return (
    <AuthShell eyebrow={a.rEyebrow} title={a.rTitle} image={`${BASE}/imagenes/portada/12.jpg`}>
      {/* Posts to the existing air-spain.es registration system */}
      <form method="post" onSubmit={onSubmit} className="space-y-6 rounded-xl border border-border bg-card p-8">
        <p className={section}>{a.personal}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={a.first}><input name="nombre" required className={authField} /></Field>
          <Field label={a.last}><input name="apellidos" required className={authField} /></Field>
        </div>
        <Field label={a.country}>
          <select name="countryID" defaultValue="209" className={authField}>
            {COUNTRIES.map(([v, n]) => <option key={v} value={v}>{n}</option>)}
          </select>
        </Field>

        <p className={section}>{a.account}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={a.email}><input name="email_1" type="email" required autoComplete="email" className={authField} /></Field>
          <Field label={a.email2}><input name="email_2" type="email" required className={authField} /></Field>
          <Field label={a.pass}><input name="pass_1" type="password" required autoComplete="new-password" className={authField} /></Field>
          <Field label={a.pass2}><input name="pass_2" type="password" required autoComplete="new-password" className={authField} /></Field>
        </div>

        <p className={section}>{a.networks}</p>
        <Field label={a.airport}>
          <input name="aeropuerto" required maxLength={4} placeholder="LEMD" className={`${authField} uppercase`} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label={a.vatsim} hint={a.optional}><input name="idvatsim" className={authField} /></Field>
          <Field label={a.ivao} hint={a.optional}><input name="idivao" className={authField} /></Field>
          <Field label={a.simbrief} hint={a.optional}><input name="idsimbrief" className={authField} /></Field>
        </div>

        {error && <p role="alert" className="rounded-md bg-destructive/15 px-4 py-3 text-sm text-destructive">{error}</p>}
        <button type="submit" className="w-full rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90">
          {a.rSubmit}
        </button>
        <p className="text-center text-sm text-muted-foreground">
          {a.haveAcc}{" "}
          <a onClick={redirectToLogin()} className="font-semibold text-secondary hover:underline">{t.nav.login}</a>
        </p>
      </form>
    </AuthShell>
  );
}
