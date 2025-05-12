/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useInfiniteQuery,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Atom, PrimitiveAtom, atom, useAtom, useAtomValue } from "jotai";
import { tokenAtom } from "../atoms";
import { useGetMuteAccounts } from "./account";

export type TAccount = {
  id: string;
  name: string;
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
  poll?: TPoll;
};

export type TPoll = {
  expired: boolean;
  expiresAt: Date;
  id: string;
  multiple: boolean;
  options: {
    title: string;
    votesCount: number;
  }[];
  voted: boolean;
  votesCount: number;
  votersCount: number;
  ownVotes: number[];
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
  url: string;
  previewUrl: string;
  description: string;
} & (
  | {
      type: "unknown";
    }
  | {
      type: "image";
      meta: {
        original: {
          width: number;
          height: number;
          size: string;
          aspect: number;
        };
      };
    }
  | {
      type: "gifv";
      meta: {
        length: string;
        duration: number;
        fps: number;
        size: string;
        width: number;
        height: number;
        aspect: number;
        original: {
          width: number;
          height: number;
          frameRate: string;
          duration: number;
          bitrate: number;
        };
      };
    }
  | {
      type: "video";
      meta: {
        length: string;
        duration: number;
        fps: number;
        size: string;
        width: number;
        height: number;
        aspect: number;
        audioEncode: string;
        audioBitrate: string;
        audioChannels: string;
        original: {
          width: number;
          height: number;
          frameRate: string;
          duration: number;
          bitrate: number;
        };
      };
    }
  | {
      type: "audio";
      meta: {
        length: string;
        duration: number;
        audioEncode: string;
        audioBitrate: string;
        audioChannels: string;
        original: {
          duration: number;
          bitrate: number;
        };
      };
    }
);

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

export const convertMedia = (data: any): TMedia => {
  switch (data.type) {
    case "image": {
      const media: TMedia = {
        id: data.id,
        description: data.description,
        previewUrl: data.preview_url,
        type: data.type,
        url: data.url,
        meta: {
          original: {
            width: data.meta.original.width,
            height: data.meta.original.height,
            size: data.meta.original.size,
            aspect: data.meta.original.aspect,
          },
        },
      };
      return media;
    }
    case "gifv": {
      const media2: TMedia = {
        id: data.id,
        description: data.description,
        previewUrl: data.preview_url,
        type: data.type,
        url: data.url,
        meta: {
          length: data.meta.length,
          duration: data.meta.duration,
          fps: data.meta.fps,
          size: data.meta.size,
          width: data.meta.width,
          height: data.meta.height,
          aspect: data.meta.aspect,
          original: {
            width: data.meta.original.width,
            height: data.meta.original.height,
            frameRate: data.meta.original.frame_rate,
            duration: data.meta.original.duration,
            bitrate: data.meta.original.bitrate,
          },
        },
      };
      return media2;
    }
    case "video": {
      const media3: TMedia = {
        id: data.id,
        description: data.description,
        previewUrl: data.preview_url,
        type: data.type,
        url: data.url,
        meta: {
          length: data.meta.length,
          duration: data.meta.duration,
          fps: data.meta.fps,
          size: data.meta.size,
          width: data.meta.width,
          height: data.meta.height,
          aspect: data.meta.aspect,
          audioEncode: data.meta.audio_encode,
          audioBitrate: data.meta.audio_bitrate,
          audioChannels: data.meta.audio_channels,
          original: {
            width: data.meta.original.width,
            height: data.meta.original.height,
            frameRate: data.meta.original.frame_rate,
            duration: data.meta.original.duration,
            bitrate: data.meta.original.bitrate,
          },
        },
      };
      return media3;
    }
    case "audio": {
      const media4: TMedia = {
        id: data.id,
        description: data.description,
        previewUrl: data.preview_url,
        type: data.type,
        url: data.url,
        meta: {
          length: data.meta.length,
          duration: data.meta.duration,
          audioEncode: data.meta.audio_encode,
          audioBitrate: data.meta.audio_bitrate,
          audioChannels: data.meta.audio_channels,
          original: {
            duration: data.meta.original.duration,
            bitrate: data.meta.original.bitrate,
          },
        },
      };
      return media4;
    }
    case "unknown": {
      const media5: TMedia = {
        id: data.id,
        description: data.description,
        previewUrl: data.preview_url,
        type: data.type,
        url: data.url,
      };
      return media5;
    }
    default: {
      const media6: TMedia = {
        id: data.id,
        description: data.description,
        previewUrl: data.preview_url,
        type: "unknown",
        url: data.url,
      };
      return media6;
    }
  }
};

export const convertAccount = (data: any): TAccount => {
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
    name: data.display_name !== "" ? data.display_name : data.username,
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

export const convertPoll = (data: any): TPoll => {
  const poll: TPoll = {
    expired: data.expired,
    expiresAt: new Date(data.expires_at),
    id: data.id,
    multiple: data.multiple,
    options: data.options.map((d: any) => {
      return {
        title: d.title,
        votesCount: d.votes_count,
      };
    }),
    voted: data.voted,
    votesCount: data.votes_count,
    votersCount: data.voters_count,
    ownVotes: data.own_votes,
  };

  return poll;
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
    inReplyTo: !data.in_reply_to ? undefined : convertPost(data.in_reply_to),
    reblog: !data.reblog ? null : convertPost(data.reblog),
    tags: data.tags.map((d: any) => {
      return {
        name: d.name,
      };
    }),
    mediaAttachments: data.media_attachments
      ? data.media_attachments.map((d: any) => convertMedia(d))
      : [],
    card: !data.card ? undefined : convertCard(data.card),
    quoteId: !data.quote_id ? undefined : data.quote_id,
    quote: !data.quote ? undefined : convertPost(data.quote),
    url: data.url,
    uri: data.uri,
    group: !data.group ? undefined : convertGroup(data.group),
    poll: !data.poll ? undefined : convertPoll(data.poll),
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

// Postの情報を取得するためのフック
export const usePost = ({ id }: { id: string }) => {
  const [accessToken] = useAtom(tokenAtom);

  // TPostAtom型のアトムを作成
  const fetcher = useCallback(async () => {
    const post = await getPost(accessToken, id);
    const postAtom: TPostAtom = atom(post);
    return postAtom;
  }, [accessToken, id]);

  return useQuery({
    queryKey: [id],
    queryFn: fetcher,
  });
};

const getAccount = async (accessToken: string, id: string) => {
  const res = await fetch(`https://truthsocial.com/api/v1/accounts/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const resjson = await res.json();
  return convertAccount(resjson);
};

export type TAccountAtom = PrimitiveAtom<TAccount>;

// Accountの情報を取得するためのフック
export const useAccount = ({ id }: { id: string }) => {
  const [accessToken] = useAtom(tokenAtom);

  // TPostAtom型のアトムを作成
  const fetcher = useCallback(async () => {
    const account = await getAccount(accessToken, id);
    const accountAtom: TAccountAtom = atom(account);
    return accountAtom;
  }, [accessToken, id]);

  return useQuery({
    queryKey: [id],
    queryFn: fetcher,
  });
};

export const getTagTimeline = async (
  accessToken: string,
  tag: string,
  maxId?: string
): Promise<TPost[]> => {
  const query = maxId === undefined || maxId === "" ? "" : `?max_id=${maxId}`;

  const res = await fetch(
    `https://truthsocial.com/api/v1/timelines/tag/${tag}${query}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return await res.json().then((res) => {
    return res.map((d: any) => {
      const cpost = convertPost(d);
      return cpost;
    });
  });
};

export const useGetTagTimeline = ({ tag }: { tag: string }) => {
  const [accessToken] = useAtom(tokenAtom);

  const postListAtom = useMemo(() => atom<TPostAtom[]>([]), []);
  const updatePostListAtom = useUpdateListAtom(postListAtom);
  const [_a, updatePostList] = useAtom(updatePostListAtom);
  const postList = useAtomValue(postListAtom);
  const posts = useCorrectAllValues(postListAtom);

  const fetchTag = useCallback(
    async ({ pageParam } = { pageParam: "" }) => {
      const res = await getTagTimeline(accessToken, tag, pageParam);
      return res;
    },
    [accessToken, tag]
  );

  const { data, fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["tag", tag],
    queryFn: fetchTag,
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage[lastPage.length - 1].id,
    staleTime: 1000,
  });

  useEffect(() => {
    data?.pages.flat().map((d) => {
      updatePostList(convertPost(d), "LI");
    });
  }, [data, fetchTag]);

  const loadMoreTag = () => {
    fetchNextPage();
  };

  return {
    posts,
    postList,
    loadMoreTag,
    isFetching,
  };
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

  const { data: muteAccounts } = useGetMuteAccounts();

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

  const socketRef = useRef<WebSocket>(null);

  const fetchHome = useCallback(
    async ({ pageParam } = { pageParam: "" }) => {
      const res = await fetch(
        `https://truthsocial.com/api/v1/timelines/following?max_id=${pageParam}`,
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
    staleTime: 1000,
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
    staleTime: 1000,
  });

  useEffect(() => {
    data?.pages.flat().map((d) => {
      try {
        const newPost = convertPost(d);
        if (
          !muteAccounts?.find((account) => account.id === newPost.account.id)
        ) {
          updatePostList(newPost, "LI");
        }
      } catch (e) {
        console.error(e);
      }
    });
  }, [data, fetchHome]);

  useEffect(() => {
    noteData?.pages.flat().map((d) => {
      try {
        const newNote = convertNotification(d);
        if (
          !muteAccounts?.find((account) => account.id === newNote.account.id)
        ) {
          updateNotificationList(newNote, "LI");
        }
      } catch (e) {
        console.error(e);
      }
    });
  }, [noteData, fetchNotification]);

  useEffect(() => {
    socketRef.current = new WebSocket(
      `wss://truthsocial.com/api/v1/streaming?access_token=${accessToken}&stream=user`
    );

    socketRef.current.addEventListener("open", () => {
      // console.log("WebSocket connection opened.", e);
    });

    socketRef.current.addEventListener("message", (event) => {
      const receivedMessage = JSON.parse(event.data);
      switch (receivedMessage["event"]) {
        case "update": {
          try {
            const newPost = convertPost(JSON.parse(receivedMessage["payload"]));
            if (
              !muteAccounts?.find(
                (account) => account.id === newPost.account.id
              )
            ) {
              updatePostList(newPost);
            }
          } catch (e) {
            console.error(e);
          }
          break;
        }
        case "notification": {
          try {
            const newNotification = convertNotification(
              JSON.parse(receivedMessage["payload"])
            );
            if (
              !muteAccounts?.find(
                (account) => account.id === newNotification.account.id
              )
            ) {
              updateNotificationList(newNotification);
            }
          } catch (e) {
            console.error(e);
          }
          break;
        }
      }
    });

    socketRef.current.addEventListener("error", (e) => {
      console.error("Websocket error:", e);
    });

    socketRef.current.addEventListener("close", () => {
      // console.log("WebSocket connection closed:", e);
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

export const useFavoritedUsers = ({
  postId,
  enabled = true,
}: {
  postId: string;
  enabled?: boolean;
}) => {
  const [accessToken] = useAtom(tokenAtom);

  const fetchFavoritedUsers = useCallback(
    async ({ pageParam }: { pageParam?: string }) => {
      const query = pageParam === undefined ? "" : `?max_id=${pageParam}`;
      const res = await fetch(
        `https://truthsocial.com/api/v1/statuses/${postId}/favourited_by${query}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          return res.map((d: any) => {
            return convertAccount(d);
          });
        });
      return res as TAccount[];
    },
    [accessToken, postId]
  );

  return useInfiniteQuery({
    queryKey: ["favoritedUsers", postId],
    queryFn: fetchFavoritedUsers,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return lastPage[lastPage.length - 1].id;
    },
    staleTime: 1000,
    enabled: enabled,
  });
};

export const useRebloggedUsers = ({
  postId,
  enabled = true,
}: {
  postId: string;
  enabled?: boolean;
}) => {
  const [accessToken] = useAtom(tokenAtom);

  const fetchRebloggedUsers = useCallback(
    async ({ pageParam }: { pageParam?: string }) => {
      const query = pageParam === undefined ? "" : `?max_id=${pageParam}`;
      const res = await fetch(
        `https://truthsocial.com/api/v1/statuses/${postId}/reblogged_by${query}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          return res.map((d: any) => {
            return convertAccount(d);
          });
        });
      return res as TAccount[];
    },
    [accessToken, postId]
  );

  return useInfiniteQuery({
    queryKey: ["rebloggedUsers", postId],
    queryFn: fetchRebloggedUsers,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return lastPage[lastPage.length - 1].id;
    },
    staleTime: 1000,
    enabled: enabled,
  });
};

export const getAccountPosts = async (
  accessToken: string,
  accountId: string,
  maxId?: string,
  sinceId?: string,
  minId?: string,
  onlyMedia?: boolean,
  excludeReplies?: boolean,
  excludeReblogs?: boolean,
  pinned?: boolean,
  withMuted?: boolean,
  onlyReplies?: boolean
): Promise<TPost[]> => {
  const params = new URLSearchParams();

  if (maxId) params.append("max_id", maxId);
  if (sinceId) params.append("since_id", sinceId);
  if (minId) params.append("min_id", minId);
  if (onlyMedia !== undefined) params.append("only_media", String(onlyMedia));
  if (excludeReplies !== undefined)
    params.append("exclude_replies", String(excludeReplies));
  if (excludeReblogs !== undefined)
    params.append("exclude_reblogs", String(excludeReblogs));
  if (pinned !== undefined) params.append("pinned", String(pinned));
  if (withMuted !== undefined) params.append("with_muted", String(withMuted));
  if (onlyReplies !== undefined)
    params.append("only_replies", String(onlyReplies));

  const query = params.toString() ? `?${params.toString()}` : "";

  const res = await fetch(
    `https://truthsocial.com/api/v1/accounts/${accountId}/statuses${query}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return await res.json().then((res) => {
    return res.map((d: any) => {
      const cpost = convertPost(d);
      return cpost;
    });
  });
};

export const useAccountPosts = ({
  accountId,
  onlyMedia,
  excludeReplies,
  excludeReblogs,
  pinned,
  withMuted,
  onlyReplies,
}: {
  accountId: string;
  onlyMedia?: boolean;
  excludeReplies?: boolean;
  excludeReblogs?: boolean;
  pinned?: boolean;
  withMuted?: boolean;
  onlyReplies?: boolean;
}) => {
  const [accessToken] = useAtom(tokenAtom);

  const postListAtom = useMemo(
    () => atom<TPostAtom[]>([]),
    [
      accountId,
      onlyMedia,
      excludeReplies,
      excludeReblogs,
      pinned,
      withMuted,
      onlyReplies,
    ]
  );
  const updatePostListAtom = useUpdateListAtom(postListAtom);
  const [_a, updatePostList] = useAtom(updatePostListAtom);
  const postList = useAtomValue(postListAtom);
  const posts = useCorrectAllValues(postListAtom);

  const fetchAccountPosts = useCallback(
    async ({ pageParam }: { pageParam?: string }) => {
      console.log([
        accessToken,
        accountId,
        pageParam,
        undefined,
        undefined,
        onlyMedia,
        excludeReplies,
        excludeReblogs,
        pinned,
        withMuted,
        onlyReplies,
      ]);
      const res = await getAccountPosts(
        accessToken,
        accountId,
        pageParam,
        undefined,
        undefined,
        onlyMedia,
        excludeReplies,
        excludeReblogs,
        pinned,
        withMuted,
        onlyReplies
      );
      return res;
    },
    [
      accessToken,
      accountId,
      onlyMedia,
      excludeReplies,
      excludeReblogs,
      pinned,
      withMuted,
      onlyReplies,
    ]
  );

  const { data, fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: [
      "accountPosts",
      accountId,
      onlyMedia,
      excludeReplies,
      excludeReblogs,
      pinned,
      withMuted,
      onlyReplies,
    ],
    queryFn: fetchAccountPosts,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return lastPage[lastPage.length - 1].id;
    },
    staleTime: 1000,
  });

  useEffect(() => {
    data?.pages.flat().map((d) => {
      updatePostList(d, "LI");
    });
  }, [data, fetchAccountPosts]);

  const loadMoreAccountPosts = () => {
    fetchNextPage();
  };

  return {
    posts,
    postList,
    loadMoreAccountPosts,
    isFetching,
  };
};
