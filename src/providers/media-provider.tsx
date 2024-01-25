"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import { type ListIdsType } from "~/types";

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
  const [listIds, setListIds] = useListIdsState(mediaIds);

  return (
    <MediaContext.Provider value={[listIds, setListIds]}>
      {children}
    </MediaContext.Provider>
  );
}
