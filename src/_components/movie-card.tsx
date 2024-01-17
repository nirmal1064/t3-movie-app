import Image from "next/image";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { FaCheck, FaPlus } from "react-icons/fa6";
import {
  MdOutlinePlaylistAdd,
  MdOutlinePlaylistAddCheck,
} from "react-icons/md";
import { IMAGE_BASE_URL, MOVIE_GENRES } from "~/lib/constants";
import { type TrendingType } from "~/types";

type Props = { movie: TrendingType };

const width = 300;

const liked = false;
const watched = false;
const watchList = false;

export default function MovieCard({ movie }: Props) {
  return (
    <div
      className={`flex h-auto w-[300px] flex-col gap-2 rounded-lg bg-movie shadow`}
    >
      <Image
        className="rounded-lg object-cover transition-all hover:scale-105"
        src={`${IMAGE_BASE_URL}${movie?.poster_path ?? movie.backdrop_path}`}
        // src={`${IMAGE_BASE_URL}${movie.backdrop_path ?? movie?.poster_path}`}
        alt={movie.original_title ?? movie.title}
        width={width}
        height={300}
      />
      <div className="flex h-full flex-col justify-between gap-1 pb-1 text-foreground">
        <div className="flex items-center gap-1">
          <h2
            className="line-clamp-1 cursor-default text-xl font-semibold"
            title={movie.title}
          >
            {movie.title}{" "}
            {movie.release_date && `(${movie.release_date.slice(0, 4)})`}
          </h2>
        </div>
        <p className="line-clamp-1 flex gap-1 overflow-hidden px-1">
          {movie.genre_ids?.slice(0, 3).map((genreId) => (
            <span
              key={genreId}
              className="rounded-sm bg-purple-500 px-1 py-0.5 text-sm"
            >
              {MOVIE_GENRES.find((genre) => genre.id === genreId)?.name}
            </span>
          ))}
        </p>
        <div className="mt-2 flex items-center justify-between px-1 text-2xl">
          <button className="rounded-lg bg-red-500 px-3 py-1 text-lg">
            Watch Trailer
          </button>
          <div className="flex gap-1.5">
            <div className="flex items-center justify-center rounded-full border border-white p-1">
              {liked ? <AiFillLike /> : <AiOutlineLike />}
            </div>
            <div className="flex items-center justify-center rounded-full border border-white p-1">
              {watched ? <FaCheck /> : <FaPlus />}
            </div>
            <div className="flex items-center justify-center rounded-full border border-white p-1">
              {watchList ? (
                <MdOutlinePlaylistAddCheck />
              ) : (
                <MdOutlinePlaylistAdd />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// export default function MovieCard({ movie }: Props) {
//   return (
//     <Card className="flex h-auto w-[250px]">
//       <CardContent className="m-0 w-full p-0">
//         <Image
//           className="h-[300px] w-full object-cover transition-all hover:scale-105"
//           src={`${IMAGE_BASE_URL}${movie?.poster_path ?? movie.backdrop_path}`}
//           // src={`${IMAGE_BASE_URL}${movie.backdrop_path ?? movie?.poster_path}`}
//           alt={movie.original_title ?? movie.title}
//           width={300}
//           height={200}
//         />
//       </CardContent>
//     </Card>
//   );
// }
