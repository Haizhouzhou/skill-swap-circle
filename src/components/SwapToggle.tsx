import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Mode = "learn" | "teach";

export function SwapToggle({ mode }: { mode: Mode }) {
  const navigate = useNavigate();
  const [flip, setFlip] = useState(0);

  useEffect(() => { setFlip((f) => f + 1); }, [mode]);

  function go(target: Mode) {
    if (target === mode) return;
    navigate(target === "learn" ? "/browse/learn" : "/browse/teach");
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-borderSoft bg-card p-1.5">
      <button
        onClick={() => go("learn")}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          mode === "learn" ? "bg-moss text-cream" : "text-mutedInk hover:text-ink"
        }`}
      >
        I want to learn
      </button>
      <button
        onClick={() => go(mode === "learn" ? "teach" : "learn")}
        aria-label="Swap"
        className="w-10 h-10 rounded-full grid place-items-center bg-accent hover:bg-sand transition-colors"
      >
        <span key={flip} className="block swap-flip">
          <SwapGlyph />
        </span>
      </button>
      <button
        onClick={() => go("teach")}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          mode === "teach" ? "bg-moss text-cream" : "text-mutedInk hover:text-ink"
        }`}
      >
        I want to teach
      </button>
    </div>
  );
}

function SwapGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 9h13l-3-3" stroke="hsl(var(--moss))" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 15H7l3 3" stroke="hsl(var(--clay))" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
