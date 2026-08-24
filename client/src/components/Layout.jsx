import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import SideNav from "./SideNav";

export default function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="hidden lg:block">
        <SideNav />
      </div>
      <div className="lg:hidden">
        <Navbar />
      </div>
      <main className="min-h-screen lg:pl-64">
        <Outlet />
      </main>
    </div>
  );
}
