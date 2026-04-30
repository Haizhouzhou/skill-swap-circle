import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { validateBody } from "../middleware/validate";
import { matchScore } from "../services/match.service";
import { matchScoreSchema } from "../validation/schemas";
export const matchRouter = Router();
matchRouter.post("/match-score", validateBody(matchScoreSchema), asyncHandler(async (req, res) => { res.json({ data: await matchScore(req.body.userId, req.body.listingId) }); }));
