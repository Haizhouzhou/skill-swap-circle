import { randomUUID } from "node:crypto";
import { Router } from "express";
import { collections, db, nowIso } from "../firestore/db";
import { asyncHandler } from "../middleware/errorHandler";
import { validateBody } from "../middleware/validate";
import { contactIntentSchema } from "../validation/schemas";
export const contactRouter = Router();
contactRouter.post("/contact-intents", validateBody(contactIntentSchema), asyncHandler(async (req, res) => { const record = { id: `contact_${randomUUID()}`, eventType: "contact_intent", userId: req.body.userId, listingId: req.body.listingId, email: req.body.email, source: req.body.source, createdAt: nowIso() }; await db.collection(collections.userListingHistory).doc(record.id).set(record); res.status(201).json({ data: record }); }));
