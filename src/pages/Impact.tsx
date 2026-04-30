import { ImpactCounter } from "@/components/ImpactCounter";
import { SkillChainView } from "@/components/SkillChainView";
import { GeoAdminSkillMap } from "@/components/GeoAdminSkillMap";
import { SEED_CHAINS } from "@/mock/chains";

export default function Impact() {
  const featured = SEED_CHAINS.find((c) => c.id === "chain_featured")!;
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
        <div className="xl:col-span-2">
          <SkillChainView chain={featured} />
        </div>
        <div className="xl:col-span-3">
          <GeoAdminSkillMap />
        </div>
      </section>

      <section className="card-soft p-8 bg-accent/40 max-w-3xl">
        <p className="font-serif text-2xl text-ink leading-snug">"When I help one person, they help another. The chain grows quietly, like ivy."</p>
        <p className="text-mutedInk mt-3">— a Skillswap volunteer</p>
      </section>
    </div>
  );
}
