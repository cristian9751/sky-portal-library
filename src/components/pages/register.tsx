import { BASE } from "@/components/SiteLayout";
import { AuthShell } from "@/components/AuthShell";
import { useI18n } from "@/lib/i18n";
import { RegisterForm } from "";
import type { RegisterFormProps } from "./RegisterForm";

// Se mantiene el export para no romper imports existentes
export type { ServerValidationError } from "./RegisterForm";

type RegisterProps = RegisterFormProps;

export function Register(props: RegisterProps) {
  const { t } = useI18n();
  const a = t.auth;

  return (
    <AuthShell eyebrow={a.rEyebrow} title={a.rTitle} image={`${BASE}/imagenes/portada/12.jpg`}>
      <RegisterForm {...props} />
    </AuthShell>
  );
}