import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DEMO_PERSONAS, useDemoUser } from "@/context/DemoUserContext";
import { Button } from "@/components/ui/button";

export function DemoUserSelector({ open, onOpenChange }: { open: boolean; onOpenChange: (b: boolean) => void }) {
  const { setUserId, user } = useDemoUser();
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
