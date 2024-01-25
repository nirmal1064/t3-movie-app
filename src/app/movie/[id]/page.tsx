import Navbar from "~/_components/Navbar";
import MovieDetail from "~/_components/movie/movie-detail";
import { env } from "~/env";
import { YT_WATCH_URL } from "~/lib/constants";
import { type ApiErrorResponse, type TMDBApiMedia } from "~/types";

type Props = { params: { id: string } };

type ResponseType = { success: true; media: TMDBApiMedia } | { success: false };

async function getMovieById(id: string) {
  try {
    const options: RequestInit = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${env.TMDB_ACCESS_TOKEN}`,
      },
    };
    const url = `https://api.themoviedb.org/3/movie/${id}?append_to_response=images,videos,credits`;
    const response = await fetch(url, options);
    const media = (await response.json()) as TMDBApiMedia | ApiErrorResponse;
    if ("id" in media) {
      return { success: true, media: { ...media, media_type: "movie" } };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}

export default async function Movie({ params }: Props) {
  const data = (await getMovieById(params.id)) as ResponseType;

  if (!data.success) {
    return (
      <main className="min-h-screen justify-center bg-background scrollbar-track-background">
        <Navbar />
        <section className="grid w-full grid-cols-auto place-items-center gap-4 pt-16">
          Movie Details Not Found. Please Try Again.
        </section>
      </main>
    );
  }

  const { media } = data;
  const trailerURLs = media.videos.results
    .filter(
      (video) =>
        video.site === "YouTube" &&
        (video.type === "Trailer" || video.type === "Teaser"),
    )
    .map((v) => `${YT_WATCH_URL}${v.key}`);
  console.log(trailerURLs);

  return (
    <main className="min-h-screen justify-center bg-background scrollbar-track-background">
      <Navbar />
      <MovieDetail media={media} />
    </main>
  );
}
