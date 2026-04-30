import { Link, useNavigate } from "react-router-dom";
import { useDemoUser } from "@/context/DemoUserContext";
import { useUserDashboardQuery } from "@/lib/api-hooks";
import { getUserById } from "@/lib/appData";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/ListingCard";
import { MedalBadge } from "@/components/MedalBadge";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, promptDemoUser } = useDemoUser();
  const navigate = useNavigate();
  const { data } = useUserDashboardQuery(user?.id);

  useEffect(() => { if (!user) promptDemoUser("Step in as a demo person to see your space."); }, []); // eslint-disable-line

  if (!user) {
    return (
      <div className="container py-16 text-center">
        <p className="font-serif text-2xl text-ink">Your space is waiting.</p>
        <p className="text-mutedInk mt-2">Choose a demo profile to see it.</p>
        <Button className="mt-5 rounded-full bg-moss text-cream hover:bg-ink" onClick={() => promptDemoUser()}>Choose a profile</Button>
      </div>
    );
  }

  const myOffers = data?.teachingOffers ?? [];
  const myRequests = data?.learningRequests ?? [];
  const savedListings = data?.savedListings ?? [];
  const recentSessions = data?.recentSessions ?? [];
  const myThreads = data?.recentChatThreads ?? [];

  return (
    <div className="container py-10 page-fade space-y-10">
      <header className="card-soft p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-sand grid place-items-center font-serif text-3xl text-moss">{user.name[0]}</div>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wide text-mutedInk">Stepping in as</p>
          <h1 className="font-serif text-3xl text-ink">{user.name} · {user.city}</h1>
          <p className="text-mutedInk mt-1 max-w-prose">{user.bio}</p>
          <div className="flex flex-wrap gap-2 mt-3 items-center">
            <span className="chip">Points · {user.points}</span>
            {user.visibleMedalIds.slice(0, 3).map((id) => <MedalBadge key={id} id={id} size="sm" />)}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button onClick={() => navigate("/me/create-offer")} className="bg-moss text-cream hover:bg-ink rounded-full">Share something I know</Button>
          <Button variant="outline" onClick={() => navigate("/me/create-request")} className="rounded-full border-borderSoft">Publish a learning request</Button>
          <Button variant="ghost" onClick={() => navigate("/me/medals")} className="rounded-full text-mutedInk">Manage medals</Button>
        </div>
      </header>

      <Section title="My teaching offers" empty="You haven't shared anything yet — that's perfectly fine.">
        {myOffers.length > 0 && <div className="grid sm:grid-cols-2 gap-4">{myOffers.map((l) => <ListingCard key={l.id} listing={l} />)}</div>}
      </Section>

      <Section title="My learning requests" empty="No requests yet. Asking for help is part of the swap.">
        {myRequests.length > 0 && <div className="grid sm:grid-cols-2 gap-4">{myRequests.map((l) => <ListingCard key={l.id} listing={l} />)}</div>}
      </Section>

      <Section title="Saved listings" empty="Nothing saved yet.">
        {savedListings.length > 0 && <div className="grid sm:grid-cols-2 gap-4">{savedListings.map((l) => <ListingCard key={l.id} listing={l} />)}</div>}
      </Section>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card-soft p-6">
          <h3 className="font-serif text-xl text-ink mb-3">Recent conversations</h3>
          {myThreads.length === 0 && <p className="text-mutedInk text-sm">No conversations yet.</p>}
          <ul className="space-y-2">
            {myThreads.map((t) => {
              const other = t.participantIds.find((id) => id !== user.id);
              const otherName = other ? getUserById(other)?.name ?? "someone" : "someone";
              const last = t.messages[t.messages.length - 1];
              return (
                <li key={t.id}>
                  <Link to={`/chat/${t.id}`} className="block rounded-xl p-3 hover:bg-accent/60">
                    <p className="text-ink font-serif">With {otherName}</p>
                    <p className="text-xs text-mutedInk truncate">{last?.text}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="card-soft p-6">
          <h3 className="font-serif text-xl text-ink mb-3">Recent sessions</h3>
          {recentSessions.length === 0 && <p className="text-mutedInk text-sm">No sessions logged yet.</p>}
          <ul className="space-y-2 text-sm text-ink">
            {recentSessions.map((s) => (
              <li key={s.id} className="rounded-xl p-3 bg-cream border border-borderSoft">
                <p className="font-serif">{s.skillTitle}</p>
                <p className="text-xs text-mutedInk">{new Date(s.completedAt).toLocaleDateString()} · {s.cityFrom} ↔ {s.cityTo}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Section({ title, empty, children }: { title: string; empty: string; children?: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-serif text-2xl text-ink mb-3">{title}</h2>
      {children ?? <p className="text-mutedInk text-sm">{empty}</p>}
    </section>
  );
}
