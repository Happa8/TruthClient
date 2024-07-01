import { atom, useAtom } from "jotai";
import { TPost, TPostAtom, convertPost } from "./connection";
import { tokenAtom } from "../atoms";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

type GetReplyQuery = {
  id: string;
};

export type TPostTree = {
  data: TPostAtom;
  children: TPostTree[];
};

type TPostContext = {
  parent: TPostTree[];
  children: TPostTree[];
};

// post.idとpost.in_reply_to_idが一致するpostからPostTreeを作成する
const createPostTree = (posts: TPost[]): TPostTree[] => {
  // postsに含まれるpostの中から、post.idがどのpost.in_reply_to_idとも一致しないpostを取得
  // これらがツリーの一番上の要素となる
  const rootPosts = posts.filter(
    (post) => !posts.some((p) => p.id === post.inReplyTo?.id)
  );

  // ツリーの上の要素から、子要素を再帰的に取得
  const createTree = (post: TPost): TPostTree => {
    return {
      data: atom(post),
      children: posts
        .filter((p) => p.inReplyTo?.id === post.id)
        .map(createTree),
    };
  };

  return rootPosts.map(createTree);
};

const getAncestors = async (
  data: GetReplyQuery,
  accessToken: string
): Promise<TPostTree[]> => {
  const sort = "trending";
  const searchQuery = new URLSearchParams({ sort: sort }).toString();

  const res = await fetch(
    `https://truthsocial.com/api/v2/statuses/${data.id}/context/ancestors?${searchQuery}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const resJson = (await res.json()) as unknown[];

  const posts = resJson.map((post) => convertPost(post));

  const tree = createPostTree(posts);

  return tree;
};

const getDescendants = async (
  data: GetReplyQuery,
  accessToken: string
): Promise<TPostTree[]> => {
  const res = await fetch(
    `https://truthsocial.com/api/v2/statuses/${data.id}/context/descendants`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const resJson = (await res.json()) as unknown[];

  const posts = resJson.map((post) => convertPost(post));

  const tree = createPostTree(posts);

  return tree;
};

const getReplies = async (
  query: GetReplyQuery,
  accessToken: string
): Promise<TPostContext> => {
  const [ancestors, descendants] = await Promise.all([
    getAncestors(query, accessToken),
    getDescendants(query, accessToken),
  ]);

  return {
    parent: ancestors,
    children: descendants,
  };
};

export const useReplies = (query: GetReplyQuery) => {
  const [accessToken] = useAtom(tokenAtom);

  const fetcher = useCallback(
    () =>
      getReplies(query, accessToken).then((res) => {
        console.log(res);
        return res;
      }),
    [query, accessToken]
  );

  return useQuery({
    queryKey: ["replies", query],
    queryFn: fetcher,
  });
};
