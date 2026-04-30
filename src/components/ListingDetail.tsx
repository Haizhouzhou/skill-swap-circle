import type { Listing } from "@/mock/types";
import { USERS_BY_ID } from "@/mock/users";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Languages, Globe, Users as UsersIcon, Mail, MessageCircle, Heart } from "lucide-react";
import { MedalBadge } from "./MedalBadge";
import { UserProfileCard } from "./UserProfileCard";
import { useRequireDemoUser } from "@/hooks/useRequireDemoUser";
import { buildMailto } from "@/lib/mailto";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE } from "@/lib/storageKeys";
import { matchScore, similarListings, recommendFor } from "@/lib/match";
import { useDemoUser } from "@/context/DemoUserContext";
import { useToast } from "@/hooks/use-toast";
import { ListingCard } from "./ListingCard";

export function ListingDetail({ listing, allListings }: { listing: Listing; allListings: Listing[] }) {
  const owner = USERS_BY_ID[listing.ownerUserId];
  const isOffer = listing.type === "offer";
  const { user } = useDemoUser();
  const { requireUser } = useRequireDemoUser();
  const navigate = useNavigate();
  const [saved, setSaved] = useLocalStorage<string[]>(STORAGE.savedListings, []);
  const [, setClicked] = useLocalStorage<string[]>(STORAGE.clickedListings, []);
  const { toast } = useToast();

  // Track click
  if (typeof window !== "undefined") {
    setTimeout(() => {
      setClicked((c) => (c.includes(listing.id) ? c : [...c, listing.id]));
    }, 0);
  }

  const isSaved = saved.includes(listing.id);
  const match = user ? matchScore(user, listing) : null;
  const similar = similarListings(listing, allListings);
  const recs = recommendFor(user, allListings, { mode: isOffer ? "learn" : "teach", limit: 3 });

  function primary() {
    if (!requireUser(isOffer ? "Step in as a demo person to request this session." : "Step in as a demo person to offer help.")) return;
    toast({ title: isOffer ? "Session request sent" : "Help offered", description: `${owner.name} will see your message in a moment.` });
  }

  function openChat() {
    if (!requireUser("Step in as a demo person to start a chat.")) return;
    navigate(`/chat/chat_for_${listing.id}`);
  }

  function toggleSave() {
    if (!requireUser("Step in as a demo person to save listings.")) return;
    setSaved((s) => (s.includes(listing.id) ? s.filter((x) => x !== listing.id) : [...s, listing.id]));
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <header className="card-soft p-6 md:p-8">
          <p className="text-xs text-clay uppercase tracking-wide">{listing.category} · {isOffer ? "Teaching offer" : "Learning request"}</p>
          <h1 className="font-serif text-3xl md:text-4xl text-ink mt-1">{listing.title}</h1>
          <p className="mt-3 text-mutedInk leading-relaxed">{listing.description}</p>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-mutedInk mt-5">
            <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4" />{listing.city}, {listing.canton}</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="w-4 h-4" />{listing.durationMinutes} min</span>
            <span className="inline-flex items-center gap-1.5">
              {listing.mode.includes("online") && listing.mode.includes("in_person")
                ? <><Globe className="w-4 h-4" /> online or in person</>
                : listing.mode.includes("online")
                  ? <><Globe className="w-4 h-4" /> online</>
                  : <><UsersIcon className="w-4 h-4" /> in person</>}
            </span>
            <span className="inline-flex items-center gap-1.5"><Languages className="w-4 h-4" />{listing.languages.join(", ")}</span>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <Section title={isOffer ? "What you will learn" : "What they want help with"}>
              <p className="text-sm text-ink leading-relaxed">{listing.title}. {isOffer ? "Calm, step-by-step, no pressure." : "Looking for a kind, patient hand."}</p>
            </Section>
            {isOffer ? (
              <Section title="Best for">
                <p className="text-sm text-ink leading-relaxed">{listing.recommendedFor.join(", ") || "anyone curious"}.</p>
              </Section>
            ) : (
              <Section title="Why this would help">
                <p className="text-sm text-ink leading-relaxed">It would make a small daily thing feel lighter and easier.</p>
              </Section>
            )}
            <Section title="Availability">
              <ul className="text-sm text-ink space-y-0.5">
                {listing.availability.map((s, i) => <li key={i}>· {s.label}</li>)}
              </ul>
            </Section>
            <Section title="Tags">
              <div className="flex flex-wrap gap-1.5">
                {listing.tags.map((t) => <span key={t} className="chip">{t}</span>)}
                {listing.beginnerFriendly && <span className="chip">beginner-friendly</span>}
              </div>
            </Section>
          </div>

          {isOffer && owner.visibleMedalIds.length > 0 && (
            <div className="mt-6">
              <p className="text-xs uppercase tracking-wide text-mutedInk mb-2">Visible recognition</p>
              <div className="flex flex-wrap gap-2">
                {owner.visibleMedalIds.map((id) => <MedalBadge key={id} id={id} size="sm" />)}
              </div>
            </div>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-2">
            <Button onClick={primary} className="bg-moss text-cream hover:bg-ink rounded-full">
              {isOffer ? "Request session" : "Offer help"}
            </Button>
            <Button asChild variant="outline" className="rounded-full border-borderSoft">
              <a href={buildMailto(listing, owner, user?.name)}>
                <Mail className="w-4 h-4" /> Contact by email
              </a>
            </Button>
            <Button variant="outline" className="rounded-full border-borderSoft" onClick={openChat}>
              <MessageCircle className="w-4 h-4" /> Open chat
            </Button>
            <Button variant="ghost" className="rounded-full text-mutedInk" onClick={toggleSave}>
              <Heart className={`w-4 h-4 ${isSaved ? "fill-clay text-clay" : ""}`} /> {isSaved ? "Saved" : "Save"}
            </Button>
          </div>
        </header>

        {match && match.reasons.length > 0 && (
          <div className="card-soft p-5 bg-accent/40">
            <p className="font-serif text-lg text-ink">Why this could be a kind match for you</p>
            <p className="text-mutedInk text-sm mt-1">
              {owner.name} could be a good match — {match.reasons.slice(0, 4).join(", ")}.
            </p>
          </div>
        )}

        {similar.length > 0 && (
          <section>
            <h2 className="font-serif text-2xl text-ink mb-3">Similar listings</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {similar.map((l) => <ListingCard key={l.id} listing={l} />)}
            </div>
          </section>
        )}
      </div>

      <aside className="space-y-6">
        <UserProfileCard user={owner} />
        <Link to={`/profile/${owner.id}`} className="text-sm text-moss hover:underline ml-2">View {owner.name}'s public profile →</Link>

        {recs.length > 0 && (
          <div>
            <h3 className="font-serif text-lg text-ink mb-2">Recommended for you</h3>
            <div className="space-y-3">
              {recs.filter(r => r.listing.id !== listing.id).slice(0, 3).map((r) => (
                <Link key={r.listing.id} to={`/listing/${r.listing.id}`} className="card-soft p-4 block">
                  <p className="text-xs text-clay">{r.listing.category}</p>
                  <p className="font-serif text-ink">{r.listing.title}</p>
                  <p className="text-xs text-mutedInk mt-1">{r.listing.city}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-borderSoft bg-cream/60 p-4">
      <p className="text-xs uppercase tracking-wide text-mutedInk mb-1.5">{title}</p>
      {children}
    </div>
  );
}
