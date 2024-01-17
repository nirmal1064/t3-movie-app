import MovieCard from "~/_components/movie-card";
import { env } from "~/env";
import { TMDB_BASE_URL } from "~/lib/constants";
import { type TrendingResponseType } from "~/types";

async function getData() {
  const url = `${TMDB_BASE_URL}/movie/popular?api_key=${env.TMDB_API_KEY}`;
  const response = await fetch(url);
  console.log(response);
  return (await response.json()) as TrendingResponseType;
}

export default async function Home() {
  const data = await getData();
  console.log(data);

  return (
    <main className="dark flex min-h-screen items-center justify-center bg-background">
      <section className="mx-auto flex w-full flex-row flex-wrap justify-center gap-2 p-4">
        {data.results.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </section>
    </main>
  );
}
