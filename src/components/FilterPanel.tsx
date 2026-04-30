import { CATEGORIES, CITIES, LANGUAGES } from "@/mock/constants";
import type { SkillCategory } from "@/mock/types";

export type Filters = {
  category: SkillCategory | "all";
  city: string;
  mode: "all" | "online" | "in_person";
  language: string;
  duration: "all" | "20" | "30" | "45" | "60";
  beginnerOnly: boolean;
  recommendedOnly: boolean;
};

export const defaultFilters: Filters = {
  category: "all",
  city: "all",
  mode: "all",
  language: "all",
  duration: "all",
  beginnerOnly: false,
  recommendedOnly: false,
};

export function FilterPanel({ filters, onChange }: { filters: Filters; onChange: (f: Filters) => void }) {
  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => onChange({ ...filters, [k]: v });
  return (
    <div className="rounded-2xl border border-borderSoft bg-card p-5 space-y-4">
      <h3 className="font-serif text-lg text-ink">Refine gently</h3>
      <Field label="Category">
        <select value={filters.category} onChange={(e) => set("category", e.target.value as any)} className={selectCls}>
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>
      <Field label="City or canton">
        <select value={filters.city} onChange={(e) => set("city", e.target.value)} className={selectCls}>
          <option value="all">Anywhere in Switzerland</option>
          {CITIES.map((c) => <option key={c.city} value={c.city}>{c.city} ({c.canton})</option>)}
        </select>
      </Field>
      <Field label="Format">
        <select value={filters.mode} onChange={(e) => set("mode", e.target.value as any)} className={selectCls}>
          <option value="all">Online or in person</option>
          <option value="online">Online</option>
          <option value="in_person">In person</option>
        </select>
      </Field>
      <Field label="Language">
        <select value={filters.language} onChange={(e) => set("language", e.target.value)} className={selectCls}>
          <option value="all">Any language</option>
          {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </Field>
      <Field label="Duration">
        <select value={filters.duration} onChange={(e) => set("duration", e.target.value as any)} className={selectCls}>
          <option value="all">Any length</option>
          <option value="20">20 minutes</option>
          <option value="30">30 minutes</option>
          <option value="45">45 minutes</option>
          <option value="60">60 minutes</option>
        </select>
      </Field>
      <label className="flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" checked={filters.beginnerOnly} onChange={(e) => set("beginnerOnly", e.target.checked)} className="accent-moss" />
        Beginner-friendly only
      </label>
      <label className="flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" checked={filters.recommendedOnly} onChange={(e) => set("recommendedOnly", e.target.checked)} className="accent-moss" />
        Recommended for me only
      </label>
    </div>
  );
}

const selectCls = "w-full h-10 rounded-xl bg-cream border border-borderSoft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-sage/40";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wide text-mutedInk mb-1.5">{label}</label>
      {children}
    </div>
  );
}
