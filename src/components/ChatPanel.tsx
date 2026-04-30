import { useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE } from "@/lib/storageKeys";
import { SEED_CHATS } from "@/mock/chats";
import type { ChatThread, ChatMessage, Listing } from "@/mock/types";
import { USERS_BY_ID } from "@/mock/users";
import { useDemoUser } from "@/context/DemoUserContext";
import { useRequireDemoUser } from "@/hooks/useRequireDemoUser";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

function loadAllThreads(extra: ChatThread[]): ChatThread[] {
  const map = new Map<string, ChatThread>();
  [...SEED_CHATS, ...extra].forEach((t) => map.set(t.id, t));
  return [...map.values()];
}

export function ChatPanel({ threadId, listing }: { threadId: string; listing?: Listing }) {
  const [stored, setStored] = useLocalStorage<ChatThread[]>(STORAGE.chatThreads, []);
  const { user } = useDemoUser();
  const { requireUser } = useRequireDemoUser();
  const [draft, setDraft] = useState("");

  const allThreads = useMemo(() => loadAllThreads(stored), [stored]);
  const thread = allThreads.find((t) => t.id === threadId);

  useEffect(() => {
    // Scroll to bottom on update
    const el = document.getElementById("chat-scroll");
    if (el) el.scrollTop = el.scrollHeight;
  }, [thread?.messages.length]);

  if (!thread) return <p className="text-mutedInk">This conversation hasn't started yet.</p>;

  function send() {
    if (!requireUser("Step in as a demo person to send a message.")) return;
    if (!draft.trim() || !user) return;
    const msg: ChatMessage = {
      id: `m_${Date.now()}`,
      senderId: user.id,
      text: draft.trim(),
      createdAt: new Date().toISOString(),
    };
    const exists = stored.some((t) => t.id === thread!.id);
    if (exists) {
      setStored(stored.map((t) => (t.id === thread!.id ? { ...t, messages: [...t.messages, msg] } : t)));
    } else {
      const newThread: ChatThread = { ...thread!, messages: [...thread!.messages, msg] };
      // Ensure current user is a participant
      if (!newThread.participantIds.includes(user.id)) newThread.participantIds = [...newThread.participantIds, user.id];
      setStored([...stored, newThread]);
    }
    setDraft("");
  }

  return (
    <div className="card-soft overflow-hidden flex flex-col h-[70vh]">
      <header className="px-5 py-4 border-b border-borderSoft bg-accent/30">
        <p className="text-xs text-clay uppercase tracking-wide">Conversation about</p>
        <p className="font-serif text-lg text-ink">{listing?.title ?? "a Skillswap exchange"}</p>
        <p className="text-xs text-mutedInk mt-1">
          With {thread.participantIds.map((id) => USERS_BY_ID[id]?.name ?? "someone").join(" · ")}
        </p>
      </header>
      <div id="chat-scroll" className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-cream">
        {thread.messages.map((m) => {
          const sender = USERS_BY_ID[m.senderId];
          const mine = user?.id === m.senderId;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${mine ? "bg-moss text-cream" : "bg-card border border-borderSoft text-ink"}`}>
                {!mine && <p className="text-xs text-clay mb-0.5">{sender?.name ?? "Someone"}</p>}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
              </div>
            </div>
          );
        })}
      </div>
      <form
        onSubmit={(e) => { e.preventDefault(); send(); }}
        className="border-t border-borderSoft p-3 flex items-center gap-2 bg-card"
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={user ? "Write something kind…" : "Step in as a demo person to write a message…"}
          className="flex-1 h-11 rounded-full bg-cream border border-borderSoft px-4 text-sm focus:outline-none focus:ring-2 focus:ring-sage/40"
        />
        <Button type="submit" className="bg-moss text-cream hover:bg-ink rounded-full h-11 px-4">
          <Send className="w-4 h-4" /> Send
        </Button>
      </form>
    </div>
  );
}
