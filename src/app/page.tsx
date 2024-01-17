import { redirect } from "next/navigation";
import Navbar from "~/_components/Navbar";
import MovieCard from "~/_components/movie-card";
import { env } from "~/env";
import { TMDB_BASE_URL } from "~/lib/constants";
import { getServerAuthSession } from "~/server/auth";
import { type TrendingResponseType } from "~/types";

async function getData() {
  try {
    const url = `${TMDB_BASE_URL}/movie/popular?api_key=${env.TMDB_API_KEY}`;
    const response = await fetch(url);
    return (await response.json()) as TrendingResponseType;
  } catch (error) {
    console.error(error);
    return {
      results: [],
      page: 0,
      total_pages: 0,
      total_results: 0,
    };
  }
}

export default async function Home() {
  const session = await getServerAuthSession();
  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const data = await getData();

  return (
    <main className="flex min-h-screen justify-center bg-background scrollbar-track-background">
      <Navbar />
      <section className="mx-auto flex w-full flex-row flex-wrap justify-center gap-5 p-4 pt-16">
        {data.results.map((movie) => (
          <MovieCard key={movie.id} media={movie} />
        ))}
      </section>
    </main>
  );
}
