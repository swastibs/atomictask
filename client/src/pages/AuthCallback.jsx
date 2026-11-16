import AuthLayout from "@/components/layout/AuthLayout";
import OAuthCallback from "@/components/auth/OAuthCallback";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function AuthCallback() {
  useDocumentTitle("Finishing sign in");
  return <AuthLayout eyebrow="Almost there"><OAuthCallback /></AuthLayout>;
}
