"use client";
import { createContext, useState, type ReactNode, useContext } from "react";

type ListIdsType = {
  favoriteIds: number[];
  watchListIds: number[];
  mylistIds: number[];
};

const useListIdsState = (initialTasks: ListIdsType) => useState(initialTasks);

export const MediaContext = createContext<ReturnType<
  typeof useListIdsState
> | null>(null);

type Props = { children: ReactNode; mediaIds: ListIdsType };

export const useListIds = () => {
  const listIds = useContext(MediaContext);
  if (!listIds) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return listIds;
};

export default function MediaProvider({ children, mediaIds }: Props) {
  const [listIds, setListIds] = useState<ListIdsType>(mediaIds);

  return (
    <MediaContext.Provider value={[listIds, setListIds]}>
      {children}
    </MediaContext.Provider>
  );
}
