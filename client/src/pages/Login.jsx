import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ThemeToggle from "@/components/ThemeToggle";
import { ArrowRight, Atom } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setApiError("");
      await login(data.email, data.password);
      navigate("/dashboard");
    } catch (err) {
      setApiError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
      {/* Background accent */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `radial-gradient(60% 40% at 50% 20%, color-mix(in oklch, var(--accent-atomic) 12%, transparent), transparent 70%)`,
        }}
      />

      {/* Theme toggle - top right */}
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md border-border/60 shadow-2xl shadow-foreground/5">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-heading text-xl font-semibold tracking-tight"
            >
              <Atom
                className="size-6"
                style={{ color: "var(--accent-atomic)" }}
              />
              AtomicTask
            </Link>
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Welcome back
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Log in to continue building your streaks.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className="h-10"
              />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className="h-10"
              />
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            {apiError && <p className="text-sm text-destructive">{apiError}</p>}

            <Button
              type="submit"
              className="cta-button w-full justify-center text-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in…" : "Log in"}
              <ArrowRight className="size-4" />
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              Don’t have an account?{" "}
            </span>
            <Link
              to="/signup"
              className="font-medium transition-colors hover:underline"
              style={{ color: "var(--accent-atomic)" }}
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
