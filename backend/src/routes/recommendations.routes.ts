import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { recommendations } from "../services/recommendations.service";
export const recommendationsRouter = Router();
recommendationsRouter.get("/recommendations", asyncHandler(async (req, res) => { res.json({ data: await recommendations({ userId: String(req.query.userId ?? req.demoContext.actorUserId ?? ""), intent: String(req.query.intent ?? "learn") === "teach" ? "teach" : "learn", limit: req.query.limit ? Number(req.query.limit) : undefined }) }); }));
