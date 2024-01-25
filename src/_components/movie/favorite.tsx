"use client";
import { type Media } from "@prisma/client";
import toast from "react-hot-toast";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { useListIds } from "~/providers/media-provider";
import { api } from "~/trpc/react";

type Props = { media: Media; className?: string };

export default function Favorite({ media, className }: Props) {
  const [listIds, setListIds] = useListIds();
  const { mutate: favoritesMutate } = api.media.addToFavorites.useMutation();
  const { mutate: removeFavoriteMutate } =
    api.media.removeFromFavorites.useMutation();
  const isFavorite = listIds.favoriteIds.includes(media.id);

  function handleLike() {
    favoritesMutate(
      { media },
      {
        onSuccess: (mediaId) => {
          if (mediaId) {
            setListIds((prevState) => ({
              ...prevState,
              favoriteIds: [...prevState.favoriteIds, mediaId],
            }));
            toast.success(
              `${media.media_type === "tv" ? "Series" : "Movie"} added to your Favorites`,
            );
          }
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

  function handleRemoveLike() {
    removeFavoriteMutate(
      { mediaId: media.id },
      {
        onSuccess: (mediaId) => {
          if (mediaId) {
            setListIds((prevState) => ({
              ...prevState,
              favoriteIds: prevState.favoriteIds.filter((id) => id !== mediaId),
            }));
          }
          toast.success(
            `${media.media_type === "tv" ? "Series" : "Movie"} Removed From your Favorites`,
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

  return isFavorite ? (
    <AiFillLike onClick={handleRemoveLike} className={className} />
  ) : (
    <AiOutlineLike onClick={handleLike} className={className} />
  );
}
