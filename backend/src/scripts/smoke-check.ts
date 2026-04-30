export {};
const baseUrl = process.env.API_BASE_URL ?? "http://localhost:8080/api/v1";
async function main() {
  const health = await request("GET", "/health");
  console.log("health:", health.data);
  const session = await request<{ id: string }>("POST", "/demo/session");
  console.log("demo session:", session.data.id);
  const headers = { "X-Demo-Session-Id": session.data.id, "X-Actor-User-Id": "user_sara" };
  await request("GET", "/bootstrap", undefined, headers);
  console.log("bootstrap loaded");
  const offers = await request<{ id: string; ownerUserId: string }[]>("GET", "/listings?type=offer&limit=3", undefined, headers);
  console.log("offers:", offers.data.map((l) => l.id).join(", "));
  const requests = await request<{ id: string }[]>("GET", "/listings?type=request&limit=3", undefined, headers);
  console.log("requests:", requests.data.map((l) => l.id).join(", "));
  if (offers.data.length) {
    const listing = offers.data[0];
    const created = await request("POST", "/sessions/request", { fromUserId: "user_sara", toUserId: listing.ownerUserId === "user_sara" ? "user_lina" : listing.ownerUserId, listingId: listing.id, message: "Hi, could we do a short Skillswap session?", proposedStartAt: "2026-05-02T14:00:00+02:00", proposedEndAt: "2026-05-02T14:30:00+02:00", timezone: "Europe/Zurich" }, headers);
    console.log("session request created:", (created.data as { session?: { id: string } }).session?.id);
  }
  const impact = await request("GET", "/impact", undefined, headers);
  console.log("impact:", (impact.data as { counters?: unknown }).counters);
}
async function request<T = unknown>(method: string, path: string, body?: unknown, headers?: Record<string, string>): Promise<{ data: T }> {
  const response = await fetch(`${baseUrl}${path}`, { method, headers: { ...(body ? { "Content-Type": "application/json" } : {}), ...(headers ?? {}) }, body: body ? JSON.stringify(body) : undefined });
  const payload = await response.json();
  if (!response.ok) throw new Error(`${method} ${path} failed: ${JSON.stringify(payload)}`);
  return payload as { data: T };
}
main().catch((error) => { console.error(error); process.exit(1); });
