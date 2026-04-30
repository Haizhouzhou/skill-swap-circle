import { randomUUID } from "node:crypto";
import { collections, db, nowIso } from "../firestore/db";
import type { Feedback } from "../types/domain";
import { getUser } from "./users.service";

export async function createFeedback(input: Omit<Feedback, "id" | "createdAt">): Promise<Feedback> {
  await Promise.all([getUser(input.fromUserId), getUser(input.toUserId)]);
  const feedback = { ...input, id: `feedback_created_${randomUUID()}`, createdAt: nowIso() };
  await db.collection(collections.feedback).doc(feedback.id).set(feedback);
  return feedback;
}
export async function listUserFeedback(userId: string) {
  await getUser(userId);
  return (await db.collection(collections.feedback).where("toUserId", "==", userId).get()).docs.map((doc) => doc.data() as Feedback).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
