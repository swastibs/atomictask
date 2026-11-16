import { Quote, Star } from "lucide-react";
import Reveal from "@/components/landing/Reveal";

const people = [
  {
    initials: "AK",
    name: "Aarav K.",
    role: "CS student · Bengaluru",
    color: "from-violet-400 to-cyan-300",
    quote: "I stopped planning the perfect day and started doing the next thing. Weirdly, that’s when everything clicked.",
  },
  {
    initials: "MS",
    name: "Mira S.",
    role: "Indie maker · Mumbai",
    color: "from-pink-400 to-orange-300",
    quote: "The streaks make consistency feel fun, not like another person yelling at me to optimize my life.",
  },
  {
    initials: "RJ",
    name: "Rohan J.",
    role: "Designer · Pune",
    color: "from-cyan-300 to-emerald-300",
    quote: "My accountability buddy and I actually show up now. The tiny wins add up faster than you think.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 sm:py-32">
      <div className="section-wrap">
        <Reveal>
          <span className="kicker">Real people, real progress</span>
          <h2 className="section-title mt-5">A little momentum<br />goes a long way.</h2>
        </Reveal>
        <div className="mt-10 grid gap-3 md:grid-cols-3">
          {people.map((person, index) => (
            <Reveal delay={index * 0.08} key={person.name}>
              <figure className="flex h-full flex-col rounded-2xl border border-white/[.08] bg-white/[.025] p-5 transition hover:-translate-y-1 hover:bg-white/[.04] sm:p-6">
                <div className="flex items-center gap-1 text-gold" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }, (_, i) => <Star className="size-3 fill-current" key={i} />)}
                </div>
                <Quote className="mt-5 size-5 text-primary/70" />
                <blockquote className="mt-2 flex-1 text-sm leading-6 text-white/85">“{person.quote}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-white/[.07] pt-4">
                  <span className={`grid size-9 place-items-center rounded-full bg-gradient-to-br ${person.color} text-[10px] font-bold text-slate-950`}>{person.initials}</span>
                  <span><strong className="block text-xs">{person.name}</strong><small className="text-[10px] text-muted">{person.role}</small></span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
