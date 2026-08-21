import { useEffect, useRef, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Cloud,
  Mail,
  MessageCircle,
  Users,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionFrame, SectionIntro } from "./SectionFrame";

/** Integration grid with a functional demo connection action. */
export default function IntegrationsSection() {
  const [connected, setConnected] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const connect = () => {
    setConnected(true);
    timer.current = window.setTimeout(() => setConnected(false), 2200);
  };
  const services = [
    [Calendar, "Google Calendar"],
    [MessageCircle, "Slack"],
    [Users, "Microsoft Teams"],
    [Mail, "Gmail"],
    [Cloud, "Outlook"],
    [Video, "Zoom"],
  ];
  return (
    <SectionFrame>
      <SectionIntro
        eyebrow="Plays well with your stack"
        title="Everything in sync, without the busywork."
      >
        Connect the tools you already use and keep your focus in one place.
      </SectionIntro>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {services.map(([Icon, name]) => (
          <Card
            className="items-center gap-3 p-4 text-center transition-transform hover:-translate-y-1"
            key={name}
          >
            <Icon className="text-[var(--accent-atomic)]" />
            <strong className="text-xs">{name}</strong>
          </Card>
        ))}
      </div>
      <div className="mt-8 flex flex-col items-center gap-3">
        <Button size="lg" onClick={connect}>
          <Calendar /> Connect your calendar
        </Button>
        {connected && (
          <span className="flex items-center gap-2 text-xs text-emerald-600">
            <CheckCircle2 className="size-4" />
            Demo connection ready
          </span>
        )}
      </div>
    </SectionFrame>
  );
}
