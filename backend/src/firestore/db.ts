import { Firestore } from "@google-cloud/firestore";
import { env } from "../config/env";

export const db = new Firestore({ projectId: env.googleCloudProject, databaseId: env.firestoreDatabaseId });

export const collections = {
  demoSessions: "demoSessions",
  users: "users",
  medalTypes: "medalTypes",
  listings: "listings",
  userSavedListings: "userSavedListings",
  userListingHistory: "userListingHistory",
  sessions: "sessions",
  chatThreads: "chatThreads",
  feedback: "feedback",
  skillChains: "skillChains",
  areaConnections: "areaConnections",
  impact: "impact",
} as const;

export function nowIso() {
  return new Date().toISOString();
}

export function docData<T>(snapshot: FirebaseFirestore.DocumentSnapshot): T | null {
  return snapshot.exists ? (snapshot.data() as T) : null;
}

export async function getDocOrNull<T>(collectionName: string, id: string): Promise<T | null> {
  return docData<T>(await db.collection(collectionName).doc(id).get());
}

export async function writeBatchChunks<T>(collectionName: string, records: T[], getId: (record: T) => string) {
  for (let i = 0; i < records.length; i += 450) {
    const batch = db.batch();
    for (const record of records.slice(i, i + 450)) {
      batch.set(db.collection(collectionName).doc(getId(record)), record as FirebaseFirestore.DocumentData);
    }
    await batch.commit();
  }
}
