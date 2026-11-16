import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, CircleAlert } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { authApi } from "@/api/auth";
import { useAuth } from "@/hooks/useAuth";
import { getServerError } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";

const validCode = (code) => /^[a-f\d]{64}$/i.test(code || "");

export default function OAuthCallback() {
  const [params] = useSearchParams();
  const code = params.get("code");
  const backendError = params.get("error");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { login } = useAuth();
  const started = useRef(false);

  const exchange = useMutation({
    mutationFn: async (input) => {
      const response = await authApi.exchangeOAuthCode(input);
      if (!response?.data?.accessToken || !response.data.user) {
        throw new Error("Sign-in finished without a session. Please try again.");
      }
      return response;
    },
    onSuccess: async (response) => {
      const tokens = response?.data;
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
        // The user from the exchange response is sufficient to continue.
      }
      toast.success("You’re in. Let’s make today count.");
      navigate("/dashboard", { replace: true });
    },
  });
  const exchangeCode = exchange.mutate;

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    window.history.replaceState({}, "", "/auth/callback");
    if (!backendError && validCode(code)) exchangeCode({ code });
  }, [code, backendError, exchangeCode]);

  const message = backendError
    ? "That sign-in didn’t go through. Pick another way to get in."
    : !validCode(code)
      ? "This sign-in link is missing or expired. Start again from the login page."
      : exchange.isError
        ? getServerError(exchange.error, "That sign-in link has expired. Try again.")
        : "";

  if (message) {
    return (
      <div className="py-5 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-rose-300/10 text-rose-200"><CircleAlert className="size-6" /></span>
        <h1 className="mt-6 font-display text-3xl font-semibold">A small detour.</h1>
        <p className="mt-3 text-sm leading-6 text-muted">{message}</p>
        <Button as={Link} className="mt-6 w-full" to="/login">Back to sign in <ArrowRight className="size-4" /></Button>
      </div>
    );
  }

  if (exchange.isSuccess) {
    return (
      <div className="py-8 text-center">
        <CheckCircle2 className="mx-auto size-8 text-emerald-300" />
        <p className="mt-4 text-sm">You’re all set. Heading to your dashboard…</p>
      </div>
    );
  }

  return (
    <div className="py-10 text-center">
      <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-[#c8bcff]"><Spinner className="size-6" label="Finishing sign-in" /></span>
      <h1 className="mt-6 font-display text-2xl font-semibold">Finishing sign-in…</h1>
      <p className="mt-2 text-sm text-muted">One last step, then you’re in.</p>
    </div>
  );
}
