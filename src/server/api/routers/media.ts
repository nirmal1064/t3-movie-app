import { type Media } from "@prisma/client";
import { z } from "zod";
import {
  addMediaToFavorites,
  addMediaToMyList,
  addMediaToWatchList,
  addToListSchema,
  removeMediaFromFavorites,
  removeMediaFromMyList,
  removeMediaFromWatchList,
} from "~/server/db-ops";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const listInputSchema = z
  .object({
    idsOnly: z.boolean(),
  })
  .optional();

const removeFromListSchema = z.object({
  mediaId: z.number(),
});

export const mediaRouter = createTRPCRouter({
  addToMyList: protectedProcedure
    .input(addToListSchema)
    .mutation(async ({ ctx, input }) =>
      addMediaToMyList({ db: ctx.db, input, userId: ctx.session.user.id }),
    ),
  removeFromMyList: protectedProcedure
    .input(removeFromListSchema)
    .mutation(async ({ ctx: { db, session }, input: { mediaId } }) =>
      removeMediaFromMyList({ db, mediaId, userId: session.user.id }),
    ),
  addToWatchList: protectedProcedure
    .input(addToListSchema)
    .mutation(async ({ ctx, input }) =>
      addMediaToWatchList({ db: ctx.db, input, userId: ctx.session.user.id }),
    ),
  removeFromWatchList: protectedProcedure
    .input(removeFromListSchema)
    .mutation(async ({ ctx: { db, session }, input: { mediaId } }) =>
      removeMediaFromWatchList({ db, mediaId, userId: session.user.id }),
    ),
  addToFavorites: protectedProcedure
    .input(addToListSchema)
    .mutation(async ({ ctx, input }) =>
      addMediaToFavorites({ db: ctx.db, input, userId: ctx.session.user.id }),
    ),
  removeFromFavorites: protectedProcedure
    .input(removeFromListSchema)
    .mutation(async ({ ctx: { db, session }, input: { mediaId } }) =>
      removeMediaFromFavorites({ db, mediaId, userId: session.user.id }),
    ),
  getMyList: protectedProcedure
    .input(listInputSchema)
    .query(async ({ ctx, input }) => {
      try {
        const user = await ctx.db.user.findUnique({
          where: { id: ctx.session.user.id },
          select: { mylistIds: true },
        });
        if (!user || user.mylistIds.length === 0) return [] as Media[];
        const mylistMedia = await ctx.db.media.findMany({
          where: {
            id: { in: user.mylistIds },
          },
        });
        if (input?.idsOnly) {
          return mylistMedia.map((media) => media.id);
        } else {
          return mylistMedia;
        }
      } catch (error) {
        console.error(error);
        if (input?.idsOnly) {
          return [] as number[];
        } else {
          return [] as Media[];
        }
      }
    }),
  getWatchList: protectedProcedure
    .input(listInputSchema)
    .query(async ({ ctx, input }) => {
      try {
        const user = await ctx.db.user.findUnique({
          where: { id: ctx.session.user.id },
          select: { watchListIds: true },
        });
        if (!user || user.watchListIds.length === 0) return [] as Media[];
        const watchListMedia = await ctx.db.media.findMany({
          where: { id: { in: user.watchListIds } },
        });
        if (input?.idsOnly) {
          return watchListMedia.map((media) => media.id);
        } else {
          return watchListMedia;
        }
      } catch (error) {
        console.error(error);
        if (input?.idsOnly) {
          return [] as number[];
        } else {
          return [] as Media[];
        }
      }
    }),
  getFavorites: protectedProcedure
    .input(listInputSchema)
    .query(async ({ ctx, input }) => {
      try {
        const user = await ctx.db.user.findUnique({
          where: { id: ctx.session.user.id },
          select: { favoriteIds: true },
        });
        if (!user || user.favoriteIds.length === 0) return [] as Media[];
        const favoritesMedia = await ctx.db.media.findMany({
          where: { id: { in: user.favoriteIds } },
        });
        if (input?.idsOnly) {
          return favoritesMedia.map((media) => media.id);
        } else {
          return favoritesMedia;
        }
      } catch (error) {
        console.error(error);
        if (input?.idsOnly) {
          return [] as number[];
        } else {
          return [] as Media[];
        }
      }
    }),
  getListIds: protectedProcedure.query(async ({ ctx }) => {
    try {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { favoriteIds: true, watchListIds: true, mylistIds: true },
      });
      return {
        favoriteIds: user?.favoriteIds ?? [],
        watchListIds: user?.watchListIds ?? [],
        mylistIds: user?.mylistIds ?? [],
      };
    } catch (error) {
      console.error(error);
      return { favoriteIds: [], watchListIds: [], mylistIds: [] };
    }
  }),
});
