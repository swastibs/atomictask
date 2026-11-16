import { ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import Brand from "@/components/layout/Brand";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function NotFound() {
  useDocumentTitle("Page not found");
  return (
    <main className="section-wrap grid min-h-screen place-items-center py-16 text-center">
      <div className="max-w-md">
        <Brand />
        <div className="mx-auto mt-12 grid size-16 place-items-center rounded-2xl bg-primary/10 text-[#c7baff]"><Sparkles className="size-7" /></div>
        <p className="mt-6 font-mono text-xs tracking-[.2em] text-primary">404 / WRONG TURN</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-.05em]">This page took a day off.</h1>
        <p className="mt-3 text-sm text-muted">No stress. Your next step is still right here.</p>
        <Button as={Link} className="mt-6" to="/"><ArrowLeft className="size-4" /> Back to home</Button>
      </div>
    </main>
  );
}
