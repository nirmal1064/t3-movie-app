import { type Media } from "@prisma/client";
import MediaProvider from "~/providers/media-provider";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import MovieCard from "./movie-card";

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
    console.log("No User");
    return <Grid />;
  }

  return (
    <MediaProvider mediaIds={mediaIds}>
      <Grid />
    </MediaProvider>
  );
}
