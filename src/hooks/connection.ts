/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useInfiniteQuery,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Atom, PrimitiveAtom, atom, useAtom, useAtomValue } from "jotai";
import { tokenAtom } from "../atoms";

export type TAccount = {
  id: string;
  userName: string;
  displayName: string;
  avatar: string;
  bot: boolean;
  createdAt: Date;
  followersCount: number;
  followingCount: number;
  note: string;
  statusesCount: number;
  website: string;
  header: string;
  url: string;
};

export type TPost = {
  id: string;
  createdAt: Date;
  account: TAccount;
  boolmarked: boolean;
  content: string;
  favourited: boolean;
  favouritesCount: number;
  reblog: TPost | null;
  reblogsCount: number;
  inReplyTo?: TPost;
  repliesCount: number;
  mentions: {
    username: string;
    id: number;
    url: string;
  }[];
  reblogged: boolean;
  muted: boolean;
  pinned: boolean;
  sensitive: boolean;
  tags: {
    name: string;
  }[];
  mediaAttachments: TMedia[];
  card?: TCard;
  quoteId?: string;
  quote?: TPost;
  url: string;
  uri: string;
  group?: TGroup;
};

export type TNotification = {
  id: string;
  type: "mention" | "status" | "reblog" | "follow" | "favourite";
  createdAt: Date;
  account: TAccount;
  status?: TPost;
};

export type TMedia = {
  id: string;
  type: "image";
  url: string;
  previewUrl: string;
  description: string;
};

export type TGroup = {
  id: string;
  note: string;
  displayName: string;
  locked: boolean;
  discoverable: boolean;
  avatar: string;
  header: string;
  url: string;
  source: {
    note: string;
  };
  owner: {
    id: string;
  };
  tags: {
    name: string;
  }[];
};

export type TCard = {
  type: "link";
  url: string;
  title: string;
  description: string;
  image: string;
  providerName: string;
};

const convertCard = (data: any): TCard => {
  const card: TCard = {
    type: "link",
    url: data.url,
    title: data.title,
    description: data.description,
    image: data.image,
    providerName: data.provider_name,
  };
  return card;
};

const convertMedia = (data: any): TMedia => {
  const media: TMedia = {
    id: data.id,
    description: data.description,
    previewUrl: data.preview_url,
    type: data.type,
    url: data.url,
  };
  return media;
};

const convertAccount = (data: any): TAccount => {
  const account: TAccount = {
    avatar: data.avatar,
    bot: data.bot,
    header: data.header,
    createdAt: new Date(data.created_at),
    displayName: data.display_name,
    followersCount: data.followers_count,
    followingCount: data.following_count,
    id: data.id,
    note: data.note,
    statusesCount: data.statues_count,
    url: data.url,
    userName: data.username,
    website: data.website,
  };

  return account;
};

const convertGroup = (data: any): TGroup => {
  const group: TGroup = {
    avatar: data.avatar,
    discoverable: data.discoverable,
    displayName: data.display_name,
    header: data.header,
    id: data.id,
    locked: data.locked,
    note: data.note,
    owner: {
      id: data.owner.id,
    },
    source: {
      note: data.source.note,
    },
    tags: data.tags.map((d: any) => {
      return {
        name: d.name,
      };
    }),
    url: data.url,
  };

  return group;
};

export const convertPost = (data: any): TPost => {
  const post: TPost = {
    account: convertAccount(data.account),
    boolmarked: data.bookmarked,
    content: data.content,
    createdAt: new Date(data.created_at),
    favourited: data.favourited,
    favouritesCount: data.favourites_count,
    id: data.id,
    mentions: data.mentions.map((d: any) => {
      return {
        username: d.username,
        id: d.id,
        url: d.url,
      };
    }),
    muted: data.muted,
    pinned: data.pinned,
    reblogged: data.reblogged,
    reblogsCount: parseInt(data.reblogs_count),
    repliesCount: parseInt(data.replies_count),
    sensitive: data.sensitive,
    inReplyTo:
      data.in_reply_to === null ? undefined : convertPost(data.in_reply_to),
    reblog: data.reblog === null ? null : convertPost(data.reblog),
    tags: data.tags.map((d: any) => {
      return {
        name: d.name,
      };
    }),
    mediaAttachments: data.media_attachments.map((d: any) => convertMedia(d)),
    card: data.card === null ? undefined : convertCard(data.card),
    quoteId: data.quote_id === null ? undefined : data.quote_id,
    quote: data.quote === null ? undefined : convertPost(data.quote),
    url: data.url,
    uri: data.uri,
    group: data.group === null ? undefined : convertGroup(data.group),
  };

  return post;
};

const convertNotification = (data: any): TNotification => {
  const notification: TNotification = {
    account: convertAccount(data.account),
    createdAt: new Date(data.created_at),
    id: data.id,
    status: data?.status === undefined ? undefined : convertPost(data.status),
    type: data.type,
  };

  return notification;
};

export const updateArray = <T extends { id: string }>(
  obj: T,
  objArray: T[],
  direction: "FI" | "LI" = "FI"
): T[] => {
  const index = objArray.findIndex((item) => item.id === obj.id);
  if (index !== -1) {
    return [...objArray.slice(0, index), obj, ...objArray.slice(index + 1)];
  } else {
    if (direction === "FI") {
      return [obj, ...objArray];
    } else {
      return [...objArray, obj];
    }
  }
};

const getPost = async (accessToken: string, id: string) => {
  const res = await fetch(`https://truthsocial.com/api/v1/statuses/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const resjson = await res.json();
  return convertPost(resjson);
};

export const usePost = ({ id }: { id: string }) => {
  const [accessToken] = useAtom(tokenAtom);

  const fetcher = useCallback(
    () => getPost(accessToken, id),
    [accessToken, id]
  );

  return useQuery({
    queryKey: [id],
    queryFn: fetcher,
  });
};

export const useGetPostSuspense = ({ id }: { id: string }) => {
  const [accessToken] = useAtom(tokenAtom);

  const fetcher = useCallback(
    () => getPost(accessToken, id),
    [accessToken, id]
  );

  return useSuspenseQuery({
    queryKey: [id],
    queryFn: fetcher,
  });
};

export type TPostAtom = PrimitiveAtom<TPost>;

export type TNotificationAtom = PrimitiveAtom<TNotification>;

const useUpdateListAtom = <T extends { id: string }>(
  sourceAtom: PrimitiveAtom<PrimitiveAtom<T>[]>
) =>
  useMemo(
    () =>
      atom(null, (get, set, newObj: T, direction: "FI" | "LI" = "FI") => {
        const postList = get(sourceAtom);
        const index = postList.findIndex((item) => get(item).id === newObj.id);
        const newPostAtom = atom(newObj);
        if (index !== -1) {
          set(sourceAtom, [
            ...postList.slice(0, index),
            newPostAtom,
            ...postList.slice(index + 1),
          ]);
        } else {
          if (direction === "FI") {
            set(sourceAtom, [newPostAtom, ...postList]);
          } else {
            set(sourceAtom, [...postList, newPostAtom]);
          }
        }
      }),
    [sourceAtom]
  );

const correctAllValuesAtom = <T>(
  sourceAtom: PrimitiveAtom<PrimitiveAtom<T>[]>
): Atom<T[]> => atom((get) => get(sourceAtom).map((atom) => get(atom)));

export const useCorrectAllValues = <T>(
  sourceAtom: PrimitiveAtom<PrimitiveAtom<T>[]>
): T[] => {
  const allValuesAtom = useMemo(
    () => correctAllValuesAtom(sourceAtom),
    [sourceAtom]
  );
  return useAtomValue(allValuesAtom);
};

export const useTimeline = () => {
  const [accessToken] = useAtom(tokenAtom);

  const postListAtom = useMemo(() => atom<TPostAtom[]>([]), []);
  const updatePostListAtom = useUpdateListAtom(postListAtom);
  const [_a, updatePostList] = useAtom(updatePostListAtom);
  const postList = useAtomValue(postListAtom);
  const posts = useCorrectAllValues(postListAtom);

  const notificationListAtom = useMemo(() => atom<TNotificationAtom[]>([]), []);
  const updateNotificationListAtom = useUpdateListAtom(notificationListAtom);
  const [_b, updateNotificationList] = useAtom(updateNotificationListAtom);
  const notificationList = useAtomValue(notificationListAtom);
  const notifications = useCorrectAllValues(notificationListAtom);

  const socketRef = useRef<WebSocket>();

  const fetchHome = useCallback(
    async ({ pageParam } = { pageParam: "" }) => {
      const res = await fetch(
        `https://truthsocial.com/api/v1/timelines/home?max_id=${pageParam}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return res.json();
    },
    [accessToken]
  );

  const { data, fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["timelines"],
    queryFn: fetchHome,
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage[lastPage.length - 1].id,
  });

  const fetchNotification = useCallback(
    async ({ pageParam } = { pageParam: "" }) => {
      const res = await fetch(
        `https://truthsocial.com/api/v1/notifications?max_id=${pageParam}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return res.json();
    },
    [accessToken]
  );

  const {
    data: noteData,
    fetchNextPage: fetchNoteNextPage,
    isFetching: isFetchingNote,
  } = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotification,
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage[lastPage.length - 1].id,
  });

  useEffect(() => {
    data?.pages.flat().map((d) => {
      const newPost = convertPost(d);
      updatePostList(newPost, "LI");
    });
  }, [data, fetchHome]);

  useEffect(() => {
    noteData?.pages.flat().map((d) => {
      const newNote = convertNotification(d);
      updateNotificationList(newNote, "LI");
    });
  }, [noteData, fetchNotification]);

  useEffect(() => {
    socketRef.current = new WebSocket(
      `wss://truthsocial.com/api/v1/streaming?access_token=${accessToken}&stream=user`
    );

    socketRef.current.addEventListener("open", (e) => {
      console.log("WebSocket connection opened.", e);
    });

    socketRef.current.addEventListener("message", (event) => {
      const receivedMessage = JSON.parse(event.data);
      switch (receivedMessage["event"]) {
        case "update": {
          const newPost = convertPost(JSON.parse(receivedMessage["payload"]));
          updatePostList(newPost);
          break;
        }
        case "notification": {
          const newNotification = convertNotification(
            JSON.parse(receivedMessage["payload"])
          );
          updateNotificationList(newNotification);
          break;
        }
      }
    });

    socketRef.current.addEventListener("error", (e) => {
      console.error("Websocket error:", e);
    });

    socketRef.current.addEventListener("close", (e) => {
      console.log("WebSocket connection closed:", e);
    });

    const socket = socketRef.current;

    return () => {
      socket.close();
    };
  }, [accessToken]);

  const loadMoreTimeLine = () => {
    fetchNextPage();
  };

  const loadMoreNotifications = () => {
    fetchNoteNextPage();
  };

  return {
    socketRef,
    posts,
    postList,
    notifications,
    notificationList,
    loadMoreTimeLine,
    isFetching,
    loadMoreNotifications,
    isFetchingNote,
  };
};
