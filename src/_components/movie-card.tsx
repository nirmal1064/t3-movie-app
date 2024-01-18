"use client";
import { type Media } from "@prisma/client";
import Image from "next/image";
import toast from "react-hot-toast";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { FaCheck, FaPlus } from "react-icons/fa6";
import {
  MdOutlinePlaylistAdd,
  MdOutlinePlaylistAddCheck,
} from "react-icons/md";
import { IMAGE_BASE_URL, MOVIE_GENRES, TV_GENERES } from "~/lib/constants";
import { api } from "~/trpc/react";

type Props = { media: Media };

const liked = false;
const watched = false;
const watchList = false;

export default function MovieCard({ media }: Props) {
  const { mutate: addToListMutate } = api.media.addToList.useMutation();

  function handleLike() {
    console.log("Handle Like");
  }

  function handleRemoveLike() {
    console.log("Handle Remove Like");
  }

  function handleAddToList() {
    console.log("Handle AddToList");
    console.log(media);
    addToListMutate(
      { media },
      {
        onSuccess: () => {
          toast.success(
            `${media.media_type === "tv" ? "Series" : "Movie"} added to your List`,
          );
        },
        onError: () => {
          toast.error("Some Error Occured");
        },
      },
    );
  }

  function handleRemoveFromList() {
    console.log("Handle RemoveFromList");
  }

  function handleAddToWatchList() {
    console.log("Handle AddToWatchList");
  }

  function handleRemoveFromWatchList() {
    console.log("Handle RemoveFromWatchList");
  }

  return (
    <div
      className={`flex h-auto w-[300px] flex-col gap-2 rounded-lg bg-movie shadow-2xl`}
    >
      <Image
        className="rounded-lg object-cover transition-all hover:scale-105"
        src={`${IMAGE_BASE_URL}${media?.poster_path ?? media.backdrop_path}`}
        alt={media.original_title ?? media.title ?? media.name ?? ""}
        priority
        width={300}
        height={450}
      />
      <div className="flex h-full flex-col justify-between gap-1 pb-1 text-foreground">
        <div className="flex items-center gap-1">
          <h2
            className="line-clamp-1 cursor-default text-xl font-semibold"
            title={media.title ?? media.name ?? undefined}
          >
            {media.title ?? media.name}{" "}
            {media.release_date && `(${media.release_date.slice(0, 4)})`}
          </h2>
        </div>
        <p className="flex flex-wrap gap-1 px-1">
          {media.genre_ids?.slice(0, 3).map((genreId) => (
            <span
              key={genreId}
              className="rounded-sm bg-purple-500 px-1 py-0.5 text-sm"
            >
              {media.media_type === "movie"
                ? MOVIE_GENRES.find((genre) => genre.id === genreId)?.name
                : TV_GENERES.find((genre) => genre.id === genreId)?.name}
            </span>
          ))}
        </p>
        <div className="mt-2 flex items-center justify-between px-1 text-2xl">
          <button className="rounded-lg bg-red-500 px-3 py-0.5 text-lg">
            Watch Trailer
          </button>
          <div className="flex gap-1.5">
            <div className="flex cursor-pointer items-center justify-center rounded-full border border-foreground p-1">
              {liked ? (
                <AiFillLike onClick={handleRemoveLike} />
              ) : (
                <AiOutlineLike onClick={handleLike} />
              )}
            </div>
            <div className="flex cursor-pointer items-center justify-center rounded-full border border-foreground p-1">
              {watched ? (
                <FaCheck onClick={handleRemoveFromList} />
              ) : (
                <FaPlus onClick={handleAddToList} />
              )}
            </div>
            <div className="flex cursor-pointer items-center justify-center rounded-full border border-foreground p-1">
              {watchList ? (
                <MdOutlinePlaylistAddCheck
                  onClick={handleRemoveFromWatchList}
                />
              ) : (
                <MdOutlinePlaylistAdd onClick={handleAddToWatchList} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
