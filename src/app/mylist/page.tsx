import { type Media } from "@prisma/client";
import Navbar from "~/_components/Navbar";
import MovieGrid from "~/_components/movie/movie-grid";
import { api } from "~/trpc/server";

export default async function MyList() {
  const media = (await api.media.getMyList.query()) as Media[];

  return (
    <main className="min-h-screen justify-center bg-background scrollbar-track-background">
      <Navbar />
      <MovieGrid media={media} />
    </main>
  );
}
