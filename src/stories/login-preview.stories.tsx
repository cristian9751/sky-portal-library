import "../styles.css";
import { Login } from "@/components/pages/login";

export const LoginPreview = () => (
  <Login
    handleLogin={async (data: FormData) => {
      const username = data.get("usuario");
      const password = data.get("pass");
      if (username !== "XSN000" || password !== "password") {
        throw new Error("invalidCredentials");
      }
    }}
    redirectToRegister={() => window.alert("Redirecting to register...")}
  />
);
