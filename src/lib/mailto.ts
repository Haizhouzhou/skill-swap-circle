import type { Listing, User } from "@/mock/types";

export function buildMailto(listing: Listing, owner: User, fromName?: string) {
  const action = listing.type === "offer" ? "session request" : "offer to help";
  const subject = `Skillswap ${action}: ${listing.title}`;
  const greeting = `Hi ${owner.name},`;
  const intro =
    listing.type === "offer"
      ? `I saw your Skillswap listing about ${listing.title.toLowerCase()}. Would you be open to a short session?`
      : `I saw your Skillswap request about ${listing.title.toLowerCase()}. I'd be glad to help if it's still useful.`;
  const closing = fromName ? `Warmly,\n${fromName}` : "Warmly,";
  const body = `${greeting}\n\n${intro}\n\nNo pressure at all — just wanted to reach out.\n\n${closing}`;
  return `mailto:${owner.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
