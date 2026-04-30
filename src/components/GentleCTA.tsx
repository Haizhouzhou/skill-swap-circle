import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export function GentleCTA({ title, body, action, to }: { title: string; body?: string; action: ReactNode; to?: string }) {
  const inner = (
    <div className="card-soft p-8 md:p-10 bg-accent/40 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
      <div className="flex-1">
        <h3 className="font-serif text-2xl text-ink">{title}</h3>
        {body && <p className="text-mutedInk mt-2 max-w-prose">{body}</p>}
      </div>
      <div>{action}</div>
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
}
