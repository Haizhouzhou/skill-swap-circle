import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIES, CITIES, LANGUAGES } from "@/mock/constants";
import type { SkillCategory, User } from "@/mock/types";
import { useDemoUser } from "@/context/DemoUserContext";
import { useCreateUserMutation } from "@/lib/api-hooks";

export default function CreateProfile() {
  const navigate = useNavigate();
  const { customUser, setCustomUser, setUserId } = useDemoUser();
  const createUser = useCreateUserMutation();

  const [name, setName] = useState(customUser?.name ?? "");
  const [email, setEmail] = useState(customUser?.email ?? "");
  const [city, setCity] = useState(customUser?.city ?? "Zürich");
  const [bio, setBio] = useState(customUser?.bio ?? "");
  const [languages, setLanguages] = useState<string[]>(customUser?.languages ?? ["English"]);
  const [teachCategories, setTeachCategories] = useState<SkillCategory[]>(customUser?.teachCategories ?? ["Digital life"]);
  const [learnCategories, setLearnCategories] = useState<SkillCategory[]>(customUser?.learnCategories ?? ["Language practice"]);
  const [teachSkillsRaw, setTeachSkillsRaw] = useState((customUser?.teachSkills ?? []).join(", "));
  const [learnSkillsRaw, setLearnSkillsRaw] = useState((customUser?.learnSkills ?? []).join(", "));

  const canton = useMemo(() => CITIES.find((entry) => entry.city === city)?.canton ?? "ZH", [city]);

  function toggleLanguage(language: string) {
    setLanguages((current) => {
      if (current.includes(language)) {
        return current.length === 1 ? current : current.filter((item) => item !== language);
      }
      return [...current, language];
    });
  }

  function toggleCategory(category: SkillCategory, mode: "teach" | "learn") {
    const setter = mode === "teach" ? setTeachCategories : setLearnCategories;
    setter((current) => current.includes(category) ? current.filter((item) => item !== category) : [...current, category]);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();

    const teachSkills = splitList(teachSkillsRaw);
    const learnSkills = splitList(learnSkillsRaw);
    const interests = Array.from(new Set([...teachCategories, ...learnCategories]));

    void createUser.mutateAsync({
      name: name.trim(),
      email: email.trim(),
      city,
      canton,
      languages,
      bio: bio.trim() || "Looking for practical skills to swap in a calm and useful way.",
      interests,
      teachCategories,
      learnCategories,
      teachSkills,
      learnSkills,
    }).then(({ data }) => {
      const profile = data.user as User;
      setCustomUser(profile);
      setUserId(profile.id);
      navigate("/me");
    });
  }

  return (
    <div className="container py-10 page-fade max-w-3xl">
      <div className="max-w-2xl">
        <p className="chip">Create your profile</p>
        <h1 className="font-serif text-4xl text-ink mt-3">Tell people what you can teach and what you want to learn.</h1>
        <p className="text-mutedInk mt-3">
          This profile is stored locally in your browser for this demo. Add practical skills, a short bio, and the categories you care about.
        </p>
      </div>

      <form onSubmit={submit} className="mt-8 card-soft p-6 md:p-8 space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Name">
            <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" required />
          </Field>
          <Field label="Email">
            <Input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="name@example.com" required />
          </Field>
          <Field label="City">
            <select value={city} onChange={(event) => setCity(event.target.value)} className={selectCls}>
              {CITIES.map((entry) => <option key={entry.city} value={entry.city}>{entry.city} ({entry.canton})</option>)}
            </select>
          </Field>
          <Field label="Canton">
            <Input value={canton} disabled />
          </Field>
        </div>

        <Field label="Short bio">
          <textarea
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            className={textareaCls}
            placeholder="A few lines about what kind of learner or helper you are."
          />
        </Field>

        <Field label="Languages">
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((language) => (
              <ToggleChip
                key={language}
                selected={languages.includes(language)}
                onClick={() => toggleLanguage(language)}
                label={language}
              />
            ))}
          </div>
        </Field>

        <div className="grid lg:grid-cols-2 gap-6">
          <Field label="Skill categories I can teach">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <ToggleChip
                  key={`teach-${category}`}
                  selected={teachCategories.includes(category)}
                  onClick={() => toggleCategory(category, "teach")}
                  label={category}
                />
              ))}
            </div>
          </Field>
          <Field label="Categories I want to learn">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <ToggleChip
                  key={`learn-${category}`}
                  selected={learnCategories.includes(category)}
                  onClick={() => toggleCategory(category, "learn")}
                  label={category}
                />
              ))}
            </div>
          </Field>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Field label="Specific skills I can teach">
            <textarea
              value={teachSkillsRaw}
              onChange={(event) => setTeachSkillsRaw(event.target.value)}
              className={textareaCls}
              placeholder="For example: English conversation, JavaScript basics, interview prep"
            />
          </Field>
          <Field label="Specific skills I want to learn">
            <textarea
              value={learnSkillsRaw}
              onChange={(event) => setLearnSkillsRaw(event.target.value)}
              className={textareaCls}
              placeholder="For example: guitar chords, French speaking, math revision"
            />
          </Field>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="bg-moss text-cream hover:bg-ink rounded-full">
            {createUser.isPending ? "Saving..." : "Save profile"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wide text-mutedInk mb-2">{label}</label>
      {children}
    </div>
  );
}

function ToggleChip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm transition ${
        selected
          ? "border-moss bg-accent text-moss"
          : "border-borderSoft bg-cream text-mutedInk hover:border-moss hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

const selectCls = "w-full h-10 rounded-xl bg-cream border border-borderSoft px-3 text-sm focus:outline-none focus:ring-2 focus:ring-sage/40";
const textareaCls = "w-full rounded-xl border border-borderSoft bg-cream p-3 text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-sage/40";
