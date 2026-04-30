import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { CITIES, DURATIONS, LANGUAGE_SUGGESTIONS, LEVELS, LISTING_MODES, SKILL_CATEGORIES, SKILLS_BY_CATEGORY } from "../seed/constants";
export const metaRouter = Router();
metaRouter.get("/meta", asyncHandler(async (_req, res) => { res.json({ data: { categories: SKILL_CATEGORIES, cities: CITIES.map(({ city, canton }) => ({ city, canton })), languageSuggestions: LANGUAGE_SUGGESTIONS, durations: DURATIONS, modes: LISTING_MODES, levels: LEVELS } }); }));
metaRouter.get("/search/suggest", asyncHandler(async (req, res) => { const q = String(req.query.q ?? "").trim().toLowerCase(); const values = [...SKILL_CATEGORIES, ...CITIES.map((c) => c.city), ...CITIES.map((c) => c.canton), ...Object.values(SKILLS_BY_CATEGORY).flat(), ...LANGUAGE_SUGGESTIONS]; res.json({ data: { suggestions: [...new Set(values)].filter((v) => !q || v.toLowerCase().includes(q)).slice(0, 20) } }); }));
