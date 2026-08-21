import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Cloud,
  Flame,
  Gift,
  Globe2,
  Headphones,
  LayoutGrid,
  Lock,
  Mail,
  MessageCircle,
  MoreHorizontal,
  Play,
  Plus,
  Rocket,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
  Video,
  X,
  Zap,
} from "lucide-react";
import "./LandingSections.css";

const aiTasks = [
  { id: 1, title: "Review the day ahead", priority: "High", duration: "15 min" },
  { id: 2, title: "Ship one meaningful task", priority: "High", duration: "45 min" },
  { id: 3, title: "Reply to priority messages", priority: "Medium", duration: "20 min" },
  { id: 4, title: "Take a proper lunch break", priority: "Low", duration: "30 min" },
  { id: 5, title: "Write tomorrow's first step", priority: "Low", duration: "10 min" },
];

const faqs = [
  ["Can I use AtomicTasks for free?", "Yes. The Free plan includes unlimited tasks, five habits, and the core task and habit experience with no credit card required."],
  ["What happens when I hit the habit limit?", "Your existing habits stay safe. You can archive one, or upgrade when you are ready to track more."],
  ["Is my data secure?", "Your data is encrypted in transit and at rest. We use role-based access and never sell personal productivity data."],
  ["Can I cancel my subscription?", "Anytime. Your plan stays active through the current billing period, and you can export your data before leaving."],
  ["Does it work on mobile?", "Yes. AtomicTasks is responsive in the browser, with iOS and Android apps designed for quick daily check-ins."],
  ["How does the AI assistant work?", "The assistant turns your intent, deadlines, and available energy into a short plan. You stay in control of every task it suggests."],
];

const RevealSection = ({ children, className = "" }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <section ref={ref} className={`landing-reveal ${visible ? "is-visible" : ""} ${className}`}>{children}</section>;
};

function SectionIntro({ eyebrow, title, children }) {
  return <div className="landing-intro"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{children && <p>{children}</p>}</div>;
}

function AIAssistantDemo() {
  const [message, setMessage] = useState("");
  const [thinking, setThinking] = useState(false);
  const [responded, setResponded] = useState(false);
  const [done, setDone] = useState([]);
  const submit = (event) => {
    event.preventDefault();
    if (!message.trim() || thinking) return;
    setThinking(true);
    window.setTimeout(() => { setThinking(false); setResponded(true); }, 1200);
  };
  const completed = done.length;
  return <RevealSection className="ai-assistant-section"><div className="landing-shell"><SectionIntro eyebrow="AI, with a point of view" title="Start with a sentence. Leave with a plan.">AtomicTasks turns a vague intention into a calm, achievable sequence.</SectionIntro><div className="ai-chat-card">
    <div className="chat-topbar"><div className="chat-agent"><span className={`agent-avatar ${thinking ? "is-thinking" : ""}`}><Sparkles size={17} /></span><div><strong>Atomic AI</strong><small>{thinking ? "Thinking through your day..." : "Your focused planning partner"}</small></div></div><span className="online-dot">Online</span></div>
    <div className="chat-body"><div className="chat-bubble user-bubble">{responded ? "Plan my day" : "Tell me what you want to make progress on."}</div>{thinking && <div className="chat-bubble ai-bubble thinking-bubble"><i /><i /><i /></div>}{responded && <div className="chat-bubble ai-bubble"><strong>Here&apos;s a focused version of your day:</strong><div className="ai-response-list">{aiTasks.map((task) => <div className={`ai-response-task ${done.includes(task.id) ? "is-done" : ""}`} key={task.id}><span className={`priority-badge priority-${task.priority.toLowerCase()}`}>{task.priority}</span><span className="response-task-copy"><strong>{task.title}</strong><small><Clock3 size={12} /> {task.duration}</small></span><button type="button" className="mark-done-button" onClick={() => setDone((current) => current.includes(task.id) ? current.filter((id) => id !== task.id) : [...current, task.id])}>{done.includes(task.id) ? <Check size={14} /> : "Done"}</button></div>)}</div></div>}</div>
    <div className="chat-footer"><form onSubmit={submit} className="chat-input-wrap"><input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Try: Plan my day" aria-label="Ask Atomic AI" /><button type="submit" aria-label="Send message"><Send size={16} /></button></form>{responded && <div className="ai-progress"><span><span style={{ width: `${(completed / aiTasks.length) * 100}%` }} /></span><small>{completed}/{aiTasks.length} tasks claimed</small></div>}</div>
    </div></div></RevealSection>;
}

const badges = [[Trophy, "7-Day Streak", true], [Target, "Task Master", true], [Flame, "Habit Hero", true], [Zap, "Early Bird", true], [Star, "Perfect Week", false], [Rocket, "Launch Mode", false], [Users, "Team Player", false], [Sparkles, "Momentum", false]];
function GamificationShowcase() {
  return <RevealSection className="gamification-section"><div className="landing-shell"><SectionIntro eyebrow="Progress you can feel" title="The little wins add up. Then they compound." >Earn visible proof that your consistency is working.</SectionIntro><div className="gamification-grid"><div className="showcase-panel badges-panel"><div className="showcase-heading"><div><span className="eyebrow">Collection</span><h3>Badges to chase</h3></div><span className="badge-count">4 / 8 unlocked</span></div><div className="badge-grid">{badges.map(([Icon, label, unlocked]) => <div className={`badge-item ${unlocked ? "unlocked" : "locked"}`} key={label}><span>{unlocked ? <Icon size={20} /> : <Lock size={17} />}</span><small>{label}</small></div>)}</div></div><div className="showcase-panel streak-panel"><span className="eyebrow">Personal best</span><div className="streak-flame"><Flame size={52} /></div><strong>42</strong><h3>Day streak</h3><p>You&apos;re in the top 8% this month.</p><div className="streak-bar"><span /></div><small>18 days to your next badge</small></div><div className="showcase-panel leaderboard-panel"><div className="showcase-heading"><div><span className="eyebrow">This week</span><h3>Leaderboard</h3></div><MoreHorizontal size={17} /></div>{[["AS", "Aisha Shah", "2,480"], ["JM", "Jordan Miller", "2,210"], ["SK", "Sam Kim", "1,980"]].map(([initials, name, points], index) => <div className="leader-row" key={name}><span className={`rank rank-${index + 1}`}>{index + 1}</span><span className="mini-avatar">{initials}</span><strong>{name}</strong><span>{points} pts</span></div>)}</div></div></div></RevealSection>;
}

function CommunitySection() {
  const [nudged, setNudged] = useState(null);
  const [dragged, setDragged] = useState(null);
  const columns = { "To do": ["Outline launch notes"], Doing: ["Polish onboarding flow"], Done: ["Ship habit reminders"] };
  return <RevealSection className="community-section"><div className="landing-shell"><SectionIntro eyebrow="Better together" title="Accountability, without the awkwardness.">Work alongside people who make showing up feel normal.</SectionIntro><div className="community-grid"><div className="community-panel partners-panel"><div className="showcase-heading"><div><span className="eyebrow">Your circle</span><h3>Accountability partners</h3></div><Users size={18} /></div>{[["MK", "Maya Kapoor", "18 day streak"], ["JL", "Jon Lee", "26 day streak"], ["NR", "Nora Reyes", "9 day streak"]].map(([initials, name, streak]) => <div className="partner-row" key={name}><span className="partner-avatar">{initials}</span><div><strong>{name}</strong><small><Flame size={11} /> {streak}</small></div><button type="button" onClick={() => setNudged(name)}>{nudged === name ? "Sent" : "Nudge"}</button></div>)}</div><div className="community-panel team-panel"><div className="showcase-heading"><div><span className="eyebrow">North star squad</span><h3>Team dashboard</h3></div><span className="team-live"><i /> Live</span></div><div className="kanban-board">{Object.entries(columns).map(([column, cards]) => <div className="kanban-column" key={column}><span>{column}</span>{cards.map((card) => <div draggable onDragStart={() => setDragged(card)} onDragOver={(event) => event.preventDefault()} onDrop={() => setDragged(null)} className={`kanban-card ${dragged === card ? "is-dragged" : ""}`} key={card}><GripIcon /><strong>{card}</strong><small><span /> Atomic team</small></div>)}<button type="button"><Plus size={13} /> Add task</button></div>)}</div><div className="activity-feed"><span className="eyebrow">Live activity</span>{["Sarah completed 5 tasks", "John started a new habit", "Maya hit a 14-day streak"].map((item, index) => <div className="activity-item" style={{ animationDelay: `${index * 120}ms` }} key={item}><span className="activity-pulse" />{item}<small>{index + 1}m</small></div>)}</div></div></div></div></RevealSection>;
}
function GripIcon() { return <span className="grip-icon"><span /><span /><span /></span>; }

function IntegrationsSection() {
  const [connected, setConnected] = useState(false);
  const services = [[Calendar, "Google Calendar"], [MessageCircle, "Slack"], [Users, "Microsoft Teams"], [Mail, "Gmail"], [Cloud, "Outlook"], [Video, "Zoom"]];
  return <RevealSection className="integrations-section"><div className="landing-shell"><SectionIntro eyebrow="Plays well with your stack" title="Everything in sync, without the busywork.">Connect the tools you already use and keep your focus in one place.</SectionIntro><div className="integration-grid">{services.map(([Icon, name]) => <div className="integration-card" key={name}><span><Icon size={21} /></span><strong>{name}</strong></div>)}</div><div className="integration-cta"><button type="button" className="cta-button" onClick={() => { setConnected(true); window.setTimeout(() => setConnected(false), 2400); }}><Calendar size={16} /> Connect your calendar</button>{connected && <span className="connect-toast"><CheckCircle2 size={15} /> Demo connection ready</span>}</div></div></RevealSection>;
}

function PricingSection() {
  const [yearly, setYearly] = useState(false);
  const plans = [{ name: "Free", monthly: "₹0", yearly: "₹0", detail: "For getting started", features: ["Unlimited tasks", "5 habits", "Basic gamification", "Community support"] }, { name: "Pro", monthly: "₹249", yearly: "₹208", detail: yearly ? "per month, billed yearly" : "per month", popular: true, features: ["Unlimited habits", "AI assistant", "Accountability partners", "Advanced analytics", "All integrations", "Priority support"] }, { name: "Team", monthly: "₹999", yearly: "₹833", detail: "per month for 5 users", features: ["Everything in Pro", "Team dashboard", "Admin controls", "Dedicated support"] }];
  return <RevealSection className="pricing-section"><div className="landing-shell"><SectionIntro eyebrow="A plan for your pace" title="Serious about progress. Flexible about price.">Start free, upgrade when the system starts paying you back.</SectionIntro><div className="billing-toggle"><span className={!yearly ? "active" : ""}>Monthly</span><button type="button" role="switch" aria-checked={yearly} onClick={() => setYearly((value) => !value)}><span style={{ transform: yearly ? "translateX(20px)" : "translateX(0)" }} /></button><span className={yearly ? "active" : ""}>Yearly <small>Save 16%</small></span></div><div className="pricing-grid">{plans.map((plan) => <div className={`price-card ${plan.popular ? "is-popular" : ""}`} key={plan.name}>{plan.popular && <span className="popular-badge">Most popular</span>}<span className="eyebrow">{plan.name}</span><h3>{plan.name === "Pro" ? "For momentum" : plan.name === "Team" ? "For shared goals" : "For the first step"}</h3><div className="price"><strong>{yearly ? plan.yearly : plan.monthly}</strong>{plan.name !== "Free" && <small>/ month</small>}</div><p>{plan.detail}</p><ul>{plan.features.map((feature) => <li key={feature}><Check size={14} /> {feature}</li>)}</ul><button type="button" className={plan.popular ? "cta-button" : "secondary-button"}>{plan.name === "Free" ? "Start free" : "Choose " + plan.name}</button></div>)}</div></div></RevealSection>;
}

const testimonials = [["LP", "Leena Patel", "Product designer", "AtomicTasks gave me a way to make progress on the work I kept postponing. The next step is always right there."], ["DB", "Daniel Brooks", "Graduate student", "My mornings feel less like a negotiation. I ask the AI for a plan, then I just take the first small win."], ["RS", "Riya Sen", "Operations lead", "Our team finally has visibility without another meeting-heavy project tool. The streaks keep it human."]];
function TestimonialsSection() {
  const [index, setIndex] = useState(0);
  const testimonial = testimonials[index];
  return <RevealSection className="testimonials-section"><div className="landing-shell"><SectionIntro eyebrow="Made for follow-through" title="A little structure changes a lot.">Real people, small steps, noticeable shifts.</SectionIntro><div className="testimonial-wrap"><button type="button" className="carousel-button" onClick={() => setIndex((index - 1 + testimonials.length) % testimonials.length)} aria-label="Previous testimonial"><ArrowLeft size={17} /></button><article className="testimonial-card"><div className="quote-mark">&ldquo;</div><div className="rating">{[1, 2, 3, 4, 5].map((star) => <Star size={15} fill="currentColor" key={star} />)}</div><blockquote>{testimonial[3]}</blockquote><div className="testimonial-person"><span className="testimonial-avatar">{testimonial[0]}</span><div><strong>{testimonial[1]}</strong><small>{testimonial[2]}</small></div></div></article><button type="button" className="carousel-button" onClick={() => setIndex((index + 1) % testimonials.length)} aria-label="Next testimonial"><ArrowRight size={17} /></button></div><div className="carousel-dots">{testimonials.map((item, dotIndex) => <button type="button" className={dotIndex === index ? "active" : ""} key={item[1]} onClick={() => setIndex(dotIndex)} aria-label={`Show testimonial ${dotIndex + 1}`} />)}</div></div></RevealSection>;
}

function FAQSection() {
  const [open, setOpen] = useState(null);
  return <RevealSection className="faq-section"><div className="landing-shell faq-shell"><SectionIntro eyebrow="Questions, answered" title="Nothing hidden behind the fine print.">A few quick answers before you begin.</SectionIntro><div className="faq-list">{faqs.map(([question, answer], index) => <div className={`faq-item ${open === index ? "is-open" : ""}`} key={question}><button type="button" onClick={() => setOpen(open === index ? null : index)} aria-expanded={open === index}><span>{question}</span><ChevronDown size={17} /></button>{open === index && <p>{answer}</p>}</div>)}</div></div></RevealSection>;
}

function TrustAndCounter() {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { const target = 1247; let current = 0; const timer = window.setInterval(() => { current += Math.ceil((target - current) / 8); if (current >= target) { current = target; window.clearInterval(timer); } setCount(current); }, 35); observer.disconnect(); } }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <RevealSection className="trust-section" ><div ref={ref} className="landing-shell trust-strip"><div className="trust-badges"><span><ShieldCheck size={17} /> SSL encrypted</span><span><BadgeCheck size={17} /> 30-day guarantee</span><span><Globe2 size={17} /> GDPR ready</span><span><Headphones size={17} /> Human support</span></div><div className="live-counter"><span className="live-dot" /><strong>{count.toLocaleString()}</strong><span>people are tracking habits right now</span></div></div></RevealSection>;
}

function MobilePreview() {
  return <RevealSection className="mobile-section"><div className="landing-shell mobile-grid"><div className="phone-mockup"><div className="phone-notch" /><div className="phone-screen"><div className="phone-status"><span>9:41</span><span>● ●</span></div><div className="phone-greeting"><small>Tuesday, Aug 21</small><strong>Good morning, Alex</strong></div><div className="phone-focus-card"><span><Flame size={15} /> 12 day streak</span><strong>One step at a time.</strong><div><span /></div></div><div className="phone-tasks"><div><span className="phone-check"><Check size={10} /></span><strong>Plan the day</strong><small>15 min</small></div><div><span className="phone-check" /><strong>Deep work block</strong><small>45 min</small></div><div><span className="phone-check" /><strong>Evening reflection</strong><small>10 min</small></div></div><div className="phone-nav"><LayoutGrid size={15} /><Target size={15} /><BarChart3 size={15} /><Users size={15} /></div></div></div><div className="mobile-copy"><span className="eyebrow">Your progress, in your pocket</span><h2>Available on iOS & Android.</h2><p>Capture the next thing wherever the day finds you. AtomicTasks keeps your plan close without asking for your whole attention.</p><div className="store-badges"><button type="button"><span></span><small>Download on the<strong>App Store</strong></small></button><button type="button"><Play size={17} fill="currentColor" /><small>GET IT ON<strong>Google Play</strong></small></button></div></div></div></RevealSection>;
}

const comparisonRows = [["Tasks", "Everything", "Everything", "Everything", "Everything", "Everything"], ["Habits", "Built in", "—", "—", "Limited", "Built in"], ["AI planning", "Included", "Add-on", "—", "—", "—"], ["Gamification", "Deep", "Light", "—", "Core", "Light"], ["Community", "Accountability", "—", "—", "—", "—"], ["Integrations", "All", "Many", "Many", "Some", "Some"], ["Price to start", "Free", "$4/mo", "$5/mo", "$0", "$8/mo"]];
function ComparisonSection() {
  return <RevealSection className="comparison-section"><div className="landing-shell"><SectionIntro eyebrow="One home for the whole loop" title="More than a task list.">AtomicTasks brings the pieces together without making you manage another system.</SectionIntro><div className="comparison-wrap"><table><thead><tr><th>Capability</th><th className="atomic-column">AtomicTasks</th><th>Todoist</th><th>Habitica</th><th>Notion</th><th>Fabulous</th></tr></thead><tbody>{comparisonRows.map((row) => <tr key={row[0]}>{row.map((value, index) => <td className={index === 1 ? "atomic-column" : ""} key={`${row[0]}-${index}`}>{index === 0 ? <strong>{value}</strong> : value === "—" ? <X size={14} /> : value.includes("All") || value === "Deep" || value === "Included" || value === "Built in" ? <span className="table-check"><Check size={13} /> {value}</span> : value}</td>)}</tr>)}</tbody></table></div></div></RevealSection>;
}

function ForecastSection() {
  return <RevealSection className="forecast-section"><div className="landing-shell"><div className="forecast-card"><div className="forecast-sparkles"><Sparkles size={18} /><Sparkles size={13} /><Sparkles size={16} /></div><span className="eyebrow">Your 30-day forecast</span><h2>Keep the chain. Change the shape of your days.</h2><p>If you maintain your current <strong>12-day streak</strong>, in 30 days you will have completed <strong>84 habits</strong> and <strong>46 tasks</strong>.</p><div className="forecast-stats"><span><strong>+30</strong><small>days of momentum</small></span><span><strong>84</strong><small>habits completed</small></span><span><strong>46</strong><small>tasks shipped</small></span></div><button type="button" className="cta-button"><Rocket size={16} /> See my forecast</button></div></div></RevealSection>;
}

function ExitIntentPopup() {
  const [open, setOpen] = useState(false);
  const [claimed, setClaimed] = useState(false);
  useEffect(() => { const onMouse = (event) => { if (event.clientY <= 4 && !sessionStorage.getItem("atomic-exit-seen")) { setOpen(true); sessionStorage.setItem("atomic-exit-seen", "1"); } }; document.addEventListener("mouseout", onMouse); return () => document.removeEventListener("mouseout", onMouse); }, []);
  if (!open) return null;
  return <div className="exit-overlay"><div className="exit-modal"><button type="button" className="exit-close" onClick={() => setOpen(false)} aria-label="Close offer"><X size={17} /></button><span className="exit-icon"><Gift size={23} /></span><span className="eyebrow">A little nudge</span><h2>Wait! Get 30% off your first year.</h2><p>Make the next step easier to start. Your future self will know what to do.</p>{claimed ? <div className="claimed-message"><CheckCircle2 size={18} /> Offer reserved. Check your inbox.</div> : <form className="exit-form" onSubmit={(event) => { event.preventDefault(); setClaimed(true); }}><input type="email" required placeholder="you@example.com" aria-label="Email address" /><button type="submit" className="cta-button">Claim offer</button></form>}</div></div>;
}

export default function LandingSections() {
  return <><AIAssistantDemo /><GamificationShowcase /><CommunitySection /><IntegrationsSection /><PricingSection /><TestimonialsSection /><FAQSection /><TrustAndCounter /><MobilePreview /><ComparisonSection /><ForecastSection /><ExitIntentPopup /></>;
}
