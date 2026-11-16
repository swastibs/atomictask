import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Spinner from "@/components/ui/Spinner";

export function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <div className="grid min-h-screen place-items-center text-muted">
        <Spinner label="Restoring your session" />
      </div>
    );
  }
  if (status !== "authenticated") {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }
  return <Outlet />;
}

export function GuestRoute() {
  const { status } = useAuth();
  return status === "authenticated" ? <Navigate replace to="/dashboard" /> : <Outlet />;
}
