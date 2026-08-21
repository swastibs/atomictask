import { useEffect, useState } from "react";
import { CheckCircle2, Gift, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

/** Optional exit-intent offer, shown once per browser session. */
export default function ExitIntent() {
  const [open, setOpen] = useState(false);
  const [claimed, setClaimed] = useState(false);
  useEffect(() => { const onMouseOut = (event) => { if (event.clientY <= 4 && !sessionStorage.getItem("atomic-exit-seen")) { sessionStorage.setItem("atomic-exit-seen", "1"); setOpen(true); } }; document.addEventListener("mouseout", onMouseOut); return () => document.removeEventListener("mouseout", onMouseOut); }, []);
  if (!open) return null;
  return <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4 backdrop-blur-sm"><Card className="relative w-full max-w-md p-8 text-center"><Button variant="ghost" size="icon" className="absolute right-3 top-3" onClick={() => setOpen(false)} aria-label="Close offer"><X /></Button><span className="mx-auto grid size-12 place-items-center rounded-xl bg-[var(--accent-atomic)] text-[var(--accent-atomic-foreground)]"><Gift /></span><span className="mt-4 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">A little nudge</span><h2 className="mt-3 font-heading text-2xl font-semibold">Wait! Get 30% off your first year.</h2><p className="mt-3 text-sm text-muted-foreground">Make the next step easier to start.</p>{claimed ? <p className="mt-5 flex items-center justify-center gap-2 text-sm text-emerald-600"><CheckCircle2 className="size-4" />Offer reserved. Check your inbox.</p> : <form className="mt-5 flex flex-col gap-2 sm:flex-row" onSubmit={(event) => { event.preventDefault(); setClaimed(true); }}><Input type="email" required placeholder="you@example.com" aria-label="Email address" /><Button type="submit">Claim offer</Button></form>}</Card></div>;
}
