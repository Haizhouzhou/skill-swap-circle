import { ImpactCounter } from "@/components/ImpactCounter";
import { SkillChainView } from "@/components/SkillChainView";
import { GeoAdminSkillMap } from "@/components/GeoAdminSkillMap";
import { Link } from "react-router-dom";
import { MedalBadge } from "@/components/MedalBadge";
import { getAllUsers } from "@/lib/appData";
import { SEED_CHAINS } from "@/mock/chains";

export default function Impact() {
  const featured = SEED_CHAINS.find((c) => c.id === "chain_featured")!;
  const topContributors = getAllUsers()
    .slice()
    .sort((left, right) => right.impactScore - left.impactScore)
    .slice(0, 8);

  return (
    <div className="container py-12 page-fade space-y-10">
      <header className="max-w-2xl">
        <p className="chip">A quiet snapshot</p>
        <h1 className="font-serif text-4xl md:text-5xl text-ink mt-3 leading-tight">Small skills moving gently across Switzerland.</h1>
        <p className="text-mutedInk mt-3">No metrics to brag about — just a soft trace of people helping people.</p>
      </header>

      <section className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <ImpactCounter value={100} label="People in the swap" />
        <ImpactCounter value={180} label="Teaching offers shared" />
        <ImpactCounter value={160} label="Learning requests posted" />
        <ImpactCounter value={300} label="Sessions completed" />
        <ImpactCounter value={40} label="Active skill chains" />
      </section>

      <section className="grid xl:grid-cols-5 gap-6 items-start">
        <div className="xl:col-span-2 space-y-6">
          <SkillChainView chain={featured} />

          <div className="card-soft p-5 md:p-6">
            <div>
              <p className="chip">Community impact board</p>
              <h2 className="font-serif text-2xl text-ink mt-3">People whose quiet help travels far.</h2>
              <p className="text-sm text-mutedInk mt-2">
                A soft ranking of members creating the most community impact.
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {topContributors.slice(0, 5).map((user, index) => (
                <Link
                  key={user.id}
                  to={`/profile/${user.id}`}
                  className="block rounded-2xl border border-borderSoft/50 bg-card/70 p-3 transition hover:border-moss hover:bg-accent/30"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent font-serif text-base text-moss">
                      #{index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-serif text-lg text-ink">{user.name}</p>
                          <p className="text-xs text-mutedInk">{user.city} · {user.languages[0]}</p>
                        </div>
                        <span className="chip shrink-0">Impact {user.impactScore}</span>
                      </div>
                      {user.visibleMedalIds.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {user.visibleMedalIds.slice(0, 2).map((id) => <MedalBadge key={id} id={id} size="sm" />)}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="xl:col-span-3 space-y-6">
          <GeoAdminSkillMap />

          <div className="card-soft p-8 bg-accent/40">
            <p className="font-serif text-2xl text-ink leading-snug">"When I help one person, they help another. The chain grows quietly, like ivy."</p>
            <p className="text-mutedInk mt-3">— a Skillswap volunteer</p>
          </div>
        </div>
      </section>
    </div>
  );
}
