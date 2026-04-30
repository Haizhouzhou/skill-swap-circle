import { getUserById } from "@/lib/appData";
import type { SkillChain } from "@/mock/types";
import { ArrowDown } from "lucide-react";

export function SkillChainView({ chain }: { chain: SkillChain }) {
  return (
    <div className="card-soft p-6 md:p-8">
      <h3 className="font-serif text-xl text-ink mb-4">A small chain of kindness</h3>
      <ol className="flex flex-col items-stretch gap-3">
        {chain.steps.map((s, i) => {
          const from = getUserById(s.fromUserId);
          const to = getUserById(s.toUserId);
          return (
            <li key={i}>
              <div className="rounded-2xl bg-accent/50 p-4 flex items-center gap-3">
                <Avatar name={from?.name ?? "?"} />
                <p className="text-sm text-ink leading-relaxed">
                  <span className="font-serif text-base">{from?.name}</span> shared <em className="not-italic text-moss">{s.skillTitle}</em> with <span className="font-serif text-base">{to?.name}</span>.
                </p>
              </div>
              {i < chain.steps.length - 1 && (
                <div className="flex justify-center py-1">
                  <ArrowDown className="w-4 h-4 text-sage" />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  return <div className="w-10 h-10 rounded-full bg-sand grid place-items-center font-serif text-moss shrink-0">{name[0]}</div>;
}
