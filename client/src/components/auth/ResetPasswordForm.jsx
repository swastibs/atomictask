import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, Eye, EyeOff, KeyRound } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { authApi } from "@/api/auth";
import { applyServerErrors, getServerError } from "@/lib/utils";
import { resetPasswordSchema } from "@/lib/validators";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PasswordStrength from "@/components/auth/PasswordStrength";
import Spinner from "@/components/ui/Spinner";

const isToken = (token) => /^[a-f\d]{64}$/i.test(token || "");

export default function ResetPasswordForm() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [visible, setVisible] = useState(false);
  const form = useForm({ resolver: zodResolver(resetPasswordSchema), defaultValues: { password: "", confirmPassword: "" } });
  const mutation = useMutation({
    mutationFn: authApi.resetPassword,
    onError: (error) => applyServerErrors(form, error, ["password"]),
    onSuccess: (response) => toast.success(response?.message || "Password reset. Sign in with your new password."),
  });
  const password = useWatch({ control: form.control, name: "password" });

  if (!isToken(token)) {
    return (
      <div className="text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-rose-300/10 text-rose-200"><KeyRound className="size-6" /></span>
        <h1 className="mt-6 font-display text-3xl font-semibold">This link needs a refresh.</h1>
        <p className="mt-3 text-sm leading-6 text-muted">The reset link is missing or doesn’t look right. Request a new one and we’ll get you back on track.</p>
        <Button as={Link} className="mt-6 w-full" to="/forgot-password">Request a new link</Button>
      </div>
    );
  }

  if (mutation.isSuccess) {
    return (
      <div className="text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-emerald-300/10 text-emerald-200"><CheckCircle2 className="size-7" /></span>
        <h1 className="mt-6 font-display text-3xl font-semibold">Password reset.</h1>
        <p className="mt-3 text-sm text-muted">Sign in with your new password and get back to it.</p>
        <Button as={Link} className="mt-6 w-full" to="/login">Sign in <ArrowRight className="size-4" /></Button>
      </div>
    );
  }

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[.18em] text-primary">New password</p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-.05em]">Make it a fresh start.</h1>
      <p className="mt-2 text-sm text-muted">Choose a strong password you haven’t used here before.</p>
      <form className="mt-7 space-y-4" noValidate onSubmit={form.handleSubmit((values) => mutation.mutate({ token, password: values.password }))}>
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="reset-password">New password</label>
          <div className="relative">
            <input
              autoComplete="new-password"
              className="field pr-12"
              id="reset-password"
              placeholder="12 characters or more"
              type={visible ? "text" : "password"}
              {...form.register("password")}
            />
            <button aria-label={visible ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-white" onClick={() => setVisible((value) => !value)} type="button">
              {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {form.formState.errors.password && <span className="field-error">{form.formState.errors.password.message}</span>}
          <PasswordStrength password={password} />
        </div>
        <Input
          autoComplete="new-password"
          error={form.formState.errors.confirmPassword?.message}
          id="reset-confirm"
          label="Confirm new password"
          placeholder="One more time"
          type="password"
          {...form.register("confirmPassword")}
        />
        {mutation.isError && (
          <div className="rounded-xl border border-rose-300/20 bg-rose-300/[.06] p-3 text-xs text-rose-200" role="alert">
            {getServerError(mutation.error, "That link expired or is invalid. Request a new one.")}
            <Link className="ml-1 underline" to="/forgot-password">Request a new link</Link>
          </div>
        )}
        <Button className="w-full" disabled={mutation.isPending} type="submit">
          {mutation.isPending ? <Spinner label="Updating password" /> : <>Update password <ArrowRight className="size-4" /></>}
        </Button>
      </form>
    </div>
  );
}
