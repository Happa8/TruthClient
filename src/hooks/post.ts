import { useAtom } from "jotai";
import { tokenAtom } from "../atoms";
import { useMutation } from "@tanstack/react-query";
import { TPoll, TPost, convertPoll, convertPost } from "./connection";

export type TPostSend = {
  content: string;
  quoteId?: string;
  replyId?: string;
  replyAccountUserNames?: string[];
  mediaIds?: string[];
};

export const postTruth = async (
  accessToken: string,
  data: TPostSend
): Promise<TPost> => {
  const res = await fetch(`https://truthsocial.com/api/v1/statuses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      status: data.content,
      quote_id: data.quoteId,
      in_reply_to_id: data.replyId,
      to: data.replyAccountUserNames,
      media_ids: data.mediaIds,
    }),
  })
    .then((res) => res.json())
    .then((res) => convertPost(res));

  return res;
};

export const usePostTruth = () => {
  const [accessToken] = useAtom(tokenAtom);

  return useMutation({
    mutationFn: (data: TPostSend) => postTruth(accessToken, data),
  });
};

export type TFavouritePost = {
  id: string;
  action: "favourite" | "unfavourite";
};

const favoritePost = async (accessToken: string, data: TFavouritePost) => {
  const res = await fetch(
    `https://truthsocial.com/api/v1/statuses/${data.id}/favourite`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res;
};

const unfavoritePost = async (accessToken: string, data: TFavouritePost) => {
  const res = await fetch(
    `https://truthsocial.com/api/v1/statuses/${data.id}/unfavourite`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res;
};

export const useFavouritePost = () => {
  const [accessToken] = useAtom(tokenAtom);

  return useMutation({
    mutationFn: (data: TFavouritePost) => {
      if (data.action === "favourite") {
        return favoritePost(accessToken, data);
      } else {
        return unfavoritePost(accessToken, data);
      }
    },
  });
};

export type TRepost = {
  id: string;
  action: "repost" | "unrepost";
};

const repost = async (accessToken: string, data: TRepost) => {
  const res = await fetch(
    `https://truthsocial.com/api/v1/statuses/${data.id}/reblog`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res;
};

const unrepost = async (accessToken: string, data: TRepost) => {
  const res = await fetch(
    `https://truthsocial.com/api/v1/statuses/${data.id}/unreblog`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res;
};

export const useRepost = () => {
  const [accessToken] = useAtom(tokenAtom);

  return useMutation({
    mutationFn: (data: TRepost) => {
      if (data.action === "repost") {
        return repost(accessToken, data);
      } else {
        return unrepost(accessToken, data);
      }
    },
  });
};

const votePoll = async (
  accessToken: string,
  data: TPoll,
  choiseIndex: number[]
) => {
  const res = await fetch(
    `https://truthsocial.com/api/v1/polls/${data.id}/votes`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        choices: choiseIndex.map((index) => `${index}`),
      }),
    }
  )
    .then((res) => res.json())
    .then((res) => {
      return convertPoll(res);
    });
  return res;
};

export const useVotePoll = () => {
  const [accessToken] = useAtom(tokenAtom);

  return useMutation({
    mutationFn: (data: { poll: TPoll; choiseIndex: number[] }) =>
      votePoll(accessToken, data.poll, data.choiseIndex),
  });
};
