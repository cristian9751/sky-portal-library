import "../styles.css"
import { Login } from "@/components/pages/login";

export const LoginPreview = () => {


  return (
    <Login handleLogin={async (data : FormData) => {
        // Simulate login logic
        const username = data.get("usuario");
        const password = data.get("pass");
        if (username !== "XSN000" || password !== "password") {
          throw new Error("invalidCredentials");
        }
      }} redirectToRegister={() => () => { alert("Redirecting to register..."); }} />
  );
}


