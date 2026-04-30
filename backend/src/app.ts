import cors from "cors";
import express from "express";
import { corsOrigins } from "./config/env";
import { contextMiddleware } from "./middleware/context";
import { AppError, errorHandler } from "./middleware/errorHandler";
import { adminRouter } from "./routes/admin.routes";
import { aiRouter } from "./routes/ai.routes";
import { bootstrapRouter } from "./routes/bootstrap.routes";
import { chatRouter } from "./routes/chat.routes";
import { contactRouter } from "./routes/contact.routes";
import { demoRouter } from "./routes/demo.routes";
import { feedbackRouter } from "./routes/feedback.routes";
import { healthRouter } from "./routes/health.routes";
import { impactRouter } from "./routes/impact.routes";
import { listingsRouter } from "./routes/listings.routes";
import { matchRouter } from "./routes/match.routes";
import { medalsRouter } from "./routes/medals.routes";
import { metaRouter } from "./routes/meta.routes";
import { recommendationsRouter } from "./routes/recommendations.routes";
import { savedListingsRouter } from "./routes/savedListings.routes";
import { sessionsRouter } from "./routes/sessions.routes";
import { usersRouter } from "./routes/users.routes";
import { visualRouter } from "./routes/visual.routes";

export function createApp() {
  const app = express();
  app.use(cors({ origin: corsOrigins(), credentials: false }));
  app.use(express.json({ limit: "1mb" }));
  app.use(contextMiddleware);
  const api = express.Router();
  api.use(healthRouter, demoRouter, bootstrapRouter, metaRouter, usersRouter, medalsRouter, listingsRouter, savedListingsRouter, recommendationsRouter, matchRouter, sessionsRouter, chatRouter, feedbackRouter, impactRouter, visualRouter, contactRouter, aiRouter, adminRouter);
  app.use("/api/v1", api);
  app.use((_req, _res, next) => next(new AppError(404, "NOT_FOUND", "Route not found")));
  app.use(errorHandler);
  return app;
}
