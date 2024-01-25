import Image from "next/image";
import { IMAGE_BASE_URL, LIST_FORMATTER, USD_FORMATTER } from "~/lib/constants";
import MediaProvider from "~/providers/media-provider";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { type ListIdsType, type GenreType, type TMDBApiMedia } from "~/types";
import Favorite from "./favorite";
import MyList from "./mylist";
import WatchList from "./watch-list";

type Props = { media: TMDBApiMedia };

export default async function MovieDetail({ media }: Props) {
  const genres = media.genres as unknown as GenreType[];
  const session = await getServerAuthSession();
  let mediaIds: ListIdsType = {
    favoriteIds: [],
    watchListIds: [],
    mylistIds: [],
  };

  if (session?.user) {
    mediaIds = await api.media.getListIds.query();
  }

  return (
    <section className="w-full gap-4 pt-16">
      <div className="mx-auto flex flex-col justify-center gap-4 md:flex-row md:pl-20">
        <Image
          className="mx-auto justify-center object-cover transition-all hover:scale-105 md:justify-normal"
          src={`${IMAGE_BASE_URL}${media?.poster_path ?? media.backdrop_path}`}
          alt={media.original_title ?? media.title ?? media.name ?? ""}
          priority
          width={300}
          height={450}
        />
        <div className="flex flex-1 flex-col gap-3 p-2 md:p-0">
          <div className="flex max-w-fit flex-col">
            <h1
              className="cursor-default text-4xl font-semibold"
              title={media.title ?? media.name ?? undefined}
            >
              {media.title ?? media.name}
            </h1>
            {media.tagline && (
              <h3 className="text-center text-muted-foreground">
                {media.tagline}
              </h3>
            )}
          </div>
          <p className="flex gap-2 text-muted-foreground">
            <span>{media.media_type === "tv" ? "TV" : "Movie"}</span>
            {media.release_date && (
              <span>{`${media.release_date.slice(0, 4)}`}</span>
            )}
            {media.media_type === "tv" && (
              <>
                <span>
                  {media.first_air_date.slice(0, 4)}-
                  {media.last_air_date.slice(0, 4)}
                </span>
                <span>{media.number_of_seasons} Seasons</span>
              </>
            )}
            {media.runtime && <span>{media.runtime} mins</span>}
          </p>
          <p className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <span
                key={genre.id.toString()}
                className="rounded-sm bg-purple-500 px-1 py-0.5 text-sm"
              >
                {genre.name}
              </span>
            ))}
          </p>
          <p>{media.overview}</p>
          <div className="flex flex-col gap-0.5">
            {media.release_date && (
              <p>
                <span className="text-muted-foreground">Release Date: </span>
                {media.release_date}
              </p>
            )}
            {media.budget && (
              <p>
                <span className="text-muted-foreground">Budget: </span>
                {USD_FORMATTER.format(media.budget)}
              </p>
            )}
            {media.revenue && (
              <p>
                <span className="text-muted-foreground">Box Office: </span>
                {USD_FORMATTER.format(media.revenue)}
              </p>
            )}
            {media.spoken_languages && (
              <p>
                <span className="text-muted-foreground">{"Language(s): "}</span>
                <span>
                  {LIST_FORMATTER.format(
                    media.spoken_languages.map(
                      (language) => language.english_name,
                    ),
                  )}
                </span>
              </p>
            )}
            {media.credits?.cast && (
              <p>
                <span className="text-muted-foreground">{"Actors: "}</span>
                <span>
                  {LIST_FORMATTER.format(
                    media.credits.cast.slice(0, 5).map((c) => c.name),
                  )}
                </span>
              </p>
            )}
            {media.credits?.crew && (
              <p>
                <span className="text-muted-foreground">{"Director(s): "}</span>
                <span>
                  {LIST_FORMATTER.format(
                    media.credits.crew
                      .slice(0, 5)
                      .filter((c) => c.job === "Director")
                      .map((c) => c.name),
                  )}
                </span>
              </p>
            )}
          </div>
          {session?.user && (
            <MediaProvider mediaIds={mediaIds}>
              <div className="flex justify-center gap-2 md:justify-normal">
                <div className="flex cursor-pointer items-center justify-center rounded-full border border-foreground p-1">
                  <Favorite media={media} className="h-8 w-8" />
                </div>
                <div className="flex cursor-pointer items-center justify-center rounded-full border border-foreground p-1">
                  <MyList media={media} className="h-8 w-8" />
                </div>
                <div className="flex cursor-pointer items-center justify-center rounded-full border border-foreground p-1">
                  <WatchList media={media} className="h-8 w-8" />
                </div>
              </div>
            </MediaProvider>
          )}
        </div>
        <div className="pb-16 md:pb-0"></div>
      </div>
    </section>
  );
}
