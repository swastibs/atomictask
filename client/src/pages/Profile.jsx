import { useEffect, useState } from "react";
import { Check, Loader2, Save, ShieldCheck } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { apiError } from "../api/tasks";
import { userApi } from "../api/users";
import axiosInstance from "../api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    username: user?.username || "",
    avatar: user?.avatar || "",
  });
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  useEffect(() => {
    userApi
      .profile()
      .then((profile) => {
        updateUser(profile);
        setForm({
          name: profile.name || "",
          username: profile.username || "",
          avatar: profile.avatar || "",
        });
      })
      .catch(() => {});
  }, [updateUser]);

  const updateForm = (key) => (event) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));
  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const profile = await userApi.updateProfile(form);
      updateUser(profile);
      setForm({
        name: profile.name || "",
        username: profile.username || "",
        avatar: profile.avatar || "",
      });
      setMessage({ type: "success", text: "Profile saved." });
    } catch (requestError) {
      setMessage({ type: "error", text: apiError(requestError) });
    } finally {
      setSaving(false);
    }
  };
  const updatePassword = async (event) => {
    event.preventDefault();
    if (password.newPassword !== password.confirmNewPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }
    setPasswordSaving(true);
    setMessage({ type: "", text: "" });
    try {
      await axiosInstance.post("/auth/change-password", password);
      setPassword({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setMessage({
        type: "success",
        text: "Password updated. Please sign in again next time.",
      });
    } catch (requestError) {
      setMessage({ type: "error", text: apiError(requestError) });
    } finally {
      setPasswordSaving(false);
    }
  };
  return (
    <div className="mx-auto grid max-w-5xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:py-12">
      <Card className="h-fit">
        <CardHeader>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Account
          </p>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid size-16 place-items-center rounded-full bg-[var(--accent-atomic)] text-2xl font-semibold text-[var(--accent-atomic-foreground)]">
            {form.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <form onSubmit={saveProfile} className="space-y-4">
            <div>
              <Label htmlFor="profile-name">Name</Label>
              <Input
                id="profile-name"
                value={form.name}
                onChange={updateForm("name")}
                required
              />
            </div>
            <div>
              <Label htmlFor="profile-username">Username</Label>
              <Input
                id="profile-username"
                value={form.username}
                onChange={updateForm("username")}
                placeholder="Optional username"
              />
            </div>
            <div>
              <Label>Email</Label>
              <p className="mt-2 break-all text-sm text-muted-foreground">
                {user?.email}
              </p>
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="animate-spin" /> : <Save />} Save
              profile
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Security
          </p>
          <CardTitle>Account security</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex gap-3 rounded-xl bg-muted/40 p-4 text-sm">
            <ShieldCheck className="size-5 shrink-0 text-[var(--accent-atomic)]" />
            <span>
              Keep your password unique and at least four characters long.
            </span>
          </div>
          <Separator className="mb-6" />
          <form onSubmit={updatePassword} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={password.currentPassword}
                onChange={(event) =>
                  setPassword({
                    ...password,
                    currentPassword: event.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="newPassword">New password</Label>
              <Input
                id="newPassword"
                type="password"
                value={password.newPassword}
                onChange={(event) =>
                  setPassword({ ...password, newPassword: event.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="confirmNewPassword">Confirm new password</Label>
              <Input
                id="confirmNewPassword"
                type="password"
                value={password.confirmNewPassword}
                onChange={(event) =>
                  setPassword({
                    ...password,
                    confirmNewPassword: event.target.value,
                  })
                }
                required
              />
            </div>
            {message.text && (
              <p
                className={
                  message.type === "error"
                    ? "text-sm text-destructive"
                    : "text-sm text-emerald-600"
                }
                role="status"
              >
                {message.type === "success" && (
                  <Check className="mr-1 inline size-4" />
                )}
                {message.text}
              </p>
            )}
            <Button type="submit" disabled={passwordSaving}>
              {passwordSaving ? (
                <Loader2 className="animate-spin" />
              ) : (
                <ShieldCheck />
              )}{" "}
              Update password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
