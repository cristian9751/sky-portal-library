import { useMemo, useRef } from "react";
import type { BaseSyntheticEvent } from "react";
import { Controller, useForm } from "react-hook-form";
import type { UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BASE } from "@/components/SiteLayout";
import { AuthShell, Field, authField } from "@/components/AuthShell";
import { COUNTRIES } from "@/data/countries";
import { useI18n } from "@/lib/i18n";
import AutocompleteInput from "../ui/autocomplete-input";

type RegisterProps = {
  handleRegistration: (data: FormData) => Promise<void>;
  redirectToLogin: () => void;
  airportOptions?: string[];
};

/** Error que la página puede lanzar para indicar errores por campo (claves = name del formulario). */
export type ServerValidationError = Error & { fieldErrors?: Record<string, string> };

const DEFAULT_COUNTRY = "209";
const DEFAULT_AIRPORTS = ["LEMD", "LEBL"];

const buildSchema = (a: Record<string, string>) =>
  z
    .object({
      nombre: z.string().trim().min(1, a["required"]),
      apellidos: z.string().trim().min(1, a["required"]),
      countryID: z.string(),
      email_1: z.string().regex(/^\S+@\S+\.\S+$/, a["invalidEmail"]),
      email_2: z.string(),
      pass_1: z.string().min(8, a["passwordRequired"]),
      pass_2: z.string(),
      airport: z.string().trim().min(3, a["requiredAirport"]),
      idvatsim: z.string(),
      idivao: z.string(),
      idsimbrief: z.string(),
    })
    .superRefine((d, ctx) => {
      if (d.email_1 !== d.email_2)
        ctx.addIssue({ code: "custom", path: ["email_2"], message: a["emailMismatch"] });
      if (d.pass_1 !== d.pass_2)
        ctx.addIssue({ code: "custom", path: ["pass_2"], message: a["passMismatch"] });
    });

type RegisterValues = z.infer<ReturnType<typeof buildSchema>>;
type FieldName = keyof RegisterValues;

const DEFAULT_VALUES: RegisterValues = {
  nombre: "",
  apellidos: "",
  countryID: DEFAULT_COUNTRY,
  email_1: "",
  email_2: "",
  pass_1: "",
  pass_2: "",
  airport: "",
  idvatsim: "",
  idivao: "",
  idsimbrief: "",
};

const FORM_FIELDS = Object.keys(DEFAULT_VALUES) as FieldName[];
const isFormField = (name: string): name is FieldName => (FORM_FIELDS as string[]).includes(name);

const sectionClass = "font-display text-xs font-bold uppercase tracking-[0.25em] text-primary";

const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <p role="alert" className="mt-1 text-xs text-destructive">
      {message}
    </p>
  ) : null;

type TextFieldProps = {
  label: string;
  hint?: string;
  error?: string;
  registration: UseFormRegisterReturn;
  type?: "text" | "email" | "password";
  autoComplete?: string;
};

/** Field + input + mensaje de error, para no repetir el mismo bloque en cada campo. */
const TextField = ({ label, hint, error, registration, type = "text", autoComplete }: TextFieldProps) => (
  <Field label={label} hint={hint}>
    <input
      {...registration}
      type={type}
      autoComplete={autoComplete}
      aria-invalid={!!error}
      className={authField}
    />
    <FieldError message={error} />
  </Field>
);

export function Register({ handleRegistration, redirectToLogin, airportOptions }: RegisterProps) {
  const { t } = useI18n();
  const a = t.auth;
  const schema = useMemo(() => buildSchema(a), [a]);
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_VALUES,
  });

  // Errores devueltos por el servidor: los que coinciden con un campo van a ese campo,
  // el resto se muestra como error general encima del botón.
  const applyServerErrors = (fieldErrors: Record<string, string>) => {
    const general: string[] = [];
    Object.entries(fieldErrors).forEach(([field, message]) => {
      if (isFormField(field)) setError(field, { type: "server", message }, { shouldFocus: true });
      else general.push(message);
    });
    if (general.length) setError("root.server", { type: "server", message: general.join(" ") });
  };

  // Solo se ejecuta si zod valida; el payload sigue saliendo del propio <form>
  const onValid = async (_: RegisterValues, __?: BaseSyntheticEvent) => {
    if (!formRef.current) return;
    try {
      await handleRegistration(new FormData(formRef.current));
    } catch (err) {
      const fieldErrors = (err as ServerValidationError)?.fieldErrors;
      if (fieldErrors && Object.keys(fieldErrors).length) return applyServerErrors(fieldErrors);
      setError("root.server", {
        type: "server",
        message: err instanceof Error && err.message ? err.message : String(err),
      });
    }
  };

  const accountFields = [
    { name: "email_1", label: a.email, type: "email", autoComplete: "email" },
    { name: "email_2", label: a.email2, type: "email", autoComplete: "email" },
    { name: "pass_1", label: a.pass, type: "password", autoComplete: "new-password" },
    { name: "pass_2", label: a.pass2, type: "password", autoComplete: "new-password" },
  ] as const;

  const networkIds = [
    { name: "idvatsim", label: a.vatsim },
    { name: "idivao", label: a.ivao },
    { name: "idsimbrief", label: a.simbrief },
  ] as const;

  return (
    <AuthShell eyebrow={a.rEyebrow} title={a.rTitle} image={`${BASE}/imagenes/portada/12.jpg`}>
      {/* Posts to the existing air-spain.es registration system */}
      <form
        ref={formRef}
        method="post"
        noValidate
        onSubmit={handleSubmit(onValid)}
        className="space-y-6 rounded-xl border border-border bg-card p-8"
      >
        <p className={sectionClass}>{a.personal}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label={a.first} registration={register("nombre")} error={errors.nombre?.message} />
          <TextField label={a.last} registration={register("apellidos")} error={errors.apellidos?.message} />
        </div>
        <Field label={a.country}>
          <select {...register("countryID")} className={authField}>
            {COUNTRIES.map(([v, n]) => (
              <option key={v} value={v}>
                {n}
              </option>
            ))}
          </select>
          <FieldError message={errors.countryID?.message} />
        </Field>

        <p className={sectionClass}>{a.account}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {accountFields.map(({ name, label, type, autoComplete }) => (
            <TextField
              key={name}
              label={label}
              type={type}
              autoComplete={autoComplete}
              registration={register(name)}
              error={errors[name]?.message}
            />
          ))}
        </div>

        <p className={sectionClass}>{a.networks}</p>
        <Field label={a.airport}>
          <Controller
            name="airport"
            control={control}
            render={({ field }) => (
              <AutocompleteInput
                name={field.name}
                value={field.value}
                onChange={(e: any) => {
                  const raw = typeof e === "string" ? e : (e?.target?.value ?? "");
                  field.onChange(raw.toUpperCase());
                }}
                onBlur={field.onBlur}
                maxLength={4}
                placeholder="LEMD"
                className={`${authField} uppercase`}
                options={airportOptions ?? DEFAULT_AIRPORTS}
              />
            )}
          />
          <FieldError message={errors.airport?.message} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          {networkIds.map(({ name, label }) => (
            <TextField
              key={name}
              label={label}
              hint={a.optional}
              registration={register(name)}
              error={errors[name]?.message}
            />
          ))}
        </div>

        <FieldError message={errors.root?.["server"]?.message} />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {a.rSubmit}
        </button>
        <p className="text-center text-sm text-muted-foreground">
          {a.haveAcc}{" "}
          <button
            type="button"
            onClick={redirectToLogin}
            className="font-semibold text-secondary hover:underline"
          >
            {t.nav.login}
          </button>
        </p>
      </form>
    </AuthShell>
  );
}