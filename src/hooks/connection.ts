/* eslint-disable @typescript-eslint/no-explicit-any */
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";

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
  url: string;
};

export type TPost = {
  id: string;
  createdAt: Date;
  account: TAccount;
  boolmarked: boolean;
  content: string;
  favourited: false;
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
  muted: boolean;
  pinned: boolean;
  sensitive: boolean;
  tags: {
    name: string;
  }[];
};

export type TNotification = {
  id: string;
  type: "mention" | "status" | "reblog" | "follow" | "favourite";
  createdAt: Date;
  account: TAccount;
  status: TPost;
};

const convertAccount = (data: any): TAccount => {
  const account: TAccount = {
    avatar: data.avatar,
    bot: data.bot,
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

const convertPost = (data: any): TPost => {
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
  };

  return post;
};

const convertNotification = (data: any): TNotification => {
  const notification: TNotification = {
    account: convertAccount(data.account),
    createdAt: new Date(data.created_at),
    id: data.id,
    status: data.status,
    type: data.type,
  };

  return notification;
};

const updateArray = <T extends { id: string }>(
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

export const useTimeline = (accessToken: string) => {
  const [posts, setPosts] = useState<TPost[]>([]);
  const [notifications, setNotifications] = useState<TNotification[]>([]);
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

  useEffect(() => {
    data?.pages.flat().map((d) => {
      const newPost = convertPost(d);
      setPosts((prev) => updateArray(newPost, prev, "LI"));
    });
  }, [data, fetchHome]);

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
          setPosts((prev) => updateArray(newPost, prev));
          break;
        }
        case "notification": {
          const newNotification = convertNotification(
            JSON.parse(receivedMessage["payload"])
          );
          console.log(newNotification);
          setNotifications((prev) => [newNotification, ...prev]);
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

  return { socketRef, posts, notifications, loadMoreTimeLine, isFetching };
};
