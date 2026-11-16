import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, MailCheck, RefreshCw } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { authApi } from "@/api/auth";
import { getServerError } from "@/lib/utils";
import { emailSchema } from "@/lib/validators";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";

const isToken = (token) => /^[a-f\d]{64}$/i.test(token || "");

export default function VerifyEmailView() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const emailFromLink = params.get("email") || "";
  const attempted = useRef(false);
  const verify = useMutation({
    mutationFn: authApi.verifyEmail,
    onSuccess: (response) => toast.success(response?.message || "Email verified. You can sign in now."),
  });
  const verifyEmail = verify.mutate;
  const resend = useMutation({
    mutationFn: authApi.resendVerification,
    onSuccess: (response) => toast.success(response?.message || "If the account needs verification, an email is on its way."),
  });
  const form = useForm({ resolver: zodResolver(emailSchema), defaultValues: { email: emailFromLink } });

  useEffect(() => {
    if (!isToken(token) || attempted.current) return;
    attempted.current = true;
    verifyEmail({ token });
  }, [token, verifyEmail]);

  if (verify.isPending) {
    return (
      <div className="py-14 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-[#c8bcff]"><Spinner label="Verifying your email" className="size-6" /></span>
        <h1 className="mt-6 font-display text-3xl font-semibold">Checking your link…</h1>
        <p className="mt-2 text-sm text-muted">This won’t take long.</p>
      </div>
    );
  }

  if (verify.isSuccess) {
    return (
      <div className="py-4 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-emerald-300/10 text-emerald-200"><CheckCircle2 className="size-7" /></span>
        <h1 className="mt-6 font-display text-3xl font-semibold">Email verified! 🎉</h1>
        <p className="mt-3 text-sm text-muted">You’re all set. Sign in and let’s make something of today.</p>
        <Button as={Link} className="mt-6 w-full" to="/login">Go to sign in <ArrowRight className="size-4" /></Button>
      </div>
    );
  }

  const linkError = token && (!isToken(token) || verify.isError);
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[.18em] text-primary">Email verification</p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-.05em]">
        {linkError ? "This link has expired." : "One quick inbox check."}
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted">
        {linkError
          ? getServerError(verify.error, "This verification link is invalid or expired. Send yourself a fresh one.")
          : "Enter your email and we’ll send a fresh verification link."}
      </p>
      <form className="mt-6 space-y-4" noValidate onSubmit={form.handleSubmit((values) => resend.mutate({ email: values.email }))}>
        <Input
          autoComplete="email"
          error={form.formState.errors.email?.message}
          id="verify-email-address"
          label="Email"
          placeholder="you@example.com"
          type="email"
          {...form.register("email")}
        />
        <Button className="w-full" disabled={resend.isPending} type="submit" variant={linkError ? "primary" : "secondary"}>
          {resend.isPending ? <Spinner label="Sending verification email" /> : <><RefreshCw className="size-4" /> Resend verification email</>}
        </Button>
      </form>
      {resend.isSuccess && (
        <p className="mt-4 flex items-center gap-2 text-xs text-emerald-200" role="status">
          <MailCheck className="size-4" /> If your account needs verification, a link is on its way.
        </p>
      )}
      <p className="mt-6 text-center text-xs text-muted">Already verified? <Link className="text-white underline" to="/login">Sign in</Link></p>
    </div>
  );
}
