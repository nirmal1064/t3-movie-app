"use client";
import { type Media } from "@prisma/client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { FaCheck, FaPlus } from "react-icons/fa6";
import {
  MdOutlinePlaylistAdd,
  MdOutlinePlaylistAddCheck,
} from "react-icons/md";
import {
  IMAGE_BASE_URL,
  MOVIE_GENRES,
  ROUTES,
  TV_GENERES,
} from "~/lib/constants";
import { useListIds } from "~/providers/media-provider";
import { api } from "~/trpc/react";

type Props = { media: Media };

export default function MovieCard({ media }: Props) {
  const [listIds, setListIds] = useListIds();
  const { mutate: addToListMutate } = api.media.addToMyList.useMutation();
  const { mutate: watchListMutate } = api.media.addToWatchList.useMutation();
  const { mutate: favoritesMutate } = api.media.addToFavorites.useMutation();
  const { mutate: removeMyListMutate } =
    api.media.removeFromMyList.useMutation();
  const { mutate: removeWatchListMutate } =
    api.media.removeFromWatchList.useMutation();
  const { mutate: removeFavoriteMutate } =
    api.media.removeFromFavorites.useMutation();
  const isFavorite = listIds.favoriteIds.includes(media.id);
  const isInMyList = listIds.mylistIds.includes(media.id);
  const isInWatchList = listIds.watchListIds.includes(media.id);
  const pathname = usePathname();

  function handleLike() {
    favoritesMutate(
      { media },
      {
        onSuccess: (mediaId) => {
          if (mediaId) {
            setListIds((prevState) => ({
              ...prevState,
              favoriteIds: [...prevState.favoriteIds, mediaId],
            }));
            toast.success(
              `${media.media_type === "tv" ? "Series" : "Movie"} added to your Favorites`,
            );
          }
        },
        onError: (error) => {
          const code = error.data?.code;
          if (code === "CONFLICT" || code === "INTERNAL_SERVER_ERROR") {
            toast.error(error.message);
          } else {
            toast.error("Some Error Occured. Please Try Again");
          }
        },
      },
    );
  }

  function handleRemoveLike() {
    removeFavoriteMutate(
      { mediaId: media.id },
      {
        onSuccess: (mediaId) => {
          if (mediaId) {
            setListIds((prevState) => ({
              ...prevState,
              favoriteIds: prevState.favoriteIds.filter((id) => id !== mediaId),
            }));
          }
          toast.success(
            `${media.media_type === "tv" ? "Series" : "Movie"} Removed From your Favorites`,
          );
        },
        onError: (error) => {
          const code = error.data?.code;
          if (code === "CONFLICT" || code === "INTERNAL_SERVER_ERROR") {
            toast.error(error.message);
          } else {
            toast.error("Some Error Occured. Please Try Again");
          }
        },
      },
    );
  }

  function handleAddToList() {
    addToListMutate(
      { media },
      {
        onSuccess: (mediaId) => {
          if (mediaId) {
            setListIds((prevState) => ({
              ...prevState,
              mylistIds: [...prevState.mylistIds, mediaId],
            }));
          }

          toast.success(
            `${media.media_type === "tv" ? "Series" : "Movie"} added to your List`,
          );
        },
        onError: (error) => {
          const code = error.data?.code;
          if (code === "CONFLICT" || code === "INTERNAL_SERVER_ERROR") {
            toast.error(error.message);
          } else {
            toast.error("Some Error Occured. Please Try Again");
          }
        },
      },
    );
  }

  function handleRemoveFromList() {
    removeMyListMutate(
      { mediaId: media.id },
      {
        onSuccess: (mediaId) => {
          if (mediaId) {
            setListIds((prevState) => ({
              ...prevState,
              mylistIds: prevState.mylistIds.filter((id) => id !== mediaId),
            }));
          }
          toast.success(
            `${media.media_type === "tv" ? "Series" : "Movie"} Removed From your List`,
          );
        },
        onError: (error) => {
          const code = error.data?.code;
          if (code === "CONFLICT" || code === "INTERNAL_SERVER_ERROR") {
            toast.error(error.message);
          } else {
            toast.error("Some Error Occured. Please Try Again");
          }
        },
      },
    );
  }

  function handleAddToWatchList() {
    watchListMutate(
      { media },
      {
        onSuccess: (mediaId) => {
          if (mediaId) {
            setListIds((prevState) => ({
              ...prevState,
              watchListIds: [...prevState.watchListIds, mediaId],
            }));
          }
          toast.success(
            `${media.media_type === "tv" ? "Series" : "Movie"} added to your Watch List`,
          );
        },
        onError: (error) => {
          const code = error.data?.code;
          if (code === "CONFLICT" || code === "INTERNAL_SERVER_ERROR") {
            toast.error(error.message);
          } else {
            toast.error("Some Error Occured. Please Try Again");
          }
        },
      },
    );
  }

  function handleRemoveFromWatchList() {
    removeWatchListMutate(
      { mediaId: media.id },
      {
        onSuccess: (mediaId) => {
          if (mediaId) {
            setListIds((prevState) => ({
              ...prevState,
              watchListIds: prevState.watchListIds.filter(
                (id) => id !== mediaId,
              ),
            }));
          }
          toast.success(
            `${media.media_type === "tv" ? "Series" : "Movie"} Removed From Watch List`,
          );
        },
        onError: (error) => {
          const code = error.data?.code;
          if (code === "CONFLICT" || code === "INTERNAL_SERVER_ERROR") {
            toast.error(error.message);
          } else {
            toast.error("Some Error Occured. Please Try Again");
          }
        },
      },
    );
  }

  if (pathname === ROUTES.MY_LIST && !isInMyList) {
    return null;
  }

  if (pathname === ROUTES.WATCH_LIST && !isInWatchList) {
    return null;
  }

  if (pathname === ROUTES.FAVORITES && !isFavorite) {
    return null;
  }

  return (
    <div
      className={`flex h-auto w-[320px] select-none flex-col gap-2 rounded-lg bg-movie shadow-2xl`}
    >
      <Image
        className="rounded-lg object-cover transition-all hover:scale-105"
        src={`${IMAGE_BASE_URL}${media?.poster_path ?? media.backdrop_path}`}
        alt={media.original_title ?? media.title ?? media.name ?? ""}
        priority
        width={320}
        height={450}
      />
      <div className="flex h-full flex-col justify-between gap-1 pb-1 text-foreground">
        <div className="flex items-center gap-1">
          <h2
            className="line-clamp-1 cursor-default px-1 text-xl font-semibold"
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
              {isFavorite ? (
                <AiFillLike onClick={handleRemoveLike} />
              ) : (
                <AiOutlineLike onClick={handleLike} />
              )}
            </div>
            <div className="flex cursor-pointer items-center justify-center rounded-full border border-foreground p-1">
              {isInMyList ? (
                <FaCheck onClick={handleRemoveFromList} />
              ) : (
                <FaPlus onClick={handleAddToList} />
              )}
            </div>
            <div className="flex cursor-pointer items-center justify-center rounded-full border border-foreground p-1">
              {isInWatchList ? (
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
