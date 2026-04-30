import { MEDAL_DEFS } from "./constants";
export const generateMedals = () => MEDAL_DEFS.map((medal) => ({ ...medal }));
