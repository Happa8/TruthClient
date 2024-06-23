import { atom } from "jotai";
import { TNotification, TPost } from "./hooks/connection";

export const tokenAtom = atom(import.meta.env.VITE_ACCESS_TOKEN);

export const postsAtom = atom<TPost[]>([]);

export const notificationsAtom = atom<TNotification[]>([]);
