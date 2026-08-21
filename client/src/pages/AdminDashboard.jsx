import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Users, ShoppingBag } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get("/users/admin/dashboard");
        setStats(res.data.data.stats);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 sm:px-6"><div className="h-10 w-64 animate-pulse rounded-lg bg-muted" /><div className="grid gap-6 md:grid-cols-2"><div className="h-32 animate-pulse rounded-xl bg-muted" /><div className="h-32 animate-pulse rounded-xl bg-muted" /></div></div>;
  if (error) return <div className="mx-auto flex max-w-xl items-center gap-3 px-4 py-16 text-sm text-destructive"><AlertCircle className="size-5 shrink-0" />{error}</div>;

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
      <div><p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Operations</p><h1 className="mt-2 font-heading text-3xl font-semibold">Admin Dashboard</h1><p className="mt-2 text-muted-foreground">A quick read on the workspace.</p></div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Total Users</CardTitle>
            <Users className="text-[var(--accent-atomic)]" />
          </CardHeader>
          <CardContent>
            <p className="font-heading text-4xl font-semibold">{stats.totalUsers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Total Orders</CardTitle>
            <ShoppingBag className="text-[var(--accent-atomic)]" />
          </CardHeader>
          <CardContent>
            <p className="font-heading text-4xl font-semibold">{stats.totalOrders}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
