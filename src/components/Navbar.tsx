import { Link, NavLink } from "react-router-dom";
import { useDemoUser } from "@/context/DemoUserContext";
import { DemoUserSelector } from "./DemoUserSelector";
import { useState } from "react";

const links = [
  { to: "/browse/learn", label: "Browse" },
  { to: "/impact", label: "Impact" },
  { to: "/me", label: "My space" },
];

export function Navbar() {
  const { user, isVisitor } = useDemoUser();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-borderSoft bg-cream/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 group">
          <LogoMark />
          <span className="font-serif text-xl text-moss group-hover:text-ink transition-colors">Skillswap</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-full text-sm transition-colors ${
                  isActive ? "bg-accent text-moss" : "text-mutedInk hover:text-ink hover:bg-accent/60"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full border border-borderSoft px-3 py-1.5 text-sm hover:bg-accent transition-colors"
        >
          <span className="w-7 h-7 rounded-full bg-sand grid place-items-center font-serif text-moss">
            {user ? user.name[0] : "·"}
          </span>
          <span className="text-mutedInk">
            {user ? <><span className="text-ink">{user.name}</span> · {user.city}</> : "Visitor"}
          </span>
          <span className="text-xs text-sage">{isVisitor ? "switch" : "switch"}</span>
        </button>
      </div>
      <DemoUserSelector open={open} onOpenChange={setOpen} />
    </header>
  );
}

function LogoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
      <circle cx="16" cy="16" r="14" stroke="hsl(var(--sage))" strokeWidth="1.2" />
      <path d="M9 13c2-3 6-3 8 0M23 19c-2 3-6 3-8 0" stroke="hsl(var(--moss))" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="9" cy="13" r="1.4" fill="hsl(var(--clay))" />
      <circle cx="23" cy="19" r="1.4" fill="hsl(var(--moss))" />
    </svg>
  );
}
