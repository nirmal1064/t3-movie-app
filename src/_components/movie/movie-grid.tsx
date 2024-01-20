import { type Media } from "@prisma/client";
import MovieCard from "./movie-card";
import { api } from "~/trpc/server";
import MediaProvider from "~/providers/media-provider";
import { getServerAuthSession } from "~/server/auth";

type Props = { media: Media[] };

export default async function MovieGrid({ media }: Props) {
  const mediaIds = await api.media.getListIds.query();
  const session = await getServerAuthSession();

  function Grid() {
    return (
      <section className="grid w-full grid-cols-auto place-items-center gap-4 pt-16">
        {media.map((movie) => (
          <MovieCard key={movie.id} media={movie} />
        ))}
        {media.length === 0 && (
          <div className="flex items-center justify-center text-xl">
            Nothing Found Here
          </div>
        )}
      </section>
    );
  }

  if (!session?.user) {
    return <Grid />;
  }

  return (
    <MediaProvider mediaIds={mediaIds}>
      <Grid />
    </MediaProvider>
  );
}
