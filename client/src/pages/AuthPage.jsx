import AuthLayout from "@/components/layout/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useLocation } from "react-router-dom";

export default function AuthPage() {
  const { pathname } = useLocation();
  const mode = pathname === "/register" ? "register" : "login";

  useDocumentTitle(mode === "register" ? "Create your account" : "Sign in");

  return (
    <AuthLayout
      loginForm={<LoginForm />}
      mode={mode}
      registerForm={<RegisterForm />}
    />
  );
}
