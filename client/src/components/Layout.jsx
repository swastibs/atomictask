import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Layout() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    // The interceptor will already redirect, but we force a full page reload
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-card text-card-foreground shadow-sm border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link to="/dashboard" className="font-bold text-lg">
            AtomicTask
          </Link>
          <Link to="/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>
          <Link to="/profile" className="hover:text-blue-600">
            Profile
          </Link>
          {user?.role === "admin" && (
            <Link to="/admin" className="hover:text-purple-600">
              Admin
            </Link>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            {user?.name || user?.email}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
