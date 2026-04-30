import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "@/mock/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { api } from "@/lib/api";
import { getUserById } from "@/lib/appData";
import { STORAGE } from "@/lib/storageKeys";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Ctx = {
  user: User | null;
  customUser: User | null;
  isVisitor: boolean;
  setUserId: (id: string | null) => void;
  setCustomUser: (user: User | null) => void;
  promptDemoUser: (reason?: string) => void;
};

const DemoUserContext = createContext<Ctx | null>(null);

const PERSONAS = [
  { id: "user_sara", label: "Sara", city: "Zürich" },
  { id: "user_lina", label: "Lina", city: "Basel" },
  { id: "user_omar", label: "Omar", city: "Lausanne" },
  { id: "user_maya", label: "Maya", city: "Bern" },
  { id: "user_noah", label: "Noah", city: "Geneva" },
];

export function DemoUserProvider({ children }: { children: ReactNode }) {
  const [selectedId, setSelectedId] = useLocalStorage<string | null>(STORAGE.selectedUserId, null);
  const [customUser, setCustomUser] = useLocalStorage<User | null>(STORAGE.customProfile, null);
  const [promptOpen, setPromptOpen] = useState(false);
  const [reason, setReason] = useState<string | undefined>(undefined);

  const user = useMemo(() => {
    if (!selectedId) return null;
    return getUserById(selectedId);
  }, [customUser, selectedId]);

  useEffect(() => {
    void api.createDemoSession();
  }, []);

  const setUserId = useCallback((id: string | null) => {
    setSelectedId(id);
    setPromptOpen(false);
    void api.selectDemoUser(id);
  }, [setSelectedId]);

  const promptDemoUser = useCallback((r?: string) => {
    setReason(r);
    setPromptOpen(true);
  }, []);

  return (
    <DemoUserContext.Provider value={{ user, customUser, isVisitor: !user, setUserId, setCustomUser, promptDemoUser }}>
      {children}
      <Dialog open={promptOpen} onOpenChange={setPromptOpen}>
        <DialogContent className="bg-card border-borderSoft rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-ink">Choose a demo profile to join the swap.</DialogTitle>
            <DialogDescription className="text-mutedInk">
              {reason ?? "Visitors can browse freely. To take part in the exchange, step in as one of the demo people below."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 mt-2">
            {PERSONAS.map((p) => (
              <Button
                key={p.id}
                variant="outline"
                className="justify-start h-auto py-3 rounded-xl border-borderSoft hover:bg-accent"
                onClick={() => setUserId(p.id)}
              >
                <span className="font-serif text-ink">Continue as {p.label}</span>
                <span className="text-mutedInk text-sm ml-2">from {p.city}</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </DemoUserContext.Provider>
  );
}

export function useDemoUser() {
  const ctx = useContext(DemoUserContext);
  if (!ctx) throw new Error("useDemoUser must be used inside DemoUserProvider");
  return ctx;
}

export const DEMO_PERSONAS = PERSONAS;
