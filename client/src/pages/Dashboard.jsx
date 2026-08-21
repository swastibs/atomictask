import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">
        Welcome, {user?.name || user?.email}!
      </h1>
      <p className="text-gray-600">Role: {user?.role}</p>
    </div>
  );
}
