import Image from "next/image";
import { IMAGE_BASE_URL, LIST_FORMATTER, USD_FORMATTER } from "~/lib/constants";
import MediaProvider from "~/providers/media-provider";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { type GenreType, type ListIdsType, type TMDBApiMedia } from "~/types";
import CastCrewList from "./cast-crew-list";
import Favorite from "./favorite";
import ImageList from "./image-list";
import MyList from "./mylist";
import SimilarOrRecommendedMedia from "./similar-recommendations";
import VideoList from "./video-list";
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

  const mediaTitle =
    media.title ??
    media.name ??
    media.original_title ??
    media.original_name ??
    undefined;

  function DisplayYear() {
    if (media.media_type === "movie" && media.release_date) {
      return `${media.release_date.slice(0, 4)}`;
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
    <section className="flex w-full flex-col gap-4 pt-16 md:px-20">
      <div className="flex flex-col justify-between gap-4 md:flex-row">
        <Image
          className="mx-auto object-cover transition-all hover:scale-105"
          src={`${IMAGE_BASE_URL}${media?.poster_path ?? media.backdrop_path}`}
          alt={mediaTitle ?? ""}
          priority
          width={300}
          height={450}
        />
        <div className="flex flex-1 flex-col gap-3 p-2 md:p-0">
          <div className="flex max-w-fit flex-col">
            <h1
              className="cursor-default text-3xl font-semibold md:text-4xl"
              title={mediaTitle}
            >
              {mediaTitle}
              {media.original_title &&
                media.original_title !== mediaTitle &&
                ` (${media.original_title})`}
              {media.original_name &&
                media.original_name !== mediaTitle &&
                ` (${media.original_name})`}
            </h1>
            {media.tagline && (
              <h3 className="text-muted-foreground">{media.tagline}</h3>
            )}
          </div>
          <p className="flex gap-2 text-muted-foreground">
            <span>{media.media_type === "tv" ? "TV" : "Movie"}</span>
            <DisplayYear />
            {media.number_of_seasons && (
              <span>{media.number_of_seasons} Seasons</span>
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
            {media.first_air_date && (
              <p>
                <span className="text-muted-foreground">First Episode: </span>
                {media.first_air_date}
              </p>
            )}
            {media.last_air_date && (
              <p>
                <span className="text-muted-foreground">Last Episode: </span>
                {media.last_air_date}
              </p>
            )}
            {media.budget !== undefined && media.budget > 0 && (
              <p>
                <span className="text-muted-foreground">Budget: </span>
                {USD_FORMATTER.format(media.budget)}
              </p>
            )}
            {media.revenue !== undefined && media.revenue > 0 && (
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
            {media.credits?.cast && media.credits.cast.length > 0 && (
              <p>
                <span className="text-muted-foreground">{"Actors: "}</span>
                <span>
                  {LIST_FORMATTER.format(
                    media.credits.cast.slice(0, 5).map((c) => c.name),
                  )}
                </span>
              </p>
            )}
            {media.credits?.crew && media.credits.crew.length > 0 && (
              <p>
                <span className="text-muted-foreground">{"Director(s): "}</span>
                <span>
                  {LIST_FORMATTER.format(
                    media.credits.crew
                      .filter((c) => c.job === "Director")
                      .map((c) => c.name)
                      .slice(0, 5),
                  )}
                </span>
              </p>
            )}
          </div>
          {session?.user && (
            <MediaProvider mediaIds={mediaIds}>
              <div className="flex justify-center gap-5 md:justify-normal md:gap-2">
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
      </div>
      <ImageList images={media.images.backdrops} />
      <CastCrewList castOrCrews={media.credits?.cast ?? []} title="Cast" />
      <CastCrewList castOrCrews={media.credits?.crew ?? []} title="Crew" />
      <VideoList videos={media.videos.results} />
      <SimilarOrRecommendedMedia
        title={`More Like this ${media.media_type === "tv" ? "Show" : "Movie"}`}
        mediaList={media.similar?.results ?? []}
      />
      <SimilarOrRecommendedMedia
        title={`Recommended ${media.media_type === "tv" ? "Shows" : "Movies"}`}
        mediaList={media.recommendations?.results ?? []}
      />
      <div className="pb-16 md:pb-0"></div>
    </section>
  );
}
