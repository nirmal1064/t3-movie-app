import { type Metadata } from "next";
import Navbar from "~/_components/Navbar";
import MovieDetail from "~/_components/movie/movie-detail";
import { env } from "~/env";
import { type ApiErrorResponse, type TMDBApiMedia } from "~/types";

type Props = { params: { id: string } };
type ResponseType = { success: true; media: TMDBApiMedia } | { success: false };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getSeriesById(params.id);
  if (data.success) {
    return { title: data.media?.title ?? data.media?.name };
  }
  return { title: "Series Not Found" };
}

async function getSeriesById(id: string) {
  try {
    const options: RequestInit = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${env.TMDB_ACCESS_TOKEN}`,
      },
    };
    const url = `https://api.themoviedb.org/3/tv/${id}?append_to_response=images,videos,credits`;
    const response = await fetch(url, options);
    const media = (await response.json()) as TMDBApiMedia | ApiErrorResponse;
    if ("id" in media) {
      return { success: true, media: { ...media, media_type: "tv" } };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}

export default async function Series({ params }: Props) {
  const data = (await getSeriesById(params.id)) as ResponseType;

  if (!data.success) {
    return (
      <main className="min-h-screen justify-center bg-background scrollbar-track-background">
        <Navbar />
        <section className="grid w-full grid-cols-auto place-items-center gap-4 pt-16">
          Show Details Not Found. Please Try Again.
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen justify-center bg-background scrollbar-track-background">
      <Navbar />
      <MovieDetail media={data.media} />
    </main>
  );
}
