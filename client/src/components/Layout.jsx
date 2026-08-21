import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="min-h-screen pt-16">
        <Outlet />
      </main>
    </div>
  );
}
