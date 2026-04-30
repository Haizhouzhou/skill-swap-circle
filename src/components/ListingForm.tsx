import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDemoUser } from "@/context/DemoUserContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE } from "@/lib/storageKeys";
import type { Listing, SkillCategory } from "@/mock/types";
import { CATEGORIES, CITIES, LANGUAGES } from "@/mock/constants";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useCreateListingMutation } from "@/lib/api-hooks";

export function ListingForm({ type }: { type: "offer" | "request" }) {
  const { user, promptDemoUser } = useDemoUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const createListing = useCreateListingMutation();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<SkillCategory>("Swiss life");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState<20 | 30 | 45 | 60>(30);
  const [mode, setMode] = useState<"online" | "in_person" | "both">("both");
  const [city, setCity] = useState(user?.city ?? "Zürich");
  const [language, setLanguage] = useState(user?.languages?.[0] ?? "English");
  const [availabilityDate, setAvailabilityDate] = useState<Date | undefined>(nextAvailableDate());
  const [availabilityTime, setAvailabilityTime] = useState("18:00");
  const [beginnerFriendly, setBeginnerFriendly] = useState(true);
  const [tagsRaw, setTagsRaw] = useState("");

  if (!user) {
    return (
      <div className="container py-16 text-center">
        <p className="font-serif text-2xl text-ink">Step in to share or ask.</p>
        <Button className="mt-5 rounded-full bg-moss text-cream hover:bg-ink" onClick={() => promptDemoUser()}>Choose a profile</Button>
      </div>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !user || !availabilityDate) return;
    const cityObj = CITIES.find((c) => c.city === city) ?? CITIES[0];
    void createListing.mutateAsync({
      type,
      title: title.trim(),
      description: description.trim() || (type === "offer" ? "A small, calm session." : "Looking for a kind hand."),
      category,
      tags: tagsRaw.split(",").map((t) => t.trim()).filter(Boolean),
      ownerUserId: user.id,
      city: cityObj.city,
      canton: cityObj.canton,
      mode: mode === "both" ? ["online", "in_person"] : [mode],
      languages: [language],
      durationMinutes: duration,
      availability: [{
        day: format(availabilityDate, "EEEE") as Listing["availability"][number]["day"],
        label: `${format(availabilityDate, "EEEE, d MMMM yyyy")} at ${availabilityTime}`,
      }],
      level: "easy",
      beginnerFriendly,
      recommendedFor: type === "offer" ? ["newcomers"] : [],
      createdAt: new Date().toISOString(),
    } as Listing).then(({ data }) => {
      toast({ title: type === "offer" ? "Offer shared" : "Request posted", description: "Thank you for taking the time." });
      navigate(`/listing/${data.listing.id}`);
    });
  }

  const isOffer = type === "offer";

  return (
    <div className="container py-10 page-fade max-w-2xl">
      <h1 className="font-serif text-3xl text-ink">{isOffer ? "Share something you know" : "Ask for a little help"}</h1>
      <p className="text-mutedInk mt-2">
        {isOffer ? "Small everyday knowledge can be valuable to someone else." : "Asking for help is part of the swap."}
      </p>

      <form onSubmit={submit} className="mt-7 card-soft p-6 space-y-5">
        <Field label="Title">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder={isOffer ? "e.g. Cook cheap student meals" : "e.g. I want to learn how to use SBB better"} />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Category">
            <select value={category} onChange={(e) => setCategory(e.target.value as SkillCategory)} className={selectCls}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Duration">
            <select value={duration} onChange={(e) => setDuration(Number(e.target.value) as any)} className={selectCls}>
              {[20, 30, 45, 60].map((d) => <option key={d} value={d}>{d} minutes</option>)}
            </select>
          </Field>
          <Field label="Format">
            <select value={mode} onChange={(e) => setMode(e.target.value as any)} className={selectCls}>
              <option value="both">Online or in person</option>
              <option value="online">Online</option>
              <option value="in_person">In person</option>
            </select>
          </Field>
          <Field label="City">
            <select value={city} onChange={(e) => setCity(e.target.value)} className={selectCls}>
              {CITIES.map((c) => <option key={c.city} value={c.city}>{c.city} ({c.canton})</option>)}
            </select>
          </Field>
          <Field label="Language">
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className={selectCls}>
              {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </Field>
          <Field label="Availability">
            <div className="space-y-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start rounded-xl border-borderSoft bg-cream px-3 text-left font-normal hover:bg-accent/40",
                      !availabilityDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {availabilityDate ? format(availabilityDate, "EEEE, d MMMM yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={availabilityDate}
                    onSelect={setAvailabilityDate}
                    disabled={(date) => isBeforeToday(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Input
                type="time"
                value={availabilityTime}
                onChange={(event) => setAvailabilityTime(event.target.value)}
                className="rounded-xl border-borderSoft bg-cream"
              />
            </div>
          </Field>
        </div>
        <Field label={isOffer ? "What someone will learn" : "What you need help with"}>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-xl border border-borderSoft bg-cream p-3 text-sm min-h-[110px] focus:outline-none focus:ring-2 focus:ring-sage/40" placeholder={isOffer ? "A few warm sentences about what you'll share." : "A few honest sentences about what would help."} />
        </Field>
        <Field label="Tags (comma separated)">
          <Input value={tagsRaw} onChange={(e) => setTagsRaw(e.target.value)} placeholder={isOffer ? "calm pace, beginner-friendly" : "newcomer, student"} />
        </Field>
        {isOffer && (
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" checked={beginnerFriendly} onChange={(e) => setBeginnerFriendly(e.target.checked)} className="accent-moss" />
            This is beginner-friendly
          </label>
        )}
        <div className="flex justify-end">
          <Button type="submit" className="bg-moss text-cream hover:bg-ink rounded-full">
            {createListing.isPending ? "Saving..." : isOffer ? "Share my offer" : "Post my request"}
          </Button>
        </div>
      </form>
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

function nextAvailableDate() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 1);
  return date;
}

function isBeforeToday(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}
