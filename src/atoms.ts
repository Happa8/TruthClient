import { atom } from "jotai";
import { TNotification } from "./hooks/connection";

export const tokenAtom = atom(import.meta.env.VITE_ACCESS_TOKEN);

export const notificationsAtom = atom<TNotification[]>([]);
