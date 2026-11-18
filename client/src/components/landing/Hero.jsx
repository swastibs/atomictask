import { ArrowRight, Check, CheckCheck, Flame, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import {
  Tabs,
  TabsList,
  TabsPanel,
  TabsPanels,
  TabsTab,
} from "@/components/keyframery/tabs";

function OrbitDiagram() {
  return (
    <div aria-label="AtomicTasks app preview" className="ref-orbit">
      <div className="ref-preview-top">
        <div>
          <span className="ref-eyebrow">Monday, your way</span>
          <h2>Today, in focus</h2>
        </div>
        <span className="ref-preview-mark"><Sparkles aria-hidden="true" /></span>
      </div>
      <Tabs className="ref-preview-tabs" defaultValue="today">
        <TabsList aria-label="Product preview" className="ref-preview-tabs-list">
          <TabsTab value="today">Today</TabsTab>
          <TabsTab value="habits">Habits</TabsTab>
          <TabsTab value="focus">Focus</TabsTab>
        </TabsList>
        <TabsPanels className="ref-preview-panels">
          <TabsPanel className="ref-preview-panel" value="today">
            <div className="ref-preview-progress">
              <span>Daily progress</span>
              <strong>2 of 4</strong>
            </div>
            <div aria-label="50 percent complete" className="ref-preview-bar">
              <span />
            </div>
            <div className="ref-preview-task is-done">
              <span><Check aria-hidden="true" /></span>
              <div><strong>Pick the one next thing</strong><small>Done · 10 min</small></div>
            </div>
            <div className="ref-preview-task">
              <span />
              <div><strong>Send the project update</strong><small>Next up · 25 min</small></div>
            </div>
            <div className="ref-preview-task">
              <span />
              <div><strong>Take a proper lunch break</strong><small>Later · 30 min</small></div>
            </div>
          </TabsPanel>
          <TabsPanel className="ref-preview-panel" value="habits">
            <div className="ref-preview-streak"><Flame aria-hidden="true" /><strong>7 day streak</strong><span>One small win each day.</span></div>
            <div className="ref-preview-week" aria-label="Weekly habit progress">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                <span className={index < 5 ? "is-complete" : ""} key={`${day}-${index}`}>{day}</span>
              ))}
            </div>
            <p className="ref-preview-caption">Your routine is starting to stick.</p>
          </TabsPanel>
          <TabsPanel className="ref-preview-panel" value="focus">
            <div className="ref-preview-focus"><span>UP NEXT</span><strong>25 minutes</strong><p>One task. One timer. No pressure.</p></div>
            <div className="ref-preview-focus-note"><CheckCheck aria-hidden="true" /> Small steps count.</div>
          </TabsPanel>
        </TabsPanels>
      </Tabs>
      <div className="ref-preview-foot"><span /><span>Your space, your pace</span><span>·</span><span>Zero guilt</span></div>
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
