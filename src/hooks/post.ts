import { useAtom } from "jotai";
import { tokenAtom } from "../atoms";
import { useMutation } from "@tanstack/react-query";
import { TPost, convertPost } from "./connection";

export type TPostSend = {
  content: string;
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
