import type { CityNode, SkillCategory } from "../types/domain";
import { DURATIONS, LEVELS, LISTING_MODES, SKILL_CATEGORIES } from "../types/domain";

export { DURATIONS, LEVELS, LISTING_MODES, SKILL_CATEGORIES };

export const CITIES: CityNode[] = [
  { city: "Geneva", canton: "GE", x: 105, y: 315 },
  { city: "Lausanne", canton: "VD", x: 170, y: 280 },
  { city: "Fribourg", canton: "FR", x: 255, y: 235 },
  { city: "Bern", canton: "BE", x: 320, y: 210 },
  { city: "Basel", canton: "BS", x: 290, y: 105 },
  { city: "Lucerne", canton: "LU", x: 410, y: 220 },
  { city: "Zürich", canton: "ZH", x: 505, y: 165 },
  { city: "Winterthur", canton: "ZH", x: 550, y: 135 },
  { city: "St. Gallen", canton: "SG", x: 620, y: 150 },
  { city: "Lugano", canton: "TI", x: 500, y: 350 },
];

export const LANGUAGE_SUGGESTIONS = ["German", "French", "Italian", "English", "Arabic", "Spanish", "Mandarin", "Hindi", "Portuguese", "Japanese", "Korean", "Turkish", "Ukrainian"];

export const SKILLS_BY_CATEGORY: Record<SkillCategory, string[]> = {
  "Swiss life": ["Use SBB / SwissPass efficiently", "Understand Swiss recycling basics", "Prepare for a flat viewing", "Read a rental listing", "Find student discounts in Switzerland", "Understand basic health insurance terms"],
  "Home & cooking": ["Cook cheap student meals", "Meal prep for one week", "Make simple lunches for busy days", "Organize a tiny kitchen", "Shop with a small weekly budget"],
  "Social confidence": ["Make friends in a new city", "Start gentle small talk", "Prepare for a networking event", "Ask for help without feeling awkward", "Build confidence in group conversations"],
  "Study habits": ["Organize study notes", "Plan exam revision", "Use Anki flashcards", "Prepare a group presentation", "Read academic papers faster"],
  "Money & budgeting": ["Create a simple monthly budget", "Use Google Sheets for daily budgeting", "Track weekly spending", "Plan low-cost weekends", "Understand shared flat expenses"],
  "Digital life": ["Use Canva for simple posters", "Organize Google Drive", "Avoid online scams", "Use a phone camera better", "Set up Notion for daily life"],
  "Repair & DIY": ["Fix a bike tire", "Basic sewing repair", "Assemble simple furniture", "Take care of houseplants", "Repair small household items"],
  "Career basics": ["Write a simple CV", "Prepare for a job interview", "Write polite professional emails", "Improve a LinkedIn profile", "Build a small portfolio page"],
  "Language practice": ["Practice German small talk", "Practice French daily phrases", "Practice Italian basics", "Learn useful Swiss German phrases", "Practice Arabic daily phrases", "Practice Spanish small talk", "Practice Mandarin basics", "Practice Hindi conversation", "Practice Portuguese travel phrases"],
  Wellbeing: ["Build a calm morning routine", "Plan a low-stress week", "Start a simple walking habit", "Create a better sleep routine", "Manage study stress gently"],
  Creative: ["Make handmade cards", "Sketch simple icons", "Create a small photo story", "Design a simple poster", "Start a tiny journal practice"],
};

export const FEEDBACK_TAGS = ["patient", "warm", "clear", "encouraging", "kind", "well-prepared", "calm", "thoughtful", "generous with time", "easy to follow"];
export const CONTEXT_TAGS = ["newcomer", "student", "living alone", "first job", "young parent", "back to studying", "shy", "career change"];
export const FIRST_NAMES = ["Anna", "Lukas", "Elena", "Mateo", "Sofia", "Jonas", "Mia", "Leon", "Nora", "Felix", "Emma", "Liam", "Lea", "Tim", "Clara", "Paul", "Yara", "Samir", "Aisha", "David", "Hannah", "Marc", "Fatima", "Pierre", "Anouk", "Chiara", "Robin", "Selma", "Tobias", "Zoe", "Iris", "Diego", "Lea-Marie", "Nicolò", "Greta", "Tariq", "Yannick", "Amira", "Stefan", "Mira", "Adrien", "Camille", "Loris", "Vera", "Joana", "Gian", "Tom", "Beatrice", "Eline", "Naomi", "Reto", "Selina", "Janosch", "Mara", "Alev", "Henri", "Salome", "Bastian", "Jana", "Andri", "Linda", "Marco", "Petra", "Sven", "Talia", "Vito", "Wanda", "Xenia", "Ylenia", "Zora", "Aron", "Bruna", "Cyril", "Dario", "Elif", "Filippo", "Gioia", "Hugo", "Idris", "Jelena", "Karim", "Lia", "Manon", "Nadia", "Oskar", "Pia", "Quentin", "Rafael", "Sina", "Theo", "Una", "Vincent", "Wim", "Xaver", "Yael", "Yusuf", "Alma", "Bence", "Carla"];
export const AVAILABILITY_LABELS = [{ day: "Monday", label: "Monday evening" }, { day: "Tuesday", label: "Tuesday afternoon" }, { day: "Wednesday", label: "Wednesday evening" }, { day: "Thursday", label: "Thursday afternoon" }, { day: "Friday", label: "Friday evening" }, { day: "Saturday", label: "Saturday morning" }, { day: "Saturday", label: "Saturday afternoon" }, { day: "Sunday", label: "Sunday afternoon" }];
export const MEDAL_DEFS = [
  { id: "first_swap", title: "First Swap", description: "Completed a first skill exchange.", icon: "Sparkles" },
  { id: "patient_helper", title: "Patient Helper", description: "Took the time to make things clear and calm.", icon: "Hand" },
  { id: "daily_life_hero", title: "Daily Life Hero", description: "Helped someone with an everyday-life task.", icon: "Sun" },
  { id: "swiss_life_guide", title: "Swiss Life Guide", description: "Helped a newcomer understand Swiss daily life.", icon: "Mountain" },
  { id: "budget_buddy", title: "Budget Buddy", description: "Helped someone get more comfortable with money.", icon: "Coins" },
  { id: "friendly_teacher", title: "Friendly Teacher", description: "Welcomed someone into something new.", icon: "Smile" },
  { id: "language_supporter", title: "Language Supporter", description: "Practiced a language with kindness.", icon: "Languages" },
  { id: "community_builder", title: "Community Builder", description: "Brought people together gently.", icon: "Users" },
  { id: "five_helped", title: "5 People Helped", description: "Five people felt a little lighter thanks to you.", icon: "Heart" },
  { id: "chain_starter", title: "Chain Starter", description: "Started a kindness chain.", icon: "Link" },
  { id: "reliable_swapper", title: "Reliable Swapper", description: "Showed up, kindly and on time.", icon: "Anchor" },
];
