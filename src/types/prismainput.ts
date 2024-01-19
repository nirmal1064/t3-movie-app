import { type Prisma } from "@prisma/client";
import { z } from "zod";

export const MediaCreategenre_idsInputSchema: z.ZodType<Prisma.MediaCreategenre_idsInput> =
  z.object({ set: z.number().array() }).strict();

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(
  () =>
    z.union([
      z.string(),
      z.number(),
      z.boolean(),
      z.object({ toJSON: z.function(z.tuple([]), z.any()) }),
      z.record(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
      z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    ]),
);

export const MediaCreateInputSchema: z.ZodType<Prisma.MediaCreateInput> = z
  .object({
    id: z.number().int(),
    title: z.string().optional().nullable(),
    name: z.string().optional().nullable(),
    poster_path: z.string().optional().nullable(),
    adult: z.boolean().optional().nullable(),
    overview: z.string().optional().nullable(),
    release_date: z.string().optional().nullable(),
    media_type: z.string(),
    genre_ids: z
      .union([
        z.lazy(() => MediaCreategenre_idsInputSchema),
        z.number().int().array(),
      ])
      .optional(),
    original_title: z.string().optional().nullable(),
    original_language: z.string().optional().nullable(),
    backdrop_path: z.string().optional().nullable(),
    popularity: z.number().optional().nullable(),
    vote_count: z.number().int().optional().nullable(),
    video: z.boolean().optional().nullable(),
    vote_average: z.number().optional().nullable(),
    first_air_date: z.string().optional().nullable(),
    last_air_date: z.string().optional().nullable(),
    runtime: z.number().int().optional().nullable(),
    status: z.string().optional().nullable(),
    number_of_episodes: z.number().int().optional().nullable(),
    number_of_seasons: z.number().int().optional().nullable(),
    type: z.string().optional().nullable(),
    images: InputJsonValueSchema.optional().nullable(),
    videos: InputJsonValueSchema.optional().nullable(),
    tagline: z.string().optional().nullable(),
    original_name: z.string().optional().nullable(),
  })
  .strict();
