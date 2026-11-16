import AuthLayout from "@/components/layout/AuthLayout";
import VerifyEmailView from "@/components/auth/VerifyEmailView";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function VerifyEmail() {
  useDocumentTitle("Verify your email");
  return <AuthLayout eyebrow="One quick step"><VerifyEmailView /></AuthLayout>;
}
