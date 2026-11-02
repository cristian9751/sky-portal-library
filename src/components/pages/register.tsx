import { BASE } from "@/components/SiteLayout";
import { AuthShell } from "@/components/AuthShell";
import { useI18n } from "@/lib/i18n";
import { RegisterForm } from "@/components/forms/RegisterForm";
import type { RegisterFormProps } from "@/components/forms/RegisterForm";
import { useApplicationContext } from "@/lib/ApplicationContext";

// Se mantiene el export para no romper imports existentes
export type { ServerValidationError } from "@/components/forms/RegisterForm";

type RegisterProps = Omit<RegisterFormProps, "submitButtonLabel">;

export function Register(props: RegisterProps) {
  const { user } = useApplicationContext();
  const { t } = useI18n();
  const a = t.auth;

  return (
    <AuthShell eyebrow={a.rEyebrow} title={a.rTitle} image={`${BASE}/imagenes/portada/12.jpg`}>
      <RegisterForm {...props} user={user} />
    </AuthShell>
  );
}