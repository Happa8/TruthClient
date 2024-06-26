import { useAtom } from "jotai";
import { TPost, convertPost } from "./connection";
import { tokenAtom } from "../atoms";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useCallback } from "react";

type GetReplyQuery = {
  id: string;
};

type TPostContext = {
  parents: TPost[];
  children: TPost[];
};

const getReplies = async (
  data: GetReplyQuery,
  accessToken: string
): Promise<TPostContext> => {
  const res = await fetch(
    `https://truthsocial.com/api/v1/statuses/${data.id}/context`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const resJson = (await res.json()) as {
    ancestors: unknown[];
    descendants: unknown[];
  };

  return {
    parents: resJson.ancestors.map((post) => convertPost(post)),
    children: resJson.descendants.map((post) => convertPost(post)),
  };
};

export const useReplies = (query: GetReplyQuery) => {
  const [accessToken] = useAtom(tokenAtom);

  const fetcher = useCallback(
    () => getReplies(query, accessToken),
    [query, accessToken]
  );

  return useSuspenseQuery({
    queryKey: ["replies", query],
    queryFn: fetcher,
  });
};
