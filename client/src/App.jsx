import { Component, lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GuestRoute, ProtectedRoute } from "@/components/layout/ProtectedRoute";
import Providers from "@/components/layout/Providers";
import Spinner from "@/components/ui/Spinner";

const AuthCallback = lazy(() => import("@/pages/AuthCallback"));
const AuthPage = lazy(() => import("@/pages/AuthPage"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const Landing = lazy(() => import("@/pages/Landing"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const VerifyEmail = lazy(() => import("@/pages/VerifyEmail"));

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <main className="grid min-h-screen place-items-center px-5 text-center">
          <div className="max-w-sm">
            <h1 className="font-display text-3xl font-semibold">A little hiccup.</h1>
            <p className="mt-3 text-sm text-muted">Your progress is safe. Reload and we’ll get you back on track.</p>
            <button
              className="mt-6 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white"
              onClick={() => window.location.reload()}
              type="button"
            >
              Reload AtomicTasks
            </button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}

function RouteFallback() {
  return (
    <div className="grid min-h-[50vh] place-items-center text-muted">
      <Spinner label="Loading page" />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Providers>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route element={<Landing />} path="/" />
              <Route element={<GuestRoute />}>
                <Route element={<AuthPage />} path="/login" />
                <Route element={<AuthPage />} path="/register" />
              </Route>
              <Route element={<ForgotPassword />} path="/forgot-password" />
              <Route element={<ResetPassword />} path="/reset-password" />
              <Route element={<ResetPassword />} path="/auth/reset-password" />
              <Route element={<VerifyEmail />} path="/verify-email" />
              <Route element={<VerifyEmail />} path="/auth/verify-email" />
              <Route element={<AuthCallback />} path="/auth/callback" />
              <Route element={<ProtectedRoute />}>
                <Route element={<Dashboard />} path="/dashboard" />
              </Route>
              <Route element={<NotFound />} path="*" />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </Providers>
    </ErrorBoundary>
  );
}
