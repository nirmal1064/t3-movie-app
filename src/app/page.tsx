import { redirect } from "next/navigation";
import Navbar from "~/_components/Navbar";
import MovieGrid from "~/_components/movie/movie-grid";
import { env } from "~/env";
import { TMDB_BASE_URL } from "~/lib/constants";
import { getServerAuthSession } from "~/server/auth";
import { type TrendingResponseType } from "~/types";

async function getTrendingMovies() {
  const type = Math.random() < 0.5 ? "movie" : "tv";
  try {
    const url = `${TMDB_BASE_URL}/${type}/popular?api_key=${env.TMDB_API_KEY}`;
    const response = await fetch(url);
    const data = (await response.json()) as TrendingResponseType;
    data.results = data.results.map((media) => ({
      ...media,
      media_type: type,
    }));
    return data;
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
  console.log(session?.user);
  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const data = await getTrendingMovies();

  return (
    <main className="container min-h-screen bg-background scrollbar-track-background">
      <Navbar />
      <MovieGrid media={data.results} />
    </main>
  );
}
