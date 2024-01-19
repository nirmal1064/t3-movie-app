import Navbar from "~/_components/Navbar";
import MovieGrid from "~/_components/movie/movie-grid";
import { env } from "~/env";
import { type SearchResultType } from "~/types";

type Props = {
  params: { slug: string };
  searchParams: Record<string, string | string[] | undefined>;
};

async function searchMovies(query: string) {
  try {
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${env.TMDB_API_KEY}&query=${query}&include_adult=false&language=en-US&page=1`;
    const response = await fetch(url);
    const data = (await response.json()) as SearchResultType;
    data.results = data.results.filter(
      (media) => media.media_type === "tv" || media.media_type === "movie",
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

export default async function Search({ searchParams }: Props) {
  const { q } = searchParams;
  const data = await searchMovies(q as string);

  return (
    <main className="flex min-h-screen justify-center bg-background scrollbar-track-background">
      <Navbar />
      <MovieGrid medias={data.results} />
    </main>
  );
}
