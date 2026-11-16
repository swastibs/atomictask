import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Eye, EyeOff, MailCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { authApi } from "@/api/auth";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema } from "@/lib/validators";
import { applyServerErrors, getServerError } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
import OAuthButtons from "@/components/auth/OAuthButtons";

export default function LoginForm() {
  const [visible, setVisible] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const queryClient = useQueryClient();
  const from = location.state?.from?.pathname || "/dashboard";
  const form = useForm({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });
  const resend = useMutation({
    mutationFn: authApi.resendVerification,
    onSuccess: (response) => toast.success(response?.message || "If your account needs verification, a link is on its way."),
  });

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: async (response) => {
      const tokens = response?.data;
      if (!tokens?.accessToken || !tokens.user) {
        form.setError("root.server", { message: "Sign-in response was incomplete. Please try again." });
        return;
      }
      login(tokens);
      queryClient.setQueryData(["auth", "me"], { success: true, data: tokens.user });
      try {
        const current = await queryClient.fetchQuery({
          queryKey: ["auth", "me"],
          queryFn: authApi.me,
          staleTime: 0,
        });
        if (current?.data) login({ ...tokens, user: current.data });
      } catch {
        // The signed-in user from the login response remains available if hydration is briefly offline.
      }
      toast.success("You’re back. Let’s make today count.");
      navigate(from, { replace: true });
    },
    onError: (error) => {
      const message = getServerError(error);
      applyServerErrors(form, error, ["email", "password"]);
      if (error?.response?.status === 403 && message.toLowerCase().includes("verify your email")) {
        setVerificationEmail(form.getValues("email"));
      }
    },
  });

  useEffect(() => {
    if (params.get("reason") === "session_expired") {
      toast.info("Your session expired. Sign in again to continue.");
    }
  }, [params]);

  const onSubmit = (values) => {
    setVerificationEmail("");
    mutation.mutate({ email: values.email, password: values.password });
  };

  return (
    <div className="auth-form-content">
      <p className="font-mono text-[10px] uppercase tracking-[.18em] text-primary">Sign in</p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-.05em] sm:text-4xl">Good to have you back.</h1>
      <p className="mt-2 text-sm text-muted">Pick up right where your momentum left off.</p>
      <div className="mt-7"><OAuthButtons /></div>
      <div className="my-6 flex items-center gap-3 text-[10px] uppercase tracking-[.15em] text-muted/70">
        <span className="h-px flex-1 bg-white/10" /> or use email <span className="h-px flex-1 bg-white/10" />
      </div>
      {verificationEmail && (
        <div className="mb-5 rounded-xl border border-amber-300/20 bg-amber-300/[.06] p-4" role="status">
          <div className="flex items-start gap-3">
            <MailCheck className="mt-0.5 size-4 shrink-0 text-amber-200" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-amber-100">One quick step before you’re in</p>
              <p className="mt-1 text-[11px] leading-5 text-muted">Verify your email, then sign in again.</p>
              <button
                className="mt-2 text-xs font-semibold text-amber-100 underline underline-offset-4 disabled:opacity-50"
                disabled={resend.isPending}
                onClick={() => resend.mutate({ email: verificationEmail })}
                type="button"
              >
                {resend.isPending ? "Sending…" : "Resend verification email"}
              </button>
            </div>
          </div>
        </div>
      )}
      <form className="space-y-4" noValidate onSubmit={form.handleSubmit(onSubmit)}>
        <Input
          autoComplete="email"
          error={form.formState.errors.email?.message}
          id="login-email"
          label="Email"
          placeholder="you@example.com"
          type="email"
          {...form.register("email")}
        />
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium" htmlFor="login-password">Password</label>
            <Link className="text-xs text-[#b8a8ff] hover:text-white" to="/forgot-password">Forgot password?</Link>
          </div>
          <div className="relative">
            <input
              aria-invalid={Boolean(form.formState.errors.password)}
              autoComplete="current-password"
              className="field pr-12"
              id="login-password"
              placeholder="Your password"
              type={visible ? "text" : "password"}
              {...form.register("password")}
            />
            <button
              aria-label={visible ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted hover:text-white"
              onClick={() => setVisible((value) => !value)}
              type="button"
            >
              {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {form.formState.errors.password && <span className="field-error">{form.formState.errors.password.message}</span>}
        </div>
        {form.formState.errors.root?.server && (
          <p aria-live="polite" className="rounded-xl border border-rose-300/20 bg-rose-300/[.06] p-3 text-xs leading-5 text-rose-200" role="alert">
            {form.formState.errors.root.server.message}
          </p>
        )}
        <Button className="w-full" disabled={mutation.isPending} type="submit">
          {mutation.isPending ? <Spinner label="Signing in" /> : <>Sign in <ArrowRight className="size-4" /></>}
        </Button>
      </form>
      <p className="mt-6 text-center text-xs text-muted">
        New here? <Link className="font-semibold text-white hover:text-[#b8a8ff]" to="/register">Create an account</Link>
      </p>
    </div>
  );
}
