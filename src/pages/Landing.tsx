import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DemoUserSelector } from "@/components/DemoUserSelector";
import { Sprout, HandHeart, Footprints } from "lucide-react";

export default function Landing() {
  const [open, setOpen] = useState(false);
  return (
    <div className="container py-12 md:py-20">
      <section className="grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <p className="chip mb-5">A peaceful Switzerland-wide skill exchange</p>
          <h1 className="font-serif text-5xl md:text-6xl text-ink leading-[1.05] tracking-tight">
            Swap useful life skills <span className="text-moss">for free.</span>
          </h1>
          <p className="mt-5 text-lg text-mutedInk leading-relaxed max-w-prose">
            Discover what you can teach. Learn what makes daily life easier. Pass one skill forward.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={() => setOpen(true)} className="bg-moss text-cream hover:bg-ink rounded-full h-12 px-6">
              Start as demo user
            </Button>
            <Button asChild variant="outline" className="rounded-full h-12 px-6 border-borderSoft">
              <Link to="/create-profile">Create my profile</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full h-12 px-6 border-borderSoft">
              <Link to="/browse/learn">Browse skills</Link>
            </Button>
          </div>
          <p className="text-sm text-mutedInk mt-6">No payment. No pressure. Just people helping people.</p>
        </div>

        <div className="relative">
          <HeroArt />
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-5 mt-16 md:mt-24">
        <ValueCard icon={<Sprout className="w-5 h-5 text-moss" />} title="Discover hidden daily skills" body="Small, useful things people quietly know — cooking, paperwork, calm conversations, repairs." />
        <ValueCard icon={<Footprints className="w-5 h-5 text-clay" />} title="Learn from people nearby" body="A neighbour, a student, a newcomer. Real people, real Swiss cities, real life." />
        <ValueCard icon={<HandHeart className="w-5 h-5 text-moss" />} title="Pass help forward" body="When you receive, share. A small chain of kindness builds across cantons." />
      </section>

      <section className="mt-20 grid md:grid-cols-2 gap-6 items-center">
        <div className="card-soft p-8 bg-accent/40">
          <h2 className="font-serif text-3xl text-ink leading-tight">Two sides of the same calm exchange.</h2>
          <p className="text-mutedInk mt-3 max-w-prose">
            Browse what others are teaching when you'd like to learn. Browse what others are asking for when you'd like to teach. One soft swap icon between the two.
          </p>
          <div className="mt-5 flex gap-3">
            <Button asChild variant="outline" className="rounded-full border-borderSoft"><Link to="/browse/learn">I want to learn</Link></Button>
            <Button asChild variant="outline" className="rounded-full border-borderSoft"><Link to="/browse/teach">I want to teach</Link></Button>
          </div>
        </div>
        <div className="card-soft p-8">
          <p className="font-serif text-2xl text-ink">"Small skills can make daily life lighter."</p>
          <p className="text-mutedInk mt-3">Skillswap is a non-commercial, volunteer-based community board across Switzerland. Nothing to sell, nothing to subscribe to. Just useful knowledge passed gently from one person to another.</p>
        </div>
      </section>

      <DemoUserSelector open={open} onOpenChange={setOpen} />
    </div>
  );
}

function ValueCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="card-soft p-6">
      <div className="w-10 h-10 rounded-xl bg-accent grid place-items-center mb-4">{icon}</div>
      <h3 className="font-serif text-xl text-ink">{title}</h3>
      <p className="text-mutedInk mt-2 leading-relaxed text-sm">{body}</p>
    </div>
  );
}

function HeroArt() {
  return (
    <svg viewBox="0 0 520 440" className="w-full h-auto" aria-hidden>
      <defs>
        <linearGradient id="hg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--sand))" />
          <stop offset="100%" stopColor="hsl(135 18% 90%)" />
        </linearGradient>
      </defs>
      {/* Soft organic shapes */}
      <path d="M60,260 C40,120 230,40 360,80 C500,120 510,300 410,360 C300,420 90,400 60,260 Z" fill="url(#hg)" stroke="hsl(var(--border-soft) / 0.5)" />
      <circle cx="380" cy="140" r="46" fill="hsl(var(--clay) / 0.35)" />
      <circle cx="160" cy="320" r="32" fill="hsl(var(--sage) / 0.45)" />

      {/* Card 1 */}
      <g transform="translate(90,110)">
        <rect width="220" height="120" rx="20" fill="hsl(var(--cream))" stroke="hsl(var(--border-soft) / 0.55)" />
        <text x="20" y="34" fontFamily="Fraunces" fontSize="16" fill="hsl(var(--moss))">Cook cheap student meals</text>
        <text x="20" y="58" fontFamily="Inter" fontSize="11" fill="hsl(var(--muted-ink))">Sara · Zürich · 30 min</text>
        <rect x="20" y="76" width="70" height="22" rx="11" fill="hsl(var(--accent))" />
        <text x="55" y="91" textAnchor="middle" fontFamily="Inter" fontSize="10" fill="hsl(var(--moss))">Swiss life</text>
      </g>
      {/* Card 2 */}
      <g transform="translate(220,250)">
        <rect width="240" height="120" rx="20" fill="hsl(var(--cream))" stroke="hsl(var(--border-soft) / 0.55)" />
        <text x="20" y="34" fontFamily="Fraunces" fontSize="16" fill="hsl(var(--moss))">Practice German small talk</text>
        <text x="20" y="58" fontFamily="Inter" fontSize="11" fill="hsl(var(--muted-ink))">Lina · Basel · Saturday</text>
        <rect x="20" y="76" width="90" height="22" rx="11" fill="hsl(var(--sand))" />
        <text x="65" y="91" textAnchor="middle" fontFamily="Inter" fontSize="10" fill="hsl(var(--ink))">Language</text>
      </g>

      {/* Swap arrow between cards */}
      <g transform="translate(245,205)">
        <circle r="22" fill="hsl(var(--cream))" stroke="hsl(var(--border-soft) / 0.6)" />
        <path d="M-10,-3 H8 l-3,-3 M10,3 H-8 l3,3" stroke="hsl(var(--moss))" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
