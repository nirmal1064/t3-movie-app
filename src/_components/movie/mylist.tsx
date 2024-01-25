"use client";
import { type Media } from "@prisma/client";
import toast from "react-hot-toast";
import { FaCheck, FaPlus } from "react-icons/fa6";
import { useListIds } from "~/providers/media-provider";
import { api } from "~/trpc/react";

type Props = { media: Media; className?: string };

export default function MyList({ media, className }: Props) {
  const [listIds, setListIds] = useListIds();
  const { mutate: addToListMutate } = api.media.addToMyList.useMutation();
  const { mutate: removeMyListMutate } =
    api.media.removeFromMyList.useMutation();
  const isInMyList = listIds.mylistIds.includes(media.id);

  function handleAddToList() {
    addToListMutate(
      { media },
      {
        onSuccess: (mediaId) => {
          if (mediaId) {
            setListIds((prevState) => ({
              ...prevState,
              mylistIds: [...prevState.mylistIds, mediaId],
            }));
          }

          toast.success(
            `${media.media_type === "tv" ? "Series" : "Movie"} added to your List`,
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

  function handleRemoveFromList() {
    removeMyListMutate(
      { mediaId: media.id },
      {
        onSuccess: (mediaId) => {
          if (mediaId) {
            setListIds((prevState) => ({
              ...prevState,
              mylistIds: prevState.mylistIds.filter((id) => id !== mediaId),
            }));
          }
          toast.success(
            `${media.media_type === "tv" ? "Series" : "Movie"} Removed From your List`,
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

  return isInMyList ? (
    <FaCheck onClick={handleRemoveFromList} className={className} />
  ) : (
    <FaPlus onClick={handleAddToList} className={className} />
  );
}
