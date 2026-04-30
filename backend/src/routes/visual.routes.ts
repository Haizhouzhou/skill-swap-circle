import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { getVisualConnections } from "../services/impact.service";
export const visualRouter = Router();
visualRouter.get("/visual/connections", asyncHandler(async (_req, res) => { res.json({ data: await getVisualConnections() }); }));
