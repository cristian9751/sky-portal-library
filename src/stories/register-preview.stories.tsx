
import "../styles.css";
import { Register } from "@/components/pages/register";

export const Registration = () => (
  <Register
    handleRegistration={async (data: FormData) => {
      // Simulate registration logic
      const email = data.get("email_1");
      const password = data.get("pass_1");

      if (!email || !password) {
        throw new Error("missingFields");
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

    }}
    redirectToLogin={() => (event) => {
      event.preventDefault();
      alert("Redirecting to login...");
    }}
  />
);