import "../styles.css"
import { LangProvider, useI18n } from "@/lib/i18n";
import { AuthShell, Field, authField } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/SiteLayout";
import { Login } from "@/components/pages/login";

function LoginPreview() {
  const { t } = useI18n();
  const a = t.auth;

  return (
    <SiteLayout >
      <Login handleLogin={async (data : FormData) => {
        // Simulate login logic
        const username = data.get("usuario");
        const password = data.get("pass");
        if (username !== "XSN000" || password !== "password") {
          throw new Error("Invalid credentials");
        }
      }} redirectToRegister={() => () => { alert("Redirecting to register..."); }} />
    </SiteLayout>
  );
}


