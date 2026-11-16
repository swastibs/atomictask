import AuthLayout from "@/components/layout/AuthLayout";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function ForgotPassword() {
  useDocumentTitle("Reset your password");
  return <AuthLayout eyebrow="Back on track"><ForgotPasswordForm /></AuthLayout>;
}
