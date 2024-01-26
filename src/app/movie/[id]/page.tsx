import { type Metadata } from "next";
import Navbar from "~/_components/Navbar";
import MediaDetail from "~/_components/movie/media-detail";
import { env } from "~/env";
import { type ApiErrorResponse, type TMDBApiMedia } from "~/types";

type Props = { params: { id: string } };

type ResponseType = { success: true; media: TMDBApiMedia } | { success: false };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getMovieById(params.id);
  if (data.success) {
    return { title: data.media?.title ?? data.media?.name };
  }
  return { title: "Movie Not Found" };
}

async function getMovieById(id: string) {
  try {
    const options: RequestInit = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${env.TMDB_ACCESS_TOKEN}`,
      },
    };
    const url = `https://api.themoviedb.org/3/movie/${id}?append_to_response=images,videos,credits,similar,recommendations`;
    const response = await fetch(url, options);
    const media = (await response.json()) as TMDBApiMedia | ApiErrorResponse;
    if ("id" in media) {
      return { success: true, media: { ...media, media_type: "movie" } };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.error(error);
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

  return (
    <main className="min-h-screen justify-center bg-background scrollbar-track-background">
      <Navbar />
      <MediaDetail media={data.media} />
    </main>
  );
}
