import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { authApi } from "@/api/auth";
import { emailSchema } from "@/lib/validators";
import { applyServerErrors } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";

export default function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const form = useForm({ resolver: zodResolver(emailSchema), defaultValues: { email: "" } });
  const mutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: (response) => {
      setSent(true);
      toast.success(response?.message || "If an account exists, we sent reset instructions.");
    },
    onError: (error) => applyServerErrors(form, error, ["email"]),
  });

  if (sent) {
    return (
      <div className="py-4 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-[#c8bcff]"><Mail className="size-6" /></span>
        <h1 className="mt-6 font-display text-3xl font-semibold tracking-[-.05em]">Check your inbox.</h1>
        <p className="mt-3 text-sm leading-6 text-muted">If an account exists for that email, we’ve sent reset instructions. You can close this tab and check your email.</p>
        <CheckCircle2 className="mx-auto mt-5 size-5 text-emerald-300" />
        <Link className="mt-6 inline-flex items-center gap-2 text-xs text-white hover:text-[#c8bcff]" to="/login"><ArrowLeft className="size-3.5" /> Back to sign in</Link>
      </div>
    );
  }

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[.18em] text-primary">Password reset</p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-.05em]">Let’s get you back in.</h1>
      <p className="mt-2 text-sm leading-6 text-muted">Share the email on your account. If it’s registered, we’ll send you a reset link.</p>
      <form className="mt-7 space-y-4" noValidate onSubmit={form.handleSubmit((values) => mutation.mutate({ email: values.email }))}>
        <Input
          autoComplete="email"
          error={form.formState.errors.email?.message}
          id="forgot-email"
          label="Email"
          placeholder="you@example.com"
          type="email"
          {...form.register("email")}
        />
        {form.formState.errors.root?.server && <p className="field-error" role="alert">{form.formState.errors.root.server.message}</p>}
        <Button className="w-full" disabled={mutation.isPending} type="submit">
          {mutation.isPending ? <Spinner label="Sending reset link" /> : <>Send reset link <Mail className="size-4" /></>}
        </Button>
      </form>
      <Link className="mt-6 inline-flex items-center gap-2 text-xs text-muted hover:text-white" to="/login"><ArrowLeft className="size-3.5" /> Back to sign in</Link>
    </div>
  );
}
