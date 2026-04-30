import { useState } from "react";
import { CITY_POSITIONS, AREA_CONNECTIONS } from "@/mock/areaConnections";
import type { AreaConnection } from "@/mock/types";

export function AreaConnectionGraph() {
  const [hover, setHover] = useState<AreaConnection | null>(null);

  return (
    <div className="card-soft p-4 md:p-6">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="font-serif text-xl text-ink">Quiet exchanges across Switzerland</h3>
        <p className="text-xs text-mutedInk">hover a thread to listen in</p>
      </div>
      <div className="relative">
        <svg viewBox="0 0 700 430" className="w-full h-auto" role="img" aria-label="Connections between Swiss cities">
          {/* Soft abstract Switzerland-inspired backdrop */}
          <defs>
            <radialGradient id="bg" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="hsl(135 18% 92%)" />
              <stop offset="100%" stopColor="hsl(42 40% 97%)" />
            </radialGradient>
          </defs>
          <path
            d="M70,260 C90,140 220,60 360,70 C520,80 640,140 640,220 C640,320 520,380 380,380 C240,380 110,360 70,260 Z"
            fill="url(#bg)"
            stroke="hsl(var(--border-soft) / 0.4)"
            strokeWidth="1"
          />

          {/* Connections */}
          {AREA_CONNECTIONS.map((c, i) => {
            const a = CITY_POSITIONS[c.sourceCity];
            const b = CITY_POSITIONS[c.targetCity];
            if (!a || !b) return null;
            const mx = (a.x + b.x) / 2;
            const my = (a.y + b.y) / 2 - 30;
            const isHover = hover === c;
            return (
              <path
                key={i}
                d={`M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`}
                stroke={isHover ? "hsl(var(--clay))" : "hsl(var(--sage))"}
                strokeOpacity={isHover ? 0.9 : 0.55}
                strokeWidth={Math.max(1.2, c.weight / 4)}
                fill="none"
                strokeLinecap="round"
                onMouseEnter={() => setHover(c)}
                onMouseLeave={() => setHover((h) => (h === c ? null : h))}
                style={{ cursor: "pointer", transition: "stroke 200ms ease" }}
              />
            );
          })}

          {/* City nodes */}
          {Object.entries(CITY_POSITIONS).map(([city, p]) => (
            <g key={city}>
              <circle cx={p.x} cy={p.y} r="6" fill="hsl(var(--moss))" />
              <circle cx={p.x} cy={p.y} r="11" fill="hsl(var(--moss))" fillOpacity="0.12" />
              <text x={p.x + 10} y={p.y + 4} fontSize="11" fill="hsl(var(--ink))" style={{ fontFamily: "Inter" }}>{city}</text>
            </g>
          ))}
        </svg>

        {hover && (
          <div className="absolute top-3 right-3 max-w-xs card-soft p-3 bg-cream/95">
            <p className="font-serif text-base text-ink">{hover.sourceCity} ↔ {hover.targetCity}</p>
            <p className="text-sm text-mutedInk">{hover.weight} swaps shared</p>
            <p className="text-sm text-ink mt-1">Top: {hover.topCategories.join(", ")}</p>
            <p className="text-xs text-mutedInk mt-1">Latest: {hover.latestSkill}</p>
          </div>
        )}
      </div>
    </div>
  );
}
