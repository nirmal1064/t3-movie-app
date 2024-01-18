import Navbar from "~/_components/Navbar";
import MovieCard from "~/_components/movie-card";
import { api } from "~/trpc/server";

export default async function MyList() {
  const media = await api.media.getMyList.query();

  return (
    <main className="flex min-h-screen justify-center bg-background scrollbar-track-background">
      <Navbar />
      <section className="mx-auto flex w-full flex-row flex-wrap justify-center gap-5 p-4 pt-16">
        {media.map((movie) => (
          <MovieCard key={movie.id} media={movie} />
        ))}
      </section>
    </main>
  );
}
