import { ArrowRight, Mail, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import Reveal from "@/components/landing/Reveal";

export default function WaitlistForm() {
  const [joined, setJoined] = useState(false);

  return (
    <section className="py-10">
      <Reveal className="section-wrap">
        <div className="glass flex flex-col items-start justify-between gap-6 rounded-2xl p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-[#c6b8ff]"><Mail className="size-5" /></span>
            <div>
              <h2 className="font-display text-xl font-semibold">Want in early?</h2>
              <p className="mt-1 text-sm text-muted">
                {joined ? "You’re in! Create your account to skip the line." : "Create your account now. No waitlist tricks, just a fresh start."}
              </p>
            </div>
          </div>
          <Button
            as={Link}
            onClick={() => {
              setJoined(true);
              toast.info("Create your account to get started — no waitlist endpoint needed.");
            }}
            to="/register"
          >
            {joined ? "Create your account" : "Get early access"} <ArrowRight className="size-4" />
          </Button>
        </div>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[10px] text-muted/70">
          <Sparkles className="size-3" /> This button takes you straight to account creation.
        </p>
      </Reveal>
    </section>
  );
}
