import type { NextFunction, Request, Response } from "express";
import type { DemoRequestContext } from "../types/api";

declare global {
  namespace Express {
    interface Request {
      demoContext: DemoRequestContext;
    }
  }
}

export function contextMiddleware(req: Request, _res: Response, next: NextFunction) {
  req.demoContext = {
    demoSessionId: headerValue(req, "x-demo-session-id"),
    actorUserId: headerValue(req, "x-actor-user-id"),
  };
  next();
}

function headerValue(req: Request, headerName: string): string | undefined {
  const value = req.headers[headerName];
  return Array.isArray(value) ? value[0] : value || undefined;
}
