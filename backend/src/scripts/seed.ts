export {};
const baseUrl = process.env.API_BASE_URL ?? "http://localhost:8080/api/v1";
const adminKey = process.env.DEMO_ADMIN_KEY;
async function main() {
  if (!adminKey) throw new Error("DEMO_ADMIN_KEY is required");
  const response = await fetch(`${baseUrl}/admin/seed`, { method: "POST", headers: { "Content-Type": "application/json", "X-Demo-Admin-Key": adminKey }, body: JSON.stringify({ resetBeforeSeed: true }) });
  const body = await response.json();
  if (!response.ok) throw new Error(`Seed failed: ${JSON.stringify(body)}`);
  console.log(JSON.stringify(body, null, 2));
}
main().catch((error) => { console.error(error); process.exit(1); });
