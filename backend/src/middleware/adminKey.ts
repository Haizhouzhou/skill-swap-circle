import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import { forbidden } from "./errorHandler";

export function requireAdminKey(req: Request, _res: Response, next: NextFunction) {
  if (req.header("X-Demo-Admin-Key") !== env.demoAdminKey) {
    next(forbidden("Missing or invalid X-Demo-Admin-Key"));
    return;
  }
  next();
}
