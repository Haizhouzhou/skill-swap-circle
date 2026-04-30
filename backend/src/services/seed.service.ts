import { db, collections, nowIso, writeBatchChunks } from "../firestore/db";
import { generateAllSeedData } from "../seed/generateAll";

const resetCollections = Object.values(collections);

export async function resetDemoData() {
  for (const collectionName of resetCollections) {
    await (db as unknown as { recursiveDelete: (ref: FirebaseFirestore.CollectionReference) => Promise<void> }).recursiveDelete(db.collection(collectionName));
  }
  return { deletedCollections: resetCollections };
}

export async function seedDemoData(opts: { resetBeforeSeed?: boolean }) {
  if (opts.resetBeforeSeed) await resetDemoData();
  const data = generateAllSeedData();
  await writeBatchChunks(collections.users, data.users, (r) => r.id);
  await writeBatchChunks(collections.medalTypes, data.medals, (r) => r.id);
  await writeBatchChunks(collections.listings, data.listings, (r) => r.id);
  await writeBatchChunks(collections.sessions, data.sessions, (r) => r.id);
  await writeBatchChunks(collections.chatThreads, data.chatThreads, (r) => r.id);
  await writeBatchChunks(collections.feedback, data.feedback, (r) => r.id);
  await writeBatchChunks(collections.skillChains, data.skillChains, (r) => r.id);
  await writeBatchChunks(collections.areaConnections, data.areaConnections, (r) => r.id);
  for (let i = 0; i < data.chatMessages.length; i += 450) {
    const batch = db.batch();
    for (const message of data.chatMessages.slice(i, i + 450)) {
      batch.set(db.collection(collections.chatThreads).doc(message.threadId).collection("messages").doc(message.id), message);
    }
    await batch.commit();
  }
  await db.collection(collections.impact).doc("global").set({
    id: "global",
    seedVersion: data.stats.seedVersion,
    namedDemoUserIds: data.namedDemoUserIds,
    counters: { users: data.stats.users, teachingOffers: data.stats.offers, learningRequests: data.stats.requests, completedSessions: data.stats.sessions, activeSkillChains: data.stats.skillChains },
    stats: data.stats,
    updatedAt: nowIso(),
  });
  return data.stats;
}

export async function exportDemoData() {
  const result: Record<string, unknown[]> = {};
  for (const collectionName of resetCollections) {
    const snapshot = await db.collection(collectionName).get();
    result[collectionName] = snapshot.docs.map((doc) => doc.data());
  }
  const messages: unknown[] = [];
  const threads = await db.collection(collections.chatThreads).get();
  for (const thread of threads.docs) {
    const snapshot = await thread.ref.collection("messages").orderBy("createdAt", "asc").get();
    messages.push(...snapshot.docs.map((doc) => doc.data()));
  }
  result.chatMessages = messages;
  return result;
}
