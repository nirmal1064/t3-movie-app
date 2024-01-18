import { MediaCreateInputSchema } from "prisma/generated/zod";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const addToListSchema = z.object({ media: MediaCreateInputSchema });

export const mediaRouter = createTRPCRouter({
  addToList: protectedProcedure
    .input(addToListSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const movieFound = await ctx.db.media.findUnique({
          where: { id: input.media.id },
        });
        let movieId = movieFound?.id;
        if (!movieFound) {
          const movieSaved = await ctx.db.media.create({ data: input.media });
          movieId = movieSaved.id;
        }
        await ctx.db.user.update({
          where: { id: ctx.session.user.id },
          data: { mylistIds: { push: movieId } },
        });
        return movieId;
      } catch (error) {
        console.error(error);
        return null;
      }
    }),
  getMyList: protectedProcedure.query(async ({ ctx }) => {
    try {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { mylistIds: true },
      });
      if (!user || user.mylistIds.length === 0) return [];
      const mylistMedia = await ctx.db.media.findMany({
        where: {
          id: { in: user.mylistIds },
        },
      });
      return mylistMedia;
    } catch (error) {
      console.error(error);
      return [];
    }
  }),
});
