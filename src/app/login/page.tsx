import { AuthGate } from "../../components/auth-gate";
import { LoginPage } from "../../screens/auth/login-page";

export default function Page() {
  return (
    <AuthGate guestOnly>
      <LoginPage />
    </AuthGate>
  );
}
