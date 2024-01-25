"use client";
import { type Media } from "@prisma/client";
import toast from "react-hot-toast";
import {
  MdOutlinePlaylistAdd,
  MdOutlinePlaylistAddCheck,
} from "react-icons/md";
import { useListIds } from "~/providers/media-provider";
import { api } from "~/trpc/react";

type Props = { media: Media; className?: string };

export default function WatchList({ media, className }: Props) {
  const [listIds, setListIds] = useListIds();
  const { mutate: watchListMutate } = api.media.addToWatchList.useMutation();
  const { mutate: removeWatchListMutate } =
    api.media.removeFromWatchList.useMutation();
  const isInWatchList = listIds.watchListIds.includes(media.id);

  function handleAddToWatchList() {
    watchListMutate(
      { media },
      {
        onSuccess: (mediaId) => {
          if (mediaId) {
            setListIds((prevState) => ({
              ...prevState,
              watchListIds: [...prevState.watchListIds, mediaId],
            }));
          }
          toast.success(
            `${media.media_type === "tv" ? "Series" : "Movie"} added to your Watch List`,
          );
        },
        onError: (error) => {
          const code = error.data?.code;
          if (code === "CONFLICT" || code === "INTERNAL_SERVER_ERROR") {
            toast.error(error.message);
          } else {
            toast.error("Some Error Occured. Please Try Again");
          }
        },
      },
    );
  }

  function handleRemoveFromWatchList() {
    removeWatchListMutate(
      { mediaId: media.id },
      {
        onSuccess: (mediaId) => {
          if (mediaId) {
            setListIds((prevState) => ({
              ...prevState,
              watchListIds: prevState.watchListIds.filter(
                (id) => id !== mediaId,
              ),
            }));
          }
          toast.success(
            `${media.media_type === "tv" ? "Series" : "Movie"} Removed From Watch List`,
          );
        },
        onError: (error) => {
          const code = error.data?.code;
          if (code === "CONFLICT" || code === "INTERNAL_SERVER_ERROR") {
            toast.error(error.message);
          } else {
            toast.error("Some Error Occured. Please Try Again");
          }
        },
      },
    );
  }

  return isInWatchList ? (
    <MdOutlinePlaylistAddCheck
      onClick={handleRemoveFromWatchList}
      className={className}
    />
  ) : (
    <MdOutlinePlaylistAdd
      onClick={handleAddToWatchList}
      className={className}
    />
  );
}
