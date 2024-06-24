import { atom } from "jotai";
import { TNotification, TPostAtom } from "./hooks/connection";

export const tokenAtom = atom(import.meta.env.VITE_ACCESS_TOKEN);

export const notificationsAtom = atom<TNotification[]>([]);

export const QuotePostAtom = atom<TPostAtom | null>(null);
