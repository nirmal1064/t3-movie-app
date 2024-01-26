import Image from "next/image";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { type TrendingType } from "~/types";

type Props = { mediaList: TrendingType[]; title: string };

export default function SimilarOrRecommendedMedia({ mediaList, title }: Props) {
  if (mediaList.length === 0) return null;

  return (
    <>
      <h2 className="text-2xl font-semibold">{title}</h2>
      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
        <div className="flex flex-nowrap gap-5">
          {mediaList
            .filter((m) => !!m.poster_path)
            .map((media) => (
              <div
                key={media.id}
                className="flex h-auto w-[138px] flex-col overflow-hidden rounded-md"
              >
                <Link
                  href={
                    media.media_type === "tv"
                      ? `/series/${media.id}`
                      : `/movie/${media.id}`
                  }
                >
                  <Image
                    key={media.id}
                    src={`https://image.tmdb.org/t/p/w220_and_h330_face${media?.poster_path}`}
                    alt={media.original_title ?? media.title ?? media.name}
                    width={220}
                    height={330}
                    objectFit="cover"
                  />
                  <p title={media.title ?? media.original_title ?? media.name}>
                    {media.title ?? media.original_title ?? media.name}
                  </p>
                  {media.release_date && (
                    <p className="text-sm text-muted-foreground">
                      {media.release_date.slice(0, 4)}
                    </p>
                  )}
                </Link>
              </div>
            ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  );
}
