import { MEDAL_DEFS } from "./constants";

export const MEDAL_LIBRARY = MEDAL_DEFS;
export const MEDAL_BY_ID: Record<string, (typeof MEDAL_DEFS)[number]> = Object.fromEntries(
  MEDAL_DEFS.map((m) => [m.id, m]),
);
