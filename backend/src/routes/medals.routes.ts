import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { validateBody } from "../middleware/validate";
import { getUserMedals, listMedals, updateVisibleMedals } from "../services/medals.service";
import { visibleMedalsSchema } from "../validation/schemas";
export const medalsRouter = Router();
medalsRouter.get("/medals", asyncHandler(async (_req, res) => { res.json({ data: await listMedals() }); }));
medalsRouter.get("/users/:userId/medals", asyncHandler(async (req, res) => { res.json({ data: await getUserMedals(req.params.userId) }); }));
medalsRouter.patch("/users/:userId/medals", validateBody(visibleMedalsSchema), asyncHandler(async (req, res) => { res.json({ data: await updateVisibleMedals(req.params.userId, req.body.visibleMedalIds) }); }));
