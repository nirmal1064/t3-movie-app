import Image from "next/image";
import Link from "next/link";
import { SiYoutube } from "react-icons/si";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { type VideoType } from "~/types";

type Props = { videos: VideoType[] };

export default function VideoList({ videos }: Props) {
  if (videos.length === 0) return null;

  return (
    <>
      <h2 className="text-2xl font-semibold">Video Clips</h2>
      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
        <div className="flex flex-nowrap gap-3">
          {videos
            .filter((video) => video.site === "YouTube")
            .map((video) => (
              <Link
                key={video.key}
                target="_blank"
                href={`https://www.youtube.com/watch?v=${video.key}`}
                className="relative h-full w-80 p-0"
              >
                <Image
                  key={video.id}
                  src={`https://i.ytimg.com/vi/${video.key}/hqdefault.jpg`}
                  alt={video.name}
                  width={320}
                  height={240}
                  objectFit="cover"
                />
                <SiYoutube
                  className="absolute left-1/2 top-1/2 h-10 w-10 translate-x-[-50%] translate-y-[-50%]"
                  fill="red"
                />
              </Link>
            ))}
        </div>
        <ScrollBar orientation="horizontal" className="p-0" />
      </ScrollArea>
    </>
  );
}
