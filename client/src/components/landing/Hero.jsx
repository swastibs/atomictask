import { ArrowRight, BarChart3, CheckCheck, Flame, GitBranch } from "lucide-react";
import { Link } from "react-router-dom";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const orbitItems = [
  { className: "ref-orbit-inner", Icon: GitBranch },
  { className: "ref-orbit-middle", Icon: Flame },
  { className: "ref-orbit-outer", Icon: BarChart3 },
];

function OrbitDiagram() {
  return (
    <div aria-label="AtomicTasks progress orbit illustration" className="ref-orbit">
      <div className="ref-orbit-glow" />
      {orbitItems.map(({ className, Icon }) => (
        <div className={`ref-orbit-ring ${className}`} key={className}>
          <span className="ref-orbit-icon">
            <Icon aria-hidden="true" />
          </span>
        </div>
      ))}
      <div className="ref-orbit-core">
        <CheckCheck aria-hidden="true" />
      </div>
    </div>
  );
}

export default function Hero() {
  useDocumentTitle("");

  return (
    <section aria-labelledby="landing-title" className="ref-hero" id="product">
      <div className="ref-hero-glow" />
      <div className="ref-hero-inner">
        <div className="ref-hero-copy">
          <span className="ref-eyebrow ref-hero-eyebrow">
            <span aria-hidden="true" />
            Task &amp; habit system
          </span>
          <h1 id="landing-title">
            Break the big thing into <span>next</span> thing.
          </h1>
          <p>
            AtomicTasks turns overwhelming goals into small, trackable actions
            so you always know what to do next.
          </p>
          <div className="ref-hero-actions">
            <Link className="ref-primary-link" to="/register">
              Start free <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <Link className="ref-outline-link" to="/login">
              Log in
            </Link>
          </div>
          <p className="ref-hero-note">
            Free tier available. No credit card required.
          </p>
        </div>
        <OrbitDiagram />
      </div>
    </section>
  );
}
