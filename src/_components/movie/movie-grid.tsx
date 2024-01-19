import { type Media } from "@prisma/client";
import MovieCard from "./movie-card";

type Props = { medias: Media[] };

export default function MovieGrid({ medias }: Props) {
  return (
    <section className="grid-cols-auto grid w-full place-items-center gap-4 pt-16">
      {medias.map((movie) => (
        <MovieCard key={movie.id} media={movie} />
      ))}
    </section>
  );
}
