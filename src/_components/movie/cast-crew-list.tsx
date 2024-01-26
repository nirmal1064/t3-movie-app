import Image from "next/image";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { type Cast, type Crew } from "~/types";

type Props = { castOrCrews: Cast[] | Crew[]; title: string };

export default function CastCrewList({ castOrCrews, title }: Props) {
  if (castOrCrews.length === 0) return null;

  return (
    <>
      <h2 className="text-2xl font-semibold">{title}</h2>
      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
        <div className="flex flex-nowrap gap-5">
          {castOrCrews
            .filter((c) => !!c.profile_path)
            .map((castOrCrew) => (
              <div
                key={castOrCrew.id}
                className="flex h-auto w-[138px] flex-col overflow-hidden rounded-md"
              >
                <Image
                  key={castOrCrew.id}
                  // src={`https://image.tmdb.org/t/p/w138_and_h175_face${castOrCrew.profile_path}`}
                  src={`https://image.tmdb.org/t/p/w342${castOrCrew.profile_path}`}
                  alt="Alt"
                  width={138}
                  height={170}
                  objectFit="cover"
                />
                <p>{castOrCrew.name}</p>
                {"character" in castOrCrew && (
                  <p className="text-xs text-muted-foreground">
                    {castOrCrew.character}
                  </p>
                )}
                {"job" in castOrCrew && (
                  <p className="text-xs text-muted-foreground">
                    {castOrCrew.job}
                  </p>
                )}
              </div>
            ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  );
}
