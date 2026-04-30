import { useDemoUser } from "@/context/DemoUserContext";
import { useParams, Link } from "react-router-dom";
import { USERS_BY_ID } from "@/mock/users";
import { SEED_LISTINGS } from "@/mock/listings";
import { SEED_CHAINS } from "@/mock/chains";
import { SEED_FEEDBACK } from "@/mock/feedback";
import { MedalBadge } from "@/components/MedalBadge";
import { ListingCard } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export default function PublicProfile() {
  const { userId } = useParams();
  const { customUser } = useDemoUser();
  const user = userId ? (USERS_BY_ID[userId] ?? (customUser?.id === userId ? customUser : null)) : null;
  if (!user) return <div className="container py-16"><p className="font-serif text-2xl">No such profile.</p></div>;

  const offers = SEED_LISTINGS.filter((l) => l.ownerUserId === user.id && l.type === "offer");
  const requests = SEED_LISTINGS.filter((l) => l.ownerUserId === user.id && l.type === "request");
  const feedbackTags = Array.from(new Set(SEED_FEEDBACK.filter((f) => f.toUserId === user.id).flatMap((f) => f.tags))).slice(0, 8);
  const contributions = SEED_CHAINS.filter((c) => c.steps.some((s) => s.fromUserId === user.id || s.toUserId === user.id)).slice(0, 3);

  return (
    <div className="container py-10 page-fade space-y-8">
      <Link to="/browse/learn" className="text-sm text-mutedInk hover:text-moss">← Back</Link>
      <header className="card-soft p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
        <div className="w-20 h-20 rounded-full bg-sand grid place-items-center font-serif text-4xl text-moss">{user.name[0]}</div>
        <div className="flex-1">
          <h1 className="font-serif text-3xl text-ink">{user.name}</h1>
          <p className="text-mutedInk">{user.city}, {user.canton} · {user.languages.join(", ")}</p>
          <p className="text-ink mt-3 leading-relaxed max-w-prose">{user.bio}</p>
          {(user.teachSkills?.length || user.learnSkills?.length) ? (
            <div className="mt-4 space-y-3">
              {user.teachSkills && user.teachSkills.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-mutedInk">Skills</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {user.teachSkills.map((skill) => <span key={skill} className="chip">{skill}</span>)}
                  </div>
                </div>
              )}
              {user.learnSkills && user.learnSkills.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-mutedInk">Wants to learn</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {user.learnSkills.map((skill) => <span key={skill} className="chip">{skill}</span>)}
                  </div>
                </div>
              )}
            </div>
          ) : null}
          <div className="flex flex-wrap items-center gap-2 mt-5">
            <span className="chip">Points · {user.points}</span>
            <span className="chip">Impact score · {user.impactScore}</span>
            {feedbackTags.slice(0, 4).map((t) => <span key={t} className="chip">{t}</span>)}
          </div>
          {user.visibleMedalIds.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {user.visibleMedalIds.map((id) => <MedalBadge key={id} id={id} size="sm" />)}
            </div>
          )}
        </div>
        <Button asChild variant="outline" className="rounded-full border-borderSoft">
          <a href={`mailto:${user.email}?subject=${encodeURIComponent("Hello from Skillswap")}`}>
            <Mail className="w-4 h-4" /> Contact by email
          </a>
        </Button>
      </header>

      {offers.length > 0 && (
        <section>
          <h2 className="font-serif text-2xl text-ink mb-3">{user.name} can teach</h2>
          <div className="grid sm:grid-cols-2 gap-4">{offers.slice(0, 4).map((l) => <ListingCard key={l.id} listing={l} />)}</div>
        </section>
      )}
      {requests.length > 0 && (
        <section>
          <h2 className="font-serif text-2xl text-ink mb-3">{user.name} would like to learn</h2>
          <div className="grid sm:grid-cols-2 gap-4">{requests.slice(0, 4).map((l) => <ListingCard key={l.id} listing={l} />)}</div>
        </section>
      )}

      {contributions.length > 0 && (
        <section className="card-soft p-6">
          <h2 className="font-serif text-xl text-ink">Skill chain contributions</h2>
          <ul className="mt-3 space-y-2 text-sm text-mutedInk">
            {contributions.map((c, i) => (
              <li key={i}>· Part of a {c.steps.length}-step chain including <em className="not-italic text-ink">{c.steps[0].skillTitle}</em></li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
