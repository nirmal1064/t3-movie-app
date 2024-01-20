import { type PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { MediaCreateInputSchema } from "~/types/prismainput";

export const addToListSchema = z.object({ media: MediaCreateInputSchema });

type InputType = z.infer<typeof addToListSchema>;

type AddMediaType = { db: PrismaClient; input: InputType; userId: string };

type RemoveMediaType = { db: PrismaClient; mediaId: number; userId: string };

export async function addMediaToMyList({ db, input, userId }: AddMediaType) {
  try {
    const mediaId = await addMediaIfNotExists(db, input);
    const user = (await db.user.findUnique({ where: { id: userId } }))!;
    if (user.mylistIds.includes(input.media.id)) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Already In Your List",
      });
    }
    await db.user.update({
      where: { id: user.id },
      data: { mylistIds: { push: input.media.id } },
    });
    return mediaId;
  } catch (error) {
    throwAddError(error);
  }
}

export async function removeMediaFromMyList({
  db,
  mediaId,
  userId,
}: RemoveMediaType) {
  try {
    const user = (await db.user.findUnique({ where: { id: userId } }))!;
    const updatedList = user.mylistIds.filter((id) => id !== mediaId);
    await db.user.update({
      where: { id: userId },
      data: { mylistIds: updatedList },
    });
    return mediaId;
  } catch (error) {
    throwRemoveError(error);
  }
}

export async function addMediaToWatchList({ db, input, userId }: AddMediaType) {
  console.log("Adding to WatchList");
  try {
    const mediaId = await addMediaIfNotExists(db, input);
    const user = (await db.user.findUnique({ where: { id: userId } }))!;
    if (user.watchListIds.includes(input.media.id)) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Already In Your Watch List",
      });
    }
    await db.user.update({
      where: { id: userId },
      data: { watchListIds: { push: input.media.id } },
    });
    return mediaId;
  } catch (error) {
    throwAddError(error);
  }
}

export async function removeMediaFromWatchList({
  db,
  mediaId,
  userId,
}: RemoveMediaType) {
  try {
    const user = (await db.user.findUnique({ where: { id: userId } }))!;
    const updatedList = user.watchListIds.filter((id) => id !== mediaId);
    await db.user.update({
      where: { id: userId },
      data: { watchListIds: updatedList },
    });
    return mediaId;
  } catch (error) {
    throwRemoveError(error);
  }
}

export async function addMediaToFavorites({ db, input, userId }: AddMediaType) {
  console.log("Adding to Favorites");
  try {
    const mediaId = await addMediaIfNotExists(db, input);
    const user = (await db.user.findUnique({ where: { id: userId } }))!;
    if (user.watchListIds.includes(input.media.id)) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Already In Your Watch List",
      });
    }
    await db.user.update({
      where: { id: userId },
      data: { favoriteIds: { push: input.media.id } },
    });
    return mediaId;
  } catch (error) {
    throwAddError(error);
  }
  // try {
  //   const mediaId = await addMediaIfNotExists(db, input);
  //   const user = (await db.user.findUnique({ where: { id: userId } }))!;
  //   if (user.favoriteIds.includes(input.media.id)) {
  //     throw new TRPCError({
  //       code: "CONFLICT",
  //       message: "Already In Favorites List",
  //     });
  //   }
  //   await db.user.update({
  //     where: {
  //       id: userId,
  //       NOT: { favoriteIds: { has: input.media.id } },
  //     },
  //     data: { favoriteIds: { push: input.media.id } },
  //   });
  //   return mediaId;
  // } catch (error) {
  //   throwAddError(error);
  // }
}

export async function removeMediaFromFavorites({
  db,
  mediaId,
  userId,
}: RemoveMediaType) {
  try {
    const user = (await db.user.findUnique({ where: { id: userId } }))!;
    const updatedList = user.favoriteIds.filter((id) => id !== mediaId);
    await db.user.update({
      where: { id: userId },
      data: { favoriteIds: updatedList },
    });
    return mediaId;
  } catch (error) {
    throwRemoveError(error);
  }
}

async function addMediaIfNotExists(db: PrismaClient, input: InputType) {
  const mediaFound = await db.media.findUnique({
    where: { id: input.media.id },
  });
  console.log(`Media Found ${mediaFound?.id}`);
  let mediaId = mediaFound?.id;
  if (!mediaFound) {
    const mediaSaved = await db.media.create({
      data: input.media,
    });
    mediaId = mediaSaved.id;
  }
  console.log(`Media Id ${mediaId}`);
  return mediaId;
}

function throwAddError(error: unknown) {
  console.error(error);
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Unable to add to your list. Please Try Again Later",
  });
}

function throwRemoveError(error: unknown) {
  console.error(error);
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Unable to Remove From your list. Please Try Again Later",
  });
}
