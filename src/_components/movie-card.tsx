"use client";
import { type Media } from "@prisma/client";
import Image from "next/image";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { FaCheck, FaPlus } from "react-icons/fa6";
import {
  MdOutlinePlaylistAdd,
  MdOutlinePlaylistAddCheck,
} from "react-icons/md";
import { IMAGE_BASE_URL, MOVIE_GENRES, TV_GENERES } from "~/lib/constants";

type Props = { media: Media };

const liked = false;
const watched = false;
const watchList = false;

export default function MovieCard({ media: movie }: Props) {
  function handleLike() {
    console.log("Handle Like");
  }

  function handleRemoveLike() {
    console.log("Handle Remove Like");
  }

  function handleAddToList() {
    console.log("Handle AddToList");
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
        src={`${IMAGE_BASE_URL}${movie?.poster_path ?? movie.backdrop_path}`}
        alt={movie.original_title ?? movie.title ?? movie.name ?? ""}
        priority
        width={300}
        height={450}
      />
      <div className="flex h-full flex-col justify-between gap-1 pb-1 text-foreground">
        <div className="flex items-center gap-1">
          <h2
            className="line-clamp-1 cursor-default text-xl font-semibold"
            title={movie.title ?? movie.name ?? undefined}
          >
            {movie.title ?? movie.name}{" "}
            {movie.release_date && `(${movie.release_date.slice(0, 4)})`}
          </h2>
        </div>
        <p className="flex flex-wrap gap-1 px-1">
          {movie.genre_ids?.slice(0, 3).map((genreId) => (
            <span
              key={genreId}
              className="rounded-sm bg-purple-500 px-1 py-0.5 text-sm"
            >
              {movie.media_type === "movie"
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
