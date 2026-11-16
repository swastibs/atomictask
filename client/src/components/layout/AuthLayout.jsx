import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import "@/styles/reference-ui.css";

export default function AuthLayout({ loginForm, registerForm, mode = "login" }) {
  const isRegister = mode === "register";

  return (
    <main className="ref-site ref-auth-site">
      <div aria-hidden="true" className="ref-grid-background" />
      <Navbar />
      <div className="auth-slider-wrapper">
        <section
          aria-label="Account access"
          className={`auth-slider${isRegister ? " is-signup" : " is-login"}`}
        >
          <div aria-hidden={isRegister} className="auth-form-panel auth-login-panel">
            {loginForm}
          </div>
          <div aria-hidden={!isRegister} className="auth-form-panel auth-signup-panel">
            {registerForm}
          </div>
          <aside aria-label="Switch account type" className="auth-overlay">
            <div className="auth-overlay-track">
              <div className="auth-overlay-copy auth-overlay-login">
                <span className="auth-orbit"><Sparkles aria-hidden="true" /></span>
                <span className="ref-eyebrow">New to AtomicTasks?</span>
                <h2>Make the next step obvious.</h2>
                <p>Build a personal rhythm for the tasks and habits that matter.</p>
                <Link to="/register">
                  Create account <ArrowRight aria-hidden="true" />
                </Link>
              </div>
              <div className="auth-overlay-copy auth-overlay-signup">
                <span className="auth-orbit"><Check aria-hidden="true" /></span>
                <span className="ref-eyebrow">Already a member?</span>
                <h2>Your plan is ready when you are.</h2>
                <p>Sign in to return to your streaks, priorities, and progress.</p>
                <Link to="/login">
                  Log in <ArrowRight aria-hidden="true" />
                </Link>
              </div>
            </div>
          </aside>
        </section>
      </div>
      <p className="ref-auth-note">
        By continuing, you’re choosing to show up for your future self.
      </p>
    </main>
  );
}
