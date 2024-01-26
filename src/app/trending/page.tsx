import Navbar from "~/_components/Navbar";
import MovieGrid from "~/_components/movie/movie-grid";
import { env } from "~/env";
import { TMDB_BASE_URL } from "~/lib/constants";
import { type TrendingResponseType } from "~/types";

async function getTrendingMovies() {
  const dayOrWeek = Math.random() < 0.5 ? "day" : "week";
  const pageNo = Math.floor(Math.random() * 10);
  try {
    const url = `${TMDB_BASE_URL}/trending/all/${dayOrWeek}?page=${pageNo}`;
    const options: RequestInit = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${env.TMDB_ACCESS_TOKEN}`,
      },
    };
    const response = await fetch(url, options);
    const data = (await response.json()) as TrendingResponseType;
    data.results = data.results.filter(
      (r) => r.media_type === "tv" || r.media_type === "movie",
    );
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

export default async function Trending() {
  const data = await getTrendingMovies();

  return (
    <main className="container min-h-screen bg-background scrollbar-track-background">
      <Navbar />
      <MovieGrid media={data.results} />
    </main>
  );
}
