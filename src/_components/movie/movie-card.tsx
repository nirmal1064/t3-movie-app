"use client";
import { type Media } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IMAGE_BASE_URL,
  MOVIE_GENRES,
  ROUTES,
  TV_GENERES,
} from "~/lib/constants";
import { useListIds } from "~/providers/media-provider";
import Favorite from "./favorite";
import MyList from "./mylist";
import WatchList from "./watch-list";

type Props = { media: Media };

export default function MovieCard({ media }: Props) {
  const [listIds] = useListIds();
  const isFavorite = listIds.favoriteIds.includes(media.id);
  const isInMyList = listIds.mylistIds.includes(media.id);
  const isInWatchList = listIds.watchListIds.includes(media.id);
  const pathname = usePathname();

  if (pathname === ROUTES.MY_LIST && !isInMyList) {
    return null;
  }

  if (pathname === ROUTES.WATCH_LIST && !isInWatchList) {
    return null;
  }

  if (pathname === ROUTES.FAVORITES && !isFavorite) {
    return null;
  }

  function DisplayYear() {
    if (media.media_type === "movie" && media.release_date) {
      return `(${media.release_date.slice(0, 4)})`;
    } else if (media.media_type === "tv" && media.first_air_date) {
      const startYear = media.first_air_date.slice(0, 4);
      const endYear = media.last_air_date
        ? media.last_air_date.slice(0, 4)
        : "";
      return `(${startYear}-${endYear})`;
    }
    return "";
  }

  return (
    <div
      className={`flex h-auto w-[320px] select-none flex-col gap-2 rounded-lg bg-movie shadow-2xl`}
    >
      <Image
        className="h-[480px] w-full rounded-lg object-cover transition-all hover:scale-105"
        src={`${IMAGE_BASE_URL}${media?.poster_path ?? media.backdrop_path}`}
        alt={media.original_title ?? media.title ?? media.name ?? ""}
        priority
        width={320}
        height={480}
      />
      <div className="line-clamp-1 flex h-full flex-col justify-between gap-1 pb-1 text-foreground">
        <div className="flex items-center gap-1">
          <h2
            className="line-clamp-1 cursor-default px-1 text-xl font-semibold"
            title={media.title ?? media.name ?? undefined}
          >
            {media.title ?? media.name} <DisplayYear />
          </h2>
        </div>
        <p className="flex gap-1 text-ellipsis px-1">
          {media.genre_ids?.slice(0, 3).map((genreId) => (
            <span
              key={genreId}
              className="whitespace-nowrap rounded-sm bg-purple-500 px-1 py-0.5 text-sm"
            >
              {media.media_type === "movie"
                ? MOVIE_GENRES.find((genre) => genre.id === genreId)?.name
                : TV_GENERES.find((genre) => genre.id === genreId)?.name}
            </span>
          ))}
        </p>
        <div className="mt-2 flex items-center justify-between px-1 text-2xl">
          <Link
            href={
              media.media_type === "tv"
                ? `/series/${media.id}`
                : `/movie/${media.id}`
            }
          >
            <button className="rounded-lg bg-red-500 px-3 py-0.5 text-lg">
              More Info
            </button>
          </Link>
          <div className="flex gap-1.5">
            <div className="flex cursor-pointer items-center justify-center rounded-full border border-foreground p-1">
              <Favorite media={media} />
            </div>
            <div className="flex cursor-pointer items-center justify-center rounded-full border border-foreground p-1">
              <MyList media={media} />
            </div>
            <div className="flex cursor-pointer items-center justify-center rounded-full border border-foreground p-1">
              <WatchList media={media} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
