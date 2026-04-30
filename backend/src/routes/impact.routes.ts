import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { getImpact, getUserImpact, listChains } from "../services/impact.service";
export const impactRouter = Router();
impactRouter.get("/impact", asyncHandler(async (_req, res) => { res.json({ data: await getImpact() }); }));
impactRouter.get("/impact/chains", asyncHandler(async (req, res) => { res.json({ data: await listChains({ limit: req.query.limit ? Number(req.query.limit) : undefined, featured: req.query.featured ? String(req.query.featured) === "true" : undefined, userId: req.query.userId ? String(req.query.userId) : undefined }) }); }));
impactRouter.get("/users/:userId/impact", asyncHandler(async (req, res) => { res.json({ data: await getUserImpact(req.params.userId) }); }));
