import type { AreaConnection } from "./types";

export const CITY_POSITIONS: Record<string, { x: number; y: number }> = {
  Geneva: { x: 105, y: 315 },
  Lausanne: { x: 170, y: 280 },
  Fribourg: { x: 255, y: 235 },
  Bern: { x: 320, y: 210 },
  Basel: { x: 290, y: 105 },
  Lucerne: { x: 410, y: 220 },
  Zürich: { x: 505, y: 165 },
  Winterthur: { x: 550, y: 135 },
  "St. Gallen": { x: 620, y: 150 },
  Lugano: { x: 500, y: 350 },
};

export const AREA_CONNECTIONS: AreaConnection[] = [
  { sourceCity: "Zürich", targetCity: "Bern", weight: 18, topCategories: ["Swiss life", "Language practice"], latestSkill: "Prepare for a flat viewing" },
  { sourceCity: "Basel", targetCity: "Zürich", weight: 14, topCategories: ["Language practice", "Digital life"], latestSkill: "Practice German small talk" },
  { sourceCity: "Lausanne", targetCity: "Geneva", weight: 13, topCategories: ["Career basics", "Home & cooking"], latestSkill: "Write a simple CV" },
  { sourceCity: "Bern", targetCity: "Lausanne", weight: 9, topCategories: ["Study habits", "Money & budgeting"], latestSkill: "Create a simple monthly budget" },
  { sourceCity: "Zürich", targetCity: "St. Gallen", weight: 8, topCategories: ["Repair & DIY", "Swiss life"], latestSkill: "Fix a bike tire" },
  { sourceCity: "Lucerne", targetCity: "Zürich", weight: 11, topCategories: ["Home & cooking", "Swiss life"], latestSkill: "Use SBB / SwissPass efficiently" },
  { sourceCity: "Lugano", targetCity: "Lucerne", weight: 6, topCategories: ["Language practice", "Wellbeing"], latestSkill: "Practice Italian basics" },
  { sourceCity: "Fribourg", targetCity: "Bern", weight: 7, topCategories: ["Study habits", "Social confidence"], latestSkill: "Prepare a group presentation" },
  { sourceCity: "Winterthur", targetCity: "Zürich", weight: 16, topCategories: ["Digital life", "Swiss life"], latestSkill: "Avoid online scams" },
  { sourceCity: "Geneva", targetCity: "Bern", weight: 5, topCategories: ["Career basics", "Social confidence"], latestSkill: "Prepare for a networking event" },
];
