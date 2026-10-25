import { MouseEventHandler, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BASE, SiteLayout } from "@/components/SiteLayout";
import { AuthShell, Field, authField } from "@/components/AuthShell";
import { COUNTRIES } from "@/data/countries";
import { useI18n } from "@/lib/i18n";
import AutocompleteInput from "../ui/autocomplete-input";

type RegisterProps = {
  handleRegistration: (data: FormData) => Promise<void>;
  redirectToLogin: () => MouseEventHandler<HTMLAnchorElement>;
  airportOptions?: string[];
};

const buildSchema = (a: Record<string, string>) =>
  z
    .object({
      nombre: z.string().trim().min(1, a["required"]),
      apellidos: z.string().trim().min(1, a["required"]),
      email_1: z.string().regex(/^\S+@\S+\.\S+$/, a["invalidEmail"]),
      email_2: z.string(),
      pass_1: z.string().min(8, a["passwordRequired"]),
      pass_2: z.string(),
      airport: z.string().trim().uppercase().min(3, a["requiredAirport"])
    })
    .superRefine((d, ctx) => {
      if (d.email_1 !== d.email_2)
        ctx.addIssue({ code: "custom", path: ["email_2"], message: a["emailMismatch"] });
      if (d.pass_1 !== d.pass_2)
        ctx.addIssue({ code: "custom", path: ["pass_2"], message: a["passMismatch"] });
    });

type RegisterValues = z.infer<ReturnType<typeof buildSchema>>;

const FieldError = ({ message }: { message?: string }) =>
  message ? <p role="alert" className="mt-1 text-xs text-destructive">{message}</p> : null;

export function Register({ handleRegistration, redirectToLogin, airportOptions }: RegisterProps) {
  const { t } = useI18n();
  const a = t.auth;
  const schema = useMemo(() => buildSchema(a), [a]);

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterValues>({ resolver: zodResolver(schema) });

  // Solo se ejecuta si zod valida; el payload sigue saliendo del propio <form>
  const onValid = (_: RegisterValues, e?: React.BaseSyntheticEvent) => {
    const d = new FormData(e?.target as HTMLFormElement);
    return handleRegistration(d).catch((err) => {
      setError("root.server", { message: err instanceof Error ? err.message : String(err) });
    });
  };

  const section = "font-display text-xs font-bold uppercase tracking-[0.25em] text-primary";

  return (
     <AuthShell eyebrow={a.rEyebrow} title={a.rTitle} image={`${BASE}/imagenes/portada/12.jpg`}>
      {/* Posts to the existing air-spain.es registration system */}
      <form method="post" onSubmit={handleSubmit(onValid)} className="space-y-6 rounded-xl border border-border bg-card p-8">
        <p className={section}>{a.personal}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={a.first}>
            <input {...register("nombre")} className={authField} />
            <FieldError message={errors.nombre?.message} />
          </Field>
          <Field label={a.last}>
            <input {...register("apellidos")} className={authField} />
            <FieldError message={errors.apellidos?.message} />
          </Field>
        </div>
        <Field label={a.country}>
          <select name="countryID" defaultValue="209" className={authField}>
            {COUNTRIES.map(([v, n]) => <option key={v} value={v}>{n}</option>)}
          </select>
        </Field>

        <p className={section}>{a.account}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={a.email}>
            <input {...register("email_1")}  autoComplete="email" className={authField} />
            <FieldError message={errors.email_1?.message} />
          </Field>
          <Field label={a.email2}>
            <input {...register("email_2")}  className={authField} />
            <FieldError message={errors.email_2?.message} />
          </Field>
          <Field label={a.pass}>
            <input {...register("pass_1")} autoComplete="new-password" className={authField} />
            <FieldError message={errors.pass_1?.message} />
          </Field>
          <Field label={a.pass2}>
            <input {...register("pass_2")} autoComplete="new-password" className={authField} />
            <FieldError message={errors.pass_2?.message} />
          </Field>
        </div>

        <p className={section}>{a.networks}</p>
        <Field label={a.airport}>
          <Controller
            name="airport"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <AutocompleteInput
                name={field.name}
                value={field.value}
                onChange={(e: any) => field.onChange(e?.target ? e.target.value : e)}
                onBlur={field.onBlur}
                maxLength={4}
                placeholder="LEMD"
                className={`${authField} uppercase`}
                options={airportOptions ?? ["LEMD", "LEBL"]}
              />
            )}
          />
          <FieldError message={errors.airport?.message} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label={a.vatsim} hint={a.optional}><input name="idvatsim" className={authField} /></Field>
          <Field label={a.ivao} hint={a.optional}><input name="idivao" className={authField} /></Field>
          <Field label={a.simbrief} hint={a.optional}><input name="idsimbrief" className={authField} /></Field>
        </div>
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