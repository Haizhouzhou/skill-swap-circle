import { collections, db, getDocOrNull, nowIso } from "../firestore/db";
import { notFound } from "../middleware/errorHandler";
import type { Medal, User } from "../types/domain";

export async function listMedals(): Promise<Medal[]> {
  return (await db.collection(collections.medalTypes).get()).docs.map((doc) => doc.data() as Medal).sort((a, b) => a.title.localeCompare(b.title));
}

export async function getUserMedals(userId: string) {
  const user = await getDocOrNull<User>(collections.users, userId);
  if (!user) throw notFound(`User ${userId} not found`);
  const medals = await listMedals();
  return { allMedalIds: user.allMedalIds, visibleMedalIds: user.visibleMedalIds, allMedals: medals.filter((m) => user.allMedalIds.includes(m.id)), visibleMedals: medals.filter((m) => user.visibleMedalIds.includes(m.id)) };
}

export async function updateVisibleMedals(userId: string, visibleMedalIds: string[]) {
  const user = await getDocOrNull<User>(collections.users, userId);
  if (!user) throw notFound(`User ${userId} not found`);
  const allowed = new Set(user.allMedalIds);
  const nextVisible = visibleMedalIds.filter((id) => allowed.has(id));
  await db.collection(collections.users).doc(userId).update({ visibleMedalIds: nextVisible, updatedAt: nowIso() });
  return getUserMedals(userId);
}
