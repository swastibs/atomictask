import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDownRight,
  ArrowUpRight,
  BadgeCheck,
  Check,
  CircleAlert,
  Clock3,
  Flame,
  KeyRound,
  Laptop2,
  LogOut,
  Monitor,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authApi } from "@/api/auth";
import Brand from "@/components/layout/Brand";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Skeleton from "@/components/ui/Skeleton";
import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/hooks/useAuth";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { changePasswordSchema, profileSchema } from "@/lib/validators";
import { applyServerErrors, formatDate, getInitials, getServerError } from "@/lib/utils";
import { queryClient as appQueryClient } from "@/lib/queryClient";

function SessionRow({ session, onRevoke, pending }) {
  const agent = session.userAgent || "Unknown device";
  const browserName =
    /iphone|ipad/i.test(agent) ? "iPhone / iPad"
      : /android/i.test(agent) ? "Android device"
        : /macintosh|mac os/i.test(agent) ? "Mac"
          : /windows/i.test(agent) ? "Windows PC"
            : agent.length > 54 ? `${agent.slice(0, 51)}…` : agent;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-white/[.07] bg-black/[.12] p-4 sm:flex-row sm:items-center">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/[.05] text-muted">
        {/mobile|iphone|android/i.test(agent) ? <Laptop2 className="size-4" /> : <Monitor className="size-4" />}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-medium">{browserName}</p>
          {session.current && <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-emerald-300">This device</span>}
        </div>
        <p className="mt-1 text-[10px] text-muted">
          {session.ipAddress || "IP unavailable"} <span className="px-1 text-white/20">·</span> Started {formatDate(session.createdAt)}
        </p>
        <p className="mt-1 text-[10px] text-muted/70">Expires {formatDate(session.expiresAt)}</p>
      </div>
      <Button
        aria-label={`Revoke ${session.current ? "current " : ""}session for ${browserName}`}
        className="self-start sm:self-auto"
        disabled={pending}
        onClick={() => onRevoke(session)}
        size="sm"
        variant="secondary"
      >
        {pending ? <Spinner label="Revoking session" /> : <><X className="size-3.5" /> Revoke</>}
      </Button>
    </div>
  );
}

function SessionList({ onRevoke, pendingId }) {
  const sessions = useQuery({
    queryKey: ["auth", "sessions"],
    queryFn: authApi.sessions,
    staleTime: 30_000,
    retry: 1,
  });

  if (sessions.isLoading) {
    return <div aria-label="Loading active sessions" className="space-y-3" role="status"><Skeleton className="h-[76px]" /><Skeleton className="h-[76px]" /></div>;
  }
  if (sessions.isError) {
    return <p className="flex items-center gap-2 text-xs text-rose-200"><CircleAlert className="size-4" />{getServerError(sessions.error)}</p>;
  }
  const list = sessions.data?.data || [];
  if (!list.length) {
    return <div className="rounded-xl border border-dashed border-white/10 py-8 text-center text-xs text-muted">No active sessions to show.</div>;
  }
  return (
    <div className="space-y-3">
      {list.map((session) => (
        <SessionRow
          key={session.id}
          onRevoke={onRevoke}
          pending={pendingId === session.id}
          session={session}
        />
      ))}
    </div>
  );
}

export default function Dashboard() {
  useDocumentTitle("Your dashboard");
  const { user, setUser, clear } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [sessionToRevoke, setSessionToRevoke] = useState(null);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const profile = useForm({ resolver: zodResolver(profileSchema), defaultValues: { name: user?.name || "" } });
  const password = useForm({ resolver: zodResolver(changePasswordSchema), defaultValues: { currentPassword: "", newPassword: "" } });

  const updateName = useMutation({
    mutationFn: authApi.updateMe,
    onSuccess: (response) => {
      if (response?.data) {
        setUser(response.data);
        queryClient.setQueryData(["auth", "me"], response);
        profile.reset({ name: response.data.name });
      }
      toast.success(response?.message || "Profile updated.");
    },
    onError: (error) => applyServerErrors(profile, error, ["name"]),
  });

  const changePassword = useMutation({
    mutationFn: authApi.changePassword,
    onError: (error) => applyServerErrors(password, error, ["currentPassword", "newPassword"]),
    onSuccess: (response) => {
      password.reset();
      clear();
      appQueryClient.clear();
      setPasswordOpen(false);
      toast.success(response?.message || "Password changed. Sign in again.");
      navigate("/login", { replace: true });
    },
  });

  const signOut = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => toast.success("You’re signed out. See you soon."),
    onSettled: () => {
      clear();
      appQueryClient.clear();
      navigate("/", { replace: true });
    },
  });

  const signOutAll = useMutation({
    mutationFn: authApi.logoutAll,
    onSuccess: (response) => toast.success(response?.message || "You’ve signed out everywhere."),
    onSettled: () => {
      clear();
      appQueryClient.clear();
      navigate("/", { replace: true });
    },
  });

  const revoke = useMutation({
    mutationFn: authApi.revokeSession,
    onSuccess: async () => {
      toast.success("Session revoked. You’re in control.");
      setSessionToRevoke(null);
      await queryClient.invalidateQueries({ queryKey: ["auth", "sessions"] });
      if (sessionToRevoke?.current) {
        clear();
        navigate("/login", { replace: true });
      }
    },
  });

  const selectedSession = sessionToRevoke;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-white/[.07] bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="section-wrap flex h-16 items-center justify-between">
          <Brand />
          <div className="flex items-center gap-3">
            <span className="hidden text-right sm:block"><strong className="block text-xs">{user?.name}</strong><small className="text-[10px] text-muted">{user?.email}</small></span>
            <span className="grid size-9 place-items-center rounded-full bg-brand text-xs font-bold text-white">{getInitials(user?.name)}</span>
            <Button disabled={signOut.isPending} onClick={() => signOut.mutate()} size="sm" variant="ghost">
              {signOut.isPending ? <Spinner label="Signing out" /> : <><LogOut className="size-3.5" /> Sign out</>}
            </Button>
          </div>
        </div>
      </header>

      <main className="section-wrap py-9 sm:py-12">
        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-primary">Your space / Dashboard</p>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-.05em] sm:text-4xl">
              Welcome back, {user?.name?.split(" ")[0] || "friend"} 👋
            </h1>
            <p className="mt-2 text-sm text-muted">You’re building something good. Keep going.</p>
          </div>
          {!user?.isEmailVerified && (
            <Link className="inline-flex items-center gap-2 self-start rounded-xl border border-amber-300/20 bg-amber-300/[.06] px-3 py-2 text-xs text-amber-100 sm:self-auto" to={`/verify-email?email=${encodeURIComponent(user?.email || "")}`}>
              <CircleAlert className="size-3.5" /> Verify your email
            </Link>
          )}
        </section>

        <section aria-label="Progress overview" className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            [Flame, "Your streak", "Ready when you are", "Streak tracking coming soon", "text-pink", "bg-pink/10"],
            [Sparkles, "Tasks today", "A fresh start", "Task planning coming soon", "text-cyan", "bg-cyan/10"],
            [BadgeCheck, "Badges", "First one’s waiting", "Your wins are next", "text-gold", "bg-gold/10"],
          ].map(([Icon, title, value, note, color, background]) => (
            <article className="rounded-2xl border border-white/[.08] bg-white/[.025] p-5" key={title}>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted">{title}</span>
                <span className={`grid size-9 place-items-center rounded-xl ${color} ${background}`}><Icon className="size-4" /></span>
              </div>
              <p className="mt-4 font-display text-xl font-semibold">{value}</p>
              <p className="mt-1 text-[10px] text-muted">{note}</p>
            </article>
          ))}
        </section>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.05fr_.95fr]">
          <section className="rounded-2xl border border-white/[.08] bg-white/[.025] p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-[#c8bcff]"><UserRound className="size-4" /></span>
              <div><h2 className="font-display text-lg font-semibold">Your profile</h2><p className="text-xs text-muted">Make it yours.</p></div>
            </div>
            <form className="mt-6 space-y-4" noValidate onSubmit={profile.handleSubmit((values) => updateName.mutate({ name: values.name.trim() }))}>
              <Input
                autoComplete="name"
                error={profile.formState.errors.name?.message}
                id="profile-name"
                label="Display name"
                {...profile.register("name")}
              />
              <div className="space-y-2">
                <label className="block text-sm font-medium" htmlFor="profile-email">Email</label>
                <input className="field opacity-65" id="profile-email" readOnly value={user?.email || ""} />
                <span className={`inline-flex items-center gap-1.5 text-[10px] ${user?.isEmailVerified ? "text-emerald-300" : "text-amber-200"}`}>
                  {user?.isEmailVerified ? <ShieldCheck className="size-3.5" /> : <CircleAlert className="size-3.5" />}
                  {user?.isEmailVerified ? "Email verified" : "Email not verified yet"}
                </span>
              </div>
              {profile.formState.errors.root?.server && <p className="field-error" role="alert">{profile.formState.errors.root.server.message}</p>}
              <Button disabled={updateName.isPending || !profile.formState.isDirty} type="submit">
                {updateName.isPending ? <Spinner label="Saving profile" /> : <><Check className="size-4" /> Save changes</>}
              </Button>
            </form>
          </section>

          <section className="rounded-2xl border border-white/[.08] bg-white/[.025] p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-cyan/10 text-cyan"><KeyRound className="size-4" /></span>
              <div><h2 className="font-display text-lg font-semibold">Account security</h2><p className="text-xs text-muted">You’re in control.</p></div>
            </div>
            <div className="mt-5 space-y-3">
              <div className="flex items-start gap-3 rounded-xl border border-white/[.07] bg-black/[.12] p-4">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-300" />
                <p className="text-xs leading-5 text-muted">Your refresh token stays in a secure, HTTP-only cookie. Your access token never leaves this tab.</p>
              </div>
              <Button className="w-full justify-between" onClick={() => setPasswordOpen(true)} variant="secondary">
                Change password <ArrowUpRight className="size-4" />
              </Button>
              <Button className="w-full justify-between" disabled={signOutAll.isPending} onClick={() => signOutAll.mutate()} variant="ghost">
                {signOutAll.isPending ? "Signing out…" : "Sign out everywhere"} <ArrowDownRight className="size-4" />
              </Button>
            </div>
          </section>
        </div>

        <section className="mt-4 rounded-2xl border border-white/[.08] bg-white/[.025] p-5 sm:p-6">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-violet-400/10 text-[#c8bcff]"><Users className="size-4" /></span>
              <div><h2 className="font-display text-lg font-semibold">Active sessions</h2><p className="text-xs text-muted">Devices currently signed in to your account.</p></div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[10px] text-muted"><Clock3 className="size-3.5" /> You can revoke any session</span>
          </div>
          <SessionList onRevoke={setSessionToRevoke} pendingId={revoke.isPending ? revoke.variables : null} />
        </section>

        <section className="relative mt-5 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/[.12] via-white/[.025] to-cyan/[.06] p-6 sm:p-8">
          <div className="absolute -right-10 -top-20 size-48 rounded-full bg-primary/15 blur-[65px]" />
          <div className="relative flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[.18em] text-[#c5b7ff]">Foundation secured</p>
              <h2 className="mt-2 font-display text-xl font-semibold">Task & habit modules are coming soon.</h2>
              <p className="mt-1 text-xs text-muted">Your account is ready. The next win is on its way.</p>
            </div>
            <span className="rounded-xl border border-white/10 bg-black/10 px-4 py-2 text-xs text-muted">You’re early. That’s a good thing.</span>
          </div>
        </section>
      </main>

      <Modal onClose={() => setPasswordOpen(false)} open={passwordOpen} title="Change your password">
        <p className="mb-5 text-xs leading-5 text-muted">You’ll be signed out on this device after your password changes.</p>
        <form className="space-y-4" noValidate onSubmit={password.handleSubmit((values) => changePassword.mutate({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }))}>
          <Input autoComplete="current-password" error={password.formState.errors.currentPassword?.message} id="current-password" label="Current password" type="password" {...password.register("currentPassword")} />
          <Input autoComplete="new-password" error={password.formState.errors.newPassword?.message} id="new-password" label="New password" type="password" {...password.register("newPassword")} />
          {changePassword.isError && <p className="field-error" role="alert">{getServerError(changePassword.error)}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <Button onClick={() => setPasswordOpen(false)} variant="ghost">Cancel</Button>
            <Button disabled={changePassword.isPending} type="submit">{changePassword.isPending ? <Spinner label="Changing password" /> : "Update password"}</Button>
          </div>
        </form>
      </Modal>

      <Modal onClose={() => setSessionToRevoke(null)} open={Boolean(selectedSession)} title="Revoke this session?">
        <p className="text-sm leading-6 text-muted">
          {selectedSession?.current
            ? "This is the device you’re using now. You’ll be signed out as soon as it’s revoked."
            : "This device will be signed out the next time it tries to refresh its session."}
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button onClick={() => setSessionToRevoke(null)} variant="ghost">Keep session</Button>
          <Button
            disabled={revoke.isPending}
            onClick={() => selectedSession && revoke.mutate(selectedSession.id)}
            variant="danger"
          >
            {revoke.isPending ? <Spinner label="Revoking session" /> : "Revoke session"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
