import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { validateBody } from "../middleware/validate";
import { createFeedback, listUserFeedback } from "../services/feedback.service";
import { createFeedbackSchema } from "../validation/schemas";
export const feedbackRouter = Router();
feedbackRouter.post("/feedback", validateBody(createFeedbackSchema), asyncHandler(async (req, res) => { res.status(201).json({ data: await createFeedback(req.body) }); }));
feedbackRouter.get("/users/:userId/feedback", asyncHandler(async (req, res) => { res.json({ data: await listUserFeedback(req.params.userId) }); }));
