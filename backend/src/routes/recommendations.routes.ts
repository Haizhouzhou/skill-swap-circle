import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { recommendations } from "../services/recommendations.service";
export const recommendationsRouter = Router();
recommendationsRouter.get("/recommendations", asyncHandler(async (req, res) => { const userId = String(req.query.userId ?? req.demoContext.actorUserId ?? ""); const items = userId ? await recommendations({ userId, intent: String(req.query.intent ?? "learn") === "teach" ? "teach" : "learn", limit: req.query.limit ? Number(req.query.limit) : undefined }) : []; res.json({ data: { items } }); }));
