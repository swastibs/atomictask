import AuthLayout from "@/components/layout/AuthLayout";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function ResetPassword() {
  useDocumentTitle("Choose a new password");
  return <AuthLayout eyebrow="Fresh start"><ResetPasswordForm /></AuthLayout>;
}
