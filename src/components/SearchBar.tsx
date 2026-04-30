import { Search } from "lucide-react";

export function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mutedInk" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Search a small skill, a place, a wish…"}
        className="w-full h-11 rounded-full bg-card border border-borderSoft pl-10 pr-4 text-sm placeholder:text-mutedInk focus:outline-none focus:ring-2 focus:ring-sage/40"
      />
    </div>
  );
}
