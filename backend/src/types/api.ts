export type ApiSuccess<T> = { data: T };
export type ApiErrorBody = { error: { code: string; message: string; details?: unknown } };
export type DemoRequestContext = { demoSessionId?: string; actorUserId?: string };
