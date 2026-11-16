import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, Eye, EyeOff, Mail, Sparkles } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { authApi } from "@/api/auth";
import { applyServerErrors, passwordBytes } from "@/lib/utils";
import { registerSchema } from "@/lib/validators";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
import OAuthButtons from "@/components/auth/OAuthButtons";
import PasswordStrength from "@/components/auth/PasswordStrength";

export default function RegisterForm() {
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [visible, setVisible] = useState(false);
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });
  const resend = useMutation({
    mutationFn: authApi.resendVerification,
    onSuccess: (response) => toast.success(response?.message || "If your account needs verification, a link is on its way."),
  });
  const mutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (_response, values) => {
      setRegisteredEmail(values.email);
      toast.success("Check your inbox to verify your email.");
    },
    onError: (error) => applyServerErrors(form, error, ["name", "email", "password"]),
  });
  const password = useWatch({ control: form.control, name: "password" });

  if (registeredEmail) {
    return (
      <div className="auth-form-content auth-success-content">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-emerald-400/10 text-emerald-300">
          <CheckCircle2 className="size-7" />
        </span>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[.18em] text-emerald-300">You’re one click away</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-.05em]">Check your inbox ✉️</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          We sent a verification link to <strong className="text-white">{registeredEmail}</strong>. Verify your email to unlock your account.
        </p>
        <Button
          className="mt-6 w-full"
          disabled={resend.isPending}
          onClick={() => resend.mutate({ email: registeredEmail })}
          variant="secondary"
        >
          {resend.isPending ? <Spinner label="Sending" /> : <><Mail className="size-4" /> Resend verification email</>}
        </Button>
        <p className="mt-5 text-xs text-muted">Wrong email? <button className="text-white underline" onClick={() => setRegisteredEmail("")} type="button">Start over</button></p>
      </div>
    );
  }

  return (
    <div className="auth-form-content">
      <p className="font-mono text-[10px] uppercase tracking-[.18em] text-primary">Create your account</p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-.05em] sm:text-4xl">Let’s get your streak started.</h1>
      <p className="mt-2 text-sm text-muted">One account. A lot of little wins.</p>
      <div className="mt-6"><OAuthButtons /></div>
      <div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-[.15em] text-muted/70">
        <span className="h-px flex-1 bg-white/10" /> or sign up with email <span className="h-px flex-1 bg-white/10" />
      </div>
      <form className="space-y-3.5" noValidate onSubmit={form.handleSubmit((values) => mutation.mutate({
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
      }))}>
        <Input
          autoComplete="name"
          error={form.formState.errors.name?.message}
          id="register-name"
          label="Name"
          placeholder="What should we call you?"
          {...form.register("name")}
        />
        <Input
          autoComplete="email"
          error={form.formState.errors.email?.message}
          id="register-email"
          label="Email"
          placeholder="you@example.com"
          type="email"
          {...form.register("email")}
        />
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="register-password">Password</label>
          <div className="relative">
            <input
              aria-invalid={Boolean(form.formState.errors.password)}
              autoComplete="new-password"
              className="field pr-12"
              id="register-password"
              placeholder="Make it a good one"
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
          <PasswordStrength password={password} />
        </div>
        <Input
          autoComplete="new-password"
          error={form.formState.errors.confirmPassword?.message}
          id="register-confirm"
          label="Confirm password"
          placeholder="One more time"
          type="password"
          {...form.register("confirmPassword")}
          hint={password ? `${passwordBytes(password)} / 72 UTF-8 bytes` : undefined}
        />
        {form.formState.errors.root?.server && (
          <p aria-live="polite" className="rounded-xl border border-rose-300/20 bg-rose-300/[.06] p-3 text-xs leading-5 text-rose-200" role="alert">
            {form.formState.errors.root.server.message}
          </p>
        )}
        <Button className="w-full" disabled={mutation.isPending} type="submit">
          {mutation.isPending ? <Spinner label="Creating your account" /> : <>Create free account <ArrowRight className="size-4" /></>}
        </Button>
      </form>
      <p className="mt-5 text-center text-xs text-muted">
        Already have an account? <Link className="font-semibold text-white hover:text-[#b8a8ff]" to="/login">Sign in</Link>
      </p>
      <p className="mt-4 flex items-center justify-center gap-1 text-[10px] text-muted/70">
        <Sparkles className="size-3" /> Free forever tier · No credit card
      </p>
    </div>
  );
}
