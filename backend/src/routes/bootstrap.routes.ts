import { Router } from "express";
import { collections, db } from "../firestore/db";
import { asyncHandler } from "../middleware/errorHandler";
import { CITIES } from "../seed/constants";
import { NAMED_DEMO_USER_IDS } from "../seed/generateUsers";
import { getImpact } from "../services/impact.service";
import type { AreaConnection, Listing, Medal, SkillChain, User } from "../types/domain";
export const bootstrapRouter = Router();
bootstrapRouter.get("/bootstrap", asyncHandler(async (_req, res) => { const [users, listings, medals, chains, connections, impact] = await Promise.all([db.collection(collections.users).get(), db.collection(collections.listings).get(), db.collection(collections.medalTypes).get(), db.collection(collections.skillChains).get(), db.collection(collections.areaConnections).get(), getImpact()]); const userData = users.docs.map((d) => d.data() as User); res.json({ data: { demoUsers: userData.filter((u) => NAMED_DEMO_USER_IDS.includes(u.id)), users: userData, listings: listings.docs.map((d) => d.data() as Listing), medals: medals.docs.map((d) => d.data() as Medal), featuredChains: chains.docs.map((d) => d.data() as SkillChain).filter((c) => c.id === "chain_featured").slice(0, 5), areaConnections: connections.docs.map((d) => d.data() as AreaConnection), cityNodes: CITIES, stats: impact.counters } }); }));
