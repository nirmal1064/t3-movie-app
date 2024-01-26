import Image from "next/image";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { type ImageType } from "~/types";

type Props = { images: ImageType[] };

export default function ImageList({ images }: Props) {
  if (images.length === 0) return null;

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md border">
      <div className="flex flex-nowrap gap-3">
        {images.map((image) => (
          <Image
            key={image.file_path}
            src={`https://image.tmdb.org/t/p/w780${image.file_path}`}
            alt="Alt"
            width={320}
            height={180}
            style={{ objectFit: "cover" }}
          />
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
