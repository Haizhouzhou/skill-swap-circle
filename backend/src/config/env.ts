import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 8080),
  nodeEnv: process.env.NODE_ENV ?? "development",
  googleCloudProject: process.env.GOOGLE_CLOUD_PROJECT || undefined,
  firestoreDatabaseId: process.env.FIRESTORE_DATABASE_ID || "(default)",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  demoAdminKey: process.env.DEMO_ADMIN_KEY ?? "change-me",
  demoSeedVersion: process.env.DEMO_SEED_VERSION ?? "1",
};

export function corsOrigins(): string[] | boolean {
  if (!env.corsOrigin || env.corsOrigin === "*") return true;
  return env.corsOrigin.split(",").map((origin) => origin.trim()).filter(Boolean);
}
