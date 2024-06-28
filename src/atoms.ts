import { Atom, atom, useAtomValue } from "jotai";
import { TNotification, TPostAtom } from "./hooks/connection";
import { useMemo } from "react";
import Column from "./components/Column";
import { atomWithReducer } from "jotai/utils";

// export const tokenAtom = atom(import.meta.env.VITE_ACCESS_TOKEN);
export const tokenAtom = atom<string>("");

export const notificationsAtom = atom<TNotification[]>([]);

export const useNullableAtomValue = <T>(
  sourceAtom: Atom<T> | null
): T | null => {
  const notNullAtom = useMemo(() => sourceAtom ?? atom(null), [sourceAtom]);
  return useAtomValue(notNullAtom);
};

export const QuotePostAtom = atom<TPostAtom | null>(null);

export type ArrayReducerAction<T> =
  | {
      type: "push";
      value: T;
    }
  | {
      type: "delete";
      index: number;
    };

const arrayReducer = <T>(prev: T[], action: ArrayReducerAction<T>) => {
  switch (action.type) {
    case "push":
      return [...prev, action.value];
    case "delete":
      return prev.filter((_, i) => i !== action.index);
  }
};

export const ColumnsAtom = atomWithReducer<
  Column[],
  ArrayReducerAction<Column>
>(
  [
    {
      type: "Home",
    },
    {
      type: "Notification",
    },
  ],
  arrayReducer
);
