import { z } from "zod";

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
  name: z.string().trim().min(3).max(80),
  gameType: z.enum(["FE2", "TRIA"]),
  creatorText: z.string().trim().min(3).max(120),
  robloxUrl: optionalUrl,
  showcaseUrl: optionalUrl,
  thumbnailUrl: optionalUrl,
  estimatedDifficulty: z.coerce.number().min(1).max(100),
  description: z.string().trim().min(20).max(800),
  skillsetText: z.string().trim().max(120).optional(),
  isTeamMap: z.coerce.boolean(),
  notes: z.string().trim().max(500).optional(),
});
