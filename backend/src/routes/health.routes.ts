import { Router } from "express";
import { env } from "../config/env";
import { asyncHandler } from "../middleware/errorHandler";
export const healthRouter = Router();
healthRouter.get("/health", asyncHandler(async (_req, res) => { res.json({ data: { status: "ok", service: "skillswap-api", nodeEnv: env.nodeEnv, timestamp: new Date().toISOString() } }); }));
