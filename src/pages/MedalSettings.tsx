import { useDemoUser } from "@/context/DemoUserContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE } from "@/lib/storageKeys";
import { MedalToggleCard } from "@/components/MedalToggleCard";
import { Button } from "@/components/ui/button";

type VisibilityMap = Record<string, Record<string, boolean>>; // userId -> medalId -> visible

export default function MedalSettings() {
  const { user, promptDemoUser } = useDemoUser();
  const [vis, setVis] = useLocalStorage<VisibilityMap>(STORAGE.medalVisibility, {});

  if (!user) {
    return (
      <div className="container py-16 text-center">
        <p className="font-serif text-2xl text-ink">Step in to manage your recognitions.</p>
        <Button className="mt-5 rounded-full bg-moss text-cream hover:bg-ink" onClick={() => promptDemoUser()}>Choose a profile</Button>
      </div>
    );
  }

  const userVis = vis[user.id] ?? Object.fromEntries(user.allMedalIds.map((id) => [id, user.visibleMedalIds.includes(id)]));

  function setMedal(medalId: string, visible: boolean) {
    setVis({ ...vis, [user.id]: { ...userVis, [medalId]: visible } });
  }

  return (
    <div className="container py-10 page-fade max-w-3xl">
      <h1 className="font-serif text-3xl text-ink">Choose what to show</h1>
      <p className="text-mutedInk mt-2 max-w-prose">
        These small recognitions are yours. Show what feels right. Hide what feels too loud. This is a quiet space, not a leaderboard.
      </p>
      <div className="mt-6 grid gap-3">
        {user.allMedalIds.map((id) => (
          <MedalToggleCard
            key={id}
            id={id}
            visible={userVis[id] ?? false}
            onToggle={(v) => setMedal(id, v)}
            earnedAt={new Date(2025, 2, 14).toISOString()}
          />
        ))}
      </div>
      <p className="text-xs text-mutedInk mt-5">Note: in this demo, public profiles still show the seeded visible medals; your toggles are saved locally.</p>
    </div>
  );
}
