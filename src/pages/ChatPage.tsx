import { useParams, Link } from "react-router-dom";
import { useMemo } from "react";
import { SEED_CHATS } from "@/mock/chats";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE } from "@/lib/storageKeys";
import type { ChatThread, Listing } from "@/mock/types";
import { SEED_LISTINGS } from "@/mock/listings";
import { ChatPanel } from "@/components/ChatPanel";
import { useDemoUser } from "@/context/DemoUserContext";
import { USERS_BY_ID } from "@/mock/users";

export default function ChatPage() {
  const { threadId } = useParams();
  const { user } = useDemoUser();
  const [stored, setStored] = useLocalStorage<ChatThread[]>(STORAGE.chatThreads, []);
  const [created] = useLocalStorage<Listing[]>(STORAGE.createdListings, []);

  const allThreads = useMemo(() => {
    const map = new Map<string, ChatThread>();
    [...SEED_CHATS, ...stored].forEach((t) => map.set(t.id, t));
    return [...map.values()];
  }, [stored]);

  const allListings = useMemo(() => [...created, ...SEED_LISTINGS], [created]);

  let thread = allThreads.find((t) => t.id === threadId);

  // Auto-create thread on first visit (e.g. /chat/chat_for_offer_3)
  if (!thread && threadId?.startsWith("chat_for_") && user) {
    const lid = threadId.replace("chat_for_", "");
    const listing = allListings.find((l) => l.id === lid);
    if (listing) {
      thread = {
        id: threadId,
        listingId: listing.id,
        participantIds: [listing.ownerUserId, user.id],
        messages: [
          { id: "auto1", senderId: user.id, text: `Hi ${USERS_BY_ID[listing.ownerUserId]?.name ?? "there"}, I saw your listing about ${listing.title.toLowerCase()}. Could we set something up?`, createdAt: new Date().toISOString() },
        ],
      };
      // Persist immediately
      setTimeout(() => {
        if (!stored.find((t) => t.id === threadId)) setStored([...stored, thread!]);
      }, 0);
    }
  }

  const listing = thread ? allListings.find((l) => l.id === thread!.listingId) : undefined;

  return (
    <div className="container py-10 page-fade max-w-3xl">
      <Link to="/me" className="text-sm text-mutedInk hover:text-moss">← Back to my space</Link>
      <div className="mt-4">
        {thread ? (
          <ChatPanel threadId={thread.id} listing={listing} />
        ) : (
          <p className="text-mutedInk">This conversation hasn't started yet.</p>
        )}
      </div>
    </div>
  );
}
