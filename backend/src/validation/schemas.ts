import { z } from "zod";
import { DURATIONS, LEVELS, LISTING_MODES, LISTING_STATUSES, LISTING_TYPES, SESSION_STATUSES, SKILL_CATEGORIES } from "../types/domain";

const skillCategory = z.enum(SKILL_CATEGORIES);
const listingType = z.enum(LISTING_TYPES);
const listingMode = z.enum(LISTING_MODES);
const duration = z.union([z.literal(20), z.literal(30), z.literal(45), z.literal(60)]);
const level = z.enum(LEVELS);
const listingStatus = z.enum(LISTING_STATUSES);
const sessionStatus = z.enum(SESSION_STATUSES);
const nonEmptyText = z.string().trim().min(1);
const language = nonEmptyText.max(60);
const isoDateTime = z.string().trim().refine((value) => !Number.isNaN(Date.parse(value)), { message: "Expected an ISO 8601 date-time string" });

export const createUserSchema = z.object({
  name: nonEmptyText.max(80),
  email: z.string().trim().email(),
  city: nonEmptyText.max(80),
  canton: nonEmptyText.max(8),
  languages: z.array(language).min(1),
  bio: z.string().trim().max(600).default(""),
  interests: z.array(skillCategory).default([]),
  teachCategories: z.array(skillCategory).default([]),
  learnCategories: z.array(skillCategory).default([]),
  avatarSeed: z.string().trim().max(80).optional(),
});

export const updateUserSchema = createUserSchema.partial().extend({
  visibleMedalIds: z.array(nonEmptyText).optional(),
  allMedalIds: z.array(nonEmptyText).optional(),
  impactScore: z.number().min(0).max(100).optional(),
});

export const createListingSchema = z.object({
  type: listingType,
  title: nonEmptyText.max(120),
  description: nonEmptyText.max(1500),
  category: skillCategory,
  tags: z.array(nonEmptyText.max(40)).default([]),
  ownerUserId: nonEmptyText,
  city: nonEmptyText.max(80),
  canton: nonEmptyText.max(8),
  mode: z.array(listingMode).min(1).default(["online", "in_person"]),
  languages: z.array(language).min(1),
  durationMinutes: duration,
  availability: z.array(z.object({ day: nonEmptyText.max(20), label: nonEmptyText.max(80) })).min(1),
  level: level.default("easy"),
  beginnerFriendly: z.boolean().default(true),
  recommendedFor: z.array(nonEmptyText.max(80)).default([]),
  status: listingStatus.default("active"),
});

export const updateListingSchema = createListingSchema.partial().omit({ ownerUserId: true, type: true }).extend({ status: listingStatus.optional() });
export const savedListingSchema = z.object({ listingId: nonEmptyText });
export const listingViewSchema = z.object({ listingId: nonEmptyText });
export const selectDemoUserSchema = z.object({ userId: nonEmptyText });
export const matchScoreSchema = z.object({ userId: nonEmptyText, listingId: nonEmptyText });

export const requestSessionSchema = z
  .object({
    fromUserId: nonEmptyText,
    toUserId: nonEmptyText,
    listingId: nonEmptyText,
    message: nonEmptyText.max(1000),
    proposedStartAt: isoDateTime.optional(),
    proposedEndAt: isoDateTime.optional(),
    timezone: z.string().trim().min(1).default("Europe/Zurich"),
  })
  .superRefine((value, ctx) => {
    if (value.proposedStartAt && value.proposedEndAt && Date.parse(value.proposedEndAt) <= Date.parse(value.proposedStartAt)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["proposedEndAt"], message: "proposedEndAt must be after proposedStartAt" });
    }
  });

export const completeSessionSchema = z.object({ feedbackTags: z.array(nonEmptyText.max(40)).default([]), note: z.string().trim().max(1200).default("") });
export const createThreadSchema = z.object({ listingId: nonEmptyText, participantIds: z.array(nonEmptyText).min(2), sessionId: nonEmptyText.optional() });
export const createMessageSchema = z.object({ senderUserId: nonEmptyText, text: nonEmptyText.max(2000) });
export const createFeedbackSchema = z.object({ sessionId: nonEmptyText, fromUserId: nonEmptyText, toUserId: nonEmptyText, tags: z.array(nonEmptyText.max(40)).default([]), note: z.string().trim().max(1200).default("") });
export const visibleMedalsSchema = z.object({ visibleMedalIds: z.array(nonEmptyText) });
export const adminSeedSchema = z.object({ resetBeforeSeed: z.boolean().default(false) });
export const contactIntentSchema = z.object({ userId: nonEmptyText.optional(), listingId: nonEmptyText.optional(), email: z.string().trim().email().optional(), source: z.string().trim().max(80).default("listing_detail") });
export const aiTextSchema = z.object({ text: z.string().trim().max(2000).default(""), userId: nonEmptyText.optional(), listingId: nonEmptyText.optional(), intent: z.enum(["learn", "teach"]).optional() });
export const sessionStatusSchema = sessionStatus;
