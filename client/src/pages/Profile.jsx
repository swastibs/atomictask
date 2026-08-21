import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import axiosInstance from "../api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Profile() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      await axiosInstance.post("/auth/update-password", {
        currentPassword,
        newPassword,
        confirmNewPassword: confirmPassword, // backend expects confirmNewPassword
      });
      setMessage({ type: "success", text: "Password updated successfully" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update password",
      });
    } finally {
      setLoading(false);
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
          <div className="rounded-xl bg-muted/40 p-4">
            <Label className="text-xs text-muted-foreground">Name</Label>
            <p className="mt-1 text-lg font-medium">{user?.name}</p>
          </div>
          <div>
            <Label>Email</Label>
            <p className="mt-1 text-lg font-medium break-all">{user?.email}</p>
          </div>
          <div>
            <Label>Role</Label>
            <p className="mt-1 text-lg font-medium capitalize">{user?.role}</p>
          </div>

          <Separator className="my-4" />
          <h3 className="text-md font-semibold">Update Password</h3>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {message.text && (
              <p
                className={`text-sm ${
                  message.type === "error" ? "text-red-500" : "text-green-500"
                }`}
              >
                {message.text}
              </p>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
