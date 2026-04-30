import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DEMO_PERSONAS, useDemoUser } from "@/context/DemoUserContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function DemoUserSelector({ open, onOpenChange }: { open: boolean; onOpenChange: (b: boolean) => void }) {
  const { setUserId, user, customUser } = useDemoUser();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-borderSoft rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-ink">Step in as someone</DialogTitle>
          <DialogDescription className="text-mutedInk">
            This is a peaceful demo. Pick a person to explore the swap from their side, or stay as a visitor.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 mt-2">
          {customUser && (
            <Button
              variant="outline"
              className={`justify-start h-auto py-3 rounded-xl border-borderSoft hover:bg-accent ${user?.id === customUser.id ? "bg-accent" : ""}`}
              onClick={() => { setUserId(customUser.id); onOpenChange(false); }}
            >
              <span className="font-serif text-ink">Continue as {customUser.name}</span>
              <span className="text-mutedInk text-sm ml-2">your profile</span>
            </Button>
          )}
          {DEMO_PERSONAS.map((p) => (
            <Button
              key={p.id}
              variant="outline"
              className={`justify-start h-auto py-3 rounded-xl border-borderSoft hover:bg-accent ${user?.id === p.id ? "bg-accent" : ""}`}
              onClick={() => { setUserId(p.id); onOpenChange(false); }}
            >
              <span className="font-serif text-ink">Continue as {p.label}</span>
              <span className="text-mutedInk text-sm ml-2">from {p.city}</span>
            </Button>
          ))}
          <Button
            variant="ghost"
            className="justify-start h-auto py-3 rounded-xl text-mutedInk"
            onClick={() => { setUserId(null); onOpenChange(false); }}
          >
            Continue as visitor
          </Button>
          <Button asChild variant="ghost" className="justify-start h-auto py-3 rounded-xl text-moss">
            <Link to="/create-profile" onClick={() => onOpenChange(false)}>
              Create my own profile
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
