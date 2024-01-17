// type Props = {
//   params: { slug: string };
//   searchParams: { [key: string]: string | string[] | undefined };
// };

import Navbar from "~/_components/Navbar";
import MovieCard from "~/_components/movie-card";
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

  console.log(data.results[2]);

  return (
    <main className="flex min-h-screen justify-center bg-background scrollbar-track-background">
      <Navbar />
      <section className="mx-auto flex w-full flex-row flex-wrap justify-center gap-5 p-4 pt-16">
        {data.results?.map((movie) => (
          <MovieCard key={movie.id} media={movie} />
        ))}
      </section>
    </main>
  );
}
