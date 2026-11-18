import {
  ArrowRight,
  BarChart3,
  Bot,
  CalendarDays,
  Flame,
  GitBranch,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@/components/keyframery/accordion";

const features = [
  [Bot, "AI planning", "Turn a thought into a focused queue of doable next actions."],
  [Flame, "Habit rhythm", "Check in daily, watch streaks grow, and learn what works."],
  [BarChart3, "Useful insight", "Measure momentum without turning your life into a spreadsheet."],
  [CalendarDays, "Daily focus", "Keep dates, priorities, and your next move close at hand."],
];

const steps = [
  ["Capture it", "Add a task the moment it crosses your mind.", Target],
  ["Break it down", "Split big goals into actions you can finish today.", GitBranch],
  ["Track the streak", "Complete one atom at a time and see the pattern build.", Flame],
];

const questions = [
  ["Do I need a calendar or complex setup?", "No. Start with one task or habit. Dates, planning prompts, and integrations are there when they make the next step easier."],
  ["Is AtomicTasks only for work?", "No. Use it for projects, errands, exercise, reading, reflection, and the small routines that keep the day moving."],
  ["Can I try it before paying?", "Yes. The free plan gives you the core task and habit workflow before you decide whether more planning power is worth it."],
  ["Will my data be private?", "Your tasks and habits belong to you. Your account is protected with secure sessions and authenticated access."],
];

const graphData = [
  { title: "Before", subtitle: "Inconsistent rhythm", average: "31%", detail: "Scattered effort this week", values: [22, 48, 18, 36, 12, 42, 26], tone: "muted" },
  { title: "After", subtitle: "Mostly consistent", average: "82%", detail: "Small actions, mostly consistent", values: [48, 54, 57, 63, 61, 70, 73], tone: "accent" },
];

function SectionHeading({ eyebrow, title, description, centered = false, id }) {
  return (
    <header className={`ref-section-heading${centered ? " is-centered" : ""}`}>
      <span className="ref-eyebrow">{eyebrow}</span>
      <h2 id={id}>{title}</h2>
      {description && <p>{description}</p>}
    </header>
  );
}

export function ProofStrip() {
  const items = [
    ["01", "One system", "Tasks, habits, and focus"],
    ["02", "Small actions", "Big goals, broken down"],
    ["03", "Visible momentum", "Progress at a glance"],
    ["04", "Free to start", "No credit card required"],
  ];

  return (
    <section aria-label="AtomicTasks at a glance" className="ref-proof-strip">
      <div className="ref-content-width ref-proof-grid">
        {items.map(([number, title, description]) => (
          <div className="ref-proof-item" key={number}>
            <span>{number}</span>
            <div>
              <strong>{title}</strong>
              <p>{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function FeatureShowcase() {
  return (
    <section aria-labelledby="features-title" className="ref-section ref-features" id="habits">
      <div className="ref-content-width">
        <div className="ref-feature-intro">
          <SectionHeading
            description="AtomicTasks brings the parts of a productive day together without turning the system into another job."
            eyebrow="One clear system"
            id="features-title"
            title="Less managing the system. More living the day."
          />
          <p className="ref-feature-aside">
            Built for the days when the list is long and your focus is short.
          </p>
        </div>
        <div className="ref-feature-grid">
          {features.map(([Icon, title, description]) => (
            <article className="ref-feature-card" key={title}>
              <div className="ref-feature-card-top">
                <span className="ref-icon-tile"><Icon aria-hidden="true" /></span>
                <ArrowRight aria-hidden="true" className="ref-card-arrow" />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  return (
    <section aria-labelledby="how-title" className="ref-section ref-how" id="how-it-works">
      <div className="ref-content-width">
        <SectionHeading
          centered
          description="No project plans to configure. Just the next atomic action."
          eyebrow="The loop"
          id="how-title"
          title="Three small steps, repeated daily"
        />
        <ol className="ref-step-grid">
          {steps.map(([title, description, Icon], index) => (
            <li className="ref-step-card" key={title}>
              <span className="ref-step-number">0{index + 1}</span>
              <span className="ref-icon-tile"><Icon aria-hidden="true" /></span>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ActivityChart({ graph }) {
  const width = 520;
  const height = 150;
  const padding = 18;
  const points = graph.values.map((value, index) => {
    const x = padding + (index / (graph.values.length - 1)) * (width - padding * 2);
    const y = height - padding - (value / 100) * (height - padding * 2);
    return `${x},${y}`;
  }).join(" ");
  const color = graph.tone === "accent" ? "var(--accent-atomic)" : "var(--ref-muted-foreground)";
  const activity = Array.from({ length: 28 }, (_, index) =>
    graph.tone === "muted" ? ((index * 5) % 9 < 4 ? 1 : 0) : (index % 11 === 0 ? 1 : 3),
  );

  return (
    <article className="ref-graph-card">
      <div className="ref-graph-heading">
        <div>
          <span className="ref-eyebrow">{graph.title}</span>
          <h3>{graph.subtitle}</h3>
        </div>
        <strong style={{ color }}>{graph.average}</strong>
      </div>
      <svg
        aria-label={`${graph.title} consistency graph`}
        className="ref-line-chart"
        role="img"
        viewBox={`0 0 ${width} ${height}`}
      >
        <polyline
          fill="none"
          points={points}
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        />
        {graph.values.map((value, index) => {
          const x = padding + (index / (graph.values.length - 1)) * (width - padding * 2);
          const y = height - padding - (value / 100) * (height - padding * 2);
          return <circle cx={x} cy={y} fill={color} key={`${value}-${index}`} r="3" />;
        })}
      </svg>
      <div className="ref-activity">
        <div className="ref-activity-label"><span>Daily activity</span><span>Less&nbsp;&nbsp; More</span></div>
        <div aria-label={`${graph.title} daily activity`} className="ref-activity-grid" role="img">
          {activity.map((level, index) => (
            <span key={index} style={{ backgroundColor: color, opacity: level ? 0.8 : 0.12 }} />
          ))}
        </div>
      </div>
      <div className="ref-graph-footer"><span>Mon</span><span>{graph.detail}</span><span>Sun</span></div>
    </article>
  );
}

export function ConsistencySection() {
  return (
    <section aria-labelledby="consistency-title" className="ref-section ref-consistency" id="ai-tasks">
      <div className="ref-content-width">
        <SectionHeading
          centered
          description="A scattered effort feels random. Small actions repeated over time become a pattern you can trust."
          eyebrow="The transformation"
          id="consistency-title"
          title="Consistency changes everything"
        />
        <div className="ref-graph-grid">
          {graphData.map((graph) => <ActivityChart graph={graph} key={graph.title} />)}
        </div>
      </div>
    </section>
  );
}

export function ReferenceFAQ() {
  return (
    <section aria-labelledby="faq-title" className="ref-section ref-faq" id="faq">
      <div className="ref-content-width ref-faq-inner">
        <SectionHeading
          centered
          eyebrow="Questions, answered"
          id="faq-title"
          title="A calmer way to get started."
        />
        <Accordion className="ref-faq-list" collapsible type="single">
          {questions.map(([question, answer], index) => (
            <AccordionItem key={question} value={`question-${index}`}>
              <AccordionHeader>
                <AccordionTrigger>{question}</AccordionTrigger>
              </AccordionHeader>
              <AccordionPanel><p>{answer}</p></AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export function ReferenceCTA() {
  return (
    <section className="ref-cta-wrap">
      <div className="ref-content-width">
        <div className="ref-cta">
          <div className="ref-cta-glow" />
          <h2>Stop planning. Start finishing.</h2>
          <p>Set up your first atomic task in under two minutes.</p>
          <div className="ref-cta-actions">
            <Link className="ref-primary-link" to="/register">
              Create free account <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <Link className="ref-cta-login" to="/login">I already have an account</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
