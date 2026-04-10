import { z } from "zod";

import { DIFFICULTY_MAX, DIFFICULTY_MIN } from "@/lib/difficulty";

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || undefined)
  .refine((value) => !value || /^https?:\/\//.test(value), {
    message: "Must be a valid URL.",
  });

export const recordSubmissionSchema = z.object({
  playerUsername: z.string().trim().min(3).max(32),
  mapId: z.string().trim().min(1),
  gameType: z.enum(["FE2", "TRIA"]),
  percent: z.coerce.number().int().min(1).max(100),
  isCompletion: z.coerce.boolean(),
  proofUrl: z.string().trim().url(),
  rawFootageUrl: optionalUrl,
  notes: z.string().trim().max(500).optional(),
  platform: z.string().trim().max(50).optional(),
  teammates: z.string().trim().max(120).optional(),
  compliance: z.literal(true),
});

export const mapSubmissionSchema = z.object({
  proposedMapCode: z
    .string()
    .trim()
    .toUpperCase()
    .max(24)
    .optional()
    .transform((value) => value || undefined)
    .refine((value) => !value || /^[A-Z0-9-]+$/.test(value), {
      message: "Map ID may only contain letters, numbers, and hyphens.",
    }),
  name: z.string().trim().min(3).max(80),
  gameType: z.enum(["FE2", "TRIA"]),
  creatorText: z.string().trim().min(3).max(120),
  robloxUrl: optionalUrl,
  showcaseUrl: optionalUrl,
  thumbnailUrl: optionalUrl,
  estimatedDifficulty: z.coerce.number().min(DIFFICULTY_MIN).max(DIFFICULTY_MAX),
  description: z.string().trim().min(20).max(800),
  skillsetText: z.string().trim().max(120).optional(),
  isTeamMap: z.coerce.boolean(),
  notes: z.string().trim().max(500).optional(),
});

export const managedMapSchema = z.object({
  id: z.string().trim().optional(),
  mapCode: z
    .string()
    .trim()
    .toUpperCase()
    .min(3)
    .max(24)
    .regex(/^[A-Z0-9-]+$/, "Map ID may only contain letters, numbers, and hyphens."),
  name: z.string().trim().min(3).max(80),
  gameType: z.enum(["FE2", "TRIA"]),
  status: z.enum(["MAIN", "LEGACY", "REMOVED", "PENDING"]),
  placement: z
    .union([z.coerce.number().int().min(1).max(500), z.literal(""), z.undefined()])
    .transform((value) => (value === "" || value === undefined ? undefined : value)),
  difficultyScore: z.coerce.number().min(DIFFICULTY_MIN).max(DIFFICULTY_MAX),
  creatorText: z.string().trim().min(3).max(160),
  shortDescription: z.string().trim().min(10).max(140),
  description: z.string().trim().min(20).max(1500),
  thumbnailUrl: optionalUrl,
  showcaseUrl: optionalUrl,
  robloxUrl: optionalUrl,
  verifierStatus: z.string().trim().max(60).optional(),
  tagsText: z.string().trim().max(180).optional(),
  isTeamMap: z.coerce.boolean(),
  recordRequirementText: z.string().trim().min(10).max(200),
  minimumRecordPercent: z.coerce.number().int().min(1).max(100),
});
