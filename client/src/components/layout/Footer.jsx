import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Atom } from "lucide-react";
import { Link } from "react-router-dom";
import { authApi } from "@/api/auth";

export default function Footer() {
  const status = useQuery({
    queryKey: ["health"],
    queryFn: authApi.health,
    staleTime: 60_000,
    retry: 1,
  });

  return (
    <footer className="ref-footer">
      <div className="ref-content-width ref-footer-inner">
        <Link aria-label="AtomicTasks home" className="ref-brand" to="/">
          <Atom aria-hidden="true" className="ref-brand-mark" />
          <span>AtomicTasks</span>
        </Link>
        <p>© 2026 AtomicTasks. All rights reserved.</p>
        <div className="ref-footer-links">
          <Link to="/login">Log in</Link>
          <Link to="/register">Sign up <ArrowRight aria-hidden="true" /></Link>
        </div>
        <div aria-live="polite" className="ref-system-status">
          <span className={status.isError ? "is-offline" : ""} />
          {status.isLoading
            ? "Checking system status"
            : status.isError
              ? "Status unavailable"
              : status.data?.message || "All systems operational"}
        </div>
      </div>
    </footer>
  );
}
